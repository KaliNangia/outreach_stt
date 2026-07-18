"""
Audio Processing Module
Handles Audio Extraction (FFmpeg), Transcription (Whisper), and Translation (IndicTrans2)
"""
from pathlib import Path
from typing import Optional, Dict, List, Any
import ffmpeg
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, AutoModelForSpeechSeq2Seq, pipeline, AutoProcessor
from config import settings
from src.core.utils import log
from peft import PeftModel, PeftConfig
import noisereduce as nr
import soundfile as sf
import librosa
import json
import os
import numpy as np
from pyannote.audio import Pipeline
from pyannote.audio.pipelines.utils.hook import ProgressHook

# --- Part 1: Audio Extractor ---

class AudioExtractor:
    """Extract and normalize audio from video files"""
    
    @staticmethod
    async def extract_audio(video_path: Path, output_path: Optional[Path] = None, audio_format: str = "wav", sample_rate: int = 16000) -> Path:
        if not video_path.exists():
            raise FileNotFoundError(f"Video file not found: {video_path}")
        
        output_path = output_path or video_path.parent / f"{video_path.stem}_audio.{audio_format}"
        try:
            log.info(f"Extracting audio from {video_path.name}")
            stream = ffmpeg.input(str(video_path))
            codec = 'pcm_s16le' if audio_format == 'wav' else 'libmp3lame'
            stream = ffmpeg.output(stream, str(output_path), acodec=codec, ar=sample_rate, ac=1)
            ffmpeg.run(stream, overwrite_output=True, quiet=True)
            log.info(f"Audio extracted: {output_path.name}")
            return output_path
        except ffmpeg.Error as e:
            err = e.stderr.decode() if e.stderr else str(e)
            log.error(f"FFmpeg error: {err}")
            raise RuntimeError(f"Audio extraction failed: {err}")

    @staticmethod
    async def normalize_audio(audio_path: Path, target_level: float = -20.0) -> Path:
        output_path = audio_path.parent / f"{audio_path.stem}_normalized{audio_path.suffix}"
        try:
            log.info(f"Normalizing audio: {audio_path.name}")
            stream = ffmpeg.input(str(audio_path))
            stream = ffmpeg.filter(stream, 'loudnorm', I=target_level)
            stream = ffmpeg.output(stream, str(output_path))
            ffmpeg.run(stream, overwrite_output=True, quiet=True)
            return output_path
        except ffmpeg.Error as e:
            log.error(f"Normalization failed: {e}")
            raise

    @staticmethod
    def get_audio_duration(audio_path: Path) -> float:
        try:
            return float(ffmpeg.probe(str(audio_path))['format']['duration'])
        except Exception as e:
            log.error(f"Error getting duration: {e}")
            return 0.0

    @staticmethod
    async def concat_audio_files(file_paths: List[Path], output_path: Path) -> Path:
        import asyncio, subprocess
        log.info(f"Concatenating {len(file_paths)} files into {output_path.name}")
        list_file = output_path.parent / "concat_list.txt"
        with open(list_file, "w") as f:
            for path in file_paths:
                f.write(f"file '{str(path.absolute()).replace("'", "'\\''")}'\n")
        
        cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(list_file), "-vn", "-acodec", "aac", str(output_path)]
        process = await asyncio.create_subprocess_exec(*cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            raise RuntimeError(f"FFmpeg failed: {stderr.decode()}")
        
        log.info(f"Merged file created: {output_path}")
        return output_path


# --- Part 1.5: Audio Preprocessing ---

class AudioPreProcessing:
    """Pre-process audio files: noise suppression and speaker diarization"""
    
    def __init__(self):
        self.diarization_pipeline = None
        self.diarization_loaded = False

    @staticmethod
    def load_audio(audio_path: Path) -> List[Any]:
        """Load audio file using librosa"""
        if not audio_path.exists():
            raise FileNotFoundError(f"Invalid Audio Path: {audio_path}")
        
        try:
            y, sr = librosa.load(audio_path, sr=None)
            return [y, sr]
        except Exception as e:
            log.error(f"Error loading audio file: {e}")
            raise

    @staticmethod
    def noise_suppression(audio_path: Path, output_path: Optional[Path] = None) -> Path:
        """Apply non-stationary noise reduction to audio file"""
        log.info(f"Applying noise suppression to {audio_path.name}")
        aud = AudioPreProcessing.load_audio(audio_path)
        y = aud[0]
        sr = aud[1]

        try:
            y_denoised = nr.reduce_noise(y=y, sr=sr, stationary=False, prop_decrease=0.85)
        except Exception as e:
            log.error(f"Noise reduction failed: {e}")
            raise

        target_path = output_path or audio_path
        sf.write(target_path, y_denoised, sr)
        log.info(f"Noise suppression complete. Saved to: {target_path}")
        return target_path

    # Keep compatibility with original method spelling
    @staticmethod
    def noise_suppresion(audio_path: Path, output_path: Optional[Path] = None) -> Path:
        return AudioPreProcessing.noise_suppression(audio_path, output_path)

    def load_diarization_model(self, hf_token: Optional[str] = None):
        """Lazy load Pyannote Speaker Diarization Pipeline"""
        if not self.diarization_loaded:
            token = hf_token or getattr(settings, "hf_token", None) or os.getenv("HF_TOKEN")
            if not token:
                log.warning("Hugging Face Access Token (HF_TOKEN) is not configured. Pyannote model download/auth may fail.")
            
            model_name = getattr(settings, "diarization_model", "pyannote/speaker-diarization-community-1")
            log.info(f"Initializing Pyannote Speaker Diarization Pipeline ({model_name})...")
            
            try:
                self.diarization_pipeline = Pipeline.from_pretrained(
                    model_name,
                    token=token
                )
                device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
                self.diarization_pipeline.to(device)
                self.diarization_loaded = True
                log.info(f"Diarization pipeline loaded successfully on {device}.")
            except Exception as e:
                log.error(f"Failed to load Pyannote pipeline: {e}")
                raise

    async def diarize(
        self,
        audio_path: Path,
        hf_token: Optional[str] = None,
        num_speakers: int = 0,
        min_speakers: int = 0,
        max_speakers: int = 0,
        output_json_path: Optional[Path] = None
    ) -> List[Dict[str, Any]]:
        """
        Run speaker diarization on audio file.
        Returns a list of segments with start time, end time, and speaker label.
        Optionally saves segments to output_json_path.
        """
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio file not found: {audio_path}")
        
        self.load_diarization_model(hf_token=hf_token)
        
        log.info(f"Running Speaker Diarization on {audio_path.name}")
        
        # Setup pipeline params
        diarization_params = {}
        if num_speakers > 0:
            diarization_params["num_speakers"] = num_speakers
        else:
            if min_speakers > 0:
                diarization_params["min_speakers"] = min_speakers
            if max_speakers > 0:
                diarization_params["max_speakers"] = max_speakers

        try:
            with ProgressHook() as hook:
                diarization_output = self.diarization_pipeline(str(audio_path), hook=hook, **diarization_params)

            # Extract speaker segments
            raw_speaker_segments = []
            for turn, speaker in diarization_output.speaker_diarization:
                raw_speaker_segments.append({
                    "start": turn.start,
                    "end": turn.end,
                    "speaker": speaker
                })

            log.info(f"Diarization complete. Identified {len(set(s['speaker'] for s in raw_speaker_segments))} unique speaker(s).")

            # Save raw segments to JSON file if path is provided
            if output_json_path:
                output_json_path = Path(output_json_path)
                output_json_path.parent.mkdir(parents=True, exist_ok=True)
                with open(output_json_path, "w", encoding="utf-8") as f:
                    json.dump(raw_speaker_segments, f, indent=4, ensure_ascii=False)
                log.info(f"Raw speaker timeline exported to: '{output_json_path}'")

            return raw_speaker_segments

        except Exception as e:
            log.error(f"Diarization failed: {e}")
            raise


# --- Part 2: Transcription Service ---

class TranscriptionService:
    """Transcribe audio using Fine Tuned Whisper or Gemma 3n"""
    
    def __init__(self):
        self.model = None
        self.processor = None
        self.model_type = None  # "efficient" or "performance"
        self.model_loaded = False
        
    def load_model(self, model_type: str = "efficient"):
        if self.model_loaded and self.model_type == model_type:
            return
            
        # Clean up any existing model from memory
        if self.model_loaded:
            log.info(f"Unloading previous model of type {self.model_type}")
            del self.model
            if self.processor:
                del self.processor
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            self.model = None
            self.processor = None
            self.model_type = None
            self.model_loaded = False

        if model_type == "efficient":
            base_model_name = getattr(settings, "whisper_base_model", "openai/whisper-large-v3-turbo")
            lora_repo = getattr(settings, "whisper_lora_repo", "Garden2006/whisper-large-v3-turbo-gurmukhi-lora")
            log.info(f"Loading Whisper base model: {base_model_name} with LoRA: {lora_repo}")
            try:
                from peft import PeftModel
                
                device = "cuda" if torch.cuda.is_available() else "cpu"
                torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
                
                try:
                    self.processor = AutoProcessor.from_pretrained(lora_repo, language="punjabi", task="transcribe")
                except Exception:
                    self.processor = AutoProcessor.from_pretrained(base_model_name, language="punjabi", task="transcribe")
                
                base_model = AutoModelForSpeechSeq2Seq.from_pretrained(
                    base_model_name,
                    torch_dtype=torch_dtype,
                    low_cpu_mem_usage=True,
                    device_map="auto" if device == "cuda" else None
                )
                self.model = PeftModel.from_pretrained(base_model, lora_repo)
                if device == "cuda":
                    self.model.to(device)
                self.model.eval()
                
                self.model_type = "efficient"
                self.model_loaded = True
                log.info("Whisper LoRA model loaded successfully")
            except Exception as e:
                log.error(f"Failed to load Whisper LoRA model: {e}")
                raise
                
        elif model_type == "performance":
            gemma_model_id = getattr(settings, "gemma_model_id", "google/gemma-3n-e4b-it")
            log.info(f"Loading Gemma 3n model: {gemma_model_id}")
            try:
                from transformers import AutoModelForMultimodalLM
                
                device = "cuda:0" if torch.cuda.is_available() else "cpu"
                torch_dtype = torch.bfloat16 if "cuda" in device else torch.float32
                
                hf_token = getattr(settings, "hf_token", None) or os.getenv("HF_TOKEN")
                
                self.processor = AutoProcessor.from_pretrained(gemma_model_id, token=hf_token)
                self.model = AutoModelForMultimodalLM.from_pretrained(
                    gemma_model_id,
                    token=hf_token,
                    torch_dtype=torch_dtype,
                    device_map="auto" if "cuda" in device else None,
                    low_cpu_mem_usage=True
                )
                self.model.eval()
                
                self.model_type = "performance"
                self.model_loaded = True
                log.info("Gemma 3n model loaded successfully")
            except Exception as e:
                log.error(f"Failed to load Gemma 3n model: {e}")
                raise
        else:
            raise ValueError(f"Unknown model type: {model_type}")

    async def transcribe(
        self, 
        audio_path: Path, 
        language: Optional[str] = None, 
        segments: Optional[List[Dict[str, Any]]] = None, 
        model_type: str = "efficient"
    ) -> Dict[str, Any]:
        if not audio_path.exists():
            raise FileNotFoundError(f"Audio not found: {audio_path}")
            
        self.load_model(model_type)
        
        try:
            log.info(f"Transcribing {audio_path.name} using {model_type} model")
            
            # Load cleaned audio at 16000Hz mono (required for these models)
            import librosa
            y, sr = librosa.load(audio_path, sr=16000, mono=True)
            
            # Fallback to whole file transcription if no segments are provided
            if not segments:
                duration = len(y) / sr
                segments = [{"start": 0.0, "end": duration, "speaker": "Speaker_0"}]
                
            diarized_transcript_entries = []
            full_text_list = []
            
            # Time formatting helper
            def format_time(seconds):
                hours = int(seconds // 3600)
                minutes = int((seconds % 3600) // 60)
                secs = int(seconds % 60)
                millis = int((seconds - int(seconds)) * 10)
                if hours > 0:
                    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{millis:01d}"
                else:
                    return f"{minutes:02d}:{secs:02d}.{millis:01d}"
                    
            device = "cuda" if torch.cuda.is_available() else "cpu"
            torch_dtype = torch.float16 if device == "cuda" else torch.float32
            
            # Transcription Loop
            for entry in segments:
                start_sec = entry['start']
                end_sec = entry['end']
                speaker = entry['speaker']
                
                duration = end_sec - start_sec
                if duration < 0.3:
                    continue
                    
                # Slice chunk in-memory
                start_sample = int(start_sec * sr)
                end_sample = int(end_sec * sr)
                chunk = y[start_sample:end_sample]
                
                if len(chunk) == 0:
                    continue
                
                text = ""
                if model_type == "efficient":
                    # Whisper LoRA Inference
                    input_features = self.processor(
                        chunk,
                        sampling_rate=16000,
                        return_tensors="pt"
                    ).input_features.to(self.model.device).to(self.model.dtype)
                    
                    lang_name = "punjabi"
                    if language:
                        lang_lower = language.lower()
                        if lang_lower in ["punjabi", "pa"]:
                            lang_name = "punjabi"
                        elif lang_lower in ["hindi", "hi"]:
                            lang_name = "hindi"
                        elif lang_lower in ["english", "en"]:
                            lang_name = "english"
                    
                    with torch.no_grad():
                        predicted_ids = self.model.generate(
                            input_features,
                            language=lang_name,
                            task="transcribe"
                        )
                    text = self.processor.batch_decode(predicted_ids, skip_special_tokens=True)[0].strip()
                    
                elif model_type == "performance":
                    # Gemma 3n Inference
                    lang_title = "Punjabi"
                    script_title = "Gurmukhi"
                    if language:
                        lang_lower = language.lower()
                        if lang_lower in ["hindi", "hi"]:
                            lang_title = "Hindi"
                            script_title = "Devanagari"
                        elif lang_lower in ["english", "en"]:
                            lang_title = "English"
                            script_title = "Latin"
                        elif lang_lower in ["punjabi", "pa"]:
                            lang_title = "Punjabi"
                            script_title = "Gurmukhi"
                            
                    asr_prompt = (
                        f"Transcribe the following speech segment segment segment in {lang_title} into "
                        f"{script_title} text. Output only the raw transcript, with no "
                        f"introductory text or newlines."
                    )
                    
                    messages = [
                        {
                            "role": "user",
                            "content": [
                                {"type": "audio", "audio": chunk},
                                {"type": "text", "text": asr_prompt},
                            ],
                        },
                    ]
                    
                    # For Gemma 3n, apply dtype correctly
                    gemma_device = self.model.device
                    gemma_dtype = torch.bfloat16 if "cuda" in str(gemma_device) else torch.float32
                    
                    inputs = self.processor.apply_chat_template(
                        messages,
                        add_generation_prompt=True,
                        tokenize=True,
                        return_dict=True,
                        return_tensors="pt",
                    )
                    
                    inputs = {k: v.to(gemma_device) for k, v in inputs.items()}
                    input_len = inputs["input_ids"].shape[-1]
                    
                    with torch.no_grad():
                        generated_ids = self.model.generate(
                            **inputs,
                            max_new_tokens=256,
                            do_sample=False,
                            repetition_penalty=1.1
                        )
                        
                    response_ids = generated_ids[0][input_len:]
                    text = self.processor.decode(response_ids, skip_special_tokens=True).strip()
                
                if text:
                    time_str = f"[{format_time(start_sec)} - {format_time(end_sec)}]"
                    diarized_transcript_entries.append({
                        "start": start_sec,
                        "end": end_sec,
                        "time": time_str,
                        "speaker": speaker,
                        "text": text
                    })
                    full_text_list.append(f"{time_str} {speaker}: {text}")
            
            full_text = "\n".join(full_text_list).strip()
            log.info(f"Transcription complete using {model_type}.")
            
            # Keep return format compatible with pipeline expectations
            # The pipeline expects: text, language, language_probability, duration, segments
            return {
                "text": full_text,
                "language": language or "punjabi",
                "language_probability": 1.0,
                "duration": len(y) / sr,
                "segments": diarized_transcript_entries
            }
            
        except Exception as e:
            log.error(f"Transcription error: {e}")
            raise

# --- Part 3: Translation Service ---

class TranslationService:
    """Translate Indian languages to English"""
    
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.model_loaded = False
        self.lang_codes = {
            "punjabi": "pan_Guru", "hindi": "hin_Deva", "english": "eng_Latn"
            # Add other mappings from original file if needed
        }

    def load_model(self):
        if not self.model_loaded:
            log.info(f"Loading Translation model: {settings.translation_model}")
            try:
                self.tokenizer = AutoTokenizer.from_pretrained(settings.translation_model, trust_remote_code=True)
                self.model = AutoModelForSeq2SeqLM.from_pretrained(settings.translation_model, trust_remote_code=True)
                if torch.cuda.is_available():
                    self.model = self.model.cuda()
                self.model_loaded = True
            except Exception as e:
                log.error(f"Translation load failed: {e}")
                raise

    async def translate(self, text: str, source_language: str, target_language: str = "english") -> str:
        if source_language.lower() == "english": return text
        try: self.load_model()
        except: return text

        try:
            src_code = self.lang_codes.get(source_language.lower())
            tgt_code = self.lang_codes.get(target_language.lower(), "eng_Latn")
            if not src_code: return text
            
            inputs = self.tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
            if torch.cuda.is_available(): inputs = {k: v.cuda() for k, v in inputs.items()}
            
            with torch.no_grad():
                gen_tokens = self.model.generate(**inputs, forced_bos_token_id=self.tokenizer.convert_tokens_to_ids(tgt_code), max_length=512)
            return self.tokenizer.batch_decode(gen_tokens, skip_special_tokens=True)[0].strip()
        except Exception as e:
            log.warning(f"Translation failed: {e}")
            return text

# Global Instances
audio_extractor = AudioExtractor()
audio_preprocessing = AudioPreProcessing()
transcription_service = TranscriptionService()
translation_service = TranslationService()

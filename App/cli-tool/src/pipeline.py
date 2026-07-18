"""
Main Pipeline Orchestrator
Coordinates all processing steps: Validation -> Extraction -> Transcription -> Translation -> Analysis -> Reporting
"""
import tempfile
import shutil
from pathlib import Path

from datetime import datetime
from typing import Dict, Optional, Any, List

from config import settings
from src.core.utils import log, FileValidator, MetadataValidator
from src.core.database import db_manager, file_manager, InteractionMetadata, InteractionRecord, ProcessingStatus
from src.modules.processing import audio_extractor, audio_preprocessing, transcription_service, translation_service
from src.modules.analysis import llm_analyzer, participant_parser
from src.modules.reports import excel_generator, pdf_generator, word_generator

class PipelineOrchestrator:
    """Orchestrate the complete report generation pipeline"""
    
    async def process_interaction(self, file_path: Path, metadata: Dict[str, Any], model: str = "efficient") -> str:
        log.info(f"Starting pipeline for: {file_path.name} using model: {model}")
        try:
            # 1. Validate
            valid, msg = FileValidator.validate_file(file_path, settings.max_upload_size_mb)
            if not valid: raise ValueError(f"Validation failed: {msg}")
            
            # 2. Create Record
            interaction_id = await self._create_record(file_path, metadata)
            
            # 3. Audio Extraction
            audio_path = await self._extract_audio(file_path, interaction_id)
            
            # 3.5. Audio Preprocessing (Noise suppression & Diarization)
            preprocessed_audio_path, segments = await self._preprocess_audio(audio_path, interaction_id)
            
            # 4. Transcription
            t_data = await self._transcribe(preprocessed_audio_path, metadata.get('language'), interaction_id, segments, model)
            
            # 5. Translation
            translation = await self._translate(t_data['segments'], t_data['text'], t_data['language'], interaction_id)
            
            # 6. Analysis
            analysis = await self._analyze(translation, metadata, interaction_id)
            enhanced_metadata = analysis.get('metadata', metadata)
            
            # 7. Participants
            participants = await self._participants(enhanced_metadata, interaction_id, t_data['text'])
            
            # 8. Reports
            await self._reports(interaction_id, {
                'metadata': enhanced_metadata,
                'narration': analysis['narration'],
                'key_challenges': analysis['challenges'],
                'farmer_questions': analysis['questions'],
                'llm_fallback_questions': analysis['fallback_questions'],
                'participants': participants
            })
            
            # 9. Complete
            await db_manager.update_interaction(interaction_id, {'status.report_generated': True, 'status.last_updated': datetime.utcnow()})
            log.info(f"Pipeline complete: {interaction_id}")
            return interaction_id
            
        except Exception as e:
            log.error(f"Pipeline failed: {e}")
            if 'interaction_id' in locals():
                await db_manager.update_interaction(interaction_id, {'status.error': str(e), 'status.last_updated': datetime.utcnow()})
            raise

    async def _create_record(self, file_path: Path, metadata: Dict[str, Any]) -> str:
        # Validate metadata
        v_meta = InteractionMetadata(
            date=MetadataValidator.validate_date(metadata['date']),
            time=MetadataValidator.validate_time(metadata['time']),
            location=metadata.get('location'),
            village=MetadataValidator.validate_required_field(metadata['village'], 'Village'),
            block=MetadataValidator.validate_required_field(metadata['block'], 'Block'),
            district=MetadataValidator.validate_required_field(metadata['district'], 'District'),
            state=metadata.get('state', 'Punjab'),
            coordinator_name=MetadataValidator.validate_required_field(metadata['coordinator_name'], 'Coordinator'),
            reporting_manager_name=metadata.get('reporting_manager_name'),
            interaction_type=metadata.get('interaction_type', 'village_meeting'),
            language=metadata.get('language', 'punjabi'),
            source_folder_path=metadata.get('source_folder_path')
        )
        
        record = InteractionRecord(
            original_filename=file_path.name,
            file_path=str(file_path),
            file_type='video' if FileValidator.is_video(file_path) else 'audio',
            file_size_mb=file_manager.get_file_size_mb(file_path),
            metadata=v_meta,
            status=ProcessingStatus()
        )
        return await db_manager.create_interaction(record)

    async def _extract_audio(self, file_path: Path, iid: str) -> Path:
        if FileValidator.is_video(file_path):
            log.info("Extracting audio")
            audio = await audio_extractor.extract_audio(file_path)
            saved = await file_manager.save_processed_file(audio, f"{iid}_audio.wav", "audio")
            await db_manager.update_interaction(iid, {'audio_path': str(saved), 'status.audio_extracted': True})
            return saved
        else:
            await db_manager.update_interaction(iid, {'audio_path': str(file_path), 'status.audio_extracted': True})
            return file_path

    async def _preprocess_audio(self, audio_path: Path, interaction_id: str) -> tuple[Path, Optional[List[Dict[str, Any]]]]:
        """Run noise suppression and speaker diarization"""
        log.info("Running audio preprocessing")
        import asyncio
        
        # 1. Noise Suppression
        try:
            cleaned_audio_filename = f"{interaction_id}_cleaned.wav"
            cleaned_audio_path = audio_path.parent / cleaned_audio_filename
            
            # Run noise suppression in a thread pool since it is CPU intensive and synchronous
            loop = asyncio.get_running_loop()
            cleaned_audio_path = await loop.run_in_executor(
                None, 
                audio_preprocessing.noise_suppression, 
                audio_path, 
                cleaned_audio_path
            )
            
            # Save processed file using file_manager
            saved_cleaned_audio = await file_manager.save_processed_file(cleaned_audio_path, cleaned_audio_filename, "audio")
            
            # Clean up temporary cleaned audio if it's different from the saved one
            if cleaned_audio_path.exists() and cleaned_audio_path != saved_cleaned_audio:
                try:
                    cleaned_audio_path.unlink()
                except Exception as e:
                    log.warning(f"Failed to delete intermediate cleaned audio: {e}")
                    
            audio_path = saved_cleaned_audio
            log.info(f"Noise suppression completed: {audio_path}")
        except Exception as e:
            log.error(f"Noise suppression failed, using original audio: {e}")
            
        # 2. Speaker Diarization
        segments = None
        try:
            diarization_json_filename = f"{interaction_id}_timeline.json"
            diarization_json_path = settings.processed_dir / "diarization" / diarization_json_filename
            diarization_json_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Run diarization
            segments = await audio_preprocessing.diarize(
                audio_path=audio_path,
                output_json_path=diarization_json_path
            )
            
            # Update database status
            await db_manager.update_interaction(interaction_id, {
                'diarization_timeline_path': str(diarization_json_path),
                'status.diarized': True
            })
        except Exception as e:
            log.error(f"Speaker diarization failed: {e}")
            # If diarization fails, we proceed without segments (fallback to whole file transcription)
            
        return audio_path, segments

    async def _transcribe(self, audio_path: Path, lang: Optional[str], iid: str, segments: Optional[List[Dict[str, Any]]] = None, model: str = "efficient") -> Dict[str, Any]:
        log.info(f"Transcribing using model: {model}")
        data = await transcription_service.transcribe(audio_path, lang, segments, model)
        await db_manager.update_interaction(iid, {'transcript': data['text'], 'transcript_language': data['language'], 'status.transcribed': True})
        return data

    async def _translate(self, segments: Optional[List[Dict[str, Any]]], raw_text: str, src_lang: str, iid: str) -> str:
        if src_lang.lower() in ['en', 'english']: return raw_text
        log.info(f"Translating {src_lang} -> English")
        lang_map = {'pa': 'punjabi', 'hi': 'hindi', 'en': 'english'} # Add full map if needed
        full_lang = lang_map.get(src_lang, src_lang)
        
        # If segments exist, translate segment-by-segment to preserve timestamps/speakers
        # and prevent model length truncation issues
        if segments:
            log.info("Translating segment-by-segment")
            translated_lines = []
            for entry in segments:
                text_to_translate = entry.get('text', '')
                if text_to_translate.strip():
                    translated_text = await translation_service.translate(text_to_translate, full_lang)
                else:
                    translated_text = ""
                time_str = entry.get('time', '')
                speaker = entry.get('speaker', '')
                translated_lines.append(f"{time_str} {speaker}: {translated_text}")
            translation = "\n".join(translated_lines).strip()
        else:
            translation = await translation_service.translate(raw_text, full_lang)
            
        await db_manager.update_interaction(iid, {'translation': translation, 'status.translated': True})
        return translation

    async def _analyze(self, text: str, meta: Dict[str, Any], iid: str) -> Dict[str, Any]:
        log.info("Analyzing (LLM)")
        
        # Parallel execution of analysis tasks
        # 1. Full Analysis (Narration, Questions, Challenges)
        analysis_res = await llm_analyzer.analyze_full_interaction(text, meta)
        
        # 2. Rich Metadata Extraction (Sarpanch, Phone, etc.)
        rich_meta = await llm_analyzer.extract_rich_metadata(text, meta)
        
        # 3. Terminology Extraction
        terms = await llm_analyzer.extract_terminology(text)
        
        # Merge rich metadata into existing metadata
        if rich_meta:
            log.info(f"Enriched metadata: {rich_meta}")
            meta.update(rich_meta)
            # Update specific fields in DB metadata
            update_fields = {f"metadata.{k}": v for k, v in rich_meta.items() if v}
            if update_fields:
                await db_manager.update_interaction(iid, update_fields)
        
        await db_manager.update_interaction(iid, {
            'narration': analysis_res['narration'], 
            'key_challenges': analysis_res['challenges'], 
            'farmer_questions': analysis_res['questions'], 
            'llm_fallback_questions': analysis_res['fallback_questions'],
            'terminology_mapping': terms,
            'status.analyzed': True
        })
        
        analysis_res['metadata'] = meta # Return updated meta
        analysis_res['terminology_mapping'] = terms
        return analysis_res

    async def _participants(self, meta: Dict[str, Any], iid: str, transcript: Optional[str] = None) -> Dict[str, Any]:
        log.info("Parsing participants")
        p = await participant_parser.parse_participants(meta, transcript)
        await db_manager.update_interaction(iid, {'participants': p})
        return p

    async def _reports(self, iid: str, data: Dict[str, Any]) -> Dict[str, Path]:
        log.info("Generating reports")
        temp_dir = Path(tempfile.mkdtemp())
        paths = {}
        
        try:
            # Excel
            p = temp_dir / f"{iid}_report.xlsx"
            excel_generator.create_report(data, p)
            paths['excel'] = await file_manager.save_report(p, 'excel', iid)
            
            # PDF
            p = temp_dir / f"{iid}_report.pdf"
            pdf_generator.create_report(data, p)
            paths['pdf'] = await file_manager.save_report(p, 'pdf', iid)
            
            # Word
            p = temp_dir / f"{iid}_report.docx"
            word_generator.create_report(data, p)
            paths['word'] = await file_manager.save_report(p, 'word', iid)
            
            await db_manager.update_interaction(iid, {
                'excel_report_path': str(paths['excel']),
                'pdf_report_path': str(paths['pdf']),
                'word_report_path': str(paths['word'])
            })
            return paths
        finally:
            shutil.rmtree(temp_dir)

pipeline = PipelineOrchestrator()

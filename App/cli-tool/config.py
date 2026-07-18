"""
Central configuration module for Report Generation Pipeline
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from typing import Literal, Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )
    
    # API Keys
    gemini_api_key: str
    
    # Zoho WorkDrive API
    zoho_client_id: str = ""
    zoho_client_secret: str = ""
    zoho_refresh_token: str = ""
    zoho_root_folder_id: str = ""
    
    # MongoDB Configuration
    mongodb_uri: str = "mongodb://localhost:27017/"
    mongodb_database: str = "outreach_reports"
    
    # File Storage
    upload_dir: Path = Path("./data/uploads")
    processed_dir: Path = Path("./data/processed")
    reports_dir: Path = Path("./data/reports")
    max_upload_size_mb: int = 500
    
    # Transcription Settings
    whisper_model: str = "large-v3"
    whisper_device: Literal["cpu", "cuda"] = "cpu"
    whisper_compute_type: str = "float16"
    
    # Advanced Model Settings
    whisper_base_model: str = "openai/whisper-large-v3-turbo"
    whisper_lora_repo: str = "Garden2006/whisper-large-v3-turbo-gurmukhi-lora"
    gemma_model_id: str = "google/gemma-3n-e4b-it"
    
    # Translation Settings
    translation_model: str = "ai4bharat/indictrans2-en-indic-1B"
    translation_device: Literal["cpu", "cuda"] = "cpu"
    
    # Diarization Settings
    hf_token: Optional[str] = None
    diarization_model: str = "pyannote/speaker-diarization-community-1"
    
    # LLM Settings
    gemini_model: str = "gemini-2.5-flash"
    gemini_max_tokens: int = 4096
    gemini_temperature: float = 0.7
    
    # API Server
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_workers: int = 4
    
    # Logging
    log_level: str = "INFO"
    log_file: Path = Path("./logs/pipeline.log")
    
    # Processing
    max_concurrent_jobs: int = 3
    task_timeout_minutes: int = 30
    batch_size: int = 16
    
    # Supported languages (Indian languages + English)
    supported_languages: list[str] = [
        "punjabi", "hindi", "bengali", "gujarati", "kannada",
        "malayalam", "marathi", "oriya", "tamil", "telugu",
        "urdu", "english"
    ]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Create directories if they don't exist
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.processed_dir.mkdir(parents=True, exist_ok=True)
        self.reports_dir.mkdir(parents=True, exist_ok=True)
        self.log_file.parent.mkdir(parents=True, exist_ok=True)


# Global settings instance
settings = Settings()

"""
Utilities Module
Handles Logging and Data Validation
"""
import sys
import re
import mimetypes
from pathlib import Path
from datetime import datetime
from typing import Tuple, List, Dict
from loguru import logger
from config import settings

# Attempt to load magic, fallback to standard mimetypes if libmagic is missing
try:
    import magic
    # Check if libmagic loader works
    magic.Magic(mime=True)
    _has_magic = True
except Exception:
    _has_magic = False

# --- Part 1: Logger ---

def setup_logger():
    """Configure loguru logger"""
    logger.remove()
    logger.add(sys.stdout, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan> - <level>{message}</level>", level=settings.log_level, colorize=True)
    logger.add(settings.log_file, format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}", level=settings.log_level, rotation="10 MB", retention="30 days", compression="zip")
    return logger

log = setup_logger()

# --- Part 2: Validators ---

class ValidationError(Exception): pass

class FileValidator:
    """Validate uploaded files"""
    AUDIO_FORMATS = {'audio/mpeg': ['.mp3'], 'audio/wav': ['.wav'], 'audio/x-wav': ['.wav'], 'audio/ogg': ['.ogg'], 'audio/flac': ['.flac'], 'audio/aac': ['.aac'], 'audio/m4a': ['.m4a', '.mp4'], 'audio/x-m4a': ['.m4a']} # Added .mp4 to m4a as commonly mislabeled
    VIDEO_FORMATS = {'video/mp4': ['.mp4'], 'video/mpeg': ['.mpeg', '.mpg'], 'video/quicktime': ['.mov'], 'video/x-msvideo': ['.avi'], 'video/x-matroska': ['.mkv'], 'video/webm': ['.webm']}
    
    @classmethod
    def get_mime_type(cls, file_path: Path) -> str:
        """Robust mime type guessing utilizing magic or mimetypes fallback"""
        if _has_magic:
            try:
                return magic.Magic(mime=True).from_file(str(file_path))
            except Exception:
                pass
        
        # Fallback to standard library mimetypes
        mime_type, _ = mimetypes.guess_type(str(file_path))
        if not mime_type:
            ext = file_path.suffix.lower()
            for m, extensions in {**cls.AUDIO_FORMATS, **cls.VIDEO_FORMATS}.items():
                if ext in extensions:
                    return m
            return 'application/octet-stream'
        return mime_type

    @classmethod
    def validate_file(cls, file_path: Path, max_size_mb: int = 500) -> Tuple[bool, str]:
        if not file_path.exists(): return False, "File does not exist"
        if (file_path.stat().st_size / (1024 * 1024)) > max_size_mb: return False, f"File exceeds {max_size_mb}MB"
        
        mime = cls.get_mime_type(file_path)
        formats = {**cls.AUDIO_FORMATS, **cls.VIDEO_FORMATS}
        
        if mime not in formats: return False, f"Unsupported format: {mime}"
        if file_path.suffix.lower() not in formats[mime]: return False, f"Extension mismatch for {mime}"
        return True, "Valid file"

    @classmethod
    def is_audio(cls, file_path: Path) -> bool:
        return cls.get_mime_type(file_path) in cls.AUDIO_FORMATS

    @classmethod
    def is_video(cls, file_path: Path) -> bool:
        return cls.get_mime_type(file_path) in cls.VIDEO_FORMATS

class MetadataValidator:
    """Validate metadata fields"""
    @staticmethod
    def validate_date(date_str: str) -> datetime:
        try: return datetime.strptime(date_str, "%Y-%m-%d")
        except: raise ValidationError(f"Invalid date: {date_str}")

    @staticmethod
    def validate_time(time_str: str) -> str:
        if not re.match(r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$', time_str): raise ValidationError(f"Invalid time: {time_str}")
        return time_str

    @staticmethod
    def validate_required_field(value: str, field_name: str) -> str:
        if not value or not value.strip(): raise ValidationError(f"{field_name} required")
        return value.strip()

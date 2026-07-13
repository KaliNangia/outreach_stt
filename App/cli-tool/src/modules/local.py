"""
Local File/Folder Processing Service
Handles scanning local folders, merging files, and executing the pipeline.
"""
import re
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Any
from src.core.utils import log
from src.modules.processing import audio_extractor

class LocalBatchService:
    """Service to handle local folder batch operations matching ZohoWorkDriveClient structure"""
    
    def __init__(self, work_dir: Path, processor):
        self.work_dir = work_dir
        self.processor = processor
        self.work_dir.mkdir(parents=True, exist_ok=True)

    def scan_for_media_files(self, folder_path: Path, file_types: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """Scan a local directory recursively for supported media files"""
        types = file_types or ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.mp4', '.avi', '.mov', '.mkv', '.webm', '.mpeg']
        media = []
        
        if not folder_path.exists():
            log.error(f"Local folder does not exist: {folder_path}")
            return []
            
        def _scan(curr_dir: Path, relative_path=""):
            try:
                # Sort items to ensure consistent merge order
                for item in sorted(curr_dir.iterdir(), key=lambda x: x.name):
                    curr_rel = f"{relative_path}/{item.name}" if relative_path else item.name
                    if item.is_file():
                        ext = item.suffix.lower()
                        if ext in types:
                            media.append({
                                "path": item,
                                "rel_path": curr_rel,
                                "name": item.name,
                                "size": item.stat().st_size,
                                "extension": ext
                            })
                    elif item.is_dir() and item.name != "__pycache__" and not item.name.startswith('.'):
                        _scan(item, curr_rel)
            except Exception as e:
                log.error(f"Local directory scan error in {curr_dir}: {e}")

        _scan(folder_path)
        return media

    def extract_metadata_from_path(self, path_str: str) -> Dict[str, str]:
        """Extract metadata from path matching Zoho's naming convention (e.g. DD-MM-YYYY_District_Block)"""
        meta = {}
        # Replace backslashes with forward slashes for cross-platform compatibility
        normalized_path = path_str.replace('\\', '/')
        parts = normalized_path.split('/')
        
        if parts:
            first = parts[-1]  # Extract from folder name itself
            if date_match := re.search(r'(\d{2})-(\d{2})-(\d{4})', first):
                d, m, y = date_match.groups()
                meta['date'] = f"{y}-{m}-{d}"
            
            loc_parts = re.sub(r'\d{2}-\d{2}-\d{4}_?', '', first).split('_')
            if len(loc_parts) >= 1 and loc_parts[0].strip():
                meta['district'] = loc_parts[0].strip()
            if len(loc_parts) >= 2 and loc_parts[1].strip():
                meta['block'] = loc_parts[1].replace('Block', '').strip()
            
        return meta

    async def process_folder_merge(self, folder_path: Path, meta_overrides: Dict[str, Any], default_lang: str) -> Optional[str]:
        """Scan a local folder, merge all media files, and process them through the pipeline"""
        log.info(f"Scanning local folder {folder_path} for merging")
        files = self.scan_for_media_files(folder_path)
        audio_files = [f for f in files if f['extension'] in ['.mp3', '.m4a', '.wav', '.aac']]
        
        if not audio_files:
            log.warning(f"No mergeable audio files found in local folder: {folder_path}")
            return None

        # Treat as one group
        folder_identifier = folder_path.name or "Merged_Local_Folder"
        log.info(f"Processing Local Group: {folder_identifier} ({len(audio_files)} files)")
        
        # 1. Setup temporary group folder for merged result
        group_dir = self.work_dir / folder_identifier.replace("/", "_").replace(" ", "_")
        group_dir.mkdir(parents=True, exist_ok=True)
        
        # 2. Merge
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        merged_filename = f"merged_{timestamp}_{folder_identifier}.m4a"
        merged_path = group_dir / merged_filename
        
        file_paths = [f['path'] for f in audio_files]
        log.info(f"🔗 Concatenating {len(file_paths)} files into: {merged_path.name}...")
        await audio_extractor.concat_audio_files(file_paths, merged_path)
        log.info("🔗 Audio files merged successfully.")
        
        # 3. Metadata extraction and fallback
        meta = self.extract_metadata_from_path(folder_identifier)
        meta.setdefault("date", datetime.now().strftime("%Y-%m-%d"))
        meta.setdefault("village", folder_identifier)
        meta.setdefault("block", "Unknown")
        meta.setdefault("district", "Unknown")
        meta.setdefault("coordinator_name", "Local Scanner")
        meta.setdefault("language", default_lang)
        meta.setdefault("time", "10:00")
        meta["source_folder_path"] = str(folder_path.absolute())
        
        # Apply Overrides
        if meta_overrides:
            meta.update(meta_overrides)
            
        # 4. Process through main pipeline orchestrator
        try:
            iid = await self.processor.process_interaction(merged_path, meta)
            log.info(f"✅ Processed [{folder_identifier}]: {iid}")
            return iid
        except Exception as e:
            log.error(f"Failed to process local folder {folder_identifier}: {e}")
            raise e

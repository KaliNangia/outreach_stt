"""
Zoho WorkDrive Integration
Handles File Listing, Downloading, and Syncing
"""
import requests
import re
import asyncio
from pathlib import Path
from typing import List, Dict, Optional, Any
from src.core.utils import log

class ZohoWorkDriveClient:
    """Client for Zoho WorkDrive API"""
    
    def __init__(self, client_id: str, client_secret: str, refresh_token: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.refresh_token = refresh_token
        self.access_token = None
        self.base_url = "https://www.zohoapis.in/workdrive/api/v1"
        
    def authenticate(self):
        try:
            log.info("Authenticating with Zoho WorkDrive")
            res = requests.post("https://accounts.zoho.in/oauth/v2/token", params={
                "refresh_token": self.refresh_token,
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "grant_type": "refresh_token"
            })
            res.raise_for_status()
            self.access_token = res.json()["access_token"]
            log.info("Authenticated Zoho")
        except Exception as e:
            log.error(f"Zoho Auth Failed: {e}")
            raise

    def _get_headers(self) -> Dict[str, str]:
        if not self.access_token: self.authenticate()
        return {"Authorization": f"Zoho-oauthtoken {self.access_token}", "Content-Type": "application/json"}

    def list_folder_contents(self, folder_id: str) -> List[Dict]:
        res = requests.get(f"{self.base_url}/files/{folder_id}/files", headers=self._get_headers())
        res.raise_for_status()
        return res.json().get("data", [])

    def get_file_info(self, file_id: str) -> Dict:
        res = requests.get(f"{self.base_url}/files/{file_id}", headers=self._get_headers())
        res.raise_for_status()
        return res.json().get("data", {})

    def download_file(self, file_id: str, save_path: Path) -> Path:
        log.info(f"Downloading {file_id}")
        info = self.get_file_info(file_id)
        url = info.get('attributes', {}).get('download_url')
        if not url: raise ValueError("No download URL")
        
        res = requests.get(url, headers=self._get_headers(), stream=True)
        res.raise_for_status()
        save_path.parent.mkdir(parents=True, exist_ok=True)
        with open(save_path, 'wb') as f:
            for chunk in res.iter_content(chunk_size=8192): f.write(chunk)
        return save_path

    def scan_for_media_files(self, folder_id: str, file_types: List[str] = None) -> List[Dict]:
        types = file_types or ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac', '.mp4', '.avi', '.mov', '.mkv', '.webm', '.mpeg']
        media = []
        
        def _scan(fid, path=""):
            try:
                for item in self.list_folder_contents(fid):
                    name = item.get("attributes", {}).get("name", "")
                    curr_path = f"{path}/{name}" if path else name
                    
                    is_folder = item.get("type") == "folder" or item.get("attributes", {}).get("type") == "folder"
                    
                    if item.get("type") == "files" and not is_folder:
                        if Path(name).suffix.lower() in types:
                            media.append({
                                "id": item.get("id"), "name": name, "path": curr_path,
                                "size": item.get("attributes", {}).get("storage_info", {}).get("size_in_bytes", 0),
                                "extension": Path(name).suffix.lower()
                            })
                    elif is_folder:
                        # log.info(f"Found subfolder: {name}")
                        _scan(item.get("id"), curr_path)
            except Exception as e:
                log.error(f"Scan error {fid}: {e}")

        log.info(f"Scanning {folder_id}")
        _scan(folder_id)
        return media

    def extract_metadata_from_path(self, file_path: str) -> Dict:
        meta = {}
        parts = file_path.split('/')
        if parts:
            first = parts[0]
            if date_match := re.search(r'(\d{2})-(\d{2})-(\d{4})', first):
                d, m, y = date_match.groups()
                meta['date'] = f"{y}-{m}-{d}"
            
            loc_parts = re.sub(r'\d{2}-\d{2}-\d{4}_?', '', first).split('_')
            if len(loc_parts) >= 1: meta['district'] = loc_parts[0]
            if len(loc_parts) >= 2: meta['block'] = loc_parts[1].replace('Block', '').strip()
            
        if len(parts) > 1:
            if v_match := re.search(r'(?:Videos?|Audios?)_(.+)', parts[1]):
                meta['village'] = v_match.group(1)
        return meta

from datetime import datetime
from src.modules.processing import audio_extractor
from src.pipeline import pipeline # Need pipeline to process

class ZohoBatchService:
    """Service to handle Batch, Sync, and Recursive operations"""
    
    def __init__(self, client: ZohoWorkDriveClient, work_dir: Path, processor):
        self.client = client
        self.work_dir = work_dir
        self.processor = processor
        self.work_dir.mkdir(parents=True, exist_ok=True)

    async def sync_folder_files(self, root_folder_id: str, default_meta: Optional[Dict] = None, model: str = "efficient"):
        """Standard sync: File by File"""
        log.info(f"Syncing {root_folder_id}")
        for file_info in self.client.scan_for_media_files(root_folder_id):
            try:
                meta = {**(default_meta or {}), **self.client.extract_metadata_from_path(file_info['path'])}
                # Defaults
                for k, v in [('time','10:00'), ('village','Unknown'), ('block','Unknown'), ('district','Unknown'), ('state','Punjab'), ('coordinator_name','Unknown'), ('interaction_type','village_meeting'), ('language','punjabi')]:
                    meta.setdefault(k, v)
                
                local_path = self.work_dir / f"{file_info['id']}_{file_info['name']}"
                self.client.download_file(file_info['id'], local_path)
                await self.processor.process_interaction(local_path, meta, model=model)
            except Exception as e:
                log.error(f"Sync Process failed {file_info['name']}: {e}")

    async def process_recursive_merge(self, root_folder_id: str, default_lang: str, model: str = "efficient"):
        """Deep scan, group by folder, merge, and process"""
        log.info(f"Deep scanning root folder {root_folder_id}")
        all_media = self.client.scan_for_media_files(root_folder_id)
        
        # Group by folder path
        grouped = {}
        for m in all_media:
            if m['extension'] not in ['.mp3', '.m4a', '.wav', '.aac']: continue
            parent_dir = str(Path(m['path']).parent)
            if parent_dir == ".": parent_dir = "Root"
            if parent_dir not in grouped: grouped[parent_dir] = []
            grouped[parent_dir].append(m)
            
        log.info(f"Found {len(grouped)} unique subfolders with audio")
        
        for folder_path, files in grouped.items():
            await self._process_file_group(folder_path, files, default_lang, model=model)

    async def process_single_folder_merge(self, folder_id: str, meta_overrides: Dict, default_lang: str, model: str = "efficient"):
        """Merge all files in a specific folder"""
        log.info(f"Scanning folder {folder_id}")
        files = self.client.scan_for_media_files(folder_id)
        audio_files = [f for f in files if f['extension'] in ['.mp3', '.m4a', '.wav', '.aac']]
        
        if not audio_files:
            log.warning("No audio files found")
            return

        # Treat as one group named "Merged Data" or from args
        folder_name = meta_overrides.get("village", "Merged_Folder")
        await self._process_file_group(folder_name, audio_files, default_lang, meta_overrides, model=model)

    async def _process_file_group(self, folder_identifier: str, files: List[Dict], lang: str, meta_overrides: Optional[Dict] = None, model: str = "efficient"):
        log.info(f"Processing Group: {folder_identifier} ({len(files)} files)")
        
        # 1. Download
        group_dir = self.work_dir / folder_identifier.replace("/", "_").replace(" ", "_")
        group_dir.mkdir(parents=True, exist_ok=True)
        
        downloaded = []
        for f in files:
            local = group_dir / f"{f['id']}_{f['name']}"
            if not local.exists():
                self.client.download_file(f['id'], local)
            downloaded.append(local)
        
        # 2. Merge
        merged_filename = f"merged_{folder_identifier.split('/')[-1]}.m4a"
        merged_path = group_dir / merged_filename
        await audio_extractor.concat_audio_files(downloaded, merged_path)
        
        # 3. Metadata
        folder_name = folder_identifier.split('/')[-1]
        
        # Default Logic
        meta = self.client.extract_metadata_from_path(f"{folder_name}/dummy_file")
        meta.setdefault("date", datetime.now().strftime("%Y-%m-%d"))
        meta.setdefault("village", folder_name)
        meta.setdefault("interaction_type", "folder_meeting")
        meta.setdefault("coordinator_name", "Auto Scanner")
        meta.setdefault("language", lang)
        meta.setdefault("time", "10:00")
        meta["source_folder_path"] = folder_identifier
        
        # Apply Overrides
        if meta_overrides:
            meta.update(meta_overrides)
            
        # 4. Process
        try:
            iid = await self.processor.process_interaction(merged_path, meta, model=model)
            print(f"✅ Processed [{folder_identifier}]: {iid}")
        except Exception as e:
            log.error(f"Failed to process {folder_identifier}: {e}")

zoho_client = None
def initialize_zoho_client(_id, secret, refresh):
    global zoho_client
    zoho_client = ZohoWorkDriveClient(_id, secret, refresh)
    zoho_client.authenticate()
    return zoho_client

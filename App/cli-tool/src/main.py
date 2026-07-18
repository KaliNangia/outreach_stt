"""
Main CLI Application
Unified entry point for file processing, folder syncing, and batch jobs.
"""
import asyncio
import argparse
from pathlib import Path
from datetime import datetime

from config import settings
from src.core.database import db_manager
from src.modules.zoho import initialize_zoho_client, ZohoBatchService
from src.modules.local import LocalBatchService
from src.pipeline import pipeline
from src.core.utils import log

async def cmd_process_file(args):
    """Process a single local file"""
    path = Path(args.file)
    if not path.exists():
        log.error(f"File not found: {path}")
        return

    meta = {
        "date": args.date or datetime.now().strftime("%Y-%m-%d"),
        "time": "10:00",
        "village": args.village or "Unknown",
        "block": args.block or "Unknown",
        "district": args.district or "Unknown",
        "coordinator_name": args.coordinator or "Manual Upload",
        "language": args.language
    }
    
    await db_manager.connect()
    try:
        iid = await pipeline.process_interaction(path, meta, model=args.model)
        print(f"✅ Processed: {iid}")
    finally:
        await db_manager.disconnect()

async def cmd_process_folder_merge(args):
    """Download, Merge, and Process Zoho Folder"""
    await db_manager.connect()
    try:
        client = initialize_zoho_client(settings.zoho_client_id, settings.zoho_client_secret, settings.zoho_refresh_token)
        service = ZohoBatchService(client, Path("data/uploads/concat_processing"), pipeline)
        
        meta_overrides = {
            "village": args.village,
            "block": args.block,
            "district": args.district,
            "interaction_type": "consolidated_meeting"
        }
        # Remove None values
        meta_overrides = {k: v for k, v in meta_overrides.items() if v}
        
        await service.process_single_folder_merge(args.folder_id, meta_overrides, args.language, model=args.model)
    finally:
        await db_manager.disconnect()

async def cmd_process_local_folder(args):
    """Scan, Merge, and Process a local folder"""
    await db_manager.connect()
    try:
        service = LocalBatchService(Path("data/uploads/local_processing"), pipeline)
        
        meta_overrides = {
            "village": args.village,
            "block": args.block,
            "district": args.district,
            "interaction_type": "consolidated_meeting"
        }
        # Remove None values
        meta_overrides = {k: v for k, v in meta_overrides.items() if v}
        
        await service.process_folder_merge(Path(args.folder_path), meta_overrides, args.language)
    finally:
        await db_manager.disconnect()

async def cmd_sync_folder(args):
    """Sync a folder normally (individual files)"""
    await db_manager.connect()
    try:
        client = initialize_zoho_client(settings.zoho_client_id, settings.zoho_client_secret, settings.zoho_refresh_token)
        service = ZohoBatchService(client, Path("data/uploads"), pipeline)
        await service.sync_folder_files(args.folder_id, model=args.model)
    finally:
        await db_manager.disconnect()

async def cmd_recursive_merge(args):
    """Deep scan, Group by Subfolder, Merge & Process"""
    await db_manager.connect()
    try:
        client = initialize_zoho_client(settings.zoho_client_id, settings.zoho_client_secret, settings.zoho_refresh_token)
        service = ZohoBatchService(client, Path("data/uploads/recursive_processing"), pipeline)
        await service.process_recursive_merge(args.folder_id, args.language, model=args.model)
    finally:
        await db_manager.disconnect()

def main():
    parser = argparse.ArgumentParser(description="Outreach Dashboard CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)
    
    # Process Single File
    p_file = subparsers.add_parser("process-file", help="Process a single local file")
    p_file.add_argument("file", help="Path to file")
    p_file.add_argument("--village", help="Village name")
    p_file.add_argument("--date", help="YYYY-MM-DD")
    p_file.add_argument("--block", help="Block")
    p_file.add_argument("--district", help="District")
    p_file.add_argument("--coordinator", help="Coordinator Name")
    p_file.add_argument("--language", default="punjabi", help="Language code")
    p_file.add_argument("--model", choices=["efficient", "performance"], default="efficient", help="Transcription model: efficient (Whisper LoRA) or performance (Gemma 3n)")
    
    # Merge Folder
    p_merge = subparsers.add_parser("process-merge", help="Download, Merge and Process Zoho Folder")
    p_merge.add_argument("folder_id", help="Zoho Folder ID")
    p_merge.add_argument("--village", help="Village name for report")
    p_merge.add_argument("--block", help="Block name")
    p_merge.add_argument("--district", help="District name")
    p_merge.add_argument("--language", default="punjabi")
    p_merge.add_argument("--model", choices=["efficient", "performance"], default="efficient", help="Transcription model: efficient (Whisper LoRA) or performance (Gemma 3n)")
    
    # Process Local Folder
    p_local = subparsers.add_parser("process-folder", help="Merge and Process all audios in a local folder")
    p_local.add_argument("folder_path", help="Local Folder Path")
    p_local.add_argument("--village", help="Village name for report")
    p_local.add_argument("--block", help="Block name")
    p_local.add_argument("--district", help="District name")
    p_local.add_argument("--language", default="punjabi")
    
    # Sync
    p_sync = subparsers.add_parser("sync", help="Regular sync of Zoho folder (file by file)")
    p_sync.add_argument("folder_id", help="Zoho Folder ID")
    p_sync.add_argument("--model", choices=["efficient", "performance"], default="efficient", help="Transcription model: efficient (Whisper LoRA) or performance (Gemma 3n)")
    
    # Recursive Merge
    p_rec = subparsers.add_parser("recursive-merge", help="Deep scan, Group by Subfolder, Merge & Process")
    p_rec.add_argument("folder_id", help="Root Zoho Folder ID")
    p_rec.add_argument("--language", default="punjabi")
    p_rec.add_argument("--model", choices=["efficient", "performance"], default="efficient", help="Transcription model: efficient (Whisper LoRA) or performance (Gemma 3n)")
    
    args = parser.parse_args()
    
    if args.command == "process-file":
        asyncio.run(cmd_process_file(args))
    elif args.command == "process-merge":
        asyncio.run(cmd_process_folder_merge(args))
    elif args.command == "process-folder":
        asyncio.run(cmd_process_local_folder(args))
    elif args.command == "sync":
        asyncio.run(cmd_sync_folder(args))
    elif args.command == "recursive-merge":
        asyncio.run(cmd_recursive_merge(args))

if __name__ == "__main__":
    main()

"""Supabase Storage 래퍼.

버킷:
- audio-files: 사용자 업로드 원본
- stem-results: 분리된 스템들
"""
from __future__ import annotations

import os
from pathlib import Path

# TODO Audio Agent: supabase 클라이언트 초기화
# from supabase import create_client, Client
#
# def get_client() -> Client:
#     return create_client(
#         os.environ["SUPABASE_URL"],
#         os.environ["SUPABASE_SERVICE_ROLE_KEY"],
#     )


def upload_stem(local_path: Path, remote_key: str) -> str:
    """스템 wav를 stem-results 버킷에 업로드. public URL 반환."""
    raise NotImplementedError("Audio Agent: implement Supabase upload")


def download_audio(remote_url: str, local_path: Path) -> Path:
    """원본 오디오 다운로드."""
    raise NotImplementedError("Audio Agent: implement download")

"""Demucs htdemucs_6s 래퍼.

플랫폼 자동 감지:
- Windows CUDA (RTX 3070): 로컬 GPU 실행 → 4분 곡 ≈ 2~3분
- Mac Intel CPU: Replicate API 사용 (로컬 CPU는 30분+)
- 강제 지정: DEMUCS_MODE=local|replicate 환경변수
"""
from __future__ import annotations

import os
from pathlib import Path


def _device() -> str:
    """실행 가능한 최선의 디바이스 반환."""
    try:
        import torch
        if torch.cuda.is_available():
            return "cuda"
        if torch.backends.mps.is_available():
            return "mps"
    except ImportError:
        pass
    return "cpu"


def _should_use_replicate() -> bool:
    """로컬 GPU 없으면 Replicate 사용."""
    mode = os.environ.get("DEMUCS_MODE", "auto")
    if mode == "local":
        return False
    if mode == "replicate":
        return True
    # auto: CUDA/MPS 없으면 Replicate
    return _device() == "cpu"


def separate(audio_url: str) -> dict[str, str]:
    """htdemucs_6s 분리 — 플랫폼에 따라 로컬/Replicate 자동 선택.

    Returns:
        {stem_name: public_url} — vocals, bass, guitar, piano, other, drums
    """
    if _should_use_replicate():
        return _separate_via_replicate(audio_url)
    return _separate_local(audio_url)


def _separate_local(audio_url: str) -> dict[str, str]:
    """Windows CUDA에서 로컬 Demucs 실행."""
    # TODO Audio Agent (Windows에서 작업):
    # import torch
    # from demucs.apply import apply_model
    # from demucs.pretrained import get_model
    # import torchaudio, httpx, tempfile
    #
    # device = _device()  # "cuda"
    # model = get_model("htdemucs_6s").to(device)
    # ...wav 다운로드 → 분리 → Supabase 업로드 → URL dict 반환
    raise NotImplementedError("Windows에서 구현 예정 (Audio Agent)")


def _separate_via_replicate(audio_url: str) -> dict[str, str]:
    """Mac에서 Replicate API로 htdemucs_6s 호출."""
    # TODO Audio Agent (Mac에서 작업):
    # import replicate
    # output = replicate.run(
    #     "cjwbw/demucs:...",  # htdemucs_6s 모델 버전
    #     input={"audio": audio_url, "model": "htdemucs_6s"}
    # )
    # return {stem: url for stem, url in output.items()}
    raise NotImplementedError("Replicate API 키 및 모델 ID 필요")

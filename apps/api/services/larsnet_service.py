"""LarsNet 래퍼 — drum 스템을 kick/snare/toms/hihat/cymbal 5분할.

설치: pip install git+https://github.com/polimi-ispl/larsnet.git
DrumSplit(유료 API)을 대체. 라이선스: MIT.
"""
from __future__ import annotations

from pathlib import Path


def split_drums(drums_path: Path, output_dir: Path) -> dict[str, Path]:
    """drums.wav → {kick, snare, toms, hihat, cymbal}.wav 경로 반환."""
    # TODO Audio Agent: LarsNet 호출
    # from larsnet import DrumSeparator
    # separator = DrumSeparator(device=...)
    # stems = separator.separate(drums_path)
    raise NotImplementedError("Audio Agent: implement LarsNet drum split")

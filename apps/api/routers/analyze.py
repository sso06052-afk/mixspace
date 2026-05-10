"""좌표 분석 엔드포인트. 분리된 스템 URL들을 받아 StemsData JSON 반환."""
from __future__ import annotations

import tempfile
from pathlib import Path

import httpx
from fastapi import APIRouter, HTTPException

from models.schemas import AnalyzeRequest, AnalyzeResponse, StemCoord, StemsData
from services.coordinate_service import analyze_wav_file

router = APIRouter()


@router.post("", response_model=AnalyzeResponse)
async def analyze_stems(req: AnalyzeRequest) -> AnalyzeResponse:
    """각 스템 wav를 다운로드 → 1초 윈도우별 좌표+FFT 사전 계산.

    입력: { stems_urls: { "vocals": "https://...", ... } }
    출력: { coordinates: StemsData }
    """
    stems_data: dict = {}
    sample_rate = 44100
    duration_sec = 0.0

    async with httpx.AsyncClient(timeout=60.0) as client:
        for stem_name, url in req.stems_urls.items():
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
                tmp_path = Path(tmp.name)

            try:
                resp = await client.get(url)
                if resp.status_code != 200:
                    raise HTTPException(
                        status_code=502,
                        detail=f"{stem_name} 다운로드 실패: {resp.status_code}",
                    )
                tmp_path.write_bytes(resp.content)

                coords, sr = analyze_wav_file(tmp_path)
                if not coords:
                    continue

                stems_data[stem_name] = coords
                sample_rate = sr
                if duration_sec == 0.0 and coords:
                    duration_sec = coords[-1]["t"] + 1.0

            finally:
                tmp_path.unlink(missing_ok=True)

    if not stems_data:
        raise HTTPException(status_code=422, detail="분석 가능한 스템이 없습니다")

    total_windows = max(len(v) for v in stems_data.values())

    return AnalyzeResponse(
        coordinates=StemsData(
            version=1,
            sample_rate=sample_rate,
            duration_sec=round(duration_sec, 2),
            window_sec=1.0,
            total_windows=total_windows,
            stems={
                name: [StemCoord(**c) for c in coords]
                for name, coords in stems_data.items()
            },
        )
    )

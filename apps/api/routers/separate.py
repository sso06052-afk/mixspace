"""스템 분리 엔드포인트.

플로우: htdemucs_6s → 6스템 → drums를 LarsNet으로 5분할 → 최종 10스템.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from models.schemas import SeparateRequest, SeparateResponse, SeparateStatusResponse

router = APIRouter()


@router.post("", response_model=SeparateResponse)
async def start_separation(req: SeparateRequest) -> SeparateResponse:
    """비동기 분리 작업 시작. job_id 즉시 반환."""
    # TODO Audio Agent: 작업 큐에 enqueue, job_id 발급
    raise HTTPException(status_code=501, detail="not implemented")


@router.get("/{job_id}", response_model=SeparateStatusResponse)
async def get_separation_status(job_id: str) -> SeparateStatusResponse:
    """분리 작업 상태 조회. completed면 stems_urls 포함."""
    # TODO Audio Agent: 작업 상태 조회 + stems_urls 반환
    raise HTTPException(status_code=501, detail="not implemented")

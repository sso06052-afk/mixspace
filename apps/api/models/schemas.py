"""Pydantic 스키마 — packages/shared/types.ts 와 1:1 동기화."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

FinalStemName = Literal[
    "vocals",
    "bass",
    "guitar",
    "piano",
    "other",
    "kick",
    "snare",
    "toms",
    "hihat",
    "cymbal",
]

AnalysisStatus = Literal["pending", "processing", "completed", "failed"]


class StemCoord(BaseModel):
    t: float
    x: float = Field(ge=-1.0, le=1.0)
    y: float = Field(ge=0.0, le=1.0)
    z: float = Field(ge=0.0, le=1.0)
    size: float = Field(ge=0.1, le=1.0)
    fft: list[float] = Field(min_length=64, max_length=64)


class StemsData(BaseModel):
    version: int = 1
    sample_rate: int
    duration_sec: float
    window_sec: float = 1.0
    total_windows: int
    stems: dict[FinalStemName, list[StemCoord]]


class SeparateRequest(BaseModel):
    audio_url: str


class SeparateResponse(BaseModel):
    job_id: str
    status: AnalysisStatus


class SeparateStatusResponse(BaseModel):
    status: AnalysisStatus
    stems_urls: dict[FinalStemName, str] | None = None


class AnalyzeRequest(BaseModel):
    stems_urls: dict[FinalStemName, str]


class AnalyzeResponse(BaseModel):
    coordinates: StemsData

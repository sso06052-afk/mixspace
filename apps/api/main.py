"""MixSpace Audio Agent — FastAPI entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import analyze, health, separate

app = FastAPI(
    title="MixSpace API",
    description="스템 분리 + 좌표 분석 백엔드",
    version="0.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(separate.router, prefix="/separate", tags=["separate"])
app.include_router(analyze.router, prefix="/analyze", tags=["analyze"])

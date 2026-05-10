# MixSpace

> 완성된 음악을 올리면 → AI가 스템 분리 → 각 악기의 공간 좌표(좌우/높낮이/앞뒤)를 계산 → Three.js 3D 공간에 시간 흐름에 따른 파형으로 시각화하는 웹앱.

상세 스펙은 **[SPEC.md](./SPEC.md)** 참조 (단일 진실).
작업 규칙은 **[CLAUDE.md](./CLAUDE.md)** 참조.

## 구조

```
apps/
├── web/        Next.js 14 + R3F (Frontend + Viz)
└── api/        FastAPI + Demucs htdemucs_6s + LarsNet (Audio)
packages/
└── shared/     공유 타입 (인터페이스 계약)
.claude/agents/ subagent 지시사항 (ceo/audio/viz/frontend/infra)
```

## 핵심 기술 결정

- **스템 분리:** Demucs `htdemucs_6s` + **LarsNet** (DrumSplit 의존 제거)
- **좌표 분석:** librosa STFT, Z축은 wet/dry + HF rolloff + stereo decorrelation 가중합
- **시각화 FFT:** 사전 계산해서 좌표 JSON에 임베드 (런타임 0 부담)
- **재생 동기:** 다중 `AudioBufferSourceNode`를 단일 `AudioContext`에서 한 번에 `start(0)`
- **GPU:** Replicate / Modal serverless (상시 서버 없음)

## 시작

```bash
pnpm install
pnpm dev:web

# API
cd apps/api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Phase 로드맵

- **Phase 1** — 웹앱 MVP (업로드 → 분리 → 3D 파형 시각화)
- **Phase 2** — 3D 드래그로 실시간 믹스 수정 + 결제
- **Phase 3** — VST/AU 플러그인 (C++ + JUCE)

## 라이선스

TBD

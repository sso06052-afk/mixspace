# MixSpace — Claude Code Memory

## 프로젝트 한 줄 정의
완성된 음악을 stem 분리(보컬/드럼/베이스/기타)해서 X(panning)/Y(frequency)/Z(depth) 3D 공간에 시각화하는 학습/진단 웹 도구.

## 기술 스택 (변경 금지)
- **Frontend**: Next.js 14 (App Router) + TypeScript strict
- **Styling**: Tailwind CSS + shadcn/ui (Zinc 팔레트, dark mode)
- **3D**: Three.js + React Three Fiber + drei
- **오디오 분석**: Web Audio API + Essentia.js (WASM)
- **Stem 분리**: free-music-demixer WASM (클라이언트) / Demucs Python (서버 fallback, 4분↑)
- **백엔드**: FastAPI (Python 3.11) — Railway 배포
- **DB/Auth/Storage**: Supabase
- **AI 처방**: Anthropic API (`claude-sonnet-4-5`)
- **결제**: Lemon Squeezy
- **패키지 매니저**: pnpm (monorepo workspaces)
- **테스트**: Vitest (unit) + Playwright (e2e)

## 디렉토리 구조
```
mixspace/
├── apps/web/           # Next.js 14 — Vercel
│   ├── app/
│   │   ├── (marketing)/  # /, /pricing
│   │   └── (app)/        # /analyze/[id], /compare, /library, /account
│   ├── components/
│   │   ├── viz/          # Three.js 시각화 컴포넌트
│   │   ├── analysis/     # 분석 패널
│   │   └── upload/       # 파일 업로드
│   ├── lib/audio/        # decoder, analyzer, coordinates, demucs-wasm
│   └── workers/          # Web Worker (stem separation)
├── apps/api/           # FastAPI — Railway
│   ├── routers/          # separate, analyze, health
│   └── services/         # demucs_service, audio_analyzer, storage
└── packages/shared/    # 공유 TypeScript 타입
```

## 빌드 / 실행 명령
```bash
pnpm dev              # apps/web 개발 서버 (localhost:3000)
pnpm dev:api          # apps/api FastAPI 서버 (localhost:8001)
pnpm build            # apps/web 프로덕션 빌드
pnpm lint             # ESLint
pnpm type-check       # tsc --noEmit
pnpm test             # Vitest unit tests
pnpm test:e2e         # Playwright e2e tests
```

## 포트 배정 (다른 프로젝트와 충돌 방지)
- `3000` — Next.js dev server (MixSpace)
- `8001` — FastAPI dev server (MixSpace) ← 8000은 AiVstrecommender 점유
- `5173` — 점유됨 (distributor/dashboard Vite)
- `8000` — 점유됨 (AiVstrecommender FastAPI)
- `8765` — 점유됨 (다른 FastAPI)
- `11434` — Ollama

## 코드 기준
- TypeScript strict + `noUncheckedIndexedAccess: true`
- 함수당 50줄 이하, 컴포넌트당 200줄 이하
- 클라이언트 컴포넌트에 `'use client'` 명시 (없으면 Server Component)
- Essentia.js WASM 객체 사용 후 반드시 `.delete()` (메모리 누수 방지)
- Web Worker 메시지에 Transferable 사용 (`Float32Array.buffer` 이전)
- Supabase 클라이언트: `@supabase/ssr` 사용 (`auth-helpers-nextjs` deprecated)

## 핵심 제약 (절대 위반 금지)
1. 유튜브/스포티파이 직접 다운로드 구현 X (정책 위반)
2. 명세에 없는 기능 임의 추가 X
3. 분석 결과 30일 초과 저장 X
4. 결제 정보 직접 처리 X (Lemon Squeezy만)
5. Demucs 처음부터 구현 X (free-music-demixer 포크 사용)
6. Free 사용자는 CPU 전용 WASM 경로 필수 (GPU 의존 X)

## WASM / SharedArrayBuffer 필수 헤더
next.config.ts에서 모든 라우트에 아래 헤더 설정 필수:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```
브라우저 콘솔에서 `crossOriginIsolated === true` 확인 후 Demucs 사용.

## 3D 좌표 의미
- **X축**: -1(왼쪽) ~ +1(오른쪽) — 스테레오 패닝
- **Y축**: 0(베이스) ~ 1(하이햇) — spectral centroid (log scale)
- **Z축**: 0(앞) ~ 1(뒤) — RT60 + HF loss + wet/dry 비율

## Stem 색상 (변경 금지)
- 보컬: `#00d4ff` (cyan)
- 드럼: `#ff4060` (red)
- 베이스: `#ffd060` (yellow)
- 기타: `#60ff90` (green)

## 환경 변수 위치
`.env.local` (gitignore) — `.env.example` 참고

## 개발 단계 현황
@docs/PLAN.md

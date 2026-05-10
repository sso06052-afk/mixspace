---
name: frontend
description: Next.js UI/업로드/재생 전담. apps/web/ 중 components/viz/ 제외 영역만 수정.
tools: Bash, Read, Write, Edit, Glob, Grep
---

# Frontend Agent

UI/UX 전담. 단일 진실은 [SPEC.md](../../SPEC.md).

## 영역

- **수정 가능:** `apps/web/app/`, `apps/web/components/{upload,player,layout}/`, `apps/web/lib/{api,stems}/`
- **수정 금지:** `apps/web/components/viz/` (Viz Agent), `apps/api/` (Audio Agent)

## 핵심 작업

1. 랜딩 (`app/page.tsx`) — 업로드 dropzone
2. 분석 페이지 (`app/analyze/[id]/page.tsx`) — Viz Scene 임베드 + 플레이어 + 범례
3. 업로드 API (`app/api/upload/route.ts`) — Supabase Storage에 wav 저장 → analyses row 생성
4. 분석 시작 API (`app/api/analyze/route.ts`) — FastAPI 호출 트리거
5. 오디오 재생 — Web Audio API 기반 다중 스템 동시 재생

## 재생 동기화 핵심 규칙

```ts
// 9~10개 AudioBufferSourceNode를 단일 AudioContext에서 한 번에 start
const ctx = new AudioContext();
const sources = stems.map(buf => {
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  return src;
});
const t0 = ctx.currentTime + 0.1; // 약간의 마진
sources.forEach(s => s.start(t0));
```

- `<audio>` 9개 띄우는 방식 금지 (동기 어긋남)
- `currentTime`은 `ctx.currentTime - t0`으로 계산해서 매 rAF에 Viz Agent로 전달

## 사전 계산 FFT 사용

좌표 JSON의 `fft` 필드(64 bin)를 그대로 Viz Agent에 전달. 런타임 FFT 없음.

## 검증 기준

- 업로드 → 분석 시작 → 결과 페이지 풀 플로우
- 재생-3D 동기 오차 < 100ms
- 10스템 동시 재생 끊김 없음

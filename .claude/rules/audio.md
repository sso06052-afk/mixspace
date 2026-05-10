---
paths:
  - "apps/web/lib/audio/**"
  - "apps/web/workers/**"
---

# Audio Processing Rules

## Web Audio API
- `AudioContext` 생성은 user gesture 내에서만 (파일 드롭 이벤트 = user gesture)
- 디코딩 전용 AudioContext는 사용 후 즉시 `await audioContext.close()`
- `Float32Array` 채널 데이터는 `buffer.copyFromChannel()`로 복사본 생성 (원본 buffer 해제 후에도 유지)

## Essentia.js WASM
- 싱글톤 패턴 필수 (`lib/audio/essentia-loader.ts`)
- WASM 객체(vector, array 등) 사용 후 반드시 `.delete()` 호출
- Essentia는 mono 신호 입력 — 스테레오는 `mixDownToMono()` 먼저
- `essentia.arrayToVector(float32Array)` → 사용 → `.delete()`

## Demucs WASM (free-music-demixer)
- WASM 파일 위치: `apps/web/public/wasm/demixer.js`, `demixer_bg.wasm`
- Web Worker에서만 실행 (`workers/stemSeparation.worker.ts`)
- Worker 생성: `new Worker(new URL('../workers/...', import.meta.url))`
- Float32Array 전송: `postMessage(data, { transfer: [buffer] })` (Transferable)
- 4분 미만 → 클라이언트 WASM, 4분 이상 → FastAPI 서버 fallback

## 3D 좌표 계산 기준
- X (panning): `(sumR - sumL) / (sumR + sumL + 1e-10)`, 범위 -1~1
- Y (frequency): spectral centroid, log scale 정규화 (80Hz→0, 16kHz→1)
- Z (depth): RT60(0.5) + HF ratio(0.3) + wet/dry(0.2) 가중 평균
- size: LUFS 기반, -60dB~0dB → 0.1~1.0

## 마스킹 임계값
- 3D 거리 < 0.15 AND 두 stem 모두 size > 0.3 → 마스킹 충돌 감지

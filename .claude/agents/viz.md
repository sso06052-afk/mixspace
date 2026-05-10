---
name: viz
description: Three.js 3D 씬 전담. apps/web/components/viz/ 만 수정. 10스템 60fps 유지가 최우선 제약.
tools: Bash, Read, Write, Edit, Glob, Grep
---

# Viz Agent

3D 시각화 전담. 단일 진실은 [SPEC.md](../../SPEC.md).

## 영역

- **수정 가능:** `apps/web/components/viz/`, `apps/web/lib/audio/` 중 viz 관련 부분
- **수정 금지:** `apps/api/`, `apps/web/app/`, 다른 컴포넌트 폴더

## 핵심 작업

1. R3F Canvas + OrbitControls + 카메라 프리셋 (front/top/side/cinematic)
2. AxisGrid (XYZ 축 + 격자)
3. StemWaveform — 스템별 파형 메시 (BufferGeometry, 64-bin FFT 기반)
4. TimeSync — `currentTime` → 각 스템의 좌표 보간 (lerp)
5. 색상 — `lib/stems/colors.ts`의 STEM_COLORS 사용

## 입력

- `StemsData` (props로 전달됨, 사전 계산 완료된 좌표+FFT)
- `currentTime: number` (Frontend Agent가 매 rAF로 전달)

## 절대 규칙

- **실시간 FFT 금지** — FFT는 이미 좌표 JSON에 64 bin으로 임베드되어 있음
- 10스템 동시 렌더 60fps 유지 — InstancedMesh 또는 BufferGeometry 직접 조작
- `useFrame` 안에서 `geometry.attributes.position.needsUpdate = true` 패턴

## 좌표 보간

```ts
const i = currentTime / windowSec;
const a = coords[Math.floor(i)];
const b = coords[Math.min(Math.floor(i)+1, coords.length-1)];
const alpha = i - Math.floor(i);
const pos = [lerp(a.x,b.x,alpha)*5, lerp(a.y,b.y,alpha)*5, lerp(a.z,b.z,alpha)*5];
```

Three.js 좌표 스케일은 ×5 (월드 단위 -5~+5).

## 검증 기준

- 10스템 동시 렌더 평균 60fps (Chrome devtools Performance)
- 카메라 4개 프리셋 모두 작동
- 시간 흐름에 따라 파형이 부드럽게 이동

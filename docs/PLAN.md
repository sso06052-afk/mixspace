# MixSpace 구현 로드맵

## 현재 단계: Phase 1 시작 전

---

## Phase 1 — 기반 (3주)

### Week 1: 환경 + UI 골격
- [ ] pnpm monorepo 초기화 (`pnpm-workspace.yaml`, root `package.json`)
- [ ] `.npmrc` 설정 (`shamefully-hoist=true`, `node-linker=hoisted`)
- [ ] `apps/web` — Next.js 14 + TypeScript strict
- [ ] `apps/api` — FastAPI 스캐폴딩
- [ ] `packages/shared` — 공유 타입 패키지
- [ ] `.gitignore`, `.env.example`, `README.md`
- [ ] Tailwind CSS 커스텀 토큰 설정 (`tailwind.config.ts`)
- [ ] shadcn/ui 초기화 (Zinc, dark mode)
- [ ] `docs/schema.sql` 작성 → Supabase에 실행
- [ ] 랜딩 페이지 정적 버전 (`app/(marketing)/page.tsx`)
- [ ] Supabase Auth (Email Magic Link) + middleware
- [ ] `/analyze`, `/library`, `/account` 라우트 골격

**완료 기준:**
- `pnpm dev` → localhost:3000 정상 렌더링
- Magic Link 로그인 동작
- `console.log(crossOriginIsolated)` → `true`

### Week 2: 오디오 분석 (클라이언트)
- [ ] `FileDropzone` 컴포넌트 (react-dropzone, WAV/FLAC/MP3)
- [ ] `lib/audio/decoder.ts` — Web Audio API 디코딩
- [ ] `lib/audio/essentia-loader.ts` — Essentia.js 싱글톤
- [ ] `lib/audio/analyzer.ts` — BPM, Key, FFT, spectral centroid
- [ ] `lib/audio/coordinates.ts` — 3D 좌표 계산 (X/Y/Z)
- [ ] `lib/store/audioStore.ts` — Zustand 전역 상태
- [ ] Vitest 단위 테스트

**완료 기준:**
- BPM 추출 ±5 오차 이내
- Key 감지 confidence 0.6 이상
- WASM 메모리 누수 없음 (Chrome DevTools 확인)

### Week 3: Stem 분리 (클라이언트 WASM)
- [ ] free-music-demixer 포크 WASM 빌드
- [ ] `public/wasm/` 파일 배포 스크립트
- [ ] `workers/stemSeparation.worker.ts` — Web Worker
- [ ] `lib/audio/demucs-wasm.ts` — Worker wrapper
- [ ] `components/upload/UploadProgress.tsx`
- [ ] Playwright E2E 테스트

**완료 기준:**
- 4분 미만 곡 stem 분리 5분 이내
- UI 블로킹 없음 (60fps 유지)

---

## Phase 2 — 3D 시각화 (2주)

### Week 4: Three.js 기본
- [ ] `components/viz/Scene.tsx` — R3F Canvas
- [ ] `components/viz/StemSphere.tsx` — 4개 구체
- [ ] OrbitControls
- [ ] 좌표축 + 그리드 (`ReferenceFrame.tsx`)
- [ ] Stem 색상 매핑

### Week 5: 시간 + 인터랙션
- [ ] `components/viz/TimeSlider.tsx`
- [ ] 시간대별 좌표 보간 (lerp)
- [ ] 재생 버튼 (오디오 + 3D 동기화, 오차 <100ms)
- [ ] 카메라 프리셋 (`CameraPresets.tsx`)
- [ ] `components/viz/MaskingLines.tsx`

---

## Phase 3 — AI + 비교 (2주)

### Week 6: Claude 처방
- [ ] `lib/api/claude.ts` — Anthropic API 클라이언트
- [ ] `components/analysis/PrescriptionPanel.tsx`
- [ ] 프롬프트 엔지니어링 (한국어, 200자 이내)
- [ ] 시간대 클릭 → 3D 점프

### Week 7: 비교 + 서버 Fallback
- [ ] `/compare` 페이지
- [ ] FastAPI 백엔드 (Demucs Python) + Railway 배포
- [ ] 큰 곡 자동 fallback 로직

---

## Phase 4 — 결제 + 출시 (1주)

### Week 8:
- [ ] Lemon Squeezy 연결 + Webhook
- [ ] Free 한도 체크 미들웨어
- [ ] `/pricing`, `/account` 완성
- [ ] Vercel 배포 + 도메인
- [ ] PostHog 이벤트 추적
- [ ] ProductHunt 출시

---

## 결제 플랜 로직
| 플랜 | 가격 | 기능 |
|------|------|------|
| Free | 무료 | 곡 3개 (평생), 그래프/AI처방/비교 X |
| Pro | $9.99/월 or $99/년 | 무제한 + 모든 기능 |
| Studio | $99 일회성 | Pro 평생 + 우선 처리 |

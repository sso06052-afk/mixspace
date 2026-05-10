# MixSpace — 최종 스펙

> 우리가 만드는 건 이거 한 줄. 다른 거 하지 않는다.

## 한 줄 정의

완성된 음악을 올리면 → AI가 스템 분리 → 각 악기의 공간 좌표(좌우/높낮이/앞뒤)를 계산 → Three.js 3D 공간에 시간 흐름에 따른 **파형으로** 시각화하는 웹앱. Phase 3에서 DAW 플러그인으로 확장.

## 핵심 가치

시장에 **3D + 파형 + depth + 수정 가능**한 도구가 없음. iZotope Neutron Visual Mixer / PEEL STEMS는 모두 2D, depth 없음, 파형 아님. → MixSpace의 빈 자리.

---

## 확정 기술 스택

| 영역 | 선택 | 이유 |
|---|---|---|
| 멜로디 분리 | Demucs `htdemucs_6s` | 6스템, 오픈소스, MPS/CUDA 가속 |
| 드럼 재분리 | **LarsNet** (오픈소스 MIT) | 유료 DrumSplit 의존 제거 |
| 분석 | Python + librosa STFT | 윈도우 전체 정보 활용 |
| GPU | Replicate / Modal serverless | 상시 서버 불필요, 초 단위 과금 |
| 로컬 개발 | Mac MPS (Apple Silicon) | Demucs 지원 |
| 백엔드 | FastAPI | librosa/torch 직결 |
| 프론트 | Next.js 14 App Router + TS | 표준 |
| 3D | Three.js + React Three Fiber + drei | 표준 |
| 재생 | Web Audio API + 다중 `AudioBufferSourceNode`를 한 번에 `start(0)` | 샘플 정확 동기 |
| 시각화 FFT | **사전 계산해서 좌표 JSON에 임베드 (64 bin)** | 런타임 부담 0 |
| 직렬화 | JSON (Phase 1) → 필요 시 MessagePack | 단순함 우선 |
| 인프라 | Vercel + Replicate + Supabase | 관리 최소화 |
| 결제 (P2) | Lemon Squeezy | 한국 개발자 호환 |
| 플러그인 (P3) | C++ + JUCE | 표준 |

---

## 최종 스템 (10개)

| 스템 | 출처 | 색상 |
|---|---|---|
| vocals | htdemucs_6s | `#00d4ff` 시안 |
| bass | htdemucs_6s | `#8040ff` 보라 |
| guitar | htdemucs_6s | `#40ff80` 초록 |
| piano | htdemucs_6s | `#ff40a0` 핑크 |
| other | htdemucs_6s | `#808080` 회색 |
| kick | drums → LarsNet | `#ff2040` 빨강 |
| snare | drums → LarsNet | `#ff6020` 주황 |
| toms | drums → LarsNet | `#a05030` 갈색 |
| hihat | drums → LarsNet | `#ffcc00` 노랑 |
| cymbal | drums → LarsNet | `#ffaa00` 금색 |

> Demucs가 주는 `drums`는 중간산물. 최종 출력에는 분해된 5스템만.

---

## 좌표 계산 (1초 윈도우 단위)

### X — 패닝 [-1 좌 ~ +1 우]
`(Σ|R| − Σ|L|) / (Σ|R| + Σ|L|)`

### Y — 주파수 높이 [0 저 ~ 1 고]
librosa STFT (n_fft=2048, hop=512) → spectral centroid 평균 → 80Hz~16kHz 로그 정규화.

### Z — 공간감 (perceptual depth) [0 앞 ~ 1 뒤]
가중합:
- **(50%) Wet/Dry**: onset 검출 → onset 후 50ms 직접음 vs 다음 500ms 잔향 에너지비
- **(30%) HF rolloff**: 곡 전체 평균 centroid 대비 현재 윈도우 상대값
- **(20%) Stereo decorrelation**: `1 - corr(L, R)`

> 추정치임. UI 라벨은 "공간감"으로.

### size — 라우드니스 [0.1 ~ 1.0]
RMS → dB → -60dB~0dB 정규화.

### fft — 시각화용 주파수 [64 bin]
STFT 평균을 64 bin으로 다운샘플하여 JSON에 임베드.

---

## 출력 JSON 스키마

```json
{
  "version": 1,
  "sample_rate": 44100,
  "duration_sec": 213.4,
  "window_sec": 1.0,
  "total_windows": 213,
  "stems": {
    "vocals": [
      { "t": 0, "x": 0.02, "y": 0.65, "z": 0.3, "size": 0.7,
        "fft": [/* 64 floats */] }
    ]
  }
}
```

페이로드 추정: 4분 곡 × 10스템 × 240윈도우 × (5 + 64) × 4B ≈ **2.5MB** (gzip 후 ~1MB).

---

## 데이터 흐름

```
사용자 wav 업로드
  → Supabase Storage (audio-files)
  → Replicate htdemucs_6s 실행
  → LarsNet으로 drums 5분할
  → 모든 스템 wav를 Supabase Storage (stem-results)
  → Audio Agent: 1초 윈도우별 좌표+FFT 계산
  → coordinates JSON을 analyses 테이블에 저장
  → 프론트 /analyze/[id] 진입 → fetch → 3D 렌더 + 다중 source 동시 재생
```

---

## 에이전트 분담

```
.claude/agents/
├── ceo.md       — 오케스트레이션, 인터페이스 변경 승인
├── audio.md     — apps/api/ 전담 (분리 + 좌표)
├── viz.md       — apps/web/components/viz/ 전담 (Three.js)
├── frontend.md  — apps/web/ (viz 제외) 전담 (UI/재생)
└── infra.md     — Vercel/Replicate/Supabase 설정만
```

**규칙**
- 각자 자기 영역만 수정
- 공유 타입(`packages/shared/types.ts`)·API 스펙 변경 시 CEO 승인
- 추측 금지, 모르면 CEO 호출

---

## 디렉토리

```
mixspace/
├── SPEC.md                       # 단일 진실 (이 파일)
├── CLAUDE.md                     # 작업 규칙
├── .claude/agents/*.md           # 에이전트 지시사항
├── apps/
│   ├── web/                      # Next.js (Frontend + Viz)
│   └── api/                      # FastAPI (Audio)
├── packages/shared/types.ts      # 인터페이스 계약
└── pnpm-workspace.yaml
```

---

## 공유 타입 (요약)

```ts
type FinalStemName =
  | 'vocals' | 'bass' | 'guitar' | 'piano' | 'other'
  | 'kick' | 'snare' | 'toms' | 'hihat' | 'cymbal';

interface StemCoord {
  t: number; x: number; y: number; z: number; size: number;
  fft: number[];  // 64 bin
}

interface StemsData {
  version: number;
  sample_rate: number;
  duration_sec: number;
  window_sec: number;
  total_windows: number;
  stems: Partial<Record<FinalStemName, StemCoord[]>>;
}
```

---

## Phase 계획

### Phase 1 — 웹앱 MVP
업로드 → 분리 → 좌표 계산 → 3D 시각화 전체 플로우. 10스템 60fps. 재생-3D 동기 <100ms. 검증: 킥/베이스 아래, 하이햇 위, 보컬 앞.

### Phase 2 — 수정 + 결제
3D 파형 드래그 → DSP 실시간 반영.
- X → `PannerNode`
- Z → `ConvolverNode` wet/dry
- Y → `BiquadFilter` EQ shelf
수정 wav 다운로드. Lemon Squeezy. Free 3회 / Pro 무제한.

### Phase 3 — VST/AU 플러그인
C++ + JUCE. 마스터버스 + 트랙별 Relay (iZotope 방식). 레이턴시 <20ms, 10트랙 CPU <10%. $149 일회성, Plugin Boutique.

---

## Phase 1 완료 기준

- [ ] wav 업로드 → 3D 시각화 풀 플로우
- [ ] 10스템 동시 60fps
- [ ] 킥/베이스 Y < 0.2, 하이햇/심벌 Y > 0.8, 보컬 Z < 0.3
- [ ] 재생-3D 동기 오차 < 100ms
- [ ] Vercel + Replicate + Supabase 라이브
- [ ] 4분 곡 분리+분석 < 3분 (Replicate GPU)

---

## 금지/주의

- YouTube/Spotify 직접 다운로드 금지 (저작권)
- 브라우저에서 Demucs 실행 금지 (메모리)
- DrumSplit 사용 금지 (LarsNet으로 대체됨)
- 공유 타입·API 스펙 변경은 ceo.md 절차 필수
- 함수당 50줄 이하, 의미 있는 변수명
- TypeScript strict, Python type hints 필수

---

**길 잃을 때 이 파일 다시 읽기.**

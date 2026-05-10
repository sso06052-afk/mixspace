# MixSpace API (Audio Agent)

스템 분리 + 좌표 분석 백엔드. 단일 진실은 [../../SPEC.md](../../SPEC.md).

---

## 환경 세팅 (플랫폼별)

### Windows (RTX 3070 — 권장, CUDA)
```bat
cd apps/api
setup-win.bat
```
- torch 2.4.0 + CUDA 12.1
- Demucs 로컬 실행 가능 (4분 곡 ≈ 2~3분)
- 실제 분리 작업은 여기서 한다

### Mac (Intel — 개발/UI 작업용)
```bash
cd apps/api
./setup-mac.sh
```
- torch 2.2.2 CPU only (Intel Mac 최대)
- Demucs import 가능하지만 실행 느림 (30분+) → **Replicate 사용**
- 좌표 계산(coordinate_service) / FastAPI 서버 / 프론트엔드 작업은 여기서 한다

---

## 서버 실행

```bash
# Mac
source .venv/bin/activate
uvicorn main:app --port 8000 --reload

# Windows
.venv\Scripts\activate
.venv\Scripts\uvicorn main:app --port 8000 --reload
```

---

## 역할 분담 (맥 ↔ 윈도우)

| 작업 | 맥 (Intel) | 윈도우 (RTX 3070) |
|---|---|---|
| 스템 분리 (Demucs) | Replicate API | 로컬 CUDA |
| 좌표 계산 (librosa) | ✅ 로컬 | ✅ 로컬 |
| FastAPI 서버 | ✅ 8000 | ✅ 8000 |
| 프론트엔드 (Next.js) | ✅ 3000 | ✅ 3000 |
| LarsNet (드럼 분할) | Replicate 또는 생략 | ✅ 로컬 |

---

## 엔드포인트

- `GET /health`
- `POST /separate` — `{ audio_url }` → `{ job_id, status }`
- `GET /separate/{job_id}` → `{ status, stems_urls? }`
- `POST /analyze` — `{ stems_urls }` → `{ coordinates: StemsData }`

---

## 좌표 계산 규칙 (SPEC.md 참조)

- Y: librosa STFT 평균 spectral centroid — 윈도우 일부만 자르는 FFT 금지
- Z: 0.5×wet_dry + 0.3×HF_relative + 0.2×stereo_decorr
- fft: 64 bin 사전 계산해서 JSON에 임베드

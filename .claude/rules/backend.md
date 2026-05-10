---
paths:
  - "apps/api/**/*.py"
---

# Backend Rules (FastAPI Python 3.11)

## API 구조
- 라우터: `routers/separate.py`, `routers/analyze.py`, `routers/health.py`
- 서비스: `services/demucs_service.py`, `services/audio_analyzer.py`, `services/storage.py`
- 스키마: `models/schemas.py` (Pydantic v2)

## FastAPI 규칙
- 모든 엔드포인트 async/await
- Pydantic v2 모델로 요청/응답 타입 명시
- 에러: `HTTPException`으로 적절한 status code 반환
- CORS: `BACKEND_URL` 환경변수 기반으로 허용 origin 설정

## Demucs
- 모델: `htdemucs_ft` (4-stem, fine-tuned)
- GPU 없는 환경: `device='cpu'` 명시
- 처리 완료 후 임시 wav 파일 즉시 삭제 (저장 비용 절감)
- 스트리밍 응답으로 진행 상황 전달 (SSE 또는 WebSocket)

## 파일 처리
- Supabase Storage에서 다운로드 → 처리 → 결과 업로드
- 임시 파일: `tempfile.NamedTemporaryFile(suffix='.wav', delete=False)` 사용
- 30일 초과 분석 결과 자동 삭제 로직 필요

## 보안
- API 키 검증: `BACKEND_API_KEY` 환경변수 (Bearer 토큰)
- 파일 크기 제한: 300MB
- 오디오 형식 검증: wav, flac, mp3만 허용

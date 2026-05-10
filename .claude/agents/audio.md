---
name: audio
description: 오디오 분리 및 좌표 분석 전담. apps/api/ 만 수정. Demucs htdemucs_6s + LarsNet 파이프라인, librosa STFT 기반 좌표 계산.
tools: Bash, Read, Write, Edit, Glob, Grep
---

# Audio Agent

오디오 처리 전담. 단일 진실은 [SPEC.md](../../SPEC.md).

## 영역

- **수정 가능:** `apps/api/` 전체
- **수정 금지:** `apps/web/`, `packages/shared/types.ts`(읽기만), 다른 에이전트 영역

## 핵심 작업

1. Demucs `htdemucs_6s`로 6스템 분리 (vocals/bass/guitar/piano/other/drums)
2. LarsNet으로 drums → kick/snare/toms/hihat/cymbal 5분할
3. 각 스템에 대해 1초 윈도우 단위 좌표+FFT 계산 후 `StemsData` JSON 반환

## 좌표 계산 규칙 (필수 준수)

- **X (패닝):** `(Σ|R| - Σ|L|) / (Σ|R| + Σ|L|)`
- **Y (높이):** **librosa STFT** (n_fft=2048, hop=512) → spectral centroid 평균 → 80~16000 Hz 로그 정규화
  - ⚠️ `np.fft.rfft(mono[:2048])` 식으로 윈도우 일부만 자르지 말 것 (정보 손실)
- **Z (perceptual depth):** 가중합
  - 50% Wet/Dry: onset 검출 후 어택 후 50ms 직접음 vs 다음 500ms 잔향 에너지비
  - 30% HF rolloff: 곡 전체 평균 centroid 대비 현재 윈도우 상대값
  - 20% Stereo decorrelation: `1 - corr(L, R)`
- **size:** RMS → dB → -60dB~0dB 정규화
- **fft:** STFT 평균을 64 bin으로 다운샘플하여 JSON에 임베드

## 출력 계약

`packages/shared/types.ts`의 `StemsData` 타입 그대로 따른다. `FinalStemName` 10개만 출력 (drums는 중간 산물).

## 인프라

- 로컬: Apple Silicon에서 `device='mps'`로 Demucs 실행
- 프로덕션: Replicate API 호출 (htdemucs_6s 공식 모델)
- LarsNet: `pip install larsnet` 또는 GitHub 직접 설치

## 검증 기준

- 4분 곡 분리+분석 < 3분 (Replicate GPU 기준)
- 출력 JSON이 `StemsData` 타입 통과
- 킥/베이스의 평균 Y < 0.2, 하이햇/심벌 평균 Y > 0.8

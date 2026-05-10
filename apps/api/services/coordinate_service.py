"""좌표 계산 — SPEC.md "좌표 계산" 섹션 구현.

성능 원칙:
- 전체 오디오에서 STFT 한 번, onset 한 번 계산
- 윈도우별로 슬라이싱만 함 (per-window librosa 호출 없음)
- 4분 곡 기준 목표: < 30초 (CPU)
"""
from __future__ import annotations

import numpy as np
import librosa
import soundfile as sf
from pathlib import Path

WINDOW_SEC = 1.0
N_FFT = 2048
HOP_LENGTH = 512
FFT_BINS = 64
EPS = 1e-10


def load_audio(path: Path) -> tuple[np.ndarray, int]:
    """wav 로드. 반환: (stereo [2, N], sample_rate)"""
    audio, sr = sf.read(str(path), always_2d=True)
    audio = audio.T.astype(np.float32)
    if audio.shape[0] == 1:
        audio = np.vstack([audio, audio])
    return audio, sr


def compute_stem_coords(audio: np.ndarray, sr: int, t_offset: float = 0.0) -> list[dict]:
    """스템 전체를 한 번에 분석 → 1초 윈도우 좌표+FFT 리스트.

    STFT·onset·centroid를 전체 오디오에서 한 번만 계산하고 윈도우별로 슬라이싱.
    4분 곡 기준 CPU에서 ~30초 목표.
    """
    mono = audio.mean(axis=0)
    window_samples = int(WINDOW_SEC * sr)
    num_windows = max(1, len(mono) // window_samples)

    # ── 1회성 전처리 ──────────────────────────────────────────

    # 전체 STFT (한 번)
    stft_full = np.abs(librosa.stft(mono, n_fft=N_FFT, hop_length=HOP_LENGTH))  # (freq, time)
    frames_per_window = int(WINDOW_SEC * sr / HOP_LENGTH)

    # 전체 spectral centroid (한 번)
    centroid_full = librosa.feature.spectral_centroid(
        S=stft_full, sr=sr
    ).squeeze()  # (time,)

    # 곡 평균 centroid (Z축 HF relative 기준)
    track_avg_centroid = float(centroid_full.mean())

    # 전체 onset 위치 (샘플 단위, 한 번)
    onset_samples = librosa.onset.onset_detect(
        y=mono, sr=sr, units="samples", hop_length=HOP_LENGTH
    )
    onset_set = set(onset_samples.tolist())

    # ── 윈도우별 계산 (슬라이싱만) ───────────────────────────

    coords = []
    for i in range(num_windows):
        start = i * window_samples
        end = start + window_samples
        win = audio[:, start:end]

        if win.shape[1] < window_samples:
            win = np.pad(win, ((0, 0), (0, window_samples - win.shape[1])))

        # STFT 슬라이스
        frame_start = i * frames_per_window
        frame_end = frame_start + frames_per_window
        stft_win = stft_full[:, frame_start:min(frame_end, stft_full.shape[1])]
        if stft_win.shape[1] == 0:
            stft_win = stft_full[:, -1:]

        # centroid 슬라이스
        cent_win = centroid_full[frame_start:min(frame_end, len(centroid_full))]
        if len(cent_win) == 0:
            cent_win = centroid_full[-1:]
        avg_centroid = float(cent_win.mean())

        coords.append({
            "t": round(t_offset + i * WINDOW_SEC, 3),
            "x": round(_panning(win), 4),
            "y": round(_freq_height(avg_centroid), 4),
            "z": round(_depth(win, sr, track_avg_centroid, avg_centroid, onset_set, start, end), 4),
            "size": round(_loudness(win), 4),
            "fft": [round(v, 4) for v in _fft_bins_from_stft(stft_win)],
        })

    return coords


# ── 피처 계산 함수들 ─────────────────────────────────────────


def _panning(win: np.ndarray) -> float:
    """X: (Σ|R| - Σ|L|) / (Σ|R| + Σ|L|), [-1, 1]."""
    sl = float(np.abs(win[0]).sum())
    sr = float(np.abs(win[1]).sum())
    return float((sr - sl) / (sr + sl + EPS))


def _freq_height(centroid_hz: float) -> float:
    """Y: centroid → 80~16000 Hz 로그 정규화 [0, 1]."""
    hz = max(centroid_hz, 80.0)
    y = np.log2(hz / 80.0) / np.log2(16000.0 / 80.0)
    return float(np.clip(y, 0.0, 1.0))


def _depth(
    win: np.ndarray,
    sr: int,
    track_avg_centroid: float,
    win_centroid: float,
    onset_set: set,
    win_start: int,
    win_end: int,
) -> float:
    """Z: 0.5*wet_dry + 0.3*hf_relative + 0.2*stereo_decorr [0, 1]."""
    mono = win.mean(axis=0)

    # (a) wet/dry — 윈도우 내 onset 찾기 (이미 계산된 onset_set 재사용)
    onsets_in_win = [s for s in onset_set if win_start <= s < win_end]
    if onsets_in_win:
        rel = int(min(onsets_in_win) - win_start)
        direct_end = rel + int(0.05 * sr)
        reverb_end = rel + int(0.5 * sr)
        direct = mono[rel:min(direct_end, len(mono))]
        reverb = mono[min(direct_end, len(mono)):min(reverb_end, len(mono))]
        if len(direct) >= 2 and len(reverb) >= 2:
            de = float(np.mean(direct ** 2)) + EPS
            re = float(np.mean(reverb ** 2)) + EPS
            wet_dry = float(np.clip(re / (de + re), 0.0, 1.0))
        else:
            wet_dry = 0.3
    else:
        wet_dry = 0.3

    # (b) HF relative (이미 계산된 centroid 재사용)
    if track_avg_centroid > 0:
        hf_relative = float(np.clip(1.0 - win_centroid / track_avg_centroid, 0.0, 1.0))
    else:
        hf_relative = 0.3

    # (c) stereo decorrelation
    l, r = win[0], win[1]
    if l.std() > EPS and r.std() > EPS:
        decorr = float(np.clip(1.0 - abs(float(np.corrcoef(l, r)[0, 1])), 0.0, 1.0))
    else:
        decorr = 0.0

    return float(np.clip(0.5 * wet_dry + 0.3 * hf_relative + 0.2 * decorr, 0.0, 1.0))


def _loudness(win: np.ndarray) -> float:
    """size: RMS → dB → -60~0 dB 정규화 [0.1, 1.0]."""
    rms = float(np.sqrt(np.mean(win ** 2)))
    db = 20.0 * np.log10(rms + EPS)
    return float(np.clip((db + 60.0) / 60.0, 0.1, 1.0))


def _fft_bins_from_stft(stft_win: np.ndarray) -> list[float]:
    """시각화용 64-bin. STFT 슬라이스의 시간 평균 → 64 bin 다운샘플 → 정규화."""
    avg = stft_win.mean(axis=1)               # (freq,)
    chunks = np.array_split(avg, FFT_BINS)
    binned = np.array([c.max() for c in chunks])
    peak = binned.max() + EPS
    return (binned / peak).tolist()


def analyze_wav_file(path: Path) -> tuple[list[dict], int]:
    """편의 함수: wav 경로 → (StemCoord 리스트, sample_rate)."""
    audio, sr = load_audio(path)
    return compute_stem_coords(audio, sr), sr

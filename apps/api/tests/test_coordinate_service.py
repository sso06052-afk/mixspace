"""coordinate_service 단위 테스트.

Demucs 없이 합성 오디오로 좌표 계산 로직 검증.
실행: .venv/bin/python -m pytest tests/ -v
"""
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent.parent))
from services.coordinate_service import compute_stem_coords, _panning

SR = 44100


def stereo(left: np.ndarray, right: np.ndarray) -> np.ndarray:
    return np.vstack([left, right]).astype(np.float32)


def sine(freq: float, duration: float = 1.0, amp: float = 0.5) -> np.ndarray:
    t = np.linspace(0, duration, int(SR * duration), endpoint=False)
    return (np.sin(2 * np.pi * freq * t) * amp).astype(np.float32)


# ── 패닝 (X) ──────────────────────────────────────────────────

def test_panning_center():
    sig = sine(440)
    assert abs(_panning(stereo(sig, sig))) < 0.05


def test_panning_full_right():
    sig = sine(440)
    assert _panning(stereo(np.zeros_like(sig), sig)) > 0.95


def test_panning_full_left():
    sig = sine(440)
    assert _panning(stereo(sig, np.zeros_like(sig))) < -0.95


# ── 주파수 높이 (Y) ──────────────────────────────────────────

def test_bass_is_low():
    """80 Hz → Y 낮음."""
    coords = compute_stem_coords(stereo(sine(80), sine(80)), SR)
    assert coords[0]["y"] < 0.15, f"80 Hz Y={coords[0]['y']:.3f}"


def test_hihat_is_high():
    """10 kHz → Y 높음."""
    coords = compute_stem_coords(stereo(sine(10000), sine(10000)), SR)
    assert coords[0]["y"] > 0.80, f"10 kHz Y={coords[0]['y']:.3f}"


# ── 라우드니스 (size) ─────────────────────────────────────────

def test_loud_signal():
    coords = compute_stem_coords(stereo(sine(440, amp=0.9), sine(440, amp=0.9)), SR)
    assert coords[0]["size"] > 0.7


def test_quiet_signal():
    coords = compute_stem_coords(stereo(sine(440, amp=0.001), sine(440, amp=0.001)), SR)
    assert coords[0]["size"] < 0.3


# ── FFT (fft) ─────────────────────────────────────────────────

def test_fft_bins_length():
    coords = compute_stem_coords(stereo(sine(440), sine(440)), SR)
    assert len(coords[0]["fft"]) == 64


def test_fft_bins_normalized():
    coords = compute_stem_coords(stereo(sine(440), sine(440)), SR)
    assert max(coords[0]["fft"]) <= 1.0
    assert min(coords[0]["fft"]) >= 0.0


# ── 전체 파이프라인 ───────────────────────────────────────────

def test_windowing_shape():
    """3초 오디오 → 3개 윈도우, t값 정확."""
    audio = stereo(sine(440, duration=3), sine(440, duration=3))
    coords = compute_stem_coords(audio, SR)
    assert len(coords) == 3
    assert coords[0]["t"] == 0.0
    assert coords[1]["t"] == 1.0
    assert coords[2]["t"] == 2.0


def test_all_values_in_range():
    audio = stereo(sine(440, duration=2), sine(440, duration=2))
    coords = compute_stem_coords(audio, SR)
    for c in coords:
        assert -1.0 <= c["x"] <= 1.0
        assert  0.0 <= c["y"] <= 1.0
        assert  0.0 <= c["z"] <= 1.0
        assert  0.1 <= c["size"] <= 1.0
        assert len(c["fft"]) == 64

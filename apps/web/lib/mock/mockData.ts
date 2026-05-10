import type { StemsData, StemCoord, FinalStemName } from '@mixspace/shared';

const DURATION = 30;
const SR = 44100;

// 각 스템의 기준 좌표 (물리적으로 그럴듯하게)
const BASE: Record<FinalStemName, { x: number; y: number; z: number; size: number }> = {
  kick:   { x:  0.00, y: 0.05, z: 0.10, size: 0.85 },
  snare:  { x:  0.00, y: 0.25, z: 0.15, size: 0.70 },
  toms:   { x:  0.20, y: 0.30, z: 0.20, size: 0.55 },
  hihat:  { x:  0.35, y: 0.88, z: 0.05, size: 0.35 },
  cymbal: { x: -0.25, y: 0.82, z: 0.08, size: 0.30 },
  bass:   { x:  0.00, y: 0.07, z: 0.18, size: 0.90 },
  vocals: { x:  0.02, y: 0.65, z: 0.22, size: 0.75 },
  guitar: { x:  0.40, y: 0.55, z: 0.38, size: 0.55 },
  piano:  { x: -0.35, y: 0.60, z: 0.42, size: 0.50 },
  other:  { x:  0.00, y: 0.50, z: 0.50, size: 0.30 },
};

function jitter(v: number, amount: number): number {
  return Math.max(-1, Math.min(1, v + (Math.random() - 0.5) * amount));
}

function makeFft(peakBin: number): number[] {
  return Array.from({ length: 64 }, (_, i) => {
    const dist = Math.abs(i - peakBin) / 10;
    return Math.max(0, Math.exp(-dist * dist) * (0.6 + Math.random() * 0.4));
  });
}

// 스템별 FFT 피크 빈 (주파수 대역 반영)
const PEAK_BIN: Record<FinalStemName, number> = {
  kick: 2, snare: 8, toms: 5, hihat: 55, cymbal: 58,
  bass: 3, vocals: 20, guitar: 22, piano: 18, other: 30,
};

function makeCoords(stem: FinalStemName, windows: number): StemCoord[] {
  const base = BASE[stem];
  return Array.from({ length: windows }, (_, i) => ({
    t: i,
    x: jitter(base.x, 0.04),
    y: jitter(base.y, 0.03),
    z: jitter(base.z, 0.03),
    size: Math.max(0.1, Math.min(1, base.size + (Math.random() - 0.5) * 0.15)),
    fft: makeFft(PEAK_BIN[stem]),
  }));
}

const windows = DURATION;

export const MOCK_DATA: StemsData = {
  version: 1,
  sample_rate: SR,
  duration_sec: DURATION,
  window_sec: 1.0,
  total_windows: windows,
  stems: Object.fromEntries(
    (Object.keys(BASE) as FinalStemName[]).map((stem) => [stem, makeCoords(stem, windows)])
  ) as StemsData['stems'],
};

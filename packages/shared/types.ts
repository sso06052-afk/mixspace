// MixSpace 공유 타입 — 에이전트 간 인터페이스 계약서.
// 변경은 CEO 승인 후에만. SPEC.md "공유 타입 (요약)" 섹션 동기화 필수.

/** Demucs htdemucs_6s 직접 출력. drums는 분해 전 중간 산물. */
export type RawStemName =
  | 'vocals'
  | 'bass'
  | 'guitar'
  | 'piano'
  | 'other'
  | 'drums';

/** 사용자에게 노출되는 최종 10스템. drums는 LarsNet으로 5분할됨. */
export type FinalStemName =
  | 'vocals'
  | 'bass'
  | 'guitar'
  | 'piano'
  | 'other'
  | 'kick'
  | 'snare'
  | 'toms'
  | 'hihat'
  | 'cymbal';

/** LarsNet drum 분해 결과 5스템. */
export type DrumStemName = 'kick' | 'snare' | 'toms' | 'hihat' | 'cymbal';

/** 1초 윈도우 단위 좌표 + 시각화용 FFT (사전 계산). */
export interface StemCoord {
  /** 윈도우 시작 시간(초). */
  t: number;
  /** 패닝: -1.0(완전 좌) ~ +1.0(완전 우). */
  x: number;
  /** 주파수 높이: 0.0(저음) ~ 1.0(고음). 80~16000Hz 로그 정규화. */
  y: number;
  /** 공간감(perceptual depth): 0.0(앞) ~ 1.0(뒤). 추정치. */
  z: number;
  /** 라우드니스 기반 크기: 0.1 ~ 1.0. */
  size: number;
  /** 시각화용 사전 계산 FFT. 64 bin, 정규화된 magnitude. */
  fft: number[];
}

/** Audio Agent의 최종 출력. 프론트는 이걸 그대로 받아서 렌더. */
export interface StemsData {
  version: number;
  sample_rate: number;
  duration_sec: number;
  window_sec: number;
  total_windows: number;
  stems: Partial<Record<FinalStemName, StemCoord[]>>;
}

export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AnalysisJob {
  id: string;
  status: AnalysisStatus;
  title: string;
  source_url: string;
  stems_urls?: Partial<Record<FinalStemName, string>>;
  coordinates?: StemsData;
  created_at: string;
}

export interface UploadResponse {
  job_id: string;
  upload_url: string;
}

export interface SeparateRequest {
  audio_url: string;
}

export interface SeparateResponse {
  job_id: string;
  status: AnalysisStatus;
}

export interface AnalyzeRequest {
  stems_urls: Partial<Record<FinalStemName, string>>;
}

export interface AnalyzeResponse {
  coordinates: StemsData;
}

/** UI에서 사용하는 스템 색상 팔레트. SPEC.md와 동기화. */
export const STEM_COLORS: Record<FinalStemName, string> = {
  vocals: '#00d4ff',
  bass: '#8040ff',
  guitar: '#40ff80',
  piano: '#ff40a0',
  other: '#808080',
  kick: '#ff2040',
  snare: '#ff6020',
  toms: '#a05030',
  hihat: '#ffcc00',
  cymbal: '#ffaa00',
};

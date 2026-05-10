'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { StemsData } from '@mixspace/shared';

type ProcessingStatus = 'idle' | 'uploading' | 'separating' | 'analyzing' | 'ready' | 'error';

interface AudioState {
  file: File | null;
  stemsData: StemsData | null;
  status: ProcessingStatus;
  progress: number;
  error: string | null;
  analysisId: string | null;

  setFile: (file: File) => void;
  setStemsData: (data: StemsData) => void;
  setStatus: (status: ProcessingStatus) => void;
  setProgress: (progress: number) => void;
  setError: (error: string) => void;
  setAnalysisId: (id: string) => void;
  reset: () => void;
}

const initial = {
  file: null,
  stemsData: null,
  status: 'idle' as ProcessingStatus,
  progress: 0,
  error: null,
  analysisId: null,
};

export const useAudioStore = create<AudioState>()(
  devtools(
    (set) => ({
      ...initial,
      setFile: (file) => set({ file }),
      setStemsData: (stemsData) => set({ stemsData }),
      setStatus: (status) => set({ status }),
      setProgress: (progress) => set({ progress }),
      setError: (error) => set({ error, status: 'error' }),
      setAnalysisId: (analysisId) => set({ analysisId }),
      reset: () => set(initial),
    }),
    { name: 'AudioStore' }
  )
);

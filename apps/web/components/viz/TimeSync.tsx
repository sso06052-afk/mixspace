'use client';

// 재생 시간 ↔ Viz currentTime 동기화 컨테이너.
// 단순 Context provider. 실제 currentTime은 audio context에서 매 rAF에 갱신.
import { createContext, useContext } from 'react';

export const TimeContext = createContext<number>(0);

export function useCurrentTime(): number {
  return useContext(TimeContext);
}

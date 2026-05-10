'use client';

import { useEffect, useRef, useState } from 'react';
import Scene from '@/components/viz/Scene';
import AudioPlayer from '@/components/player/AudioPlayer';
import StemLegend from '@/components/layout/StemLegend';
import CameraPresets, { type PresetKey } from '@/components/viz/CameraPresets';
import { MOCK_DATA } from '@/lib/mock/mockData';
import type { StemsData } from '@mixspace/shared';

export default function AnalyzePage({ params }: { params: { id: string } }) {
  const data: StemsData = MOCK_DATA; // TODO: real fetch by params.id
  const duration = data.duration_sec;

  const currentTimeRef = useRef(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [preset, setPreset] = useState<PresetKey>('cinematic');

  // 재생 타이머 (실제 오디오 없으므로 setInterval로 시뮬레이션)
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      const next = currentTimeRef.current + 0.05;
      if (next >= duration) {
        currentTimeRef.current = 0;
        setDisplayTime(0);
        setPlaying(false);
        return;
      }
      currentTimeRef.current = next;
      setDisplayTime(next);
    }, 50);
    return () => clearInterval(interval);
  }, [playing, duration]);

  function handleSeek(t: number) {
    currentTimeRef.current = t;
    setDisplayTime(t);
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a12] text-white">
      {/* 상단 툴바 */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 shrink-0">
        <span className="text-xs text-neutral-500 font-mono">{params.id}</span>
        <CameraPresets current={preset} onChange={setPreset} />
      </header>

      {/* 3D 캔버스 */}
      <div className="flex-1 relative overflow-hidden">
        <Scene data={data} currentTimeRef={currentTimeRef} preset={preset} />
        <StemLegend />
      </div>

      {/* 재생 컨트롤 */}
      <AudioPlayer
        playing={playing}
        currentTime={displayTime}
        duration={duration}
        onPlayPause={() => setPlaying((p) => !p)}
        onSeek={handleSeek}
      />
    </div>
  );
}

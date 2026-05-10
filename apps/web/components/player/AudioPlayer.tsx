'use client';

interface AudioPlayerProps {
  playing: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (t: number) => void;
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({
  playing,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
}: AudioPlayerProps) {
  return (
    <div className="shrink-0 border-t border-neutral-800 bg-neutral-900/80 backdrop-blur px-4 py-3 flex items-center gap-4">
      <button
        onClick={onPlayPause}
        className="w-9 h-9 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center justify-center transition-colors shrink-0"
      >
        {playing ? '⏸' : '▶'}
      </button>

      <span className="text-xs text-neutral-400 tabular-nums w-10 shrink-0">
        {fmt(currentTime)}
      </span>

      <input
        type="range"
        min={0}
        max={duration}
        step={0.05}
        value={currentTime}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className="flex-1 h-1 appearance-none bg-neutral-700 rounded cursor-pointer accent-cyan-500"
      />

      <span className="text-xs text-neutral-500 tabular-nums w-10 shrink-0 text-right">
        {fmt(duration)}
      </span>
    </div>
  );
}

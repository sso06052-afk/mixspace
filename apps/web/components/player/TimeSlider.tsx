'use client';

interface TimeSliderProps {
  currentTime: number;
  duration: number;
  onSeek: (t: number) => void;
}

export default function TimeSlider({ currentTime, duration, onSeek }: TimeSliderProps) {
  return (
    <input
      type="range"
      min={0}
      max={duration}
      step={0.01}
      value={currentTime}
      onChange={(e) => onSeek(parseFloat(e.target.value))}
      className="w-full"
    />
  );
}

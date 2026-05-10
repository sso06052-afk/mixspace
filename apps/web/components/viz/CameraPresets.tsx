'use client';

export type PresetKey = 'front' | 'top' | 'side' | 'cinematic';

const LABELS: Record<PresetKey, string> = {
  front: '정면',
  top: '위',
  side: '옆',
  cinematic: '시네마틱',
};

interface CameraPresetsProps {
  current: PresetKey;
  onChange: (p: PresetKey) => void;
}

export default function CameraPresets({ current, onChange }: CameraPresetsProps) {
  return (
    <div className="flex gap-1">
      {(Object.keys(LABELS) as PresetKey[]).map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-1 text-xs rounded transition-colors ${
            current === key
              ? 'bg-cyan-500 text-black font-semibold'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
          }`}
        >
          {LABELS[key]}
        </button>
      ))}
    </div>
  );
}

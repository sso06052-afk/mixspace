'use client';

import { STEM_COLORS, type FinalStemName } from '@mixspace/shared';

const ORDER: FinalStemName[] = [
  'vocals', 'kick', 'snare', 'toms', 'hihat', 'cymbal',
  'bass', 'guitar', 'piano', 'other',
];

export default function StemLegend() {
  return (
    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur rounded-lg p-3 text-xs space-y-1">
      {ORDER.map((stem) => (
        <div key={stem} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: STEM_COLORS[stem] }}
          />
          <span className="text-neutral-300">{stem}</span>
        </div>
      ))}
    </div>
  );
}

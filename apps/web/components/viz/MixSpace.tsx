'use client';

import { STEM_COLORS, type FinalStemName, type StemsData } from '@mixspace/shared';
import StemWaveform from './StemWaveform';

interface MixSpaceProps {
  data: StemsData;
  currentTimeRef: React.MutableRefObject<number>;
}

export default function MixSpace({ data, currentTimeRef }: MixSpaceProps) {
  return (
    <>
      {(Object.entries(data.stems) as [FinalStemName, typeof data.stems[FinalStemName]][]).map(
        ([name, coords]) => {
          if (!coords || coords.length === 0) return null;
          return (
            <StemWaveform
              key={name}
              stemName={name}
              coords={coords}
              currentTimeRef={currentTimeRef}
              windowSec={data.window_sec}
              color={STEM_COLORS[name]}
            />
          );
        }
      )}
    </>
  );
}

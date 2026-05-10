'use client';

import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { StemsData } from '@mixspace/shared';
import type { PresetKey } from './CameraPresets';
import CameraRig from './CameraRig';
import AxisGrid from './AxisGrid';
import MixSpace from './MixSpace';

interface SceneProps {
  data: StemsData;
  currentTimeRef: React.MutableRefObject<number>;
  preset: PresetKey;
}

export default function Scene({ data, currentTimeRef, preset }: SceneProps) {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', background: '#0a0a12' }}
      camera={{ position: [6, 4, 9], fov: 50, near: 0.1, far: 1000 }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 8, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-5, 2, -5]} intensity={0.5} color="#4040ff" />

      <CameraRig preset={preset} />
      <AxisGrid />
      <MixSpace data={data} currentTimeRef={currentTimeRef} />

      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
    </Canvas>
  );
}

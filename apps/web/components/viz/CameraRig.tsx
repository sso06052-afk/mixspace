'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PresetKey } from './CameraPresets';

const PRESETS: Record<PresetKey, { pos: [number, number, number]; target: [number, number, number] }> = {
  front:     { pos: [0, 2.5, 12],  target: [0, 2, 0] },
  top:       { pos: [0, 16, 0.01], target: [0, 0, 0] },
  side:      { pos: [12, 2.5, 0],  target: [0, 2, 0] },
  cinematic: { pos: [6, 4, 9],     target: [0, 2, 0] },
};

export default function CameraRig({ preset }: { preset: PresetKey }) {
  const { camera } = useThree();
  const goalPos = useRef(new THREE.Vector3(...PRESETS[preset].pos));
  const goalTarget = useRef(new THREE.Vector3(...PRESETS[preset].target));
  const currentTarget = useRef(new THREE.Vector3(...PRESETS[preset].target));

  useEffect(() => {
    goalPos.current.set(...PRESETS[preset].pos);
    goalTarget.current.set(...PRESETS[preset].target);
  }, [preset]);

  useFrame(() => {
    camera.position.lerp(goalPos.current, 0.06);
    currentTarget.current.lerp(goalTarget.current, 0.06);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

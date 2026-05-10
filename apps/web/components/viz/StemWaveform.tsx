'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { FinalStemName, StemCoord } from '@mixspace/shared';

interface StemWaveformProps {
  stemName: FinalStemName;
  coords: StemCoord[];
  currentTimeRef: React.MutableRefObject<number>;
  windowSec: number;
  color: string;
}

const SCALE = 5;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export default function StemWaveform({
  coords,
  currentTimeRef,
  windowSec,
  color,
}: StemWaveformProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!groupRef.current || coords.length === 0) return;

    const t = currentTimeRef.current;
    const idx = t / windowSec;
    const i = clamp01(idx / coords.length) < 1 ? Math.floor(idx) : coords.length - 1;
    const j = Math.min(i + 1, coords.length - 1);
    const a = coords[Math.max(0, Math.min(i, coords.length - 1))];
    const b = coords[j];
    const alpha = clamp01(idx - i);
    if (!a || !b) return;

    const x = lerp(a.x, b.x, alpha) * SCALE;
    const y = lerp(a.y, b.y, alpha) * SCALE;
    const z = lerp(a.z, b.z, alpha) * SCALE;
    const size = lerp(a.size, b.size, alpha);

    groupRef.current.position.set(x, y, z);
    groupRef.current.scale.setScalar(size);

    if (lightRef.current) {
      lightRef.current.intensity = size * 1.5;
    }
  });

  const threeColor = new THREE.Color(color);

  return (
    <group ref={groupRef}>
      {/* 메인 구체 */}
      <mesh>
        <sphereGeometry args={[0.25, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.85}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      {/* 글로우 후광 */}
      <mesh>
        <sphereGeometry args={[0.38, 12, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
      {/* 포인트 라이트 (주변 공간 조명) */}
      <pointLight ref={lightRef} color={color} intensity={1.2} distance={3} decay={2} />
    </group>
  );
}

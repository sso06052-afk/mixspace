'use client';

export default function AxisGrid() {
  return (
    <group>
      <gridHelper args={[10, 10, '#333', '#222']} />
      <axesHelper args={[5]} />
    </group>
  );
}

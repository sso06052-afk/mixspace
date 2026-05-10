'use client';

import { useState } from 'react';

export default function FileDropzone() {
  const [dragging, setDragging] = useState(false);

  // TODO Frontend Agent: 실제 업로드 → /api/upload 호출 → /analyze/[id]로 라우팅
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      className={`
        border-2 border-dashed rounded-xl p-16 text-center cursor-pointer
        transition-colors
        ${dragging ? 'border-cyan-400 bg-cyan-400/5' : 'border-neutral-700 hover:border-neutral-500'}
      `}
    >
      <p className="text-xl mb-2">wav 파일을 끌어다 놓으세요</p>
      <p className="text-sm text-neutral-500">또는 클릭해서 선택</p>
    </div>
  );
}

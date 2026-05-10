'use client';

interface UploadProgressProps {
  progress: number; // 0~100
}

export default function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div className="w-full bg-neutral-800 rounded-full h-2">
      <div
        className="bg-cyan-400 h-2 rounded-full transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

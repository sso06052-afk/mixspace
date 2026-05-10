import type {
  AnalysisJob,
  StemsData,
  SeparateRequest,
  SeparateResponse,
} from '@mixspace/shared';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

export async function startSeparation(
  body: SeparateRequest,
): Promise<SeparateResponse> {
  const res = await fetch(`${BACKEND_URL}/separate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`separation failed: ${res.status}`);
  return res.json();
}

export async function getAnalysis(id: string): Promise<AnalysisJob> {
  const res = await fetch(`/api/analysis/${id}`);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchCoordinates(url: string): Promise<StemsData> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`coordinates fetch failed: ${res.status}`);
  return res.json();
}

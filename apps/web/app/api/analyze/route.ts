import { NextRequest, NextResponse } from 'next/server';

// TODO Frontend Agent: FastAPI /separate + /analyze 호출 트리거
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'not implemented' },
    { status: 501 },
  );
}

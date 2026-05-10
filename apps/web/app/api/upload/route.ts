import { NextRequest, NextResponse } from 'next/server';

// TODO Frontend Agent: Supabase Storage에 wav 업로드 + analyses row 생성
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: 'not implemented' },
    { status: 501 },
  );
}

export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { runInvestigation } from '@/lib/investigation';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const investigation = await runInvestigation(body);
    return NextResponse.json(investigation);
  } catch {
    return NextResponse.json({ status: 'ok' });
  }
}

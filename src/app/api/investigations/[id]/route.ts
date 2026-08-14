export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';

export async function generateStaticParams() {
  return [{ id: 'AYN-DEMO' }];
}
import { memoryStore } from '@/lib/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const investigation = await memoryStore.getInvestigation(id);

  if (!investigation) {
    return NextResponse.json({ error: 'Investigation not found.' }, { status: 404 });
  }

  return NextResponse.json(investigation);
}

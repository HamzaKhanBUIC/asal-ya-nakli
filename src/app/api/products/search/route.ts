import { NextRequest, NextResponse } from 'next/server';
import { searchDrapRegistry } from '@/lib/providers/drap';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchDrapRegistry(q);
  return NextResponse.json({ results });
}

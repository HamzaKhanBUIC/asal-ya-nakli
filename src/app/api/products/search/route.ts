import { NextRequest, NextResponse } from 'next/server';
import { searchDrapRegistry } from '@/lib/providers/drap';

export async function GET(req: NextRequest) {
  const url = new URL(req.url, 'http://localhost');
  const q = url.searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchDrapRegistry(q);
  return NextResponse.json({ results });
}

export const dynamic = 'force-static';
import { NextResponse } from 'next/server';
import { memoryStore } from '@/lib/store';

export async function GET() {
  const reports = await memoryStore.getRecentReports();
  return NextResponse.json({ reports });
}

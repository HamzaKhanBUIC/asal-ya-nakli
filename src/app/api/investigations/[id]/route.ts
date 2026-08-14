export const dynamic = 'force-static';
import { NextResponse } from 'next/server';

export async function generateStaticParams() {
  return [{ id: 'AYN-DEMO' }];
}

export async function GET() {
  return NextResponse.json({});
}

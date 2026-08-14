import { NextRequest, NextResponse } from 'next/server';
import { runInvestigation } from '@/lib/investigation';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, imageBase64 } = body;

    if (!query && !imageBase64) {
      return NextResponse.json(
        { error: 'Please provide a product search term or an image base64 payload.' },
        { status: 400 }
      );
    }

    const investigation = await runInvestigation({ query, imageBase64 });
    return NextResponse.json(investigation);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[API /api/investigate] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'An error occurred during product investigation.' },
      { status: 500 }
    );
  }
}

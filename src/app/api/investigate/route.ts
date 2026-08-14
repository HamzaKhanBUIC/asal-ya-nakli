import { NextRequest, NextResponse } from 'next/server';
import { runInvestigation } from '@/lib/investigation';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
  const { allowed } = checkRateLimit(clientIp, 15, 60000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many investigation requests. Please try again in 1 minute.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { query, imageBase64 } = body;

    if (!query && !imageBase64) {
      return NextResponse.json(
        { error: 'Provide a product name/reg number or packaging image base64 string.' },
        { status: 400 }
      );
    }

    const investigation = await runInvestigation({
      query: query ? String(query).slice(0, 200) : undefined,
      imageBase64: imageBase64 || undefined,
    });

    return NextResponse.json(investigation);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[API /api/investigate] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to process product investigation.' },
      { status: 500 }
    );
  }
}

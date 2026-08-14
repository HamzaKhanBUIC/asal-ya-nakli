import { NextRequest, NextResponse } from 'next/server';
import { memoryStore } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, verdict, flags, note, city, batchNumber, imageUrl } = body;

    if (!productName || !verdict) {
      return NextResponse.json(
        { error: 'Product name and verdict are required.' },
        { status: 400 }
      );
    }

    if (!['REAL', 'SUSPICIOUS', 'FAKE'].includes(verdict)) {
      return NextResponse.json({ error: 'Invalid verdict value.' }, { status: 400 });
    }

    const reportData = {
      id: `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      productId: productName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      productName,
      verdict,
      flags: Array.isArray(flags) ? flags : [],
      note: typeof note === 'string' ? note.slice(0, 1000) : '',
      city: typeof city === 'string' ? city.slice(0, 100) : '',
      batchNumber: typeof batchNumber === 'string' ? batchNumber.slice(0, 50) : '',
      imageUrl,
      createdAt: new Date().toISOString(),
    };

    await memoryStore.addReport(reportData);
    const updatedStats = await memoryStore.getCommunityStats(productName);

    return NextResponse.json({
      success: true,
      report: reportData,
      updatedStats,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[API /api/report] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to record community report.' },
      { status: 500 }
    );
  }
}

// Asal ya Nakli - Core Investigation Orchestrator

import {
  Investigation,
  EvidenceItem,
  ProductExtraction,
  InvestigationTimelineStep,
  OfficialAlert,
} from '@/types';
import { searchDrapRegistry } from '@/lib/providers/drap';
import { searchWhoAlerts } from '@/lib/providers/who';
import { memoryStore } from '@/lib/store';
import { calculateDeterministicRisk } from '@/lib/risk/engine';
import { extractProductFromImage, generateAIExplanation } from '@/lib/groq/client';

export async function runInvestigation(params: {
  query?: string;
  imageBase64?: string;
}): Promise<Investigation> {
  const { query, imageBase64 } = params;

  const now = new Date().toISOString();
  const shortId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const investigationId = `AYN-${shortId}`;

  const timeline: InvestigationTimelineStep[] = [
    { timestamp: new Date().toLocaleTimeString(), action: 'Investigation initiated', status: 'completed' },
  ];

  let extractedData: ProductExtraction | undefined;
  let targetProductName = query || 'Uploaded Packaging Item';
  let queryType: 'search' | 'image' | 'combined' = query ? 'search' : 'image';

  // Step 1: AI Vision Extraction if image is provided
  if (imageBase64) {
    if (query) queryType = 'combined';
    try {
      extractedData = await extractProductFromImage(imageBase64);
      if (extractedData.detectedProductName) {
        targetProductName = extractedData.detectedProductName;
      }
      timeline.push({
        timestamp: new Date().toLocaleTimeString(),
        action: 'Packaging OCR & Visual Feature Extraction complete',
        status: 'completed',
      });
    } catch (err) {
      console.error('Image extraction error:', err);
      timeline.push({
        timestamp: new Date().toLocaleTimeString(),
        action: 'Packaging visual extraction fallback activated',
        status: 'warning',
      });
    }
  }

  // Step 2: Official DRAP Registry Search
  let officialMatch = null;
  try {
    const regResults = await searchDrapRegistry(targetProductName);
    if (regResults.length > 0) {
      officialMatch = regResults[0];
    }
    timeline.push({
      timestamp: new Date().toLocaleTimeString(),
      action: 'DRAP Official Registry check complete',
      status: 'completed',
    });
  } catch (err) {
    console.error('DRAP registry lookup error:', err);
  }

  // Step 3: WHO & Official Alerts Search
  let alerts: OfficialAlert[] = [];
  try {
    alerts = await searchWhoAlerts(targetProductName, extractedData?.batchNumber || undefined);
    timeline.push({
      timestamp: new Date().toLocaleTimeString(),
      action: 'WHO & National Safety Alerts queried',
      status: 'completed',
    });
  } catch (err) {
    console.error('Alerts search error:', err);
  }

  // Step 4: Community Intelligence Data Aggregation
  const communityStats = await memoryStore.getCommunityStats(targetProductName);
  timeline.push({
    timestamp: new Date().toLocaleTimeString(),
    action: 'Community Intelligence reports compiled',
    status: 'completed',
  });

  // Step 5: Build Structured Evidence Items
  const evidence: EvidenceItem[] = [];

  // Official Evidence
  if (officialMatch) {
    evidence.push({
      id: `ev-official-${officialMatch.id}`,
      investigationId,
      type: 'FACT',
      sourceType: 'OFFICIAL',
      claim: `Registered with DRAP as ${officialMatch.brandName} (${officialMatch.registrationNumber})`,
      strength: 'STRONG',
      confidence: 0.95,
      data: officialMatch,
      sourceUrl: officialMatch.sourceUrl,
      createdAt: now,
    });
  }

  // Alerts Evidence
  for (const alert of alerts) {
    evidence.push({
      id: `ev-alert-${alert.id}`,
      investigationId,
      type: 'FACT',
      sourceType: 'OFFICIAL',
      claim: `Official Safety Alert: ${alert.title}`,
      strength: 'STRONG',
      confidence: 0.98,
      data: alert,
      sourceUrl: alert.sourceUrl,
      createdAt: now,
    });
  }

  // Visual Evidence
  if (extractedData?.packagingObservations) {
    for (const obs of extractedData.packagingObservations) {
      evidence.push({
        id: `ev-obs-${obs.id}`,
        investigationId,
        type: 'OBSERVATION',
        sourceType: 'AI_OBSERVATION',
        claim: `${obs.category.toUpperCase()}: ${obs.description}`,
        strength: obs.severity === 'high' ? 'STRONG' : obs.severity === 'medium' ? 'MODERATE' : 'WEAK',
        confidence: obs.confidence,
        data: obs,
        createdAt: now,
      });
    }
  }

  // Community Evidence
  if (communityStats.totalReports > 0) {
    evidence.push({
      id: `ev-community-summary`,
      investigationId,
      type: 'COMMUNITY',
      sourceType: 'COMMUNITY',
      claim: `${communityStats.totalReports} community checks reported (${communityStats.verdictBreakdown.real} Real, ${communityStats.verdictBreakdown.suspicious} Suspicious, ${communityStats.verdictBreakdown.fake} Fake)`,
      strength: communityStats.totalReports > 5 ? 'STRONG' : 'MODERATE',
      confidence: Math.min(0.9, 0.4 + communityStats.totalReports * 0.05),
      data: communityStats,
      createdAt: now,
    });
  }

  // Step 6: Bounded Deterministic Risk Engine
  const riskAssessment = calculateDeterministicRisk({
    officialMatch,
    alerts,
    extractedData,
    communityStats,
    evidenceItems: evidence,
  });

  timeline.push({
    timestamp: new Date().toLocaleTimeString(),
    action: 'Deterministic Authenticity Risk Signal calculated',
    status: 'completed',
  });

  // Step 7: Groq Evidence Explanation Generation
  const explanation = await generateAIExplanation({
    productName: targetProductName,
    riskAssessment,
    officialMatch,
    alerts,
    evidence,
    communityStats,
  });

  timeline.push({
    timestamp: new Date().toLocaleTimeString(),
    action: 'AI Evidence Explanation report generated',
    status: 'completed',
  });

  const investigation: Investigation = {
    id: investigationId,
    productId: targetProductName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    productName: targetProductName,
    queryType,
    imageUrl: imageBase64,
    extractedData,
    officialMatch,
    matchingAlerts: alerts,
    evidence,
    riskAssessment,
    explanation,
    communityStats,
    timeline,
    createdAt: now,
  };

  // Persist to store
  memoryStore.saveInvestigation(investigation);

  return investigation;
}

// Asal ya Nakli - Bounded Deterministic Risk Engine

import {
  EvidenceItem,
  OfficialAlert,
  OfficialProduct,
  ProductExtraction,
  RiskAssessment,
  RiskFactor,
  RiskLevel,
  ConfidenceLevel,
  CommunityStats,
} from '@/types';

export function calculateDeterministicRisk(params: {
  officialMatch: OfficialProduct | null | undefined;
  alerts: OfficialAlert[];
  extractedData?: ProductExtraction;
  communityStats?: CommunityStats;
  evidenceItems: EvidenceItem[];
}): RiskAssessment {
  const { officialMatch, alerts, extractedData, communityStats, evidenceItems } = params;

  let rawScore = 0;
  const factors: RiskFactor[] = [];

  // --- 1. OFFICIAL ALERT MATCH SIGNAL ---
  if (alerts && alerts.length > 0) {
    for (const alert of alerts) {
      const isCritical = alert.severity === 'CRITICAL' || alert.severity === 'HIGH';
      const impact = isCritical ? 60 : 40;
      rawScore += impact;
      factors.push({
        id: `alert-${alert.id}`,
        label: `Official Safety Alert: ${alert.source}`,
        scoreImpact: +impact,
        severity: isCritical ? 'high' : 'medium',
        explanation: `Matches official alert "${alert.title}" issued by ${alert.source}. ${alert.summary}`,
      });
    }
  }

  // --- 2. OFFICIAL REGISTRY IDENTITY MATCH / MISMATCH ---
  if (officialMatch) {
    if (officialMatch.status === 'SUSPENDED' || officialMatch.status === 'CANCELLED') {
      const impact = 45;
      rawScore += impact;
      factors.push({
        id: 'reg-cancelled',
        label: 'Official Registration Suspended or Cancelled',
        scoreImpact: +impact,
        severity: 'high',
        explanation: `The DRAP registration ${officialMatch.registrationNumber} is listed as ${officialMatch.status}.`,
      });
    } else if (officialMatch.status === 'ACTIVE') {
      const mitigation = 15;
      rawScore -= mitigation;
      factors.push({
        id: 'reg-active',
        label: 'Verified Product Registration Record',
        scoreImpact: -mitigation,
        severity: 'low',
        explanation: `Product matches registered DRAP record (${officialMatch.registrationNumber}) for ${officialMatch.manufacturer}. Note: Registration existence does not guarantee physical unit authenticity.`,
      });
    }
  } else {
    // No registry match found
    const impact = 15;
    rawScore += impact;
    factors.push({
      id: 'reg-missing',
      label: 'No Exact Match in Official DRAP Database',
      scoreImpact: +impact,
      severity: 'medium',
      explanation: 'The queried product identity or registration number could not be corroborated in the DRAP public database.',
    });
  }

  // --- 3. VISUAL & PACKAGING ANOMALIES (AI OCR EXTRACTION) ---
  if (extractedData && extractedData.packagingObservations) {
    for (const obs of extractedData.packagingObservations) {
      let impact = 0;
      if (obs.severity === 'high') impact = 25;
      else if (obs.severity === 'medium') impact = 12;
      else impact = 5;

      rawScore += impact;
      factors.push({
        id: `obs-${obs.id}`,
        label: `Visual Packaging Signal: ${obs.category.toUpperCase()}`,
        scoreImpact: +impact,
        severity: obs.severity,
        explanation: `${obs.description} (Confidence: ${Math.round(obs.confidence * 100)}%)`,
      });
    }

    // Check expiry / date sanity
    if (extractedData.expiryDate) {
      const expDate = new Date(extractedData.expiryDate);
      if (!isNaN(expDate.getTime()) && expDate < new Date()) {
        const impact = 30;
        rawScore += impact;
        factors.push({
          id: 'date-expired',
          label: 'Expired Product Packaging Date',
          scoreImpact: +impact,
          severity: 'high',
          explanation: `Extracted packaging expiry date (${extractedData.expiryDate}) is past today's date.`,
        });
      }
    }
  }

  // --- 4. COMMUNITY INTELLIGENCE SIGNALS ---
  if (communityStats && communityStats.totalReports > 0) {
    const { fake, suspicious, real } = communityStats.verdictBreakdown;
    const total = communityStats.totalReports;

    const negativeRatio = (fake + suspicious * 0.5) / total;

    if (total >= 3 && negativeRatio > 0.4) {
      const impact = Math.min(35, Math.round(negativeRatio * 40));
      rawScore += impact;
      factors.push({
        id: 'community-negative',
        label: 'Community Warning Reports',
        scoreImpact: +impact,
        severity: negativeRatio > 0.6 ? 'high' : 'medium',
        explanation: `${fake} fake and ${suspicious} suspicious reports submitted out of ${total} community checks.`,
      });
    } else if (total >= 5 && real / total >= 0.8) {
      const mitigation = 10;
      rawScore -= mitigation;
      factors.push({
        id: 'community-positive',
        label: 'Corroborating Community Reports',
        scoreImpact: -mitigation,
        severity: 'low',
        explanation: `${real} out of ${total} community members reported purchasing genuine units matching this identity.`,
      });
    }
  }

  // Clamp risk score to [0, 100]
  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // Determine Risk Level
  let level: RiskLevel = 'LOW';
  if (evidenceItems.length < 2 && !extractedData && (!alerts || alerts.length === 0)) {
    level = 'INSUFFICIENT';
  } else if (finalScore >= 65 || (alerts && alerts.length > 0)) {
    level = 'HIGH';
  } else if (finalScore >= 25) {
    level = 'ELEVATED';
  } else {
    level = 'LOW';
  }

  // Determine Confidence Level
  let confidence: ConfidenceLevel = 'LOW';
  const totalEvidenceCount = evidenceItems.length;
  if (officialMatch && (extractedData || (alerts && alerts.length > 0))) {
    confidence = 'HIGH';
  } else if (totalEvidenceCount >= 3 || officialMatch || extractedData) {
    confidence = 'MEDIUM';
  } else {
    confidence = 'LOW';
  }

  return {
    score: finalScore,
    level,
    factors,
    confidence,
  };
}

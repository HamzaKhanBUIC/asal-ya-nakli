// Asal ya Nakli - Core Domain Types

export type EvidenceType = 'FACT' | 'OBSERVATION' | 'COMMUNITY' | 'INFERENCE';
export type EvidenceSourceType = 'OFFICIAL' | 'AI_OBSERVATION' | 'COMMUNITY' | 'SYSTEM';

export type RiskLevel = 'INSUFFICIENT' | 'LOW' | 'ELEVATED' | 'HIGH';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type ReportVerdict = 'REAL' | 'SUSPICIOUS' | 'FAKE';

export type ObservationCategory =
  | 'spelling'
  | 'typography'
  | 'logo'
  | 'seal'
  | 'label'
  | 'date'
  | 'batch'
  | 'packaging'
  | 'other';

export type ObservationSeverity = 'low' | 'medium' | 'high';

export interface Observation {
  id: string;
  category: ObservationCategory;
  description: string;
  confidence: number;
  severity: ObservationSeverity;
  evidenceText?: string;
}

export interface ProductExtraction {
  detectedProductName: string | null;
  brand: string | null;
  manufacturer: string | null;
  genericName: string | null;
  strength: string | null;
  dosageForm: string | null;
  registrationNumber: string | null;
  batchNumber: string | null;
  manufacturingDate: string | null;
  expiryDate: string | null;
  languageDetected: string[];
  visibleText: string[];
  packagingObservations: Observation[];
}

export interface OfficialProduct {
  id: string;
  registrationNumber: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  manufacturer: string;
  country: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'UNVERIFIED';
  issueDate?: string;
  expiryDate?: string;
  source: string; // e.g. "DRAP (Drug Regulatory Authority of Pakistan)"
  sourceUrl?: string;
}

export interface OfficialAlert {
  id: string;
  source: string; // e.g., "DRAP", "WHO"
  title: string;
  productNames: string[];
  activeIngredients?: string[];
  batchNumbers?: string[];
  manufacturers?: string[];
  countries?: string[];
  alertDate?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  sourceUrl: string;
  summary: string;
}

export interface EvidenceItem {
  id: string;
  investigationId: string;
  type: EvidenceType; // FACT, OBSERVATION, COMMUNITY, INFERENCE
  sourceType: EvidenceSourceType; // OFFICIAL, AI_OBSERVATION, COMMUNITY, SYSTEM
  claim: string;
  strength: 'WEAK' | 'MODERATE' | 'STRONG';
  confidence: number; // 0.0 - 1.0
  data: Record<string, unknown> | OfficialProduct | OfficialAlert | Observation | CommunityStats | unknown;
  sourceUrl?: string;
  createdAt: string;
}

export interface CommunityReport {
  id: string;
  productId: string;
  productName: string;
  verdict: ReportVerdict;
  flags: string[];
  note?: string;
  city?: string;
  batchNumber?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface CommunityStats {
  totalReports: number;
  verdictBreakdown: {
    real: number;
    suspicious: number;
    fake: number;
  };
  topFlags: Array<{ flag: string; count: number }>;
  cityDistribution: Array<{ city: string; count: number }>;
  recentReports: CommunityReport[];
}

export interface RiskFactor {
  id: string;
  label: string;
  scoreImpact: number; // e.g., +25 or -10
  severity: 'low' | 'medium' | 'high';
  evidenceId?: string;
  explanation: string;
}

export interface RiskAssessment {
  score: number; // 0 to 100 (Bounded authenticity risk score)
  level: RiskLevel; // INSUFFICIENT | LOW | ELEVATED | HIGH
  factors: RiskFactor[];
  confidence: ConfidenceLevel; // LOW | MEDIUM | HIGH
}

export interface AIExplanation {
  headline: string;
  summary: string;
  reasons: Array<{
    title: string;
    explanation: string;
    evidenceId?: string;
  }>;
  recommendedNextStep: string;
  disclaimer: string;
}

export interface InvestigationTimelineStep {
  timestamp: string;
  action: string;
  status: 'completed' | 'in_progress' | 'warning';
}

export interface Investigation {
  id: string;
  productId: string;
  productName: string;
  queryType: 'search' | 'image' | 'combined';
  imageUrl?: string;
  extractedData?: ProductExtraction;
  officialMatch?: OfficialProduct | null;
  matchingAlerts: OfficialAlert[];
  evidence: EvidenceItem[];
  riskAssessment: RiskAssessment;
  explanation: AIExplanation;
  communityStats: CommunityStats;
  timeline: InvestigationTimelineStep[];
  createdAt: string;
}

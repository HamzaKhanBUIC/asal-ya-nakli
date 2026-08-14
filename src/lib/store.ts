// Global Dual-Mode Persistence Store (Supabase PostgreSQL + In-Memory Fallback)

import { Investigation, CommunityReport, CommunityStats } from '@/types';
import {
  saveInvestigationToSupabase,
  getInvestigationFromSupabase,
  addCommunityReportToSupabase,
  getAllCommunityReportsFromSupabase,
} from './supabase/db';

export const INITIAL_COMMUNITY_REPORTS: CommunityReport[] = [
  {
    id: 'rep-seed-1',
    productId: 'prod-panadol-500',
    productName: 'Panadol 500mg',
    verdict: 'REAL',
    flags: [],
    note: 'Purchased from D. Watson Pharmacy, Islamabad. Standard packaging and clear foil imprint.',
    city: 'Islamabad',
    batchNumber: 'B8921',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'rep-seed-2',
    productId: 'prod-panadol-500',
    productName: 'Panadol 500mg',
    verdict: 'SUSPICIOUS',
    flags: ['Faded Brand Logo', 'Soft Pill Consistency'],
    note: 'Blister foil felt thinner than usual, purchased at local market stall.',
    city: 'Lahore',
    batchNumber: 'B8921',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'rep-seed-3',
    productId: 'prod-flynn-para',
    productName: 'Flynn Paracetamol',
    verdict: 'FAKE',
    flags: ['Invalid Reg #', 'Faded Brand Logo', 'Missing Expiry Date'],
    note: 'No DRAP registration number printed on carton. Tablets dissolved into powder immediately.',
    city: 'Peshawar',
    batchNumber: 'UNKNOWN',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'rep-seed-4',
    productId: 'prod-augmentin-625',
    productName: 'Augmentin 625mg',
    verdict: 'FAKE',
    flags: ['Discolored Tablets', 'Misspelled Active Ingredient'],
    note: 'Matched WHO alert alert N°9/2025. Packaging font was misaligned.',
    city: 'Karachi',
    batchNumber: 'K9901',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

class MemoryStore {
  private investigations: Map<string, Investigation> = new Map();
  private reports: CommunityReport[] = [...INITIAL_COMMUNITY_REPORTS];

  constructor() {}

  // --- INVESTIGATIONS ---

  async saveInvestigation(inv: Investigation): Promise<void> {
    this.investigations.set(inv.id, inv);
    await saveInvestigationToSupabase(inv);
  }

  async getInvestigation(id: string): Promise<Investigation | null> {
    const supabaseRecord = await getInvestigationFromSupabase(id);
    if (supabaseRecord) return supabaseRecord;

    return this.investigations.get(id) || null;
  }

  // --- COMMUNITY REPORTS ---

  async addReport(report: CommunityReport): Promise<void> {
    this.reports.unshift(report);
    await addCommunityReportToSupabase(report);
  }

  async getReportsForProduct(productName: string): Promise<CommunityReport[]> {
    const allSupabase = await getAllCommunityReportsFromSupabase();
    const reportsSource = allSupabase.length > 0 ? allSupabase : this.reports;

    const normTarget = productName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return reportsSource.filter((r) => {
      const normName = r.productName.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normName.includes(normTarget) || normTarget.includes(normName);
    });
  }

  async getRecentReports(limit = 10): Promise<CommunityReport[]> {
    const allSupabase = await getAllCommunityReportsFromSupabase();
    if (allSupabase.length > 0) return allSupabase.slice(0, limit);

    return this.reports.slice(0, limit);
  }

  async getCommunityStats(productName: string): Promise<CommunityStats> {
    const productReports = await this.getReportsForProduct(productName);
    const totalReports = productReports.length;

    const verdictBreakdown = {
      real: productReports.filter((r) => r.verdict === 'REAL').length,
      suspicious: productReports.filter((r) => r.verdict === 'SUSPICIOUS').length,
      fake: productReports.filter((r) => r.verdict === 'FAKE').length,
    };

    const flagMap: Record<string, number> = {};
    const cityMap: Record<string, number> = {};

    productReports.forEach((r) => {
      if (r.flags) {
        r.flags.forEach((f) => {
          flagMap[f] = (flagMap[f] || 0) + 1;
        });
      }
      if (r.city) {
        cityMap[r.city] = (cityMap[r.city] || 0) + 1;
      }
    });

    const topFlags = Object.entries(flagMap)
      .map(([flag, count]) => ({ flag, count }))
      .sort((a, b) => b.count - a.count);

    const cityDistribution = Object.entries(cityMap)
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalReports,
      verdictBreakdown,
      topFlags,
      cityDistribution,
      recentReports: productReports.slice(0, 5),
    };
  }
}

declare global {
  // eslint-disable-next-line no-var
  var globalStore: MemoryStore | undefined;
}

export const memoryStore = globalThis.globalStore || new MemoryStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.globalStore = memoryStore;
}

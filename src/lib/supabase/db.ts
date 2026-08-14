// Supabase Database CRUD Operations for Asal ya Nakli

import { supabase, isSupabaseConfigured } from './client';
import { Investigation, CommunityReport } from '@/types';

export async function saveInvestigationToSupabase(investigation: Investigation): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase.from('investigations').upsert({
      id: investigation.id,
      product_id: investigation.productId,
      product_name: investigation.productName,
      query_type: investigation.queryType,
      image_url: investigation.imageUrl || null,
      extracted_data: investigation.extractedData || null,
      official_match: investigation.officialMatch || null,
      matching_alerts: investigation.matchingAlerts || [],
      evidence: investigation.evidence || [],
      risk_assessment: investigation.riskAssessment || null,
      explanation: investigation.explanation || null,
      community_stats: investigation.communityStats || null,
      timeline: investigation.timeline || [],
      created_at: investigation.createdAt,
    });

    if (error) {
      console.warn('[Supabase DB] Failed to save investigation:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase DB] Error in saveInvestigation:', err);
    return false;
  }
}

export async function getInvestigationFromSupabase(id: string): Promise<Investigation | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('investigations')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      productId: data.product_id,
      productName: data.product_name,
      queryType: data.query_type,
      imageUrl: data.image_url,
      extractedData: data.extracted_data,
      officialMatch: data.official_match,
      matchingAlerts: data.matching_alerts || [],
      evidence: data.evidence || [],
      riskAssessment: data.risk_assessment,
      explanation: data.explanation,
      communityStats: data.community_stats,
      timeline: data.timeline || [],
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error('[Supabase DB] Error fetching investigation:', err);
    return null;
  }
}

export async function addCommunityReportToSupabase(report: CommunityReport): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  try {
    const { error } = await supabase.from('community_reports').insert({
      id: report.id,
      product_id: report.productId,
      product_name: report.productName,
      verdict: report.verdict,
      flags: report.flags || [],
      note: report.note || null,
      city: report.city || null,
      batch_number: report.batchNumber || null,
      image_url: report.imageUrl || null,
      created_at: report.createdAt,
    });

    if (error) {
      console.warn('[Supabase DB] Failed to insert community report:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[Supabase DB] Error in addCommunityReport:', err);
    return false;
  }
}

export async function getAllCommunityReportsFromSupabase(): Promise<CommunityReport[]> {
  if (!isSupabaseConfigured() || !supabase) return [];

  try {
    const { data, error } = await supabase
      .from('community_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((d) => ({
      id: d.id,
      productId: d.product_id,
      productName: d.product_name,
      verdict: d.verdict,
      flags: d.flags || [],
      note: d.note,
      city: d.city,
      batchNumber: d.batch_number,
      imageUrl: d.image_url,
      createdAt: d.created_at,
    }));
  } catch (err) {
    console.error('[Supabase DB] Error fetching all reports:', err);
    return [];
  }
}

'use client';

import React, { useState } from 'react';
import { Header } from '@/components/brand/Header';
import { SearchSection } from '@/components/search/SearchSection';
import { InvestigationView } from '@/components/investigation/InvestigationView';
import { ReportModal } from '@/components/reports/ReportModal';
import { Investigation, CommunityStats } from '@/types';
import { ShieldCheck, HeartPulse, Building2, Lock } from 'lucide-react';

export default function Home() {
  const [activeInvestigation, setActiveInvestigation] = useState<Investigation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleInvestigate = async (params: { query?: string; imageBase64?: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete investigation.');
      }

      setActiveInvestigation(data);
    } catch (error: unknown) {
      const err = error as Error;
      alert(err.message || 'An error occurred during product investigation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSearch = () => {
    setActiveInvestigation(null);
  };

  const handleReportSubmitted = (updatedStats: CommunityStats) => {
    if (activeInvestigation) {
      setActiveInvestigation((prev) => (prev ? { ...prev, communityStats: updatedStats } : null));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9ff] text-slate-900 font-sans">
      <Header
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onResetSearch={handleResetSearch}
      />

      <main className="flex-1">
        {activeInvestigation ? (
          <InvestigationView
            investigation={activeInvestigation}
            onResetSearch={handleResetSearch}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        ) : (
          <div className="py-8 space-y-12">
            <SearchSection onInvestigate={handleInvestigate} isLoading={isLoading} />

            {/* Platform Value Pillars Section (Stitch Cards) */}
            <div className="max-w-[1200px] mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-2.5 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#064e3b]">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm font-sans">Official DRAP & WHO Corroboration</h3>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Checks product identity against the DRAP public database and WHO global medical safety alert registries.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-2.5 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm font-sans">Deterministic Risk Engine</h3>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Uses bounded mathematical scoring to prevent hallucinated risk percentages. Every point impact is explainable.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 rounded-xl space-y-2.5 shadow-xs">
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm font-sans">Community Feedback Loop</h3>
                <p className="text-slate-600 leading-relaxed font-normal">
                  Anonymous citizen reports build real-time city-level product intelligence for healthcare consumers across Pakistan.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Report Modal */}
      <ReportModal
        productName={activeInvestigation?.productName}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSubmitted={handleReportSubmitted}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#064e3b]" />
            <span className="font-bold text-slate-800">Asal ya Nakli? (اصل یا نقلی؟)</span>
            <span>• Product Authenticity Intelligence</span>
          </div>

          <div className="text-center md:text-right space-y-1">
            <p className="font-medium text-slate-700">DRAP Official Database & WHO Medical Product Alerts Corroborated</p>
            <p className="text-[10px] text-slate-400">
              Disclaimer: Risk signals do not replace advice from a licensed pharmacist, doctor, or regulatory authority.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

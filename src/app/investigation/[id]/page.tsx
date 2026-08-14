'use client';

import React, { useEffect, useState, use } from 'react';
import { Header } from '@/components/brand/Header';
import { InvestigationView } from '@/components/investigation/InvestigationView';
import { ReportModal } from '@/components/reports/ReportModal';
import { Investigation, CommunityStats } from '@/types';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

export default function InvestigationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    async function fetchInvestigation() {
      try {
        const res = await fetch(`/api/investigations/${id}`);
        if (!res.ok) {
          throw new Error('Investigation record not found or expired.');
        }
        const data = await res.json();
        setInvestigation(data);
      } catch (error: unknown) {
        const err = error as Error;
        setErrorMsg(err.message || 'Failed to load investigation record.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchInvestigation();
  }, [id]);

  const handleResetSearch = () => {
    router.push('/');
  };

  const handleReportSubmitted = (updatedStats: CommunityStats) => {
    if (investigation) {
      setInvestigation((prev) => (prev ? { ...prev, communityStats: updatedStats } : null));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      <Header
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onResetSearch={handleResetSearch}
      />

      <main className="flex-1 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <p className="text-xs font-semibold text-zinc-400">Loading Investigation Record #{id}...</p>
          </div>
        ) : errorMsg || !investigation ? (
          <div className="max-w-md mx-auto p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-center space-y-4 my-12">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Investigation Not Found</h3>
            <p className="text-xs text-zinc-400">{errorMsg || 'This investigation link may be invalid or expired.'}</p>
            <button
              onClick={handleResetSearch}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition"
            >
              Start New Investigation
            </button>
          </div>
        ) : (
          <InvestigationView
            investigation={investigation}
            onResetSearch={handleResetSearch}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}
      </main>

      <ReportModal
        productName={investigation?.productName}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSubmitted={handleReportSubmitted}
      />
    </div>
  );
}

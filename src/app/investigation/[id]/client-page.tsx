'use client';

import React, { useEffect, useState, use } from 'react';
import { Header } from '@/components/brand/Header';
import { InvestigationView } from '@/components/investigation/InvestigationView';
import { ReportModal } from '@/components/reports/ReportModal';
import { Investigation, CommunityStats } from '@/types';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

export default function InvestigationClientContent({ params }: { params: Promise<{ id: string }> }) {
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
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMsg(error.message || 'Failed to retrieve investigation record.');
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchInvestigation();
    }
  }, [id]);

  const handleResetSearch = () => {
    router.push('/');
  };

  const handleReportSubmitted = (updatedStats: CommunityStats) => {
    if (investigation) {
      setInvestigation({ ...investigation, communityStats: updatedStats });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9ff] text-slate-900 font-sans">
      <Header
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onResetSearch={handleResetSearch}
      />

      <main className="flex-1">
        {isLoading ? (
          <div className="max-w-[1200px] mx-auto px-4 py-20 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#064e3b] animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Retrieving Evidence Investigation Record #{id}...</p>
          </div>
        ) : errorMsg || !investigation ? (
          <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Record Not Found</h3>
            <p className="text-xs text-slate-600">{errorMsg || `No record exists for ID #${id}.`}</p>
            <button
              onClick={handleResetSearch}
              className="px-4 py-2 rounded-md font-bold text-xs bg-[#064e3b] text-white hover:bg-[#003527] transition"
            >
              Verify Product Authenticity
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

      {/* Report Modal */}
      <ReportModal
        productName={investigation?.productName}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSubmitted={handleReportSubmitted}
      />
    </div>
  );
}

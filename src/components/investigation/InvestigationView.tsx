'use client';

import React, { useState } from 'react';
import { Investigation } from '@/types';
import { RiskBadge } from '@/components/investigation/RiskBadge';
import { EvidencePanel } from '@/components/investigation/EvidencePanel';
import { VisualEvidenceView } from '@/components/investigation/VisualEvidenceView';
import { AIExplanationCard } from '@/components/investigation/AIExplanationCard';
import { CommunityIntelligenceSection } from '@/components/reports/CommunityIntelligenceSection';
import { Share2, Clock, Check, PlusCircle, ArrowLeft } from 'lucide-react';

interface InvestigationViewProps {
  investigation: Investigation;
  onResetSearch: () => void;
  onOpenReportModal: () => void;
}

export function InvestigationView({ investigation, onResetSearch, onOpenReportModal }: InvestigationViewProps) {
  const [copied, setCopied] = useState(false);
  const [communityStats] = useState(investigation.communityStats);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/investigation/${investigation.id}` : '';

  const handleCopyLink = () => {
    if (navigator.clipboard && shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-6 space-y-8 animate-in fade-in">
      {/* Top Navigation & Share Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onResetSearch}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#064e3b] transition cursor-pointer font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Verify Another Product</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-xs">
            <Clock className="w-3.5 h-3.5 text-[#064e3b]" />
            <span>ID: <strong className="text-slate-900">{investigation.id}</strong></span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#064e3b]" />
                <span className="text-[#064e3b]">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Record</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Title Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#003527] px-2.5 py-0.5 rounded-xs border border-[#064e3b]">
            Active Evidence Record
          </span>
          <span className="text-xs text-slate-500 font-mono">{new Date(investigation.createdAt).toLocaleString()}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          {investigation.productName}
        </h2>
      </div>

      {/* 1. Risk Assessment Badge */}
      <RiskBadge assessment={investigation.riskAssessment} />

      {/* 2. Groq AI Evidence Explanation */}
      <AIExplanationCard explanation={investigation.explanation} />

      {/* 3. Evidence Log & Official DRAP/WHO Corroboration */}
      <EvidencePanel investigation={investigation} />

      {/* 4. Visual Packaging OCR Analysis (if photo was uploaded) */}
      {(investigation.imageUrl || investigation.extractedData) && (
        <VisualEvidenceView imageUrl={investigation.imageUrl} extractedData={investigation.extractedData} />
      )}

      {/* 5. Community Intelligence Section */}
      <CommunityIntelligenceSection stats={communityStats} onOpenReportModal={onOpenReportModal} />

      {/* Bottom Report Loop CTA */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-3 shadow-xs">
        <h4 className="text-base font-bold text-slate-900 font-sans">Have you purchased or inspected this product?</h4>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          Help protect healthcare consumers across Pakistan by submitting your packaging observations. Every report strengthens community product intelligence.
        </p>
        <button
          onClick={onOpenReportModal}
          className="px-5 py-2.5 rounded-md font-bold text-xs bg-[#064e3b] hover:bg-[#003527] text-white transition inline-flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          <span>Report What You Observed</span>
        </button>
      </div>
    </div>
  );
}

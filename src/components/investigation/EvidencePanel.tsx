import React from 'react';
import { Investigation } from '@/types';
import { SourceBadge } from '@/components/common/Badge';
import { Building2, AlertOctagon, FileText, ExternalLink } from 'lucide-react';

interface EvidencePanelProps {
  investigation: Investigation;
}

export function EvidencePanel({ investigation }: EvidencePanelProps) {
  const { officialMatch, matchingAlerts, evidence } = investigation;

  return (
    <div className="space-y-6">
      {/* 1. PRODUCT IDENTITY CARD */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#064e3b]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans">Product Identity Record</h3>
          </div>
          <SourceBadge sourceType="OFFICIAL" />
        </div>

        {officialMatch ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#f8fafc] p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold block mb-1">Brand Name</span>
              <span className="text-slate-900 font-bold text-sm">{officialMatch.brandName}</span>
            </div>
            <div className="bg-[#f8fafc] p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold block mb-1">Generic Name</span>
              <span className="text-slate-800 font-medium">{officialMatch.genericName}</span>
            </div>
            <div className="bg-[#f8fafc] p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold block mb-1">Strength / Form</span>
              <span className="text-slate-800 font-medium">{officialMatch.strength} ({officialMatch.dosageForm})</span>
            </div>
            <div className="bg-[#f8fafc] p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-semibold block mb-1">DRAP Reg #</span>
              <span className="text-[#064e3b] font-mono font-bold">{officialMatch.registrationNumber}</span>
            </div>
            <div className="col-span-2 md:col-span-4 bg-[#f8fafc] p-3 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-slate-500 font-semibold text-[10px] block">Official Manufacturer</span>
                <span className="text-slate-900 font-bold text-xs">{officialMatch.manufacturer} ({officialMatch.country})</span>
              </div>
              {officialMatch.sourceUrl && (
                <a
                  href={officialMatch.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#064e3b] hover:underline text-[11px] flex items-center gap-1 font-bold"
                >
                  <span>Verify DRAP Registry</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#f8fafc] p-4 rounded-lg border border-slate-200 text-center">
            <p className="text-xs text-slate-600 font-medium">
              No exact official DRAP registry record corroborated for query identity &quot;{investigation.productName}&quot;.
            </p>
          </div>
        )}
      </div>

      {/* 2. OFFICIAL SAFETY ALERTS */}
      {matchingAlerts.length > 0 && (
        <div className="bg-red-50/80 border border-red-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 border-b border-red-200 pb-3">
            <AlertOctagon className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-bold text-red-950 uppercase tracking-wider font-sans">
              Matched Safety Alerts ({matchingAlerts.length})
            </h3>
          </div>
          <div className="space-y-3">
            {matchingAlerts.map((alert) => (
              <div key={alert.id} className="bg-white border border-red-300 rounded-lg p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-700">{alert.source}</span>
                  <span className="text-[11px] text-slate-500">{alert.alertDate}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                <p className="text-xs text-slate-700">{alert.summary}</p>
                {alert.batchNumbers && alert.batchNumbers.length > 0 && (
                  <p className="text-[11px] text-amber-900 font-mono font-semibold">
                    Flagged Batch #s: {alert.batchNumbers.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. INDIVIDUAL EVIDENCE LOG CARDS */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#064e3b]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans">
              Evidence Log ({evidence.length} Signals)
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {evidence.map((item) => (
            <div
              key={item.id}
              className="bg-[#f8fafc] border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <SourceBadge sourceType={item.sourceType} />
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">
                    Confidence: {Math.round(item.confidence * 100)}%
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900">{item.claim}</p>
              </div>

              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#064e3b] hover:underline flex items-center gap-1 shrink-0 font-bold"
                >
                  <span>Verify</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

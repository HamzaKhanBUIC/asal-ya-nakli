import React from 'react';
import { EvidenceSourceType } from '@/types';

export function SourceBadge({ sourceType, className = '' }: { sourceType: EvidenceSourceType; className?: string }) {
  switch (sourceType) {
    case 'OFFICIAL':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#003527] text-white border border-[#064e3b] ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
          OFFICIAL FACT
        </span>
      );
    case 'AI_OBSERVATION':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-sky-900 text-sky-100 border border-sky-700 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-300"></span>
          AI OBSERVATION
        </span>
      );
    case 'COMMUNITY':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-[#904d00] text-white border border-amber-600 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
          COMMUNITY REPORT
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-700 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          SYSTEM INFERENCE
        </span>
      );
  }
}

import React from 'react';
import { RiskAssessment } from '@/types';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';

interface RiskBadgeProps {
  assessment: RiskAssessment;
}

export function RiskBadge({ assessment }: RiskBadgeProps) {
  const { score, level, confidence } = assessment;

  const renderLevelVisual = () => {
    switch (level) {
      case 'HIGH':
        return {
          bgColor: 'bg-red-50/90 border-red-200 text-red-950',
          badgeBg: 'bg-[#640006] text-white',
          icon: <AlertOctagon className="w-8 h-8 text-red-600" />,
          title: 'HIGH AUTHENTICITY RISK',
          sub: 'Multiple warning signals match known counterfeit profiles or active safety alerts.',
          barColor: 'bg-red-600',
        };
      case 'ELEVATED':
        return {
          bgColor: 'bg-amber-50/90 border-amber-200 text-amber-950',
          badgeBg: 'bg-[#904d00] text-white',
          icon: <AlertTriangle className="w-8 h-8 text-amber-600" />,
          title: 'ELEVATED AUTHENTICITY RISK',
          sub: 'Specific packaging or community reporting anomalies require careful verification.',
          barColor: 'bg-amber-500',
        };
      case 'LOW':
        return {
          bgColor: 'bg-emerald-50/90 border-emerald-200 text-emerald-950',
          badgeBg: 'bg-[#003527] text-white',
          icon: <ShieldCheck className="w-8 h-8 text-[#064e3b]" />,
          title: 'LOW AUTHENTICITY RISK',
          sub: 'No major warning signals identified from available evidence records.',
          barColor: 'bg-[#064e3b]',
        };
      default:
        return {
          bgColor: 'bg-slate-50 border-slate-200 text-slate-900',
          badgeBg: 'bg-slate-700 text-white',
          icon: <HelpCircle className="w-8 h-8 text-slate-500" />,
          title: 'INSUFFICIENT EVIDENCE',
          sub: 'Not enough reliable information available for a high-confidence assessment.',
          barColor: 'bg-slate-400',
        };
    }
  };

  const visual = renderLevelVisual();
  const segments = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <div className={`p-6 rounded-xl border shadow-sm ${visual.bgColor} space-y-4`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Risk Level Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-xs shrink-0">
            {visual.icon}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${visual.badgeBg}`}>
                {level}
              </span>
              <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                Confidence: <strong className="text-slate-900">{confidence}</strong>
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight font-sans">{visual.title}</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md">{visual.sub}</p>
          </div>
        </div>

        {/* Stitch Score Display Token */}
        <div className="bg-white border border-slate-200 rounded-xl px-6 py-4 text-center shrink-0 w-full md:w-auto shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1 font-sans">
            Risk Signal Score
          </p>
          <div className="flex items-baseline justify-center gap-1 font-sans">
            <span className="text-5xl font-extrabold tracking-tight text-slate-900">{score}</span>
            <span className="text-base font-semibold text-slate-400">/ 100</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 italic">Bounded deterministic score</p>
        </div>
      </div>

      {/* Stitch 10-Segment Risk Gauge Bar */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
          <span>0 (Low Risk)</span>
          <span>Authenticity Gauge</span>
          <span>100 (High Risk)</span>
        </div>
        <div className="flex gap-1 h-3.5 w-full rounded overflow-hidden bg-slate-200/80 p-0.5">
          {segments.map((threshold) => {
            const isFilled = score >= threshold - 9;
            return (
              <div
                key={threshold}
                className={`flex-1 transition-all rounded-xs ${
                  isFilled ? visual.barColor : 'bg-slate-300/40'
                }`}
                title={`Threshold ${threshold}%`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

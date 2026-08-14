import React from 'react';
import { AIExplanation } from '@/types';
import { Bot, Lightbulb, CheckCircle2 } from 'lucide-react';

interface AIExplanationCardProps {
  explanation: AIExplanation;
}

export function AIExplanationCard({ explanation }: AIExplanationCardProps) {
  const { headline, summary, reasons, recommendedNextStep, disclaimer } = explanation;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#064e3b]">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#064e3b] font-sans">
            Groq AI Evidence Synthesis
          </span>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight font-sans">{headline}</h3>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#f8fafc] border border-slate-200 p-4 rounded-lg">
        <p className="text-sm text-slate-800 leading-relaxed font-medium">{summary}</p>
      </div>

      {/* Structured Reasons */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">Why This Assessment:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reasons.map((reason, idx) => (
            <div key={idx} className="bg-[#f8fafc] border border-slate-200 p-3.5 rounded-lg space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#064e3b] shrink-0" />
                <span className="text-xs font-bold text-slate-900">{reason.title}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">{reason.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Action */}
      <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-lg flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-[#064e3b] shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-[#064e3b] uppercase tracking-wider block font-sans">Recommended Action</span>
          <p className="text-xs text-slate-800 font-medium mt-0.5">{recommendedNextStep}</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-[#f8fafc] p-3 rounded-lg border border-slate-200 text-center">
        <p className="text-[11px] text-slate-500 italic leading-normal">{disclaimer}</p>
      </div>
    </div>
  );
}

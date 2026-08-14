import React from 'react';
import { CommunityStats } from '@/types';
import { Users, MapPin, Flag } from 'lucide-react';

interface CommunityIntelligenceSectionProps {
  stats: CommunityStats;
  onOpenReportModal: () => void;
}

export function CommunityIntelligenceSection({ stats, onOpenReportModal }: CommunityIntelligenceSectionProps) {
  const { totalReports, verdictBreakdown, topFlags, cityDistribution, recentReports } = stats;

  const realPct = totalReports > 0 ? Math.round((verdictBreakdown.real / totalReports) * 100) : 0;
  const suspPct = totalReports > 0 ? Math.round((verdictBreakdown.suspicious / totalReports) * 100) : 0;
  const fakePct = totalReports > 0 ? Math.round((verdictBreakdown.fake / totalReports) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans">
            Community Intelligence ({totalReports} Reports)
          </h3>
        </div>
        <button
          onClick={onOpenReportModal}
          className="text-xs font-bold px-3 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition cursor-pointer"
        >
          + Report Observation
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Verdict Breakdown Bar */}
        <div className="bg-[#f8fafc] p-4 rounded-lg border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-600 block font-sans">Verdict Breakdown</span>
          <div className="flex h-3.5 w-full rounded-xs overflow-hidden bg-slate-200">
            <div style={{ width: `${realPct}%` }} className="bg-[#064e3b]" title={`Real: ${realPct}%`} />
            <div style={{ width: `${suspPct}%` }} className="bg-amber-500" title={`Suspicious: ${suspPct}%`} />
            <div style={{ width: `${fakePct}%` }} className="bg-red-600" title={`Fake: ${fakePct}%`} />
          </div>
          <div className="flex items-center justify-between text-[11px] font-bold pt-1">
            <span className="text-[#064e3b]">🟢 Real ({realPct}%)</span>
            <span className="text-amber-800">🟡 Suspicious ({suspPct}%)</span>
            <span className="text-red-700">🔴 Fake ({fakePct}%)</span>
          </div>
        </div>

        {/* Top Flags */}
        <div className="bg-[#f8fafc] p-4 rounded-lg border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1 font-sans">
            <Flag className="w-3.5 h-3.5 text-amber-700" />
            <span>Commonly Flagged Concerns</span>
          </span>
          {topFlags.length > 0 ? (
            <div className="space-y-1">
              {topFlags.slice(0, 3).map((f) => (
                <div key={f.flag} className="flex items-center justify-between text-xs">
                  <span className="text-slate-800 font-medium">{f.flag}</span>
                  <span className="text-amber-800 font-bold">{f.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No specific flags reported</p>
          )}
        </div>

        {/* City Breakdown */}
        <div className="bg-[#f8fafc] p-4 rounded-lg border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1 font-sans">
            <MapPin className="w-3.5 h-3.5 text-[#064e3b]" />
            <span>City Distribution</span>
          </span>
          {cityDistribution.length > 0 ? (
            <div className="space-y-1">
              {cityDistribution.slice(0, 3).map((c) => (
                <div key={c.city} className="flex items-center justify-between text-xs">
                  <span className="text-slate-800 font-medium">{c.city}</span>
                  <span className="text-[#064e3b] font-bold">{c.count} reports</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No city location specified</p>
          )}
        </div>
      </div>

      {/* Recent Submissions */}
      {recentReports.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block font-sans">
            Recent Community Submissions
          </span>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="bg-[#f8fafc] border border-slate-200 p-3.5 rounded-lg flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                        report.verdict === 'REAL'
                          ? 'bg-emerald-100 text-[#064e3b] border border-emerald-300'
                          : report.verdict === 'SUSPICIOUS'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}
                    >
                      {report.verdict}
                    </span>
                    {report.city && (
                      <span className="text-[11px] text-slate-600 font-semibold">📍 {report.city}</span>
                    )}
                    {report.batchNumber && (
                      <span className="text-[11px] text-slate-500 font-mono">Batch #{report.batchNumber}</span>
                    )}
                  </div>
                  {report.note && <p className="text-slate-800 font-medium">{report.note}</p>}
                  {report.flags.length > 0 && (
                    <p className="text-[11px] text-amber-900 font-bold">Flags: {report.flags.join(', ')}</p>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 shrink-0">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

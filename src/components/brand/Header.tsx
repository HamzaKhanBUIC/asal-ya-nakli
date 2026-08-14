import React from 'react';
import { ShieldCheck, PlusCircle, Search, FileText, Users, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  onOpenReportModal?: () => void;
  onResetSearch?: () => void;
}

export function Header({ onOpenReportModal, onResetSearch }: HeaderProps) {
  return (
    <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onResetSearch}
        >
          <div className="w-10 h-10 rounded-lg bg-[#064e3b] flex items-center justify-center text-white shadow-sm group-hover:bg-[#003527] transition-colors">
            <ShieldCheck className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-[#064e3b] transition-colors font-sans">
                Asal ya Nakli?
              </h1>
              <span className="text-lg font-semibold text-[#064e3b] font-urdu dir-rtl">
                اصل یا نقلی؟
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">
              Product Authenticity Intelligence Infrastructure
            </p>
          </div>
        </div>

        {/* Navigation Links & Action */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button onClick={onResetSearch} className="hover:text-[#064e3b] transition flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>Verify Product</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400 font-normal">DRAP & WHO Corroborated</span>
          </nav>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold bg-[#064e3b] hover:bg-[#003527] text-white transition-all shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>Submit Report</span>
          </button>
        </div>
      </div>
    </header>
  );
}

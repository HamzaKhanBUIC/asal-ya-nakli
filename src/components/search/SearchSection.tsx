'use client';

import React, { useState, useRef } from 'react';
import { Search, Camera, Upload, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

interface SearchSectionProps {
  onInvestigate: (params: { query?: string; imageBase64?: string }) => void;
  isLoading: boolean;
}

export function SearchSection({ onInvestigate, isLoading }: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !selectedImage) return;
    onInvestigate({ query: query.trim() || undefined, imageBase64: selectedImage || undefined });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDemoSelect = (demoTerm: string) => {
    setQuery(demoTerm);
    onInvestigate({ query: demoTerm });
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8">
      {/* Stitch Design Hero */}
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#e9edff] border border-[#cbd5e1] text-[#003527]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#064e3b]" />
          <span>Trust Infrastructure • Official Signals, Visual OCR & Community Reports</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight font-sans">
          Investigate the evidence behind <br className="hidden md:inline" />
          <span className="text-[#064e3b]">the products you buy.</span>
        </h2>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Access DRAP official registrations, WHO medical alerts, Groq AI visual packaging analysis, and citizen community reports to verify authenticity.
        </p>
      </div>

      {/* Main Stitch Search & Upload Container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-sans">
                <Search className="w-4 h-4 text-[#064e3b]" />
                <span>Search Product Name or Reg #</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Panadol 500mg, Augmentin, Brufen..."
                  className="w-full bg-[#f8fafc] border border-slate-300 rounded-md px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#064e3b] focus:ring-1 focus:ring-[#064e3b] transition font-sans"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Image Upload Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 font-sans">
                <Camera className="w-4 h-4 text-amber-700" />
                <span>Analyze Packaging Photo</span>
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-md p-3.5 flex items-center justify-center gap-3 cursor-pointer transition ${
                  selectedImage
                    ? 'border-[#064e3b] bg-emerald-50/50'
                    : 'border-slate-300 hover:border-slate-400 bg-[#f8fafc]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {selectedImage ? (
                  <div className="flex items-center gap-3 w-full">
                    <img
                      src={selectedImage}
                      alt="Selected packaging"
                      className="w-10 h-10 object-cover rounded border border-emerald-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#064e3b] truncate">Packaging Photo Loaded</p>
                      <p className="text-[10px] text-slate-500">Click to replace image</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-[#064e3b]" />
                  </div>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-600 font-medium">
                      Upload or take photo of product box, foil, or serial code
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading || (!query.trim() && !selectedImage)}
            className="w-full py-4 rounded-md font-bold text-sm bg-[#064e3b] hover:bg-[#003527] text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Analyzing Evidence Signals...</span>
              </div>
            ) : (
              <>
                <span>Run Product Authenticity Check</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick-Test Scenarios */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider font-sans">
            Demo Scenarios (1-Click Test):
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDemoSelect('Panadol 500mg')}
              className="px-3 py-1.5 rounded text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#064e3b] border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#064e3b]"></span>
              <span>Panadol 500mg [DRAP VERIFIED]</span>
            </button>
            <button
              onClick={() => handleDemoSelect('Flynn Paracetamol Suspicious')}
              className="px-3 py-1.5 rounded text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Flynn Paracetamol [COMMUNITY FLAGS]</span>
            </button>
            <button
              onClick={() => handleDemoSelect('Augmentin 625mg')}
              className="px-3 py-1.5 rounded text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Augmentin 625mg [WHO SAFETY ALERT]</span>
            </button>
            <button
              onClick={() => handleDemoSelect('Brufen 400mg')}
              className="px-3 py-1.5 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Brufen 400mg</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

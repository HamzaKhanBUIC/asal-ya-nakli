import React from 'react';
import { ProductExtraction } from '@/types';
import { Camera, FileSearch } from 'lucide-react';

interface VisualEvidenceViewProps {
  imageUrl?: string;
  extractedData?: ProductExtraction;
}

export function VisualEvidenceView({ imageUrl, extractedData }: VisualEvidenceViewProps) {
  if (!imageUrl && !extractedData) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Camera className="w-5 h-5 text-amber-700" />
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-sans">
          Visual Packaging OCR Analysis
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Uploaded Photo Preview */}
        {imageUrl && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 block font-sans">Submitted Packaging Photo</span>
            <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-slate-100 aspect-square flex items-center justify-center">
              <img src={imageUrl} alt="Packaging evidence" className="w-full h-full object-cover" />
            </div>
          </div>
        )}

        {/* Extracted Structured Fields & Observations */}
        <div className={`space-y-4 ${imageUrl ? 'md:col-span-2' : 'md:col-span-3'}`}>
          {extractedData && (
            <>
              {/* Structured Extracted Tags */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                <div className="bg-[#f8fafc] p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Extracted Batch #</span>
                  <span className="text-[#064e3b] font-mono font-bold">{extractedData.batchNumber || 'Not detected'}</span>
                </div>
                <div className="bg-[#f8fafc] p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-500 text-[10px] block">Packaging Expiry Date</span>
                  <span className="text-amber-800 font-mono font-bold">{extractedData.expiryDate || 'Not detected'}</span>
                </div>
                <div className="bg-[#f8fafc] p-2.5 rounded-lg border border-slate-200 col-span-2 md:col-span-1">
                  <span className="text-slate-500 text-[10px] block">Language Detected</span>
                  <span className="text-slate-800 font-medium">{extractedData.languageDetected.join(', ') || 'English'}</span>
                </div>
              </div>

              {/* Observation Cards */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block font-sans">
                  Packaging Observations ({extractedData.packagingObservations.length})
                </span>
                <div className="space-y-2">
                  {extractedData.packagingObservations.map((obs) => (
                    <div
                      key={obs.id}
                      className="bg-[#f8fafc] border border-slate-200 rounded-lg p-3 flex items-start gap-3"
                    >
                      <div
                        className={`p-1.5 rounded shrink-0 ${
                          obs.severity === 'high'
                            ? 'bg-red-100 text-red-700'
                            : obs.severity === 'medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-[#064e3b]'
                        }`}
                      >
                        <FileSearch className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 uppercase">{obs.category}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              obs.severity === 'high'
                                ? 'bg-red-100 text-red-800'
                                : obs.severity === 'medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-[#064e3b]'
                            }`}
                          >
                            {obs.severity} SEVERITY
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">{obs.description}</p>
                        {obs.evidenceText && (
                          <p className="text-[10px] text-slate-500 font-mono italic">
                            Evidence text: &quot;{obs.evidenceText}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { ReportVerdict, CommunityStats } from '@/types';

interface ReportModalProps {
  productName?: string;
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: (updatedStats: CommunityStats) => void;
}

const AVAILABLE_FLAGS = [
  'Broken seal',
  'Spelling error',
  'Packaging difference',
  'Unusual color',
  'Missing information',
  'Suspicious price',
  'Unexpected seller',
  'Altered expiry date',
  'Other',
];

const PAKISTAN_CITIES = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad'];

export function ReportModal({ productName: initialProductName, isOpen, onClose, onReportSubmitted }: ReportModalProps) {
  const [productName, setProductName] = useState(initialProductName || 'Panadol 500mg');
  const [verdict, setVerdict] = useState<ReportVerdict>('SUSPICIOUS');
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  const [city, setCity] = useState('Karachi');
  const [batchNumber, setBatchNumber] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const toggleFlag = (flag: string) => {
    setSelectedFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      setErrorMsg('Please enter a product name.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productName.trim(),
          verdict,
          flags: selectedFlags,
          city,
          batchNumber: batchNumber.trim() || undefined,
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report.');
      }

      onReportSubmitted(data.updatedStats);
      onClose();
    } catch (error: unknown) {
      const err = error as Error;
      setErrorMsg(err.message || 'An error occurred while submitting report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Report Product Observation</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Contribute to community product intelligence. No account required.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Product Name */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 uppercase tracking-wider block">Product Name *</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Panadol 500mg"
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Verdict Selection */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 uppercase tracking-wider block">Observation Verdict *</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setVerdict('REAL')}
                className={`py-2.5 rounded-xl font-bold border transition ${
                  verdict === 'REAL'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                🟢 Genuine
              </button>
              <button
                type="button"
                onClick={() => setVerdict('SUSPICIOUS')}
                className={`py-2.5 rounded-xl font-bold border transition ${
                  verdict === 'SUSPICIOUS'
                    ? 'bg-amber-950 text-amber-300 border-amber-500'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                🟡 Suspicious
              </button>
              <button
                type="button"
                onClick={() => setVerdict('FAKE')}
                className={`py-2.5 rounded-xl font-bold border transition ${
                  verdict === 'FAKE'
                    ? 'bg-red-950 text-red-300 border-red-500'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                🔴 Counterfeit
              </button>
            </div>
          </div>

          {/* Flags Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-300 uppercase tracking-wider block">Observed Warning Flags</label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_FLAGS.map((flag) => {
                const isSelected = selectedFlags.includes(flag);
                return (
                  <button
                    type="button"
                    key={flag}
                    onClick={() => toggleFlag(flag)}
                    className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] border transition ${
                      isSelected
                        ? 'bg-amber-950 text-amber-300 border-amber-600'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{flag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* City & Batch */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-zinc-300 uppercase tracking-wider block">City Location</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-zinc-300 uppercase tracking-wider block">Batch # (Optional)</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. B8921"
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="font-bold text-zinc-300 uppercase tracking-wider block">Detailed Observations (Optional)</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe printing quality, seal condition, purchase pharmacy location..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-2 shadow-lg"
          >
            {isSubmitting ? (
              <span>Submitting Report...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Anonymous Evidence Report</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Download, FileText, CheckCircle2 } from 'lucide-react';

export const CtaDownloadGccCompReport: React.FC = () => {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>58 · Market Intelligence Whitepaper Download Card</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">2026 Compensation Report</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>Free Institutional Research</span>
            </div>
            <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
              2026 India & Global GCC Tech Salary & Benchmarking Report
            </h2>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              Comprehensive 48-page study analyzing over 12,000 engineering compensation points across Bangalore, Hyderabad, and London. Includes real data on base salary brackets, US RSU allocations, and retention metrics.
            </p>
          </div>

          <div className="md:col-span-5 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            {downloaded ? (
              <div className="py-4 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Download Started</h4>
                <p className="text-xs text-slate-500">The PDF has been sent to your work email.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter corporate email to unlock"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setDownloaded(true)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 48-Page PDF Report</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

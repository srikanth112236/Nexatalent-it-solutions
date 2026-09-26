import React from 'react';
import { DollarSign } from 'lucide-react';

export const CaseStudyCostSavingsGraphVisual: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>46 · 3-Year Cumulative Savings Trajectory Visual</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">$6.4M Cumulative Delta</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>36-Month Capital Preservation Analysis</span>
          </div>
          <h2 className="text-section-title font-bold text-white tracking-tight">
            How a 25-Person Pod Saves $6,400,000 Over 3 Years
          </h2>
        </div>

        {/* Visual Bar Graph */}
        <div className="space-y-6 max-w-4xl mx-auto bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
          {[
            { year: 'Year 1', usCost: '$6.2M', gccCost: '$1.7M', savings: '$4.5M Saved', pct: '27%' },
            { year: 'Year 2', usCost: '$6.5M', gccCost: '$1.8M', savings: '$4.7M Saved', pct: '28%' },
            { year: 'Year 3', usCost: '$6.8M', gccCost: '$1.9M', savings: '$4.9M Saved', pct: '28%' },
          ].map((bar, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white font-bold">{bar.year}</span>
                <span className="text-emerald-400 font-bold">{bar.savings}</span>
              </div>
              <div className="h-8 w-full bg-slate-950 rounded-xl overflow-hidden flex border border-slate-800">
                <div 
                  style={{ width: bar.pct }} 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 flex items-center justify-end px-3 text-[11px] font-mono text-slate-950 font-bold"
                >
                  GCC ({bar.gccCost})
                </div>
                <div className="flex-1 bg-rose-950/40 flex items-center justify-end px-3 text-[11px] font-mono text-rose-400">
                  Onshore Baseline ({bar.usCost})
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

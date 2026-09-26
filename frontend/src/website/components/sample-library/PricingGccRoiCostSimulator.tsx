import React, { useState } from 'react';
import { DollarSign, ArrowRight } from 'lucide-react';

export const PricingGccRoiCostSimulator: React.FC = () => {
  const [headcount, setHeadcount] = useState<number>(20);
  const [seniorityMix, setSeniorityMix] = useState<number>(70); // % senior

  // US fully-loaded cost (~$250k sr, $170k mid)
  const usAvgCost = (seniorityMix / 100) * 260000 + ((100 - seniorityMix) / 100) * 175000;
  const usTotalAnnual = headcount * usAvgCost;

  // Indian GCC cost (~$65k sr, $40k mid)
  const gccAvgCost = (seniorityMix / 100) * 68000 + ((100 - seniorityMix) / 100) * 42000;
  const gccTotalAnnual = headcount * gccAvgCost;

  const annualSavings = usTotalAnnual - gccTotalAnnual;
  const threeYearSavings = annualSavings * 3;

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>52 · Enterprise GCC ROI Cost Simulator</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Real-Time Model</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Interactive Financial Model</span>
          </div>
          <h2 className="text-section-title font-bold text-white tracking-tight">
            Calculate Your Organization's 3-Year Capital Arbitrage
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders */}
          <div className="lg:col-span-6 space-y-6 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span>Planned Team Size (Headcount)</span>
                <span className="text-emerald-400 font-bold">{headcount} Engineers</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span>Senior / Staff Seniority Ratio</span>
                <span className="text-emerald-400 font-bold">{seniorityMix}% Staff/Senior</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                step="10"
                value={seniorityMix}
                onChange={(e) => setSeniorityMix(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1.5 font-light">
              <div className="font-mono text-slate-300 font-semibold mb-1">Model Assumptions:</div>
              <div>• US Baseline: San Francisco & New York average fully loaded comp + healthcare + rent.</div>
              <div>• India Baseline: Top 1% tier-1 compensation in Indiranagar/Outer Ring Rd + Class-A facilities.</div>
            </div>
          </div>

          {/* Savings Outcome Box */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 block mb-1">
                Net Annual Capital Saved
              </span>
              <div className="text-4xl font-black font-mono text-white">
                ${annualSavings.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ year</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <span className="text-xs font-mono text-emerald-300 block mb-1">3-Year Cumulative Runway Preservation</span>
              <div className="text-3xl font-black font-mono text-emerald-400">
                ${threeYearSavings.toLocaleString()}
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/30"
            >
              <span>Download Detailed Excel Financial Model</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

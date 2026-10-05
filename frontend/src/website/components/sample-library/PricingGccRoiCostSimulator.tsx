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
    <div className="w-full bg-[#FAF8F5] py-8 px-4 sm:px-8 border-y border-slate-200/80">
      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-extrabold uppercase tracking-wider mb-3">
            <DollarSign className="w-3.5 h-3.5 text-[#0265FF]" />
            <span>ENTERPRISE COST ESTIMATOR</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Calculate Your Organization's 3-Year Cost Savings
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal">
            Model headcount savings achieved by leveraging Nexa Talent IT Solutions offshore pod models.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders */}
          <div className="lg:col-span-6 space-y-6 bg-[#FAF8F5] p-6 rounded-2xl border border-slate-200">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                <span>Planned Team Size (Headcount)</span>
                <span className="text-[#0265FF] font-extrabold">{headcount} Engineers</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={headcount}
                onChange={(e) => setHeadcount(Number(e.target.value))}
                className="w-full accent-[#0265FF] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                <span>Senior / Staff Seniority Ratio</span>
                <span className="text-[#0265FF] font-extrabold">{seniorityMix}% Staff/Senior</span>
              </div>
              <input
                type="range"
                min="30"
                max="90"
                step="10"
                value={seniorityMix}
                onChange={(e) => setSeniorityMix(Number(e.target.value))}
                className="w-full accent-[#0265FF] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5 font-normal">
              <div className="text-slate-900 font-bold mb-1">Model Assumptions:</div>
              <div>• US Baseline: San Francisco & New York average fully loaded comp + health + facilities.</div>
              <div>• India Baseline: Senior compensation bands in major Indian technology hubs.</div>
            </div>
          </div>

          {/* Savings Outcome Box */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0265FF] block mb-1">
                Net Annual Savings
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                ${annualSavings.toLocaleString()} <span className="text-xs font-normal text-slate-600">/ year</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-xs">
              <span className="text-xs font-bold text-slate-600 block mb-1">3-Year Cumulative Cost Savings</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0265FF]">
                ${threeYearSavings.toLocaleString()}
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3.5 rounded-full bg-[#0265FF] hover:bg-[#004FBF] text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Request Detailed Commercial Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

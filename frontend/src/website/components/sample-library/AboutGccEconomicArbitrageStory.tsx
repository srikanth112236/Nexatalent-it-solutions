import React from 'react';
import { DollarSign, ArrowRight } from 'lucide-react';

export const AboutGccEconomicArbitrageStory: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>18 · GCC Economic Arbitrage Architecture</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Capital Efficiency</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Economic Comparative Analysis</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Deploy 4 Senior Staff Engineers for the Cost of 1
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Realized fully-loaded annual cost comparison for a 10-person enterprise software pod.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* US / UK Onshore Overhead */}
          <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase text-rose-700">Silicon Valley / London Onshore</span>
              <span className="text-xs font-mono text-rose-600">Standard Baseline</span>
            </div>
            <div className="text-3xl font-black font-mono text-slate-900 mb-1">$2,850,000 / yr</div>
            <p className="text-xs text-slate-600 mb-6 font-light">10-Person Engineering Team (Base salary + 28% US payroll taxes + health + physical lease)</p>

            <ul className="space-y-2 text-xs text-slate-600 border-t border-rose-200/60 pt-4">
              <li className="flex justify-between">
                <span>Avg Senior Base Salary:</span>
                <strong className="font-mono text-slate-900">$210,000</strong>
              </li>
              <li className="flex justify-between">
                <span>Benefits & Payroll Taxes:</span>
                <strong className="font-mono text-slate-900">$58,800 / person</strong>
              </li>
              <li className="flex justify-between">
                <span>Recruiter Placement Fees (25%):</span>
                <strong className="font-mono text-slate-900">$525,000 upfront</strong>
              </li>
            </ul>
          </div>

          {/* NexaScale Sovereign GCC Hub */}
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-300 shadow-md shadow-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800">NexaScale Sovereign GCC Hub</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">4.2x Savings</span>
            </div>
            <div className="text-3xl font-black font-mono text-emerald-700 mb-1">$680,000 / yr</div>
            <p className="text-xs text-slate-600 mb-6 font-light">10-Person Senior Staff Pod (Tier-1 compensation + turnkey Class-A office + legal pass-through)</p>

            <ul className="space-y-2 text-xs text-slate-700 border-t border-emerald-200 pt-4">
              <li className="flex justify-between">
                <span>Top 1% Bangalore Compensation:</span>
                <strong className="font-mono text-slate-900">$52,000 (₹44L)</strong>
              </li>
              <li className="flex justify-between">
                <span>Class-A Leased Space & Hardware:</span>
                <strong className="font-mono text-slate-900">$16,000 / person</strong>
              </li>
              <li className="flex justify-between">
                <span>Net Annual Client Capital Saved:</span>
                <strong className="font-mono text-emerald-700 font-bold">$2,170,000 / yr</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <span>*Calculated based on verified 2026 Radford & NexaTalent GCC Market Intelligence benchmarks.</span>
          <a href="#calculator" className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0">
            <span>Open Interactive Cost Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
};

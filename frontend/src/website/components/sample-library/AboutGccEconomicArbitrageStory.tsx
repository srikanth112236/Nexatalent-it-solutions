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
              <span className="text-xs font-mono font-bold uppercase text-rose-700">Single-Market Onshore Hiring</span>
              <span className="text-xs font-mono text-rose-600">Considerations</span>
            </div>
            <div className="text-3xl font-black font-mono text-slate-900 mb-1">Concentrated Cost Base</div>
            <p className="text-xs text-slate-600 mb-6 font-light">One geography carrying base compensation, payroll levies, benefits and facility overhead.</p>

            <ul className="space-y-2 text-xs text-slate-600 border-t border-rose-200/60 pt-4">
              <li className="flex justify-between">
                <span>Senior base compensation bands:</span>
                <strong className="font-mono text-slate-900">Top quartile pressure</strong>
              </li>
              <li className="flex justify-between">
                <span>Benefits & payroll levies:</span>
                <strong className="font-mono text-slate-900">Employer-loaded</strong>
              </li>
              <li className="flex justify-between">
                <span>Agency placement fees:</span>
                <strong className="font-mono text-slate-900">Percentage-based</strong>
              </li>
            </ul>
          </div>

          {/* NexaScale Sovereign GCC Hub */}
          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-300 shadow-md shadow-emerald-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800">Distributed GCC Hiring Model</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">Compared Structurally</span>
            </div>
            <div className="text-3xl font-black font-mono text-emerald-700 mb-1">Distributed Cost Base</div>
            <p className="text-xs text-slate-600 mb-6 font-light">Senior pod across hiring corridors with facility and compliance coordination.</p>

            <ul className="space-y-2 text-xs text-slate-700 border-t border-emerald-200 pt-4">
              <li className="flex justify-between">
                <span>Senior corridor compensation:</span>
                <strong className="font-mono text-slate-900">Benchmarked bands</strong>
              </li>
              <li className="flex justify-between">
                <span>Facility & coordination:</span>
                <strong className="font-mono text-slate-900">Planned per pod</strong>
              </li>
              <li className="flex justify-between">
                <span>Commercial comparison:</span>
                <strong className="font-mono text-emerald-700 font-bold">Modelled per mandate</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <span>*Calculated based on verified 2026 Radford & NexaTalent IT Solutions GCC Market Intelligence benchmarks.</span>
          <a href="#calculator" className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0">
            <span>Open Interactive Cost Simulator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export const CaseStudyBeforeAfterTeamComparison: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>47 · Before & After Operational Comparison</span>
        <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px]">Legacy vs Sovereign</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Before vs. After: The Sovereign GCC Transformation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="p-6 rounded-2xl bg-rose-50/40 border border-rose-200">
            <span className="text-xs font-mono font-bold text-rose-700 uppercase block mb-3">Before NexaTalent IT Solutions (Legacy IT Outsourcing)</span>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Engineers rotated across multiple clients without notice</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Heavy non-technical project managers billing 40 hours/week</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Fragmented IP ownership and risky sub-contractor agreements</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>40% annual contractor turnover requiring constant retraining</span>
              </li>
            </ul>
          </div>

          {/* After */}
          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-300 shadow-sm">
            <span className="text-xs font-mono font-bold text-emerald-800 uppercase block mb-3">After NexaTalent IT Solutions (Sovereign GCC Center)</span>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>100% dedicated full-time captive engineers reporting to your VP Eng</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Direct GitHub and Jira integration with zero middle-management bloat</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>100% direct IP assignment to client US parent entity</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>99.4% retention backed by US RSU equity alignment</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

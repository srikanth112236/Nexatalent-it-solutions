import React from 'react';
import { LayoutGrid, CheckCircle2, Award } from 'lucide-react';

export const FullScreenHorizontalSplitCurtain: React.FC = () => {
  return (
    <section
      className="relative w-full py-20 px-6 md:px-16 bg-slate-50 text-slate-900 border-b border-slate-200 flex flex-col items-center justify-center text-center"
    >
      <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/10">
        <LayoutGrid className="w-8 h-8 text-blue-600" />
      </div>

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-4">
        <Award className="w-3.5 h-3.5" />
        <span>NEXA TALENT INTELLIGENCE™ · ARCHITECTURAL ECOSYSTEM</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 uppercase leading-tight">
        AI-Powered Talent. Human Intelligence. Better Hiring.
      </h1>
      <p className="text-slate-600 text-base md:text-lg max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
        NexaTalent IT Solutions connects companies, recruitment partners, and technology professionals through an intelligent hiring ecosystem designed to discover, match, and deliver top 1% talent faster.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-mono font-bold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>STAGE 04 CLEARED</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mb-1">AI Research Directors</div>
          <div className="text-xs text-slate-600 leading-relaxed">
            82 Candidates cleared deep algorithmic and architectural vetting.
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-bold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>ESCROW SEALED</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mb-1">Founding GCC Managing Directors</div>
          <div className="text-xs text-slate-600 leading-relaxed">
            24 Executives placed with 100% 2-year retention records.
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-mono font-bold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>ZERO CONFLICT</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mb-1">Staff Distributed Storage</div>
          <div className="text-xs text-slate-600 leading-relaxed">
            114 Engineers with verified non-compete quarantine passes.
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Award } from 'lucide-react';

export const CaseStudyExecutiveQuoteHighlight: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>50 · Full-Width Editorial Executive Quote Banner</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">C-Suite Endorsement</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-14 border border-slate-800 shadow-xl text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>Silicon Valley Engineering Retainer</span>
          </div>

          <blockquote className="text-xl sm:text-2xl font-serif italic text-slate-200 leading-relaxed font-light">
            "Employers evaluating distributed hiring consistently ask for the same foundations: documented screening, visible pipelines and accountable placements."
          </blockquote>

          <div className="pt-4 border-t border-slate-800 inline-block text-center">
            <div className="font-bold text-white text-base">Hiring Leadership Perspective</div>
            <div className="text-xs text-slate-400 font-mono">Representative view across platform engineering mandates</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">Screening · Visibility · Accountability</div>
          </div>
        </div>
      </section>
    </div>
  );
};

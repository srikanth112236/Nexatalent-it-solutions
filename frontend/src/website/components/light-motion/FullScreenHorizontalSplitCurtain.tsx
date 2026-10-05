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
        <span>NEXATALENT IT SOLUTIONS · TECHNOLOGY & TALENT PARTNER</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 uppercase leading-tight">
        Building Teams. Powering Growth.
      </h1>
      <p className="text-slate-600 text-base md:text-lg max-w-3xl mx-auto mb-6 leading-relaxed font-medium">
        We help companies hire the right people through IT recruitment, permanent staffing, contract staffing, executive search, and specialized talent solutions.
      </p>

      {/* Dual Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
        <a
          href="/employers"
          className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <span>Hire Talent →</span>
        </a>
        <a
          href="/partners"
          className="px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-extrabold text-sm shadow-sm transition-all flex items-center gap-2"
        >
          <span>Vendor Empanelment</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl text-left">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-mono font-bold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>PERMANENT HIRING</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mb-1">IT & Tech Recruitment</div>
          <div className="text-xs text-slate-600 leading-relaxed">
            Direct tech sourcing & lateral engineering talent across senior levels.
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2 text-blue-600 text-xs font-mono font-bold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>FLEXIBLE STAFFING</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mb-1">Contract & Contract-to-Hire</div>
          <div className="text-xs text-slate-600 leading-relaxed">
            Agile developer squads and contract staffing for critical project delivery.
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-mono font-bold mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>LEADERSHIP SEARCH</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900 mb-1">Executive Search</div>
          <div className="text-xs text-slate-600 leading-relaxed">
            Confidential search for CXO, VP Engineering, and specialized leadership roles.
          </div>
        </div>
      </div>
    </section>
  );
};

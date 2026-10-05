import React from 'react';
import { Award } from 'lucide-react';

export const AboutHeroManifesto: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>11 · About Manifesto & Thesis Statement</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Institutional Pedigree</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-b from-white via-slate-50 to-blue-50/30 border border-slate-200 p-8 sm:p-14 shadow-sm relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6">
            <Award className="w-4 h-4 text-blue-600" />
            <span>The NexaTalent IT Solutions Operating Manifesto</span>
          </div>

          <h2 className="text-section-title font-black text-slate-900 tracking-tight leading-tight mb-6">
            Talent is Not an Operational Cost. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Talent is Sovereign Capital.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed max-w-3xl mx-auto mb-10">
            For three decades, global tech enterprises treated offshore engineering as a cost-cutting compromise. 
            NexaTalent IT Solutions was founded on the opposite premise: that India's premier engineering hubs represent the highest-density concentration of distributed systems architects, low-latency quant developers, and AI researchers on earth.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200/80 text-left">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <span className="text-3xl font-black font-mono text-slate-900 block mb-1">10,000+</span>
              <span className="text-xs font-semibold text-slate-700">Senior Placements Executed</span>
              <p className="text-[11px] text-slate-500 mt-1 font-light">Across 80+ tier-1 Global Capability Centers.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <span className="text-3xl font-black font-mono text-blue-600 block mb-1">75 Days</span>
              <span className="text-xs font-semibold text-slate-700">Turnkey Hub Launch SLA</span>
              <p className="text-[11px] text-slate-500 mt-1 font-light">From corporate charter to first code deployed.</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <span className="text-3xl font-black font-mono text-emerald-600 block mb-1">99.4%</span>
              <span className="text-xs font-semibold text-slate-700">Candidate 24-Month Retention</span>
              <p className="text-[11px] text-slate-500 mt-1 font-light">Backed by programmatic equity alignment.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Layers } from 'lucide-react';

export const CaseStudyGccMaturityFramework: React.FC = () => {
  const stages = [
    {
      stage: 'Level 1: Outpost',
      size: '10–25 Engineers',
      focus: 'Tactical burst staffing & test automation.',
      timeframe: 'Month 1-3',
    },
    {
      stage: 'Level 2: Capability Core',
      size: '25–100 Engineers',
      focus: 'Ownership of microservices, distributed pipelines & DevOps.',
      timeframe: 'Month 4-12',
    },
    {
      stage: 'Level 3: Strategic Sovereign Hub',
      size: '100–300 Engineers',
      focus: 'Complete product roadmap ownership and AI research.',
      timeframe: 'Year 2-3',
    },
    {
      stage: 'Level 4: Global Innovation Engine',
      size: '300+ Engineers',
      focus: 'Site Managing Director directs multi-discipline corporate division.',
      timeframe: 'Year 3+',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>49 · 4-Stage GCC Maturity Progression Framework</span>
        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">Maturity Ladder</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Maturity Framework</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            How Outposts Evolve into Global Innovation Engines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stages.map((st, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold block w-fit mb-3">
                  {st.timeframe}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{st.stage}</h4>
                <div className="text-xs font-mono text-indigo-600 font-semibold mb-3">{st.size}</div>
                <p className="text-xs text-slate-600 font-light leading-relaxed">{st.focus}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-mono text-slate-400">
                Stage {i + 1} Cleared
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Filter } from 'lucide-react';

export const DetailTechnicalVettingFunnel: React.FC = () => {
  const funnel = [
    {
      stage: 'Top of Funnel',
      volume: '10,000 Applicants',
      pct: '100%',
      desc: 'Algorithmic resume analysis parsing GitHub repos, OSS contributions, and tenure benchmarks.',
      color: 'bg-slate-200 text-slate-700',
    },
    {
      stage: 'Live Technical Sandbox',
      volume: '1,500 Screened',
      pct: '15%',
      desc: 'Real-time timed coding in concurrency, memory allocation, and distributed consensus.',
      color: 'bg-blue-100 text-blue-800',
    },
    {
      stage: 'System Architecture Defense',
      volume: '400 Advanced',
      pct: '4%',
      desc: 'Deep-dive whiteboard defense with Ex-FAANG Principal Architects defending edge-case failure modes.',
      color: 'bg-indigo-100 text-indigo-800',
    },
    {
      stage: 'Sovereign Talent Bench',
      volume: '150 Finalists',
      pct: '1.5%',
      desc: 'Elite engineers accredited to join active client GCC mandates with guaranteed 90-day retention.',
      color: 'bg-emerald-600 text-white font-bold',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>24 · 5-Stage Technical Vetting Funnel</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">1.5% Acceptance Bar</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            <Filter className="w-3.5 h-3.5" />
            <span>Candidate Funnel Telemetry</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Only the Top 1.5% Cross Into Our Client Rosters
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Every candidate is rigorously pre-evaluated so your team only interviews final-stage performers.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {funnel.map((f, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-mono shrink-0 ${f.color}`}>
                  {f.pct}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{f.stage}</h4>
                  <p className="text-xs text-slate-500 font-light mt-0.5">{f.desc}</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700 shrink-0 bg-white px-3 py-1 rounded-lg border border-slate-200">
                {f.volume}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

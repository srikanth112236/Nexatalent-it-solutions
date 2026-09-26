import React from 'react';
import { Target, ShieldCheck, Zap, Eye, Compass } from 'lucide-react';

export const AboutValuesCoreEthos: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Zero-Noise Curation',
      desc: 'We never flood hiring managers with 50 unvetted resumes. Clients review exactly 3 candidates per role, all verified to perform.',
    },
    {
      icon: Zap,
      title: 'Speed without Compromise',
      desc: '14-day standard turnaround for pre-vetted pods. We maintain an active, unreleased bench of senior architects ready to deploy.',
    },
    {
      icon: ShieldCheck,
      title: 'Radical Transparency',
      desc: 'Cost-plus fee architecture. You know exactly what the engineer takes home, what the real-estate costs, and what our margin is.',
    },
    {
      icon: Eye,
      title: 'Sovereign Alignment',
      desc: 'Your engineers are your engineers. We do not rotate talent across clients, and we do not insert intermediary project managers.',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>16 · Values & Core Institutional Ethos</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Guiding Principles</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Operational Principles</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            How We Protect Enterprise Hiring Standards
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-2xs shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base mb-1">{v.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

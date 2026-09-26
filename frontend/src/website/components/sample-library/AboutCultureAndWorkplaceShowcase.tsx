import React from 'react';
import { Sparkles, Terminal, Laptop, Coffee, HeartHandshake } from 'lucide-react';

export const AboutCultureAndWorkplaceShowcase: React.FC = () => {
  const perks = [
    {
      icon: Laptop,
      title: 'High-Spec Bare-Metal Hardware',
      desc: 'M3 Max MacBook Pros, dual 4K Studio Displays, and dedicated NVIDIA H100 remote compute instances.',
    },
    {
      icon: Terminal,
      title: 'Zero-Bureaucracy Engineering',
      desc: 'No middle-management translation layers. Direct sprint participation with US & European product architects.',
    },
    {
      icon: HeartHandshake,
      title: 'Institutional Equity Parity',
      desc: 'Direct parent company RSUs and stock options granted via Carta with standardized 4-year vesting cliffs.',
    },
    {
      icon: Coffee,
      title: 'Class-A Grade Workplace',
      desc: 'Indiranagar & Outer Ring Road tech hubs with private soundproof focus pods, barista cafes, and wellness suites.',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>20 · Culture, Environment & Workplace Experience</span>
        <span className="text-violet-600 bg-violet-50 px-2 py-0.5 rounded text-[10px]">Talent Magnetism</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top 1% Engineer Retention Driver</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            How We Maintain 99.4% Engineering Retention
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Tier-1 engineers don't leave when they are surrounded by world-class peers, high-impact problems, and institutional compensation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:bg-violet-50/40 hover:border-violet-300 transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-violet-600 mb-4 shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">{p.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{p.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-mono text-violet-600 font-semibold">
                  Standard GCC Inclusion
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

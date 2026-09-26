import React from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';

export const AboutCompanyTimelineEvolution: React.FC = () => {
  const milestones = [
    {
      year: '2021',
      title: 'Genesis: Retained Search for Unicorns',
      desc: 'Founded by tech MDs to solve chronic mis-hires in high-growth Bangalore engineering scaleups.',
      metric: '120 Placements',
    },
    {
      year: '2023',
      title: 'Pioneering Turnkey Sovereign GCCs',
      desc: 'Launched the 75-Day GCC delivery blueprint, building turnkey Indian subsidiaries for US software platforms.',
      metric: '1,500+ Engineers',
    },
    {
      year: '2024',
      title: 'Quant & Algorithmic Practice Expansion',
      desc: 'Opened London Bishopsgate desk, deploying low-latency C++ squads for top market makers and hedge funds.',
      metric: '18 Top Funds',
    },
    {
      year: '2026',
      title: 'The AI Infrastructure & Sovereign Era',
      desc: 'Over 10,000 engineers placed, 80+ enterprise GCC hubs operating, and $140M+ in collective client payroll managed.',
      metric: '80+ GCC Hubs',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>15 · Corporate Evolution Timeline</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Growth Milestones</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>5-Year Trajectory</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            From Boutique Search to Institutional GCC Standard
          </h2>
        </div>

        {/* Timeline Horizontal / Staggered Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {milestones.map((m, i) => (
            <div key={i} className="relative flex flex-col justify-between p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50/40 hover:border-blue-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-blue-600">{m.year}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 shadow-2xs">
                    {m.metric}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 leading-snug">{m.title}</h4>
                <p className="text-xs text-slate-500 font-light leading-relaxed">{m.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Milestone</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

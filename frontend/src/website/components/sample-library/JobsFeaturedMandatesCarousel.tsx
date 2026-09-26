import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const JobsFeaturedMandatesCarousel: React.FC = () => {
  const mandates = [
    {
      title: 'Principal Storage Engineer',
      clientType: 'US Cloud Infrastructure Unicorn ($9B)',
      comp: '₹85L Base + $120k US RSUs/yr',
      location: 'Bangalore · Hybrid',
      status: 'CONFIDENTIAL RETAINER',
      highlight: 'Directly designing distributed append-only storage engine.',
    },
    {
      title: 'VP of Platform Engineering',
      clientType: 'Global Tier-1 Payments Processor',
      comp: '₹1.4Cr CTC + Executive Carry',
      location: 'Hyderabad · On-Site',
      status: 'ACTIVE SEARCH',
      highlight: 'Leading 180-engineer multi-region payment core.',
    },
    {
      title: 'Senior Quant C++ Researcher',
      clientType: 'Tier-1 Quantitative Prop Trading Firm',
      comp: '£220k Base + 100% Target Bonus',
      location: 'London · City of London',
      status: 'TOP SECRET',
      highlight: 'Low-latency tick-to-trade algorithmic optimization.',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>32 · Featured Retained Mandates Spotlight</span>
        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">Confidential Searches</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive & Principal Retainers</span>
            </div>
            <h2 className="text-section-title font-bold text-white tracking-tight">
              Active Confidential Mandates
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md font-light leading-relaxed">
            These roles are not posted on public job boards. NexaTalent manages these client searches exclusively under mutual NDA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mandates.map((m, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                    {m.status}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                </div>

                <div className="text-xs font-mono text-slate-400 mb-1">{m.clientType}</div>
                <h4 className="font-bold text-white text-base mb-2 group-hover:text-amber-400 transition-colors">
                  {m.title}
                </h4>
                <div className="text-sm font-mono font-bold text-emerald-400 mb-3">{m.comp}</div>
                <p className="text-xs text-slate-400 leading-relaxed font-light mb-4">{m.highlight}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">{m.location}</span>
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Request NDA Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

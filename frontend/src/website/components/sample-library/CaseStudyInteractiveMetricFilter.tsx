import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const CaseStudyInteractiveMetricFilter: React.FC = () => {
  const [industry, setIndustry] = useState<'all' | 'fintech' | 'ai' | 'cloud'>('all');

  const studies = [
    {
      name: 'Global Investment Bank',
      industry: 'fintech',
      metric: '$22M Saved / yr',
      hub: 'Bangalore & London',
      scope: 'Turnkey 180-engineer algorithmic trading and risk analytics hub.',
    },
    {
      name: 'Generative AI Unicorn',
      industry: 'ai',
      metric: '32 Days to Launch',
      hub: 'Indiranagar Hub',
      scope: 'Post-training RLHF & synthetic data synthesis squad.',
    },
    {
      name: 'Public SaaS Enterprise ($12B)',
      industry: 'cloud',
      metric: '99.999% SRE Uptime',
      hub: 'Hyderabad Cyber Towers',
      scope: 'Multi-region Kubernetes cloud infrastructure and zero-trust security center.',
    },
    {
      name: 'High-Frequency Market Maker',
      industry: 'fintech',
      metric: '240ns Low Latency',
      hub: 'London & Bangalore',
      scope: 'C++23 bare-metal order routing and CME/Eurex exchange gateways.',
    },
  ];

  const filtered = industry === 'all' ? studies : studies.filter((s) => s.industry === industry);

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>44 · Interactive Case Study Industry Filter Deck</span>
        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">Client Proof Grid</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
              Verified Enterprise GCC Transformations
            </h2>
            <p className="text-xs text-slate-500 mt-1">Filter across industries and scale tiers.</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {(['all', 'fintech', 'ai', 'cloud'] as const).map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => setIndustry(ind)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  industry === ind ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {ind === 'all' ? 'All Industries' : ind}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-indigo-700">{s.industry}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    {s.metric}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">{s.name}</h4>
                <div className="text-xs text-slate-500 font-mono mb-3">{s.hub}</div>
                <p className="text-xs text-slate-600 font-light leading-relaxed">{s.scope}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                <span>Read Full Transformation Whitepaper</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

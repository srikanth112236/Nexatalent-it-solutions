import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

export const PricingTransparentTierCards: React.FC = () => {
  const tiers = [
    {
      name: 'Retained Executive Search',
      fee: '25% of Year-1 Base',
      desc: 'Exclusive, confidential search for Site Managing Directors, CTOs, and Principal Architects.',
      features: [
        'Dedicated Managing Partner lead',
        '14-Day shortlist delivery SLA',
        '12-Month free replacement warranty',
        'Comprehensive 360 reference audits',
      ],
      popular: false,
    },
    {
      name: 'Sovereign GCC Pods',
      fee: 'Cost-Plus 15%',
      desc: 'Turnkey 8-person squads with dedicated Class-A office space, hardware, and multi-currency payroll.',
      features: [
        'Direct employment & IP assignment',
        'Transparent engineer salary pass-through',
        '90-Day free candidate replacement',
        '75-Day complete turnkey launch',
      ],
      popular: true,
    },
    {
      name: 'Enterprise GCC Advisory',
      fee: 'Milestone-Based Retainer',
      desc: 'Full subsidiary incorporation, real estate lease negotiation, transfer pricing, and SEZ regulatory setup.',
      features: [
        'Wholly-owned Indian subsidiary setup',
        'Trilegal / Cooley legal compliance review',
        '100–500 seat campus leasing',
        'Ongoing transfer pricing & statutory audit',
      ],
      popular: false,
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>51 · Transparent Commercial Engagement Models</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Zero Hidden Fees</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Transparent, Predictable Commercial Terms
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            No markups disguised as "overhead". We operate on clear cost-plus and success-aligned retained search models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl flex flex-col justify-between border transition-all ${
                t.popular
                  ? 'bg-slate-950 text-white border-blue-500 shadow-xl shadow-blue-900/20'
                  : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-mono font-bold uppercase ${t.popular ? 'text-blue-400' : 'text-slate-500'}`}>
                    {t.name}
                  </span>
                  {t.popular && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-600 text-white font-bold">
                      Most Popular
                    </span>
                  )}
                </div>

                <div className={`text-2xl font-black font-mono mb-2 ${t.popular ? 'text-white' : 'text-slate-900'}`}>
                  {t.fee}
                </div>
                <p className={`text-xs mb-6 font-light leading-relaxed ${t.popular ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.desc}
                </p>

                <ul className="space-y-2.5 text-xs mb-6">
                  {t.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${t.popular ? 'text-blue-400' : 'text-emerald-600'}`} />
                      <span className={t.popular ? 'text-slate-300' : 'text-slate-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  t.popular ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md' : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <span>Select Engagement Model</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

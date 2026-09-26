import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DetailServiceLevelGuaranteeSla: React.FC = () => {
  const slas = [
    {
      metric: '14-Day Delivery SLA',
      target: 'Shortlist Delivery',
      desc: 'First calibrated slate of 3 top-tier candidates delivered within 14 calendar days of intake calibration.',
      penalty: '10% Fee Discount if missed',
    },
    {
      metric: '90-Day Free Replacement',
      target: 'Candidate Tenure',
      desc: 'If any placed engineer departs or fails performance reviews within 90 days, we replace them at zero additional cost.',
      penalty: '100% Free Replacement',
    },
    {
      metric: '75-Day GCC Turnkey Launch',
      target: 'Entity & Office Setup',
      desc: 'Complete turnkey infrastructure, incorporation, facility lease, and initial 50-person pod fully operational in 75 days.',
      penalty: 'Daily milestone liquidated damages',
    },
    {
      metric: '99.4% Offer Acceptance Rate',
      target: 'Closing Precision',
      desc: 'Because we pre-align compensation, RSUs, and candidate life goals upfront, offers are rarely declined.',
      penalty: 'Backed by pre-close commitments',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>25 · Service Level Agreements & Institutional Guarantees</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Contractual Commitments</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Contractually Enforced SLAs</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            We Put Our Retainers on the Line
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Every engagement includes unambiguous, legally binding SLAs backed by financial penalties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slas.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-emerald-700 uppercase">{s.target}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {s.penalty}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-2">{s.metric}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{s.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Legally Binding In Every Master Service Agreement</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

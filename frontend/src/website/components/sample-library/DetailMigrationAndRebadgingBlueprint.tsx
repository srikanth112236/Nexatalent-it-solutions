import React from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

export const DetailMigrationAndRebadgingBlueprint: React.FC = () => {
  const phases = [
    {
      phase: 'Phase 1 · Week 1-2',
      title: 'Talent Audit & Calibration',
      desc: 'Technical assessment of existing third-party vendor contractors. Identify high-performers for direct captive rebadging.',
    },
    {
      phase: 'Phase 2 · Week 3-4',
      title: 'Direct Captive Employment Offers',
      desc: 'Issue formalized offer letters from your GCC entity with calibrated compensation, equity upside, and continuity bonuses.',
    },
    {
      phase: 'Phase 3 · Week 5-6',
      title: 'IP & Hardware Handover',
      desc: 'Coordinated vendor contract sunsetting, hardware migration, and SOC-2 access credential re-enrollment.',
    },
    {
      phase: 'Phase 4 · Week 7-8',
      title: 'Sovereign Sprint Resumption',
      desc: '100% of institutional knowledge retained with zero days of production deployment downtime.',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>29 · Contractor Rebadging & Vendor Transition Blueprint</span>
        <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded text-[10px]">Zero Downtime</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-3">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Legacy Vendor Carve-Out</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Transition From Outsourced IT to a Direct Sovereign GCC
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Tired of paying massive 50% agency margins to legacy IT outsourcers? We seamlessly transition your best talent into your own entity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {phases.map((p, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-sky-700 block mb-2">{p.phase}</span>
                <h4 className="font-bold text-slate-900 text-sm mb-2">{p.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{p.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Production Interruption</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

export const CtaTalentBenchReserveDrawer: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>57 · High-Urgency Talent Bench Reservation Banner</span>
        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">Only 2 Pods Remaining</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Q3 Capacity Allocation</span>
          </div>
          <h2 className="text-section-title font-bold text-white tracking-tight">
            Reserve a Pre-Vetted SRE or AI Pod for Q3 Delivery
          </h2>
          <p className="text-xs text-slate-400 font-light max-w-xl">
            Due to strict quality screening, NexaTalent IT Solutions launches a maximum of 6 turnkey pods per quarter. 4 are currently under active client retainer.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-xs">
            <span className="text-slate-500 block">Remaining Slots</span>
            <span className="text-lg font-black text-amber-400">2 PODS</span>
          </div>
          <button
            type="button"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <span>Lock In Pod Allocation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};

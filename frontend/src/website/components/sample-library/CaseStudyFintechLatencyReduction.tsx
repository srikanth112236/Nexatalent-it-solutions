import React from 'react';
import { Zap, CheckCircle2 } from 'lucide-react';

export const CaseStudyFintechLatencyReduction: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>42 · Quant & HFT Latency Optimization Case Study</span>
        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">180ns Execution</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>London & Chicago Prop Trading Client</span>
            </div>
            <h2 className="text-section-title font-bold text-white tracking-tight">
              Re-Engineering an Options Matching Engine with 15 Elite Kernel Engineers
            </h2>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Facing fierce algorithmic latency competition on CME and Eurex, a London quantitative market maker retained NexaTalent to deploy an ultra low-latency C++23 kernel optimization pod in Bangalore.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-2xl font-black font-mono text-amber-400 block">-42%</span>
                <span className="text-xs text-slate-300">P99 Latency Reduction</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-2xl font-black font-mono text-emerald-400 block">180ns</span>
                <span className="text-xs text-slate-300">Kernel Bypass Latency</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-2xl font-black font-mono text-cyan-400 block">21 Days</span>
                <span className="text-xs text-slate-300">Squad Deployment Time</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="text-xs font-mono text-amber-400 uppercase">Architecture Highlights</div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Solarflare OpenOnload TCP stack bypass</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-allocation lock-free ring buffers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>AMD Xilinx UltraScale+ FPGA parser core</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

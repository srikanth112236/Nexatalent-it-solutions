import React from 'react';
import { Activity, Zap } from 'lucide-react';

export const FullScreenHorizontalSplitCurtainLaser: React.FC = () => {
  return (
    <section className="relative w-full py-20 px-6 md:px-16 bg-slate-50 text-slate-900 border-b border-slate-200 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-lg shadow-blue-500/10">
        <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
      </div>

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-4">
        <Zap className="w-3.5 h-3.5 text-blue-600" />
        <span>HIGH-FREQUENCY QUANT & SYSTEMS ENGINE</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
        Sub-Millisecond Quant Guild
      </h2>
      <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
        High-frequency trading algorithmic talent calibrated on custom FPGA hardware, DPDK packet ingestion, and order-book arbitration.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left font-mono w-full max-w-5xl">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="text-xs text-blue-600 font-bold mb-1">Tick-To-Trade Latency</div>
          <div className="text-2xl font-black text-slate-900">&lt; 840 Nanoseconds</div>
          <div className="text-xs text-slate-500 mt-2">Custom Solarflare OpenOnload Kernel</div>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="text-xs text-blue-600 font-bold mb-1">FPGA RTL Engineers</div>
          <div className="text-2xl font-black text-slate-900">46 Verified Leads</div>
          <div className="text-xs text-slate-500 mt-2">Xilinx UltraScale+ / Verilog Master</div>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="text-xs text-emerald-600 font-bold mb-1">GCC Cost Differential</div>
          <div className="text-2xl font-black text-emerald-600">-58% Net Spend</div>
          <div className="text-xs text-slate-500 mt-2">Delivered in 21 Days to Prod</div>
        </div>
      </div>
    </section>
  );
};

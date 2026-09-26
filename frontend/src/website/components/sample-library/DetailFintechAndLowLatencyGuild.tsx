import React from 'react';
import { Zap, Activity } from 'lucide-react';

export const DetailFintechAndLowLatencyGuild: React.FC = () => {
  const specs = [
    {
      metric: '340 Nanoseconds',
      title: 'Bare-Metal C++20/23 Systems',
      desc: 'Lock-free queues, cache-line packing, kernel bypass with Solarflare OpenOnload, and custom memory allocators.',
    },
    {
      metric: 'Sub-Microsecond',
      title: 'FPGA & Hardware Acceleration',
      desc: 'Verilog / VHDL synthesis, AMD Xilinx UltraScale+ development, and customized tick-to-trade algorithmic pipelines.',
    },
    {
      metric: '10M+ Msg / Sec',
      title: 'Exchange Gateways & Market Data',
      desc: 'Direct market access (DMA) protocol handlers for CME, NASDAQ (ITCH/OUCH), Eurex, and Tier-1 crypto venues.',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>27 · High-Frequency Trading & Low-Latency Guild</span>
        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">Quant Systems</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Ultra Low-Latency Practice</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            The Most Selective Quant Engineering Roster in India
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Engineered exclusively for global hedge funds, electronic market makers, and institutional investment banks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specs.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-xl font-black font-mono text-amber-600 block mb-2">{s.metric}</span>
                <h4 className="font-bold text-slate-900 text-sm mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{s.desc}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                <span>Verified in C++23 Benchmark Test</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

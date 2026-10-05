import React from 'react';
import { Zap, Activity } from 'lucide-react';

export const DetailFintechAndLowLatencyGuild: React.FC = () => {
  const specs = [
    {
      metric: '340 Nanoseconds',
      title: 'Bare-Metal C++ Systems',
      desc: 'Lock-free queues, cache optimization, kernel-bypass networking, and high-frequency trading infrastructure.',
    },
    {
      metric: 'Sub-Microsecond',
      title: 'FPGA & Hardware Acceleration',
      desc: 'Custom FPGA logic synthesis, hardware development, and real-time algorithmic execution pipelines.',
    },
    {
      metric: '10M+ Msg / Sec',
      title: 'Market Data & Gateways',
      desc: 'Direct market access (DMA) protocol handlers for global stock exchanges and banking networks.',
    },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] py-8 px-4 sm:px-8 border-y border-slate-200/80">
      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-extrabold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5 text-[#0265FF]" />
            <span>FINANCIAL TECHNOLOGY & QUANT SYSTEMS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            High-Performance Financial Engineering Practice
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 font-normal">
            Specialized engineering talent for financial institutions, trading platforms, and fintech leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specs.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#FAF8F5] border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-xl font-extrabold text-[#0265FF] block mb-2">{s.metric}</span>
                <h4 className="font-extrabold text-slate-900 text-sm mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{s.desc}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                <Activity className="w-3.5 h-3.5 text-[#0265FF]" />
                <span>Benchmarked Performance Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

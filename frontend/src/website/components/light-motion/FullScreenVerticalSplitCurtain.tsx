import React from 'react';
import { Radar, Compass } from 'lucide-react';

export const FullScreenVerticalSplitCurtain: React.FC = () => {
  return (
    <section className="relative w-full py-20 px-6 md:px-16 bg-white text-slate-900 border-b border-slate-200 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-lg shadow-emerald-500/10">
        <Radar className="w-8 h-8 text-emerald-600 animate-spin" style={{ animationDuration: '8s' }} />
      </div>

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold mb-4">
        <Compass className="w-3.5 h-3.5 text-emerald-600" />
        <span>NEXA MATCH™ · REAL-TIME TALENT ARBITRAGE RADAR</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
        Real-Time Engineering Coordinates
      </h2>
      <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
        Real-time candidate telemetry across Bengaluru Outer Ring Road, Hyderabad HITEC City, Pune Cybercity, and Delhi NCR tech corridors.
      </p>

      <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50 grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono w-full max-w-5xl">
        <div className="p-4 bg-white border border-slate-200 rounded-2xl">
          <div className="text-xs text-slate-500">Bengaluru Hub</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">240,000+</div>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-2xl">
          <div className="text-xs text-slate-500">Hyderabad Hub</div>
          <div className="text-2xl font-black text-blue-600 mt-1">185,000+</div>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-2xl">
          <div className="text-xs text-slate-500">Pune Hub</div>
          <div className="text-2xl font-black text-purple-600 mt-1">130,000+</div>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-2xl">
          <div className="text-xs text-slate-500">Delhi NCR Hub</div>
          <div className="text-2xl font-black text-teal-600 mt-1">115,000+</div>
        </div>
      </div>
    </section>
  );
};

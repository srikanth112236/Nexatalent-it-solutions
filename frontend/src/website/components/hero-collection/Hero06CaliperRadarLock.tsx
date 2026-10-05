import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, ArrowRight } from 'lucide-react';

export const Hero06CaliperRadarLock: React.FC = () => {
  const [lockedTarget, setLockedTarget] = useState<string>('Bangalore');

  const targets = [
    { city: 'Bangalore', role: 'Staff SRE & Distributed DB', pool: '2,400+ Candidates', latency: '14 Days' },
    { city: 'Hyderabad', role: 'GenAI & GPU Cluster Architects', pool: '1,800+ Candidates', latency: '16 Days' },
    { city: 'London', role: 'Fintech & Quant Leads', pool: '500+ Candidates', latency: '21 Days' },
    { city: 'Silicon Valley', role: 'Executive CXO Advisory', pool: 'Retained Roster', latency: '30 Days' },
  ];

  return (
    <div className="relative min-h-[90vh] bg-slate-950 text-white overflow-hidden flex items-center justify-center border-y border-slate-800">
      
      {/* Top & Bottom Caliper Clamping Bars */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900 border-b border-blue-500/30 flex items-center justify-between px-6 text-[10px] font-mono text-slate-400 z-20">
        <span>▲ UPPER CALIPER PIN: GEO-SEARCH RADAR</span>
        <span className="text-blue-400 font-bold">ACCURACY: 99.8% PRECISION</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-8 bg-slate-900 border-t border-blue-500/30 flex items-center justify-between px-6 text-[10px] font-mono text-slate-400 z-20">
        <span>▼ LOWER CALIPER ANCHOR: VERIFIED BENCH</span>
        <span className="text-emerald-400 font-bold">STATUS: LOCKED ON TARGET</span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Interactive Radar Circle */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-blue-500/30 flex items-center justify-center p-4">
            
            {/* Inner rings */}
            <div className="absolute inset-4 rounded-full border border-blue-500/20" />
            <div className="absolute inset-12 rounded-full border border-blue-500/20" />
            <div className="absolute inset-24 rounded-full border border-blue-500/20" />

            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-blue-500/20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-full w-px bg-blue-500/20" />
            </div>

            {/* Rotating Radar Sweep Needle */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 via-transparent to-transparent pointer-events-none"
            />

            {/* Center Lock Core */}
            <div className="relative z-10 p-5 rounded-2xl bg-slate-900 border border-blue-500/40 text-center shadow-xl max-w-[200px]">
              <Target className="w-6 h-6 text-blue-400 mx-auto mb-2 animate-pulse" />
              <div className="text-[10px] font-mono text-slate-400 uppercase">Target Hub</div>
              <div className="text-base font-extrabold text-white">{lockedTarget}</div>
              <div className="text-[10px] font-mono text-emerald-400 mt-1">● Caliper Calibrated</div>
            </div>

          </div>
        </div>

        {/* Right: Target Selection & Engagement */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-500/40 text-blue-300 text-xs font-mono">
            <Compass className="w-3.5 h-3.5" />
            <span>CALIPER PRECISION RECRUITMENT RADAR</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Pinpoint the Top 1% of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
              Global Engineering Talent
            </span>
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed font-light">
            Select a target global tech center to lock the caliper jaws onto verified engineer clusters with verified Git commit histories and algorithmic scores.
          </p>

          {/* Target Cards */}
          <div className="space-y-2 pt-2">
            {targets.map((t) => (
              <div 
                key={t.city}
                onClick={() => setLockedTarget(t.city)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  lockedTarget === t.city 
                    ? 'bg-blue-950/60 border-blue-500 text-white shadow-lg shadow-blue-950' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div>
                  <div className="text-xs font-bold flex items-center gap-2">
                    <span>{t.city}</span>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                      {t.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{t.pool}</div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-emerald-400 font-bold">{t.latency}</div>
                  <div className="text-[9px] text-slate-500">Intake SLA</div>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>Lock Requisition for {lockedTarget}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

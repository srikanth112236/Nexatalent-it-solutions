import React, { useState } from 'react';
import { Globe2, Plane, ArrowRight, Activity } from 'lucide-react';

export const Hero10GlobalOrbitalFlightpath: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<'sf-blr' | 'ldn-hyd' | 'sg-blr'>('sf-blr');

  const routes = {
    'sf-blr': { from: 'San Francisco', to: 'Bangalore', speed: '14 Days Intake', delta: '72% Cost Arbitrage', mandate: 'Staff Platform Eng' },
    'ldn-hyd': { from: 'London (Canary Wharf)', to: 'Hyderabad', speed: '18 Days Intake', delta: '65% Cost Arbitrage', mandate: 'Fintech FIX Protocol' },
    'sg-blr': { from: 'Singapore', to: 'Bangalore', speed: '12 Days Intake', delta: '60% Cost Arbitrage', mandate: 'GenAI LLM Pipeline' },
  };

  const current = routes[activeRoute];

  return (
    <div className="relative min-h-[92vh] bg-slate-950 text-white overflow-hidden flex items-center justify-center border-y border-slate-800">
      
      {/* Background Starfield / Orbital Ambient */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Orbital Flight Path Interactive Visualization */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-cyan-500/30 bg-slate-900/60 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md">
            
            {/* Orbital Arcs */}
            <div className="absolute inset-6 rounded-full border border-dashed border-cyan-500/20 animate-spin-slow pointer-events-none" />
            <div className="absolute inset-16 rounded-full border border-cyan-500/10 pointer-events-none" />

            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                ORBITAL TALENT FLIGHTPATH
              </span>
              <span>LIVE ARBITRAGE</span>
            </div>

            {/* Flight Path Arc Indicator */}
            <div className="text-center space-y-2 my-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                <Plane className="w-3.5 h-3.5" />
                <span>{current.from} ➔ {current.to}</span>
              </div>
              <div className="text-3xl font-black text-white">{current.delta}</div>
              <div className="text-xs text-slate-400 font-mono">Target Mandate: <strong className="text-cyan-400">{current.mandate}</strong></div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-2">
              <span>LATENCY: ZERO JETLAG (24/7 OVERLAP)</span>
              <span className="text-emerald-400">● 100% OPERATIONAL</span>
            </div>

          </div>
        </div>

        {/* Right Column: Routing Controls & Proposition */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>GLOBAL TALENT ARBITRAGE CORRIDOR</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Connect HQ to GCC in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
              Sub-Millisecond Synchrony
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 font-light leading-relaxed">
            Eliminate geographical boundaries. We configure round-the-clock follow-the-sun engineering teams across prime talent corridors with verified equity compensation models.
          </p>

          {/* Route selector buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { id: 'sf-blr', name: 'SF ➔ BLR', sub: 'Silicon Valley' },
              { id: 'ldn-hyd', name: 'LDN ➔ HYD', sub: 'London Canary' },
              { id: 'sg-blr', name: 'SG ➔ BLR', sub: 'Singapore APAC' },
            ].map((route) => (
              <button
                key={route.id}
                type="button"
                onClick={() => setActiveRoute(route.id as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  activeRoute === route.id 
                    ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-lg shadow-cyan-950' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold font-mono">{route.name}</div>
                <div className="text-[10px] text-slate-500">{route.sub}</div>
              </button>
            ))}
          </div>

          <button 
            type="button"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>Activate Corridor Pipeline ({current.from})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

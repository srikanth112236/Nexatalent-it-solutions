import React, { useState } from 'react';
import { Sliders, ArrowRight, Clock, Building } from 'lucide-react';

export const Hero13InteractivePodConfigurator: React.FC = () => {
  const [seats, setSeats] = useState(120);

  // Dynamic calculations based on seats
  const setupDays = Math.round(45 + (seats / 500) * 45); // 45 to 90 days
  const annualSavingsUsd = (seats * 145000).toLocaleString();
  const leadsCount = Math.max(2, Math.round(seats / 25));
  const sresCount = Math.round(seats * 0.4);
  const coreDevCount = seats - leadsCount - sresCount;

  return (
    <div className="relative min-h-[92vh] bg-white text-slate-900 overflow-hidden flex items-center justify-center border-y border-slate-200">
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headline & Value Narrative */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold">
            <Sliders className="w-3.5 h-3.5" />
            <span>REAL-TIME INTERACTIVE POD CONFIGURATOR</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Design Your Global Pod in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              60 Seconds Flat.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Drag the headcount slider to calculate instantaneous turnkey ramp duration, capital savings compared to Silicon Valley, and squad distribution.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-500 font-bold">ANNUAL PROJECTED SAVINGS:</span>
              <span className="text-emerald-600 font-black text-base">${annualSavingsUsd} USD</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(seats / 500) * 100}%` }}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <button 
              type="button"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-lg shadow-slate-900/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Lock Configuration & Reserve Bench</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Slider & Pod Matrix HUD */}
        <div className="lg:col-span-6">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-mono font-bold text-slate-600">HEADCOUNT SELECTOR</span>
              <span className="text-2xl font-black text-blue-600">{seats} Engineering Seats</span>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input 
                type="range" 
                min="25" 
                max="500" 
                step="5"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>25 SEATS (PILOT)</span>
                <span>250 SEATS (CAMPUS)</span>
                <span>500 SEATS (MEGA-HUB)</span>
              </div>
            </div>

            {/* Dynamic Output Cards */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="text-slate-400 text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span>TOTAL RAMP TIME</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">{setupDays} Calendar Days</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Includes legal incorporation</div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="text-slate-400 text-[10px] flex items-center gap-1">
                  <Building className="w-3 h-3 text-indigo-600" />
                  <span>CLASS-A REAL ESTATE</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">{(seats * 65).toLocaleString()} Sq Ft</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Bangalore / Hyderabad</div>
              </div>
            </div>

            {/* Squad Distribution Breakdown */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                Synthesized Squad Architecture
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Principal Technical Directors & Staff Leads:</span>
                <strong className="font-mono text-blue-600">{leadsCount} Heads</strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Distributed SRE & Platform Specialists:</span>
                <strong className="font-mono text-blue-600">{sresCount} Heads</strong>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Full-Stack & Backend Product Engineers:</span>
                <strong className="font-mono text-blue-600">{coreDevCount} Heads</strong>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { TrendingUp, Play, FileText } from 'lucide-react';

export const Hero20InstitutionalMediaBrief: React.FC = () => {
  return (
    <div className="relative min-h-[92vh] bg-slate-900 text-white overflow-hidden flex items-center justify-center border-y border-slate-800">
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Macroeconomic Brief */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>GLOBAL ECONOMIC FORUM GCC REPORT • 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
            The Macroeconomic Flight to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              High-Conviction Captives
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-lg">
            Over $120B in enterprise technology engineering is transitioning from third-party IT outsourcing to autonomous GCC centers. NexaTalent IT Solutions is the institutional advisor of choice.
          </p>

          <div className="pt-2 grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 text-xs font-mono">
            <div>
              <div className="text-2xl font-black text-white">$120B</div>
              <div className="text-slate-400 text-[10px]">Market Migration</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">68%</div>
              <div className="text-slate-400 text-[10px]">Net Cost Delta</div>
            </div>
            <div>
              <div className="text-2xl font-black text-cyan-400">1,800+</div>
              <div className="text-slate-400 text-[10px]">Active Hubs</div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button 
              type="button"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Download Institutional Whitepaper</span>
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Executive Video Brief Card */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl relative group">
            
            {/* Video Thumbnail */}
            <div className="relative h-64 sm:h-72 bg-slate-800 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80" 
                alt="Executive Interview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-slate-950 ml-1" />
                </div>
              </div>
            </div>

            {/* Video Meta Info */}
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>EXECUTIVE BRIEFING · 12 MIN</span>
                <span className="text-emerald-400 font-bold">VERIFIED INSIGHT</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">
                Why Fortune 100 CTOs Are Moving From Outsourcers to 100% Owned Captives
              </h4>
              <p className="text-xs text-slate-400">
                Keynote address featuring Managing Director of NexaScale Capital Advisory.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

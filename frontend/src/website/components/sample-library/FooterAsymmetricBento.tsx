import React from 'react';
import { ArrowUpRight, Clock, Heart, Sparkles } from 'lucide-react';

export const FooterAsymmetricBento: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>07 · Asymmetric Bento-Grid Footer</span>
        <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-[10px]">Modular Bento Architecture</span>
      </div>

      <footer className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-slate-800">
        
        {/* Bento Box 1: Brand & Thesis (Span 2) */}
        <div className="md:col-span-2 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Sovereign Architecture</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Transforming Engineering Arbitrage into Sovereign Advantage.
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg font-light">
              NexaTalent partners with institutional private equity, public tech enterprises, and tier-1 scaleups to deploy sovereign engineering centers with zero execution drag.
            </p>
          </div>
          <div className="pt-6 flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>© 2026 NEXATALENT</span>
            <span>•</span>
            <span>SOC 2 CERTIFIED</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-rose-500"><Heart className="w-3 h-3 fill-current" /> BLR + SF</span>
          </div>
        </div>

        {/* Bento Box 2: Live Timezones */}
        <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase tracking-wider mb-4">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Global Dispatch Clocks</span>
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-400">San Francisco (PST)</span>
                <span className="text-white font-bold">07:22 AM</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-400">London (GMT)</span>
                <span className="text-white font-bold">03:22 PM</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Bangalore (IST)</span>
                <span className="text-emerald-400 font-bold">08:52 PM</span>
              </div>
            </div>
          </div>
          <div className="pt-4 text-[11px] text-slate-400">
            24/7 Global Follow-the-Sun Mandate Sourcing
          </div>
        </div>

        {/* Bento Box 3: Quick Action Launchpad */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex flex-col justify-between shadow-lg shadow-blue-600/20">
          <div>
            <span className="text-[11px] font-mono tracking-widest uppercase text-blue-200">Executive Concierge</span>
            <h4 className="text-lg font-bold mt-1 text-white">Retain A Pod In 72 Hours</h4>
            <p className="text-xs text-blue-100/80 mt-2 leading-relaxed font-light">
              Skip traditional 6-month recruiting cycles with pre-vetted senior squads.
            </p>
          </div>
          <button 
            type="button"
            className="w-full mt-6 py-2.5 px-4 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center justify-between hover:bg-blue-50 transition-all cursor-pointer"
          >
            <span>Book Consultation</span>
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>

      </footer>
    </div>
  );
};

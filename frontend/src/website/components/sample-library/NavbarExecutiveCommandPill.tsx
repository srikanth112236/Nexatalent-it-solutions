import React, { useState } from 'react';
import { Command, Sparkles, UserCheck, ShieldAlert } from 'lucide-react';

export const NavbarExecutiveCommandPill: React.FC = () => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>03 · Executive Command Pill Navbar</span>
        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">Floating Command Center</span>
      </div>

      <div className="flex justify-center">
        <header className="inline-flex items-center gap-2 p-1.5 rounded-full bg-slate-950 text-white shadow-2xl shadow-slate-950/30 border border-slate-800 backdrop-blur-xl max-w-full">
          {/* Brand Icon */}
          <div className="flex items-center gap-2 pl-3 pr-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black text-xs">
              N
            </div>
            <span className="font-bold text-xs tracking-tight text-white hidden sm:inline">NexaTalent</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Quick Links */}
          <div className="flex items-center gap-1 text-xs">
            <a href="#gcc" className="px-3 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              Sovereign GCC
            </a>
            <a href="#leadership" className="px-3 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              Leadership
            </a>
            <a href="#compensation" className="px-3 py-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
              Arbitrage
            </a>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* ⌘K Trigger */}
          <button
            type="button"
            onClick={() => setPaletteOpen(!paletteOpen)}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <Command className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">Command</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">⌘K</kbd>
          </button>

          {/* Direct Concierge Trigger */}
          <button 
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Retain Us</span>
          </button>
        </header>
      </div>

      {/* Simulated Command Palette Drawer */}
      {paletteOpen && (
        <div className="mt-4 max-w-lg mx-auto p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-2xl">
          <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
            <span>QUICK EXECUTIVE DISPATCH</span>
            <span className="text-[10px] text-amber-400">ESC to close</span>
          </div>
          <div className="space-y-1.5">
            {[
              { icon: UserCheck, title: 'Deploy Bangalore SRE Squad', meta: 'Turnkey • 14 days' },
              { icon: ShieldAlert, title: 'Request Confidential C-Suite Mandate', meta: 'NDA Protected' },
              { icon: Sparkles, title: 'Generate 2026 GCC Cost Arbitrage Model', meta: 'Instant Excel/PDF' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 cursor-pointer transition-all">
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-slate-200">{item.title}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{item.meta}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

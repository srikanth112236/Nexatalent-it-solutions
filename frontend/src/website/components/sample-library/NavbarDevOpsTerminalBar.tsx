import React from 'react';
import { Terminal, GitBranch, Activity, Cpu, ArrowRight } from 'lucide-react';

export const NavbarDevOpsTerminalBar: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>05 · DevOps & Terminal Engineering Header</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Real-Time SRE Telemetry</span>
      </div>

      <header className="max-w-7xl mx-auto bg-slate-950 text-slate-200 border border-slate-800 rounded-2xl shadow-xl overflow-hidden font-mono text-xs">
        <div className="px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Terminal Prompt Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-center gap-2 pl-2 text-emerald-400 font-bold">
              <Terminal className="w-4 h-4" />
              <span>nexatalent.internal</span>
            </div>
            <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
              <GitBranch className="w-3 h-3 text-emerald-400" />
              <span>v2.8-prod</span>
            </div>
          </div>

          {/* Center: Live Telemetry Badges */}
          <div className="hidden lg:flex items-center gap-6 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Active SRE Squads: <strong className="text-white">48 Pods</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Avg Latency: <strong className="text-white">18.4ms</strong></span>
            </div>
            <div>
              <span>Placement Uptime: <strong className="text-emerald-400">99.98%</strong></span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <a href="#docs" className="text-slate-400 hover:text-white transition-colors text-xs hidden sm:inline">
              $ man nexatalent
            </a>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>$ deploy --pod-sre</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </header>
    </div>
  );
};

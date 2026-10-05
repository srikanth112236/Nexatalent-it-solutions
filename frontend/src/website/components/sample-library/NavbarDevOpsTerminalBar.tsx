import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, GitBranch, Activity, Cpu, ArrowRight, ChevronDown, Check, Copy } from 'lucide-react';
import { Logo } from '../Logo';

export const NavbarDevOpsTerminalBar: React.FC<{ bare?: boolean }> = ({ bare = false }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menuName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={bare ? 'w-full relative z-10' : 'w-full bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs relative z-10'}>
      {!bare && (
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          05 · DevOps & Terminal Engineering Header
        </span>
        <span className="text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded text-[10px] font-bold">
          Interactive CLI Flyouts & Real-Time SRE Telemetry
        </span>
      </div>
      )}

      <header 
        className="max-w-7xl mx-auto bg-slate-950 text-slate-200 border border-slate-800 rounded-2xl shadow-xl shadow-slate-900/30 font-mono text-xs relative"
        onMouseEnter={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }}
        onMouseLeave={handleMouseLeave}
      >
        <div className="px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 relative">
          
          {/* Left: Terminal Prompt Brand */}
          <div className="flex items-center gap-3">
            <a href="/" aria-label="NexaTalent IT Solutions home" className="shrink-0">
              <Logo height={26} onDark />
            </a>
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

          {/* Center: Live Telemetry Badges with hover drawers */}
          <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-400">
            
            {/* Pods drawer trigger */}
            <div 
              className="relative py-1"
              onMouseEnter={() => handleMouseEnter('pods')}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'pods' ? null : 'pods')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeMenu === 'pods' ? 'bg-slate-900 text-emerald-400' : 'hover:bg-slate-900/60 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Pods: <strong className="text-white">48 Active</strong></span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === 'pods' ? 'rotate-180 text-emerald-400' : 'text-slate-600'}`} />
              </button>
            </div>

            {/* Latency drawer trigger */}
            <div 
              className="relative py-1"
              onMouseEnter={() => handleMouseEnter('telemetry')}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'telemetry' ? null : 'telemetry')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeMenu === 'telemetry' ? 'bg-slate-900 text-cyan-400' : 'hover:bg-slate-900/60 hover:text-slate-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Latency: <strong className="text-white">18.4ms</strong></span>
                <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === 'telemetry' ? 'rotate-180 text-cyan-400' : 'text-slate-600'}`} />
              </button>
            </div>

            <div className="px-2 py-1 text-slate-400">
              <span>SLA: <strong className="text-emerald-400">99.98%</strong></span>
            </div>
          </div>

          {/* Right: Actions with Manual trigger */}
          <div className="flex items-center gap-3">
            <div 
              className="relative py-1"
              onMouseEnter={() => handleMouseEnter('docs')}
            >
              <button
                type="button"
                onClick={() => setActiveMenu(activeMenu === 'docs' ? null : 'docs')}
                className={`text-xs transition-colors px-2.5 py-1 rounded-lg cursor-pointer hidden sm:flex items-center gap-1 ${
                  activeMenu === 'docs' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>$ man nexatalent</span>
                <ChevronDown className={`w-3 h-3 ${activeMenu === 'docs' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => copyCommand('npx nexatalent deploy --pod-sre --seats 24')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{copiedCmd ? 'Copied CLI Command!' : '$ deploy --pod-sre'}</span>
              {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <ArrowRight className="w-3 h-3" />}
            </button>
          </div>

        </div>

        {/* Terminal Flyouts on Hover */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.14 }}
              className="absolute left-0 right-0 top-full pt-1 z-50"
              onMouseEnter={() => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = null;
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div className="h-2 w-full bg-transparent" />
              
              <div className="mx-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-black/80">
                
                {/* 1. Pods Drawer */}
                {activeMenu === 'pods' && (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-3">
                      <span className="text-emerald-400 font-bold flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" />
                        ACTIVE CLUSTERS & POD STATUS
                      </span>
                      <span>48 Pods Across 3 Continents</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                        <div className="text-slate-400 text-[10px]">CLUSTER: BLR-01</div>
                        <div className="text-white font-bold text-sm mt-0.5">24 SRE & Quant Pods</div>
                        <div className="text-emerald-400 text-[11px] mt-1">● 100% Health • 0 Incidents</div>
                      </div>
                      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                        <div className="text-slate-400 text-[10px]">CLUSTER: HYD-02</div>
                        <div className="text-white font-bold text-sm mt-0.5">18 AI Post-Training Pods</div>
                        <div className="text-emerald-400 text-[11px] mt-1">● 100% Health • H100 Cluster</div>
                      </div>
                      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                        <div className="text-slate-400 text-[10px]">CLUSTER: LDN-01</div>
                        <div className="text-white font-bold text-sm mt-0.5">6 Fintech Fix Protocol Pods</div>
                        <div className="text-emerald-400 text-[11px] mt-1">● 100% Health • Low Jitter</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Telemetry Drawer */}
                {activeMenu === 'telemetry' && (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-3">
                      <span className="text-cyan-400 font-bold flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5" />
                        NETWORK & CANDIDATE LATENCY TELEMETRY
                      </span>
                      <span>Updated every 500ms</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">DNS Resolution</div>
                        <div className="text-white font-bold text-base mt-1">4.2ms</div>
                      </div>
                      <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">Interview Turnaround</div>
                        <div className="text-cyan-400 font-bold text-base mt-1">48 Hrs</div>
                      </div>
                      <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">Vetting Accuracy</div>
                        <div className="text-emerald-400 font-bold text-base mt-1">99.4%</div>
                      </div>
                      <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800">
                        <div className="text-[10px] text-slate-400">Packet Jitter</div>
                        <div className="text-white font-bold text-base mt-1">&lt;0.8ms</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Docs & CLI Manual Drawer */}
                {activeMenu === 'docs' && (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-3">
                      <span className="text-white font-bold">$ man nexatalent (CLI Reference)</span>
                      <span className="text-[10px] text-slate-500">Click command to copy</span>
                    </div>
                    <div className="space-y-1.5 font-mono text-xs">
                      {[
                        { cmd: 'npx nexatalent requisition --role staff-sre --geo blr', desc: 'Instant 72-hour sourcing pipeline trigger' },
                        { cmd: 'npx nexatalent audit --ip-vault --soc2', desc: 'Run zero-trust security & NDA validation check' },
                        { cmd: 'npx nexatalent arbitrage --comp-report 2026', desc: 'Download comprehensive PPP GCC salary model' },
                      ].map((item, i) => (
                        <div
                          key={i}
                          onClick={() => copyCommand(item.cmd)}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-900 hover:bg-slate-800/80 border border-slate-800/80 cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">&gt;</span>
                            <span className="text-white text-xs group-hover:text-emerald-300">{item.cmd}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                            <span className="hidden md:inline">{item.desc}</span>
                            <Copy className="w-3 h-3 group-hover:text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>
    </div>
  );
};

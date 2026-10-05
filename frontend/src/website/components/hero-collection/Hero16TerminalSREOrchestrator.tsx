import React, { useState } from 'react';
import { Terminal, Play } from 'lucide-react';

export const Hero16TerminalSREOrchestrator: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState([
    '$ nexactl cluster status --hub blr-01',
    '[OK] Cluster connected: 48 active pods across Bangalore & Hyderabad',
    '[OK] Average P99 latency: 14.2ms to AWS us-east-1 via DirectConnect',
    '[OK] Total verified staff engineers on standby: 240 seats',
  ]);

  const runDeploy = () => {
    setRunning(true);
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        '$ nexactl deploy --pod-sre --seats 24 --geo blr',
        '>>> Provisioning air-gapped VPC subnet...',
        '>>> Allocating 24 pre-vetted senior SRE engineers...',
        '[SUCCESS] Pod deployed. First PR turnaround SLA: < 48 hours.',
      ]);
      setRunning(false);
    }, 1000);
  };

  return (
    <div className="relative min-h-[92vh] bg-slate-950 text-white font-mono overflow-hidden flex items-center justify-center border-y border-slate-800">
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Headline */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <Terminal className="w-3.5 h-3.5" />
            <span>SRE & INFRASTRUCTURE ORCHESTRATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-mono">
            $ nexactl deploy <br />
            <span className="text-emerald-400">
              --sre-pod --seats 50
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
            Eliminate traditional recruiter phone screens. We deploy production-ready Site Reliability Engineering squads with verified incident post-mortem scores.
          </p>

          <div className="flex items-center gap-4 pt-2 font-sans">
            <button 
              type="button"
              onClick={runDeploy}
              disabled={running}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer font-mono"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>{running ? 'PROVISIONING...' : '$ RUN DEPLOY COMMAND'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Terminal Window */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl bg-black border border-slate-800 shadow-2xl overflow-hidden text-xs">
            
            {/* Window titlebar */}
            <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-400 text-[11px] ml-2">bash ~ nexactl (production cluster)</span>
              </div>
              <div className="text-[10px] text-emerald-400">● 99.99% UP</div>
            </div>

            {/* Terminal Body */}
            <div className="p-5 space-y-2 h-72 overflow-y-auto font-mono text-[11px] leading-relaxed">
              {logs.map((log, i) => (
                <div key={i} className={log.startsWith('$') ? 'text-emerald-400 font-bold' : log.includes('[SUCCESS]') ? 'text-emerald-300 font-bold bg-emerald-950/40 p-1.5 rounded' : 'text-slate-400'}>
                  {log}
                </div>
              ))}
              <div className="flex items-center gap-1 text-emerald-400">
                <span>&gt;</span>
                <span className="w-2 h-4 bg-emerald-400 animate-pulse inline-block" />
              </div>
            </div>

            {/* Bottom SRE Stats */}
            <div className="bg-slate-900/60 p-3 border-t border-slate-800 flex justify-between text-[10px] text-slate-500 font-mono">
              <span>ACTIVE CLUSTERS: BLR, HYD, LDN</span>
              <span>MEAN INCIDENT RECOVERY: 4.8 MIN</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

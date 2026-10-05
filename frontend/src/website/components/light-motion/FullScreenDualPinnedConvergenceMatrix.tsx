import React from 'react';
import { Cpu, Network, ArrowRightLeft, Sparkles } from 'lucide-react';

export const FullScreenDualPinnedConvergenceMatrix: React.FC = () => {
  return (
    <section className="relative w-full py-20 px-6 md:px-16 bg-slate-50 text-slate-900 border-b border-slate-200 flex flex-col items-center justify-center text-center">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEXA DEMAND-SUPPLY CONVERGENCE MATRIX</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Synchronized Talent Matching Pipeline
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Enterprise demand mandates dynamically synchronized with our pre-vetted senior candidate supply pool in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">Enterprise Demand Hub</h4>
                <p className="text-xs text-slate-500">GCC & Global Tech Hiring Specs</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated parsing of tech stack requirements, seniority levels, timezone overlap criteria, and headcount budgets.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">Vetted Talent Supply Node</h4>
                <p className="text-xs text-slate-500">50,000+ Pre-Evaluated Engineers</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vetted candidates with verified algorithmic code scores, system architecture defenses, and English fluency clearances.
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-mono font-bold shadow-lg">
          <ArrowRightLeft className="w-4 h-4" />
          <span>72-HOUR AUTOMATED MATCHING CYCLE ACTIVE</span>
        </div>
      </div>
    </section>
  );
};

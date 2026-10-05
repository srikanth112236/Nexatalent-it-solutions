import React from 'react';
import { Database, Unlock } from 'lucide-react';

export const FullScreenSplitDivergenceExecutive: React.FC = () => {
  return (
    <section className="relative w-full py-20 px-6 md:px-16 bg-slate-50 text-slate-900 border-b border-slate-200 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-lg shadow-blue-500/10">
        <Database className="w-8 h-8 text-blue-600" />
      </div>

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-4">
        <Unlock className="w-3.5 h-3.5 text-emerald-600" />
        <span>EXECUTIVE TALENT VAULT ACCESS</span>
      </div>

      <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
        Executive Talent Vault Unlocked
      </h2>
      <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
        Accredited enterprise clients get direct access to our tier-1 engineering leadership pool with validated background checks and non-compete passes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-5xl">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="text-xs font-mono text-slate-500">Assessed Profiles</div>
          <div className="text-2xl font-black text-slate-900 mt-1">Principal Pipeline</div>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="text-xs font-mono text-slate-500">Tenure Support</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">Joining to Settling</div>
        </div>
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="text-xs font-mono text-slate-500">Placement Governance</div>
          <div className="text-2xl font-black text-blue-600 mt-1">Audit-Trailed Flow</div>
        </div>
      </div>
    </section>
  );
};

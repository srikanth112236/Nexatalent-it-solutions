import React from 'react';
import { Building2, UserCheck, ArrowRight } from 'lucide-react';

export const CtaDualActionPortalGateway: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>59 · Bilateral Audience Gateway Split</span>
        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">Client vs Candidate</span>
      </div>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* For Employers */}
        <div className="p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono uppercase text-blue-400 font-bold tracking-wider">For Technology Leaders</span>
            <h3 className="text-2xl font-bold text-white mt-1 mb-2">I Want to Build an Engineering Pod</h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed mb-6">
              Deploy sovereign squads, launch a turnkey Indian subsidiary in 75 days, or retain executive managing directors.
            </p>
          </div>
          <button 
            type="button"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-600/30"
          >
            <span>Retain Us For Engineering Talent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* For Candidates */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-4">
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono uppercase text-emerald-700 font-bold tracking-wider">For Senior & Staff Engineers</span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 mb-2">I Want to Join a Tier-1 GCC Mandate</h3>
            <p className="text-xs text-slate-500 font-light leading-relaxed mb-6">
              Access unposted confidential mandates, US dollar RSU equity grants, and personal career representation.
            </p>
          </div>
          <button 
            type="button"
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Explore Retained Roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};

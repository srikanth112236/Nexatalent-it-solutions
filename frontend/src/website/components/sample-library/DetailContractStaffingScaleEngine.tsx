import React from 'react';
import { Zap, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DetailContractStaffingScaleEngine: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>23 · On-Demand Contract Staffing Engine</span>
        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">72-Hour Rapid Burst</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Rapid Elastic Burst Staffing</span>
            </div>
            <h2 className="text-section-title font-bold text-white tracking-tight">
              Scale Up 20 Engineers in 72 Hours. Zero Severance Liabilities.
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md font-light leading-relaxed">
            Need urgent surge capacity for a major enterprise release, migration, or security remediation? NexaTalent IT Solutions’s pre-vetted contractor bench deploys instantaneously.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-6 h-6 text-amber-400" />
                <span className="text-xs font-mono text-slate-500">STAGE I</span>
              </div>
              <h4 className="font-bold text-white text-base mb-2">Structured Fast-Start Onboarding</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Candidates arrive with documented background checks, NDA sign-offs, and provisioned work endpoints.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-amber-400 font-semibold">
              Day-1 Readiness Checklist
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-xs font-mono text-slate-500">STAGE II</span>
              </div>
              <h4 className="font-bold text-white text-base mb-2">Flexible Contract-to-Hire</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Convert contractors to permanent team members per agreed terms with documented conversion options.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-emerald-400 font-semibold">
              Documented Conversion Terms
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                <span className="text-xs font-mono text-slate-500">STAGE III</span>
              </div>
              <h4 className="font-bold text-white text-base mb-2">Managed EOR & Tax Remittance</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                NexaTalent IT Solutions acts as the Employer of Record, coordinating statutory provident fund, gratuity, and health insurance obligations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-cyan-400 font-semibold">
              Documented Compliance Cover
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

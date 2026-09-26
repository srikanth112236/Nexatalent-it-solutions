import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CaseStudyHealthcareAiCompliance: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>43 · HealthTech & Regulated Clinical AI Case Study</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">HIPAA & FDA Compliant</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>US Clinical Diagnostics Unicorn</span>
            </div>
            <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
              Deploying a Zero-Trust Clinical AI Pod Under FDA 21 CFR Part 11
            </h2>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              Medical device and healthcare software requires uncompromising regulatory rigor. NexaTalent placed an entire 18-person Bangalore clinical ML engineering team operating within air-gapped VPCs and SOC-2 Type II audit regimes.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl font-black font-mono text-emerald-600 block">100%</span>
                <span className="text-xs text-slate-700">Audit Compliance</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl font-black font-mono text-blue-600 block">0</span>
                <span className="text-xs text-slate-700">Security Breaches</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl font-black font-mono text-slate-900 block">18</span>
                <span className="text-xs text-slate-700">Specialist Placements</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <span className="text-xs font-mono text-slate-500 uppercase">Compliance Badges</span>
            <div className="space-y-2 text-xs font-medium text-slate-800">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>HIPAA BAA Signed Under US Delaware Entity</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>FDA 21 CFR Part 11 Software Validation</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted Dedicated Fiber Infrastructure</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

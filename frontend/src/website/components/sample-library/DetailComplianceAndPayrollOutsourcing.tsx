import React from 'react';
import { DollarSign, CheckCircle2 } from 'lucide-react';

export const DetailComplianceAndPayrollOutsourcing: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>28 · Employer of Record (EOR) & Multi-Currency Payroll</span>
        <span className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded text-[10px]">Turnkey Compliance</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Full EOR Shield</span>
            </div>
            <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
              Hire in India Without Incorporating a Local Entity
            </h2>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              Want to deploy your first 15 engineers before incorporating a wholly-owned subsidiary? 
              NexaTalent IT Solutions acts as the Employer of Record, managing all local tax, statutory provident fund (EPF), 
              health benefits, and multi-currency payroll under our legal umbrella.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700 pt-2">
              {[
                'Automated monthly salary disbursement in INR with automated tax withholding',
                'Comprehensive group medical insurance (₹10L coverage + parents)',
                '100% intellectual property assignment back to client parent entity',
                'Seamless transition to your own entity once incorporated (Zero friction transfer)',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-mono text-slate-400">Monthly EOR Administration</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800">
                Guaranteed Compliance
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Statutory Provident Fund (EPF):</span>
                <span className="text-white">100% Managed & Remitted</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Gratuity Trust Funding:</span>
                <span className="text-white">Escrow Segregated</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Professional Tax (Karnataka/Telangana):</span>
                <span className="text-white">State Remittance Automated</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800/80">
                <span className="text-slate-400">Cross-Border Invoicing:</span>
                <span className="text-emerald-400 font-bold">Single Monthly USD Invoice</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-light">
              Clients receive one consolidated monthly invoice in USD or GBP. We settle all local statutory vendors.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

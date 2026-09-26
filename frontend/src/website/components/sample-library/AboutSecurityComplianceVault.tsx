import React from 'react';
import { ShieldCheck, Lock, FileText, Download } from 'lucide-react';

export const AboutSecurityComplianceVault: React.FC = () => {
  const certs = [
    {
      title: 'SOC-2 Type II Certified',
      auditor: 'Ernst & Young LLP (Annual Continuous Audit)',
      scope: 'Trust Services Criteria: Security, Availability, and Confidentiality of talent systems.',
      validity: 'Valid Through 2027',
    },
    {
      title: 'ISO 27001:2022 ISMS',
      auditor: 'BSI Group Verification Body',
      scope: 'Information Security Management for all corporate offices, endpoint hardware, and cloud repositories.',
      validity: 'Active Audit Cycle',
    },
    {
      title: '100% Direct IP Assignment',
      auditor: 'Cooley LLP & Trilegal Vetted',
      scope: 'Tri-party IP assignment deeds vesting 100% of all software, models, and artifacts directly in the client entity.',
      validity: 'Institutional Enforceability',
    },
    {
      title: 'FEMA & Cross-Border Tax Escrow',
      auditor: 'Reserve Bank of India (RBI) Authorized Dealer Bank Rails',
      scope: 'Standardized transfer pricing, arm’s length documentation, and automated withholding tax remittance.',
      validity: 'Fully Compliant',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>19 · Security, Governance & Regulatory Compliance Vault</span>
        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">Zero Risk Profile</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>Institutional Governance Escrow</span>
            </div>
            <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
              Enterprise Risk Elimination Blueprint
            </h2>
          </div>
          <button 
            type="button"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Compliance Packet (PDF)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certs.map((c, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {c.validity}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-500 mb-2">Auditor: {c.auditor}</div>
                <p className="text-xs text-slate-600 font-light leading-relaxed">{c.scope}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>View Verification Summary</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

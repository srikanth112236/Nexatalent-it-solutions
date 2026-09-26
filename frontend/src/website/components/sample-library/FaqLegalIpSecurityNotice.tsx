import React from 'react';
import { Lock } from 'lucide-react';

export const FaqLegalIpSecurityNotice: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>55 · Legal Escrow & IP Assignment Notice</span>
        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">Institutional Defense</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>Contractual IP Enforceability</span>
            </div>
            <h2 className="text-section-title font-bold text-white tracking-tight">
              Ironclad Intellectual Property & Non-Solicitation Covenants
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Governing Law: State of Delaware / High Court of Karnataka
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h4 className="font-bold text-white text-sm mb-2">Perpetual Assignment Deed</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              All employment contracts contain worldwide, perpetual, irrevocable intellectual property assignment clauses transferring all copyrights and patent rights to the client upon creation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h4 className="font-bold text-white text-sm mb-2">24-Month Non-Solicitation</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Strict non-solicitation and confidentiality non-disclosure agreements enforceable across both Indian and United States federal jurisdictions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h4 className="font-bold text-white text-sm mb-2">SOC-2 Endpoint Security</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Hardware encrypted with BitLocker/FileVault, MDM enrolled via Jamf, with USB mass-storage restrictions and remote-wipe capabilities.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

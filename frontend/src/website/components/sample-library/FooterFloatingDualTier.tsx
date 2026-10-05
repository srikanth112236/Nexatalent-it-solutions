import React, { useState } from 'react';
import { Globe, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react';

export const FooterFloatingDualTier: React.FC<{ bare?: boolean }> = ({ bare = false }) => {
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'INR' | 'GBP'>('USD');

  return (
    <div className={bare ? 'w-full' : 'w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200'}>
      {!bare && (
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>09 · Floating Dual-Tier Elevated Footer</span>
        <span className="text-teal-600 bg-teal-50 px-2 py-0.5 rounded text-[10px]">Currency & Locality Switcher</span>
      </div>
      )}

      <footer className="max-w-6xl mx-auto space-y-3">
        {/* Tier 1: Floating Action & Currency Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Ready to Scale Global Engineering?</h4>
              <p className="text-xs text-slate-500 font-light">Deploy a dedicated GCC pod or schedule a confidential feasibility audit.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-mono">
              <DollarSign className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              {(['USD', 'EUR', 'INR', 'GBP'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    currency === curr ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tier 2: Floating Minimal Directory Bar */}
        <div className="p-5 rounded-2xl bg-slate-900 text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-400" />
            <span className="text-slate-200 font-semibold">NexaTalent IT Solutions Global</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Bangalore • Hyderabad • London • SF</span>
          </div>

          <div className="flex items-center gap-5">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms</a>
            <a href="#security" className="hover:text-white transition-colors">SOC-2 Portal</a>
            <a href="#careers" className="text-teal-400 hover:underline">We're Hiring</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

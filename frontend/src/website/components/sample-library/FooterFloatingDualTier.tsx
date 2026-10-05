import React from 'react';
import { Globe, ArrowRight, ShieldCheck } from 'lucide-react';

export const FooterFloatingDualTier: React.FC<{ bare?: boolean }> = ({ bare = false }) => {

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
              <h4 className="font-bold text-slate-900 text-base">Ready to Scale Your Technology Team?</h4>
              <p className="text-xs text-slate-500 font-light">Partner with NexaTalent IT Solutions for IT recruitment, contract staffing, and vendor empanelment.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/employers"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Hire Talent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/partners"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Vendor Empanelment</span>
            </a>
          </div>
        </div>

        {/* Tier 2: Floating Minimal Directory Bar */}
        <div className="p-5 rounded-2xl bg-slate-900 text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-200 font-semibold">NexaTalent IT Solutions</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">India & Global Talent Delivery</span>
          </div>

          <div className="flex items-center gap-5">
            <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/disclaimer" className="hover:text-white transition-colors">Legal & Compliance</a>
            <a href="/jobs" className="text-emerald-400 hover:underline">Explore Careers</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

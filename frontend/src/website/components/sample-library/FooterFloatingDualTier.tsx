import React from 'react';
import { Globe, ArrowRight, ShieldCheck } from 'lucide-react';

/* White-only · black text/buttons · no color accents */
export const FooterFloatingDualTier: React.FC<{ bare?: boolean }> = ({ bare = false }) => {

  return (
    <div className={bare ? 'w-full bg-white' : 'w-full bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200'}>
      {!bare && (
      <div className="text-xs font-mono font-semibold text-black uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>09 · Floating Dual-Tier Elevated Footer</span>
        <span className="text-black bg-white border border-neutral-300 px-2 py-0.5 rounded text-[10px]">Currency & Locality Switcher</span>
      </div>
      )}

      <footer className="max-w-6xl mx-auto space-y-3 bg-white">
        {/* Tier 1: Floating Action Card — white */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl shadow-neutral-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-300 flex items-center justify-center text-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-black text-base">Ready to Scale Your Technology Team?</h4>
              <p className="text-xs text-black font-light">Partner with NexaTalent IT Solutions for IT recruitment, contract staffing, and vendor empanelment.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/employers"
              className="px-5 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Hire Talent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/partners"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-black border border-neutral-300 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Vendor Empanelment</span>
            </a>
          </div>
        </div>

        {/* Tier 2: Directory bar — white, black text */}
        <div className="p-5 rounded-2xl bg-white text-black text-xs flex flex-col sm:flex-row items-center justify-between gap-4 border border-neutral-200">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-black" />
            <span className="text-black font-semibold">NexaTalent IT Solutions</span>
            <span className="text-black">|</span>
            <span>India & Global Talent Delivery</span>
          </div>

          <div className="flex items-center gap-5">
            <a href="/privacy-policy" className="hover:text-black transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-black transition-colors">Terms</a>
            <a href="/disclaimer" className="hover:text-black transition-colors">Legal & Compliance</a>
            <a href="/jobs" className="text-black font-semibold hover:underline">Explore Careers</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

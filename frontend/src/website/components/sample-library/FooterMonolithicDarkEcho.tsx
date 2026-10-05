import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const FooterMonolithicDarkEcho: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>08 · Monolithic Dark Echo Footer</span>
        <span className="text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded text-[10px]">Brutalist Typography Watermark</span>
      </div>

      <footer className="max-w-7xl mx-auto rounded-3xl bg-neutral-950 text-white p-8 sm:p-14 border border-neutral-800 overflow-hidden relative">
        {/* Giant Watermark in background */}
        <div className="absolute -bottom-8 -right-8 select-none pointer-events-none opacity-5 text-neutral-100 font-black text-8xl lg:text-9xl tracking-tighter">
          NEXATALENT IT SOLUTIONS
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-500">Corporate Genesis</span>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              NexaTalent IT Solutions operates institutional talent infrastructure designed specifically to circumvent agency friction, slow recruiting cycles, and sub-par technical vetting.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Zero Placement Fee on Failed Trials</span>
            </div>
          </div>

          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-4">Mandate Categories</span>
            <ul className="space-y-2 text-xs text-neutral-400 font-light">
              <li className="hover:text-white transition-colors cursor-pointer">Chief Technology Officers</li>
              <li className="hover:text-white transition-colors cursor-pointer">Staff / Principal Distributed Systems</li>
              <li className="hover:text-white transition-colors cursor-pointer">Senior Applied ML / LLM Researchers</li>
              <li className="hover:text-white transition-colors cursor-pointer">FPGA / Low Latency C++ Engineers</li>
            </ul>
          </div>

          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-4">Infrastructure</span>
            <ul className="space-y-2 text-xs text-neutral-400 font-light">
              <li className="hover:text-white transition-colors cursor-pointer">Turnkey 75-Day GCC Centers</li>
              <li className="hover:text-white transition-colors cursor-pointer">Employer of Record & Tax Pass-Through</li>
              <li className="hover:text-white transition-colors cursor-pointer">ISO 27001 Secure Server Rooms</li>
              <li className="hover:text-white transition-colors cursor-pointer">Cross-Border Equity Granting</li>
            </ul>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2">Private Inquiries</span>
              <p className="text-xs text-neutral-400 font-light mb-4">
                Managing Partners respond to verified institutional domain inquiries within 4 business hours.
              </p>
            </div>
            <a 
              href="mailto:partners@nexatalent.internal" 
              className="inline-flex items-center justify-between px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-neutral-200 hover:text-white hover:border-neutral-500 transition-all"
            >
              <span>partners@nexatalent.internal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="relative z-10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 font-mono">
          <div>© 2026 NEXATALENT IT SOLUTIONS PLATFORM HOLDINGS. ALL RIGHTS RESERVED.</div>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>SEC-REG: #8829-10</span>
            <span>BLR • HYD • LON • SF</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

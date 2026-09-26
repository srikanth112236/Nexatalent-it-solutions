import React, { useState } from 'react';
import { Terminal, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CtaInteractiveNewsletterTerminal: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>60 · Terminal-Themed Market Intelligence Dispatch</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Weekly GCC Wire</span>
      </div>

      <section className="max-w-4xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl font-mono">
        <div className="flex items-center gap-2 text-slate-500 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-400 pl-2">gcc-intelligence-wire.sh</span>
        </div>

        <div className="space-y-4 mb-6">
          <div className="text-emerald-400 text-sm font-bold flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>$ subscribe --cadence=weekly --topic=gcc-arbitrage</span>
          </div>
          <p className="text-xs text-slate-400 font-sans font-light leading-relaxed max-w-xl">
            Join 14,000+ CTOs, VPs of Engineering, and talent executives receiving our weekly briefing on executive compensation benchmarks, regulatory updates, and GCC infrastructure trends.
          </p>
        </div>

        {subscribed ? (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Subscription confirmed. Terminal payload dispatched to {email}.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-lg">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="cto@enterprise.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans shadow-md shadow-emerald-600/30 shrink-0"
            >
              <span>$ exec subscribe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { ArrowRight, Flame, Check } from 'lucide-react';

export const Hero09KineticTypographicManifesto: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="relative min-h-[90vh] bg-neutral-950 text-white overflow-hidden flex flex-col justify-between border-y border-neutral-800">
      
      {/* Top Bar Ticker */}
      <div className="py-2.5 bg-blue-600 text-black font-mono text-xs font-bold uppercase tracking-wider overflow-hidden whitespace-nowrap flex items-center">
        <div className="flex gap-8 animate-marquee">
          <span>★ 75-DAY TURNKEY BUILD-OPERATE-TRANSFER</span>
          <span>★ ZERO RECRUITMENT FEES ON CONTINGENCY</span>
          <span>★ 90-DAY UNCONDITIONAL REPLACEMENT SLA</span>
          <span>★ TOP 1% VERIFIED ALGORITHMIC TALENT</span>
          <span>★ 75-DAY TURNKEY BUILD-OPERATE-TRANSFER</span>
        </div>
      </div>

      {/* Main Kinetic Center Area */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center space-y-8 my-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-mono">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>KINETIC MANIFESTO • HIGH-FREQUENCY HIRING</span>
        </div>

        <h1 className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] text-white">
          Build Big. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">
            Scale Fearlessly.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-xl text-neutral-400 font-light leading-relaxed">
          Traditional recruitment is obsolete. NexaTalent IT Solutions synthesizes executive headhunting, real-estate infrastructure, and algorithmic technical vetting into a unified sovereign deployment engine.
        </p>

        {/* Quick Intake Form */}
        <div className="max-w-md mx-auto pt-4">
          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-sm font-mono flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span>Manifesto dispatched to executive partner.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter corporate email for brief..."
                className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
              <button 
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Dispatch Brief</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Quantitative Strip */}
      <div className="border-t border-neutral-800 bg-neutral-900/60 py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div>BANGALORE: <strong className="text-white">2,400+ SEATS</strong></div>
          <div>HYDERABAD: <strong className="text-white">1,800+ SEATS</strong></div>
          <div>LONDON: <strong className="text-white">500+ SEATS</strong></div>
          <div>SAN FRANCISCO: <strong className="text-white">RETAINED BOARD</strong></div>
        </div>
      </div>

    </div>
  );
};

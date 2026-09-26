import React from 'react';
import { Gift, ArrowRight } from 'lucide-react';

export const JobsReferralEngineAndRewards: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>38 · Institutional Candidate Referral Engine</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">$5,000 / ₹4,00,000 Bounty</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              <Gift className="w-3.5 h-3.5" />
              <span>Peer Engineering Referral Program</span>
            </div>
            <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
              Earn $5,000 (₹4,00,000) for Referring Staff & Principal Engineers
            </h2>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              Know an exceptional distributed systems architect, C++ quant engineer, or ML infrastructure lead? 
              Refer them to NexaTalent’s private retained mandates. When they are placed, we disburse your bounty within 14 days of start date.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-mono text-slate-500 block">Senior L5</span>
                <span className="text-base font-bold font-mono text-emerald-700">₹2,00,000</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-mono text-slate-500 block">Staff L6</span>
                <span className="text-base font-bold font-mono text-emerald-700">₹3,50,000</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-mono text-slate-500 block">Principal L7+</span>
                <span className="text-base font-bold font-mono text-emerald-700">₹5,00,000</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-base">Submit a Peer Recommendation</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Candidate Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="text"
                placeholder="Candidate LinkedIn URL or GitHub"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="email"
                placeholder="Your Corporate Email (For Bounty Dispatch)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/30"
              >
                <span>Dispatch Referral Privately</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[10px] text-slate-500 font-mono text-center">
              100% Confidential • Disbursed via Wire Transfer
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

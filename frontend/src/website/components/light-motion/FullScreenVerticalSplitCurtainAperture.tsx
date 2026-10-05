import React from 'react';
import { ShieldCheck, Users } from 'lucide-react';

export const FullScreenVerticalSplitCurtainAperture: React.FC = () => {
  return (
    <section className="relative w-full py-20 px-6 md:px-16 bg-white text-slate-900 border-b border-slate-200 flex flex-col items-center justify-center text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold mb-4">
        <Users className="w-3.5 h-3.5" />
        <span>EXECUTIVE & LEADERSHIP DIRECTORY</span>
      </div>

      <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
        GCC Leadership Vanguard
      </h2>
      <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
        Pre-qualified Site Leaders and Engineering Vice Presidents who have navigated hyper-growth expansions from seed stage to public listing.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-5xl">
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50">
          <span className="text-xs font-mono text-blue-600 font-bold uppercase">Site Managing Director</span>
          <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">Ex-Microsoft GCC Head</h4>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">Scaled Bangalore R&D center from 50 to 1,800 engineers over 4 years.</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Available in 30 Days</span>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50">
          <span className="text-xs font-mono text-indigo-600 font-bold uppercase">VP Platform Architecture</span>
          <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">Ex-Stripe Infrastructure</h4>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">Architected global multi-region payment routing handling $12B monthly volume.</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Vetted & Cleared</span>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50">
          <span className="text-xs font-mono text-teal-600 font-bold uppercase">Head of AI Research</span>
          <h4 className="text-xl font-bold text-slate-900 mt-1 mb-2">IIT Delhi PhD / Ex-DeepMind</h4>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">Published author with 18 papers on model compression and efficient inference.</p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Confidential Dialogue</span>
          </div>
        </div>
      </div>
    </section>
  );
};

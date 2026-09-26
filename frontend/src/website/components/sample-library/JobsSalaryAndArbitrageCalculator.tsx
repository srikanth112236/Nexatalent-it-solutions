import React, { useState } from 'react';
import { DollarSign, ArrowRight, TrendingUp } from 'lucide-react';

export const JobsSalaryAndArbitrageCalculator: React.FC = () => {
  const [experienceYears, setExperienceYears] = useState<number>(8);
  const [roleTier, setRoleTier] = useState<'senior' | 'staff' | 'principal'>('staff');

  const baseRanges = {
    senior: { inr: 45, usd: 54000, pppUsd: 190000 },
    staff: { inr: 70, usd: 84000, pppUsd: 295000 },
    principal: { inr: 105, usd: 126000, pppUsd: 440000 },
  };

  const current = baseRanges[roleTier];
  const adjustedInr = Math.round(current.inr * (1 + (experienceYears - 6) * 0.04));
  const adjustedUsd = Math.round(current.usd * (1 + (experienceYears - 6) * 0.04));
  const adjustedPpp = Math.round(current.pppUsd * (1 + (experienceYears - 6) * 0.04));

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>33 · Candidate Compensation & Purchasing Power Calculator</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">PPP Realization</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Candidate Real Purchasing Power</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Calculate Your True Global Purchasing Power Parity (PPP)
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Earning ₹70L+ in Bangalore or Hyderabad with US RSUs yields significantly higher disposable savings than a $250k salary in San Francisco or London.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-2">Target Seniority Tier</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'senior', label: 'Senior (L5)' },
                  { id: 'staff', label: 'Staff (L6)' },
                  { id: 'principal', label: 'Principal (L7)' },
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setRoleTier(tier.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      roleTier === tier.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                <span>Years of Production Software Experience</span>
                <span className="font-mono text-emerald-600">{experienceYears} Years</span>
              </div>
              <input
                type="range"
                min="4"
                max="18"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-slate-800">Standard Inclusion:</div>
              <ul className="space-y-1 text-[11px] text-slate-500">
                <li>• US Dollar Parent Company RSUs (Carta Sync)</li>
                <li>• 100% Comprehensive Family Health & Dental Coverage</li>
                <li>• ₹2,50,000 Annual Learning & Compute Allowance</li>
              </ul>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-1">
                Estimated Indian Base Compensation
              </span>
              <div className="text-4xl font-black font-mono text-emerald-400">
                ₹{adjustedInr} Lakhs <span className="text-xs font-normal text-slate-400">CTC (~${adjustedUsd.toLocaleString()}/yr)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400 uppercase">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Equivalent San Francisco Standard of Living</span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                ${adjustedPpp.toLocaleString()} / yr
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                After accounting for housing, taxation, and disposable savings, this package delivers equivalent real purchasing power to a top-bracket Bay Area salary.
              </p>
            </div>

            <button
              type="button"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/30"
            >
              <span>Submit Profile for Private Mandates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

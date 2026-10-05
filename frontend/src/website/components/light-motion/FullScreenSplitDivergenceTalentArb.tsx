import React from 'react';
import { DollarSign, Users, TrendingUp } from 'lucide-react';

export const FullScreenSplitDivergenceTalentArb: React.FC = () => {
  return (
    <section className="relative w-full py-20 px-6 md:px-16 bg-slate-50 text-slate-900 border-b border-slate-200 flex flex-col justify-center items-center text-center">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>PAYROLL COST ARBITRAGE MATRIX</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            High-Impact Tech Talent at 60% Lower Cost
          </h2>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Compare traditional US/UK local hiring overhead versus NexaTalent IT Solutions offshore engineering pod model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-900">US / UK Local Hiring</h4>
                <p className="text-xs text-slate-500">$160,000+ Average Annual Salary</p>
              </div>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 border-t pt-3">
              <li>• 60 to 90 Days Average Time-to-Hire</li>
              <li>• High recruiter markup fees (20-30%)</li>
              <li>• Complex local benefits & healthcare liabilities</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-emerald-950">NexaTalent GCC Offshore Pod</h4>
                <p className="text-xs text-emerald-700 font-bold">$65,000 Average Annual Cost (Save 60%)</p>
              </div>
            </div>
            <ul className="text-xs text-emerald-800 space-y-2 border-t border-emerald-200 pt-3">
              <li>✓ 72-Hour Rapid Matching & Deployment</li>
              <li>✓ 14-Day Zero-Risk Engineering Trial</li>
              <li>✓ Full EOR compliance, IP transfer, and hardware setup</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

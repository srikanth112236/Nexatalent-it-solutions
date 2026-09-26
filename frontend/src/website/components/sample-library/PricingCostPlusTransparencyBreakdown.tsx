import React from 'react';

export const PricingCostPlusTransparencyBreakdown: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>53 · Cost-Plus Fee Transparency Architecture</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Open-Book Accounting</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            100% Open-Book Fee Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Traditional agencies take 50% hidden contractor margins. We operate on a transparent cost-plus model where you see every dollar allocated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200">
            <span className="text-4xl font-black font-mono text-blue-700 block mb-2">85%</span>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Direct Engineer Compensation</h4>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Base salary, statutory provident fund (EPF), annual bonuses, and medical insurance paid directly to your engineering team.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-4xl font-black font-mono text-slate-800 block mb-2">10%</span>
            <h4 className="font-bold text-slate-900 text-sm mb-1">Facility & Endpoint Infrastructure</h4>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Class-A campus real-estate lease in Indiranagar/Outer Ring Rd, Herman Miller chairs, M3 MacBooks, and fiber lines.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-4xl font-black font-mono text-emerald-700 block mb-2">5%</span>
            <h4 className="font-bold text-slate-900 text-sm mb-1">NexaTalent Platform Fee</h4>
            <p className="text-xs text-slate-600 font-light leading-relaxed">
              Covers ongoing Employer of Record management, cross-border tax compliance, payroll auditing, and replacement SLAs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

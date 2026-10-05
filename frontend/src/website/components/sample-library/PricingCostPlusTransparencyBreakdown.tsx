import React from 'react';
import { DollarSign, ShieldCheck, PieChart } from 'lucide-react';

export const PricingCostPlusTransparencyBreakdown: React.FC = () => {
  return (
    <div id="cost-plus" className="w-full bg-[#FAF8F5] py-16 px-4 sm:px-6 border-y border-slate-200">
      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 shadow-md">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-bold uppercase tracking-wider">
            <PieChart size={14} /> Open-Book Cost-Plus Transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            100% Audited Fee Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Traditional recruitment agencies hide 40-70% candidate markups behind opaque contracts. NexaTalent IT Solutions operates on an open-book, auditable Cost-Plus model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 hover:border-blue-400 transition-colors">
            <span className="text-4xl font-extrabold text-[#0265FF] block mb-2 font-mono">85%</span>
            <h4 className="font-bold text-slate-900 text-base mb-1.5">Direct Practitioner Compensation</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Base salary, statutory provident fund (EPF), annual performance bonuses, and comprehensive medical insurance paid directly to your tech team.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition-colors">
            <span className="text-4xl font-extrabold text-slate-800 block mb-2 font-mono">10%</span>
            <h4 className="font-bold text-slate-900 text-base mb-1.5">Infrastructure & Endpoint Security</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Class-A campus facilities in Bengaluru, Hyderabad, and Pune, ergonomic workspaces, SOC2-compliant hardware endpoints, and high-speed fiber channels.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 transition-colors">
            <span className="text-4xl font-extrabold text-emerald-700 block mb-2 font-mono">5%</span>
            <h4 className="font-bold text-slate-900 text-base mb-1.5">NexaTalent Platform & Governance Fee</h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Covers ongoing EOR management, cross-border tax compliance, 3-stage practitioner vetting, continuous technical benchmarks, and 90-day replacement SLAs.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#0265FF]" />
            <span>Audited quarterly by Big-4 accounting partners for margin transparency.</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-bold">
            <DollarSign size={16} className="text-emerald-600" />
            <span>Zero Hidden Surcharges • Zero Sourcing Markup</span>
          </div>
        </div>
      </section>
    </div>
  );
};

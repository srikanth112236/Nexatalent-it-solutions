import React from 'react';
import { Building2 } from 'lucide-react';

export const CaseStudyEnterpriseScaleMetricCard: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>41 · Enterprise GCC Scale Case Study</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">250 Engineers • 90 Days</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Fortune 100 Enterprise Software Client</span>
            </div>
            <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
              Building a 250-Engineer Bangalore AI Center in 90 Days
            </h2>
            <p className="text-sm text-slate-600 font-light leading-relaxed">
              When a NYSE-listed cloud enterprise needed to accelerate foundation model training while reducing high-velocity Bay Area burn, NexaTalent IT Solutions designed, incorporated, and staffed their sovereign Indian capability center.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl font-black font-mono text-blue-600 block">250</span>
                <span className="text-xs text-slate-700 font-semibold">Engineers Onboarded</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl font-black font-mono text-emerald-600 block">$14.2M</span>
                <span className="text-xs text-slate-700 font-semibold">Annual CapEx Saved</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-2xl font-black font-mono text-indigo-600 block">90 Days</span>
                <span className="text-xs text-slate-700 font-semibold">Incorporation to Code</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">Executive Testimonial</span>
            <blockquote className="text-sm text-slate-300 italic leading-relaxed font-light">
              "NexaTalent IT Solutions delivered what our internal corporate development team estimated would take 18 months. Their technical vetting bar is indistinguishable from our Mountain View headquarters."
            </blockquote>
            <div className="pt-2 border-t border-slate-800">
              <div className="font-bold text-white text-xs">SVP of Global Engineering</div>
              <div className="text-[11px] text-slate-400 font-mono">Fortune 100 Enterprise Cloud Client</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

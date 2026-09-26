import React from 'react';
import { Target, Search, FileCheck, CheckCircle2, Award } from 'lucide-react';

export const DetailExecutiveSearchPlaybook: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Confidential Market Mapping',
      desc: 'We map the top 40 engineering leaders across target competitors under strict NDA within 5 business days.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Algorithmic & Leadership Defense',
      desc: 'Candidates are interviewed by former Google/Goldman tech directors on architecture scale, board presence, and team scaling.',
      icon: Target,
    },
    {
      num: '03',
      title: 'Symmetrical Compensation Calibration',
      desc: 'We balance US equity parity with local Indian tax optimizations to craft unrefusable offer packages.',
      icon: FileCheck,
    },
    {
      num: '04',
      title: 'Post-Placement 360 Governance',
      desc: 'Quarterly check-ins with client board members and 12-month free executive replacement warranty.',
      icon: Award,
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>22 · Retained Executive Search Playbook</span>
        <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">C-Suite & MD Practice</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Retained Search Methodology</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            How We Secure Site Managing Directors & CTOs
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Proven retained executive search framework with a 99.1% completion rate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black font-mono text-indigo-600">{s.num}</span>
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-2">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{s.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-semibold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Stage</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

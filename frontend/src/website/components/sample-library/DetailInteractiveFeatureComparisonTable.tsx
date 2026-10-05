import React from 'react';
import { Check, X, ShieldCheck } from 'lucide-react';

export const DetailInteractiveFeatureComparisonTable: React.FC = () => {
  const rows = [
    {
      feature: 'Direct Employment & Equity Ownership',
      traditionalAgency: false,
      legacyConsulting: false,
      nexaTalent: true,
      note: 'Engineers report directly to client VP Eng & receive client RSUs',
    },
    {
      feature: '100% IP Assignment Guarantee',
      traditionalAgency: false,
      legacyConsulting: false,
      nexaTalent: true,
      note: 'Deeds signed directly with client parent entity',
    },
    {
      feature: 'Transparent Cost-Plus Margin (15%)',
      traditionalAgency: false,
      legacyConsulting: false,
      nexaTalent: true,
      note: 'No hidden 50-70% staff augmentation markups',
    },
    {
      feature: 'Turnkey 75-Day Hub Delivery SLA',
      traditionalAgency: false,
      legacyConsulting: false,
      nexaTalent: true,
      note: 'Real estate, legal entity, hardware, and first 50 seats',
    },
    {
      feature: '90-Day Free Candidate Replacement',
      traditionalAgency: false,
      legacyConsulting: false,
      nexaTalent: true,
      note: 'Backed by contractual fee guarantees',
    },
    {
      feature: 'Zero Outsourced Middle-Managers',
      traditionalAgency: false,
      legacyConsulting: false,
      nexaTalent: true,
      note: 'No non-technical intermediaries billing hours',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>30 · Comprehensive Comparative Evaluation Table</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Head-to-Head Comparison</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Market Differentiation</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            NexaTalent IT Solutions vs. Traditional Headhunters vs. Big IT Outsourcers
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Compare delivery architecture, IP protection, and fee structures side-by-side.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="py-4 px-4 font-bold text-slate-900">Key Operating Criteria</th>
                <th className="py-4 px-4 font-medium text-slate-500 text-center">Traditional Headhunters</th>
                <th className="py-4 px-4 font-medium text-slate-500 text-center">Big-4 IT Outsourcers</th>
                <th className="py-4 px-4 font-black text-blue-700 bg-blue-50/80 rounded-t-xl text-center">NexaTalent IT Solutions Engine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    <div>{r.feature}</div>
                    <div className="text-[11px] text-slate-400 font-light mt-0.5">{r.note}</div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {r.traditionalAgency ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {r.legacyConsulting ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3.5 px-4 text-center bg-blue-50/50 font-bold">
                    <Check className="w-5 h-5 text-blue-600 mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

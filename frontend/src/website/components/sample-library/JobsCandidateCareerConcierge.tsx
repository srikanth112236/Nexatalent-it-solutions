import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const JobsCandidateCareerConcierge: React.FC = () => {
  const services = [
    {
      title: 'Anonymous Market Testing',
      desc: 'We float your anonymized technical dossier to 5 target CTOs to establish your true enterprise market value before initiating interviews.',
    },
    {
      title: 'US RSU & Tax Structure Advisory',
      desc: 'Our cross-border tax advisors help you structure 409A stock option grants, Section 83(b) elections, and Indian capital gains.',
    },
    {
      title: 'Executive Counter-Offer Strategy',
      desc: 'We represent you exclusively during final negotiation rounds to maximize equity components and tenure protections.',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>Private Candidate Career Concierge & Agent Model</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Candidate Representation</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Talent Representation Model</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            We Act as Your Personal Talent Agent
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Top athletes have agents. Principal engineers and tech executives deserve the same level of private career representation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {services.map((s, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{s.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-mono text-blue-600 font-semibold">
                Complimentary for Cleared Engineers
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-700">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Zero cost to candidates. All advisory fees are paid by client retainers.</span>
          </span>
          <button 
            type="button"
            onClick={() => window.location.href = '/contact?inquiry=candidate#contact-form'}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer shrink-0 shadow-sm"
          >
            Apply for Agent Representation →
          </button>
        </div>
      </section>
    </div>
  );
};

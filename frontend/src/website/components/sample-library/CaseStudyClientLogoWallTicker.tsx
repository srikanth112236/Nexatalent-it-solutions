import React from 'react';

export const CaseStudyClientLogoWallTicker: React.FC = () => {
  const domains = [
    'Cloud & Infrastructure',
    'AI & Machine Learning',
    'Full-Stack Development',
    'Data & Analytics',
    'Cybersecurity & Risk',
    'Enterprise Digital & ERP',
  ];

  return (
    <div className="w-full bg-[#FAF8F5] py-8 px-4 sm:px-8 border-y border-slate-200/80">
      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xs text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-bold uppercase tracking-wider mb-3">
          <span>SPECIALIZED HIRING CAPABILITIES</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Hiring Excellence Across Core Engineering Domains
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-8 font-normal">
          Dedicated recruitment teams providing targeted talent matching for major technology functions.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {domains.map((domain, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 hover:text-[#0265FF] hover:bg-blue-50/60 hover:border-blue-300 transition-all select-none shadow-xs text-center leading-snug"
            >
              {domain}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};


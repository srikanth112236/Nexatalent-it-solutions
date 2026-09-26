import React from 'react';

export const CaseStudyClientLogoWallTicker: React.FC = () => {
  const logos = [
    'Datadog Scale Tier',
    'Snowflake Ecosystem',
    'Citadel Securities Guild',
    'Stripe Partner Network',
    'Confluent Cloud Ops',
    'MongoDB Infra Guild',
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>48 · Enterprise Client & Ecosystem Logo Wall</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Tier-1 Trust</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm text-center">
        <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-6">
          TRUSTED BY LEADERSHIP AT WORLD-CLASS TECHNOLOGY PLATFORMS
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {logos.map((logo, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center font-bold text-xs font-mono text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 hover:border-blue-200 transition-all select-none"
            >
              {logo}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

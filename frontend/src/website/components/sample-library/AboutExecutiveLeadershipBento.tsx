import React from 'react';
import { Linkedin, Award, ArrowUpRight } from 'lucide-react';

export const AboutExecutiveLeadershipBento: React.FC = () => {
  const leaders = [
    {
      name: 'Vikramaditya Sharma',
      role: 'Managing Partner & Co-Founder',
      pedigree: 'Ex-Goldman Sachs Tech MD • 18 yrs GCC Leadership',
      bio: 'Pioneered GCC infrastructure transformations across 14 enterprise banks and tech platforms in Bangalore & London.',
      initials: 'VS',
      tag: 'FINTECH & BANKING ARCHITECTURE',
    },
    {
      name: 'Ananya Deshmukh, PhD',
      role: 'Head of Executive Search & AI Guild',
      pedigree: 'Ex-Google Research • IIT Bombay • Stanford Post-Doc',
      bio: 'Directs the confidential search practice for Principal AI Researchers, Staff ML Infra architects, and foundation model squads.',
      initials: 'AD',
      tag: 'AI INFRASTRUCTURE & LLMS',
    },
    {
      name: 'Marcus Vance',
      role: 'Partner, North America & EMEA',
      pedigree: 'Ex-McKinsey & Co. Partner • Silicon Valley Lead',
      bio: 'Advises US enterprise boards, PE operating partners, and CTOs on cross-border talent arbitrage and entity formation.',
      initials: 'MV',
      tag: 'CROSS-BORDER ADVISORY',
    },
    {
      name: 'Suresh Nambiar',
      role: 'VP Infrastructure & Legal Compliance',
      pedigree: 'Ex-Infosys Legal Counsel • RBI FEMA Compliance Officer',
      bio: 'Architected our proprietary IP assignment framework, transfer pricing guidelines, and SOC-2 Type II audit pipelines.',
      initials: 'SN',
      tag: 'GOVERNANCE & RISK ESCROW',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>13 · Executive Leadership Bento Grid</span>
        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Tier-1 Pedigree</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Leadership Cadre</span>
            </div>
            <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
              Engineered by Operators, Not Headhunters
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md font-light">
            Our partners have collectively built 40+ engineering organizations from inception to public listing across India, the US, and Europe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leaders.map((leader, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                      {leader.initials}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                        {leader.name}
                      </h4>
                      <p className="text-xs text-slate-500">{leader.role}</p>
                    </div>
                  </div>
                  <a 
                    href="#linkedin" 
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>

                <div className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold mb-3">
                  {leader.pedigree}
                </div>

                <p className="text-xs text-slate-600 font-light leading-relaxed mb-4">
                  {leader.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{leader.tag}</span>
                <span className="flex items-center gap-1 text-blue-600 font-sans font-semibold">
                  <span>View Mandates</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

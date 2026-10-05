import React from 'react';
import { Heart, Laptop, BookOpen, Plane, Coffee, ShieldCheck } from 'lucide-react';

export const JobsCandidatePerksAndWorkspaceGrid: React.FC = () => {
  const perks = [
    {
      icon: Laptop,
      title: 'Top-Tier Workstations',
      desc: 'Choice of M3 Max MacBook Pro or high-spec Linux ThinkPad with dual 4K Studio Displays & Herman Miller Aeron seating.',
    },
    {
      icon: Heart,
      title: '100% Comprehensive Healthcare',
      desc: 'Zero-deductible medical, dental, and vision insurance covering employee, spouse, children, and dependent parents.',
    },
    {
      icon: Plane,
      title: 'Annual US/Europe Offsites',
      desc: 'Annual all-hands offsites at the client global headquarters in San Francisco, New York, London, or Amsterdam.',
    },
    {
      icon: BookOpen,
      title: 'Annual ₹3,00,000 Learning Budget',
      desc: 'Personal stipend for international conference attendance (NeurIPS, OSDI, SIGMOD), books, and compute credits.',
    },
    {
      icon: ShieldCheck,
      title: 'Carta US RSU Vesting',
      desc: 'Direct stock options and RSUs in the parent entity with transparent 4-year vesting cliffs and secondary liquidity windows.',
    },
    {
      icon: Coffee,
      title: 'Class-A Campus Facilities',
      desc: 'Private on-site gym, chef-curated organic meals, soundproof call pods, and gaming lounges in Indiranagar & HITEC City.',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>Candidate Perks, Workspace & Compensation Ecosystem</span>
        <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded text-[10px]">Tier-1 Benefits</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-3">
            <Heart className="w-3.5 h-3.5" />
            <span>Candidate Experience Standard</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Institutional Benefits That Compete With Silicon Valley
          </h2>
          <p className="text-xs text-slate-500 mt-2 font-light">
            Every engineer placed through NexaTalent IT Solutions receives standardized Tier-1 compensation packages.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-purple-50/40 hover:border-purple-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-purple-600 mb-4 shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-2">{p.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-light">{p.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-mono text-purple-600 font-semibold">
                  Standard NexaTalent IT Solutions Package
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

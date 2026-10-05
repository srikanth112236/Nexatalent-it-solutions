import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JobsFeaturedMandatesCarousel: React.FC = () => {
  const mandates = [
    {
      id: 'j1',
      title: 'Principal Storage Engineer',
      clientType: 'US Cloud Infrastructure Unicorn ($9B)',
      comp: '₹85L Base + $120k US RSUs/yr',
      location: 'Bangalore · Hybrid',
      status: 'CONFIDENTIAL RETAINER',
      highlight: 'Directly designing distributed append-only storage engine.',
    },
    {
      id: 'j2',
      title: 'VP of Platform Engineering',
      clientType: 'Global Tier-1 Payments Processor',
      comp: '₹1.4Cr CTC + Executive Carry',
      location: 'Hyderabad · On-Site',
      status: 'ACTIVE SEARCH',
      highlight: 'Leading 180-engineer multi-region payment core.',
    },
    {
      id: 'j3',
      title: 'Senior Quant C++ Researcher',
      clientType: 'Tier-1 Quantitative Prop Trading Firm',
      comp: '£220k Base + 100% Target Bonus',
      location: 'London · City of London',
      status: 'TOP SECRET',
      highlight: 'Low-latency tick-to-trade algorithmic optimization.',
    },
  ];

  return (
    <section className="w-full bg-[#FAF8F5] py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive & Principal Retainers</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Active Confidential Mandates
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md font-normal leading-relaxed">
            These roles are managed exclusively under mutual candidate NDA. Click below to view detailed requirements and apply.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mandates.map((m) => (
            <div key={m.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md hover:border-[#0265FF] hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0265FF] border border-blue-200">
                    {m.status}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="text-xs font-bold text-slate-500 mb-1">{m.clientType}</div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2 group-hover:text-[#0265FF] transition-colors">
                  {m.title}
                </h3>
                <div className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg inline-block border border-emerald-200 mb-3">{m.comp}</div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal mb-4">{m.highlight}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold">{m.location}</span>
                <Link
                  to={`/jobs/${m.id}`}
                  className="px-4 py-2 rounded-xl bg-[#0265FF] hover:bg-[#004FBF] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>View Details & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

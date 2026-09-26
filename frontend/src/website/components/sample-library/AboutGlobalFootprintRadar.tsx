import React from 'react';
import { Globe, Users, Clock } from 'lucide-react';

export const AboutGlobalFootprintRadar: React.FC = () => {
  const hubs = [
    {
      city: 'Bangalore Headquarters',
      hub: 'Indiranagar & Outer Ring Road Tech Corridor',
      placements: '4,200+ Engineers Placed',
      specialty: 'Distributed Systems, GenAI & Cloud Core',
      latency: '12-Day Avg Fill Time',
      capacity: 'Tier-1 Hub',
    },
    {
      city: 'Hyderabad Innovation Hub',
      hub: 'HITEC City & Financial District',
      placements: '2,800+ Engineers Placed',
      specialty: 'BFSI, Cloud SRE, & Enterprise Cyber',
      latency: '14-Day Avg Fill Time',
      capacity: 'Scale Hub',
    },
    {
      city: 'London Advisory Hub',
      hub: '100 Bishopsgate, Bank, EC2N',
      placements: '1,100+ Senior Mandates',
      specialty: 'Algorithmic Quant, High-Frequency C++, Risk',
      latency: '21-Day Avg Fill Time',
      capacity: 'Fintech Hub',
    },
    {
      city: 'San Francisco Executive Desk',
      hub: 'SoMa & Silicon Valley Corridor',
      placements: 'Managing Directors & Founders',
      specialty: 'Board Advisory & US Entity Formation',
      latency: '28-Day C-Suite Retainer',
      capacity: 'Executive Hub',
    },
  ];

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>14 · Global Geospatial Footprint Radar</span>
        <span className="text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded text-[10px]">Worldwide GCC Presence</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>Multi-Jurisdiction GCC Footprint</span>
            </div>
            <h2 className="text-section-title font-bold text-white tracking-tight">
              Four Strategic Geospatial Hubs. Unified Governance.
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md font-light leading-relaxed">
            Direct physical presence in the world's most competitive engineering and financial epicenters, operating under standardized legal and security frameworks.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hubs.map((hub, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {hub.capacity}
                  </span>
                  <Globe className="w-4 h-4 text-slate-500" />
                </div>
                <h4 className="font-bold text-white text-base mb-1">{hub.city}</h4>
                <p className="text-xs text-slate-400 mb-4 font-light">{hub.hub}</p>

                <div className="space-y-2 py-3 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{hub.placements}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{hub.latency}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400">
                {hub.specialty}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

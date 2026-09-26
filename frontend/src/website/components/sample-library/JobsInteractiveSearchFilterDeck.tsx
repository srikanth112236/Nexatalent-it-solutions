import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Briefcase, ArrowRight } from 'lucide-react';

export const JobsInteractiveSearchFilterDeck: React.FC = () => {
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const jobs = [
    {
      title: 'Principal Distributed Systems Architect',
      client: 'US Enterprise Cloud Storage Platform',
      location: 'Bangalore (Indiranagar) · Hybrid',
      comp: '₹65L – ₹90L + US RSUs',
      domain: 'backend',
      tags: ['C++ / Rust', 'Raft / Paxos', 'Storage Internals'],
      urgency: 'Active Retainer',
    },
    {
      title: 'Staff Machine Learning Infrastructure Engineer',
      client: 'Tier-1 AI Foundation Model Lab',
      location: 'Bangalore (Outer Ring Rd) · On-Site',
      comp: '₹75L – ₹1.1Cr + Direct Equity',
      domain: 'ai',
      tags: ['Megatron-LM', 'H100 Clusters', 'CUDA / Triton'],
      urgency: 'Immediate Start',
    },
    {
      title: 'Ultra Low-Latency C++ Execution Lead',
      client: 'Global Quantitative Market Maker',
      location: 'London (Bank) / Bangalore Remote',
      comp: '£180k – £240k Base + PnL Bonus',
      domain: 'quant',
      tags: ['Kernel Bypass', 'Solarflare', 'FIX / ITCH'],
      urgency: 'Confidential',
    },
    {
      title: 'Site Managing Director (GCC Launch)',
      client: 'NYSE-Listed FinTech Platform ($18B Market Cap)',
      location: 'Hyderabad (HITEC City)',
      comp: 'Executive Retainer (C-Suite Scale)',
      domain: 'leadership',
      tags: ['GCC Scaling', '500+ Org Leadership', 'Board Advisory'],
      urgency: 'Partner Lead',
    },
  ];

  const filteredJobs = jobs.filter((j) => {
    const matchesDomain = filterDomain === 'all' || j.domain === filterDomain;
    const matchesQuery = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesQuery;
  });

  return (
    <div className="w-full bg-slate-900/5 p-4 sm:p-6 rounded-2xl border border-slate-200">
      <div className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>31 · Interactive Job Discovery & Domain Filter Deck</span>
        <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px]">Real-Time Search</span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Senior & Staff Mandates</span>
          </div>
          <h2 className="text-section-title font-bold text-slate-900 tracking-tight">
            Curated Retained Roles for Tier-1 Engineers
          </h2>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, stack, or keywords (e.g. C++, Megatron)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Domains' },
              { id: 'backend', label: 'Distributed Systems' },
              { id: 'ai', label: 'AI & ML Infra' },
              { id: 'quant', label: 'Low Latency' },
              { id: 'leadership', label: 'Managing Directors' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setFilterDomain(btn.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  filterDomain === btn.id ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Job Listings Cards */}
        <div className="space-y-3">
          {filteredJobs.map((job, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                    {job.urgency}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{job.client}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h4>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-light">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono font-semibold text-slate-700">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{job.comp}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-wrap gap-1.5">
                  {job.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  <span>Apply Privately</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

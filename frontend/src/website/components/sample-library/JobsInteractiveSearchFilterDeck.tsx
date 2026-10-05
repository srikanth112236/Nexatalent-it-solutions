import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Briefcase, ArrowRight, Building2, Cpu, Filter } from 'lucide-react';

interface JobItem {
  id: string;
  title: string;
  client: string;
  location: string;
  comp: string;
  domain: string;
  techCategory: string;
  tags: string[];
  urgency: string;
  experience: string;
  workMode: string;
}

const JOBS_DATA: JobItem[] = [
  {
    id: 'job-1',
    title: 'Senior Java Developer / Microservices Engineer',
    client: 'Enterprise FinTech Core Platform',
    location: 'Bangalore (Indiranagar) · Hybrid',
    comp: '₹18L – ₹28L PA',
    domain: 'bfsi',
    techCategory: 'java',
    tags: ['Core Java', 'Spring Boot', 'Microservices', 'Kafka'],
    urgency: 'Immediate Start',
    experience: '5+ Years',
    workMode: 'Hybrid (3 days office)'
  },
  {
    id: 'job-2',
    title: 'Senior React / Frontend Architecture Lead',
    client: 'US Cloud SaaS Scale-Up',
    location: 'Pune (Kharadi) / Remote',
    comp: '₹22L – ₹32L PA + Equity',
    domain: 'technology',
    techCategory: 'react',
    tags: ['React 18', 'TypeScript', 'Next.js', 'TailwindCSS'],
    urgency: 'Active Retainer',
    experience: '6–8 Years',
    workMode: 'Hybrid / Remote'
  },
  {
    id: 'job-3',
    title: 'Principal Data Engineer & PySpark Specialist',
    client: 'Global HealthTech & Clinical AI',
    location: 'Hyderabad (HITEC City)',
    comp: '₹28L – ₹40L PA',
    domain: 'healthcare',
    techCategory: 'ai',
    tags: ['PySpark', 'Databricks', 'Snowflake', 'Airflow'],
    urgency: 'Priority Intake',
    experience: '7+ Years',
    workMode: 'Hybrid'
  },
  {
    id: 'job-4',
    title: 'Principal DevOps & SRE Cloud Architect',
    client: 'Fortune 500 GCC Platform',
    location: 'Bangalore / Remote',
    comp: '₹35L – ₹50L PA',
    domain: 'gcc',
    techCategory: 'devops',
    tags: ['Kubernetes', 'Terraform', 'Golang', 'AWS'],
    urgency: 'Immediate Start',
    experience: '8+ Years',
    workMode: 'Remote-First'
  },
  {
    id: 'job-5',
    title: 'Ultra Low-Latency C++ Execution Lead',
    client: 'Global Quantitative Market Maker',
    location: 'Mumbai (BKC) / London Remote',
    comp: '₹55L – ₹90L PA + PnL Bonus',
    domain: 'bfsi',
    techCategory: 'cpp',
    tags: ['C++20', 'Kernel Bypass', 'Solarflare', 'FIX Protocol'],
    urgency: 'Confidential Search',
    experience: '6–10 Years',
    workMode: 'On-Site / High Concurrency'
  },
  {
    id: 'job-6',
    title: 'Site Managing Director (GCC 0-to-1 Launch)',
    client: 'NYSE-Listed Cloud Platform',
    location: 'Hyderabad (Financial District)',
    comp: 'Executive Retainer Scale',
    domain: 'gcc',
    techCategory: 'leadership',
    tags: ['GCC Scaling', '500+ Org Leadership', 'Board Advisory'],
    urgency: 'Partner Lead',
    experience: '15+ Years',
    workMode: 'Executive On-Site'
  },
  {
    id: 'job-7',
    title: 'Embedded AUTOSAR & EV Firmware Lead',
    client: 'Global Automotive OEM R&D Center',
    location: 'Chennai / Pune',
    comp: '₹24L – ₹36L PA',
    domain: 'automotive',
    techCategory: 'embedded',
    tags: ['AUTOSAR', 'Embedded C/C++', 'ISO 26262', 'CAN Bus'],
    urgency: 'Active Intake',
    experience: '6+ Years',
    workMode: 'On-Site R&D Lab'
  },
  {
    id: 'job-8',
    title: 'High-Concurrency Checkout Architect',
    client: 'Omnichannel Retail & E-Commerce Giant',
    location: 'Bangalore (Outer Ring Rd)',
    comp: '₹32L – ₹48L PA',
    domain: 'retail',
    techCategory: 'java',
    tags: ['Java 17', 'Distributed Caching', 'Spring Boot', 'Redis'],
    urgency: 'Urgent Scale',
    experience: '8+ Years',
    workMode: 'Hybrid'
  }
];

export const JobsInteractiveSearchFilterDeck: React.FC<{ searchQueryProp?: string }> = ({ searchQueryProp }) => {
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [filterTech, setFilterTech] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(searchQueryProp || '');

  useEffect(() => {
    if (searchQueryProp !== undefined) {
      setSearchQuery(searchQueryProp);
    }
  }, [searchQueryProp]);

  const filteredJobs = JOBS_DATA.filter((j) => {
    const matchesDomain = filterDomain === 'all' || j.domain === filterDomain;
    const matchesTech = filterTech === 'all' || j.techCategory === filterTech;
    
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesDomain && matchesTech;

    const matchesQuery = 
      j.title.toLowerCase().includes(query) ||
      j.client.toLowerCase().includes(query) ||
      j.location.toLowerCase().includes(query) ||
      j.tags.some(t => t.toLowerCase().includes(query));

    return matchesDomain && matchesTech && matchesQuery;
  });

  return (
    <section id="jobs-interactive-filter-deck" className="w-full bg-[#FAF8F5] py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-extrabold uppercase tracking-wider shadow-xs">
            <Briefcase className="w-4 h-4 text-[#0265FF]" />
            <span>VERIFIED RECRUITMENT MANDATES</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Active Job Openings & Retained Mandates
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Filter active mandates by industry sector, tech stack category, or search keywords across Bangalore, Hyderabad, Pune, London, and remote.
          </p>
        </div>

        {/* Filter Console Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-blue-900/5 space-y-6">
          
          {/* Top Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-[#0265FF] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active roles by skill, title, location, or company (e.g. Java, React, Bangalore, FinTech, Microservices)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0265FF] focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Dual Filter Category Strips */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            
            {/* Industry Vertical Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider w-full sm:w-auto mr-2 flex items-center gap-1">
                <Building2 size={14} className="text-[#0265FF]" />
                <span>Industry Sector:</span>
              </span>
              {[
                { id: 'all', label: 'All Industries' },
                { id: 'technology', label: 'Technology & SaaS' },
                { id: 'bfsi', label: 'BFSI & FinTech' },
                { id: 'healthcare', label: 'Healthcare & Life Sciences' },
                { id: 'gcc', label: 'Global Capability Centers' },
                { id: 'retail', label: 'Retail & E-Commerce' },
                { id: 'automotive', label: 'Automotive & EV' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setFilterDomain(btn.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterDomain === btn.id
                      ? 'bg-[#0265FF] text-white shadow-md shadow-blue-600/20'
                      : 'bg-[#FAF8F5] text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Tech Stack Filters */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider w-full sm:w-auto mr-2 flex items-center gap-1">
                <Cpu size={14} className="text-[#0265FF]" />
                <span>Tech Stack:</span>
              </span>
              {[
                { id: 'all', label: 'All Tech Categories' },
                { id: 'java', label: 'Java / Spring' },
                { id: 'react', label: 'React / Frontend' },
                { id: 'ai', label: 'AI / Data Science' },
                { id: 'devops', label: 'Cloud / DevOps' },
                { id: 'cpp', label: 'Low Latency C++' },
                { id: 'leadership', label: 'Executive CXO' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setFilterTech(btn.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterTech === btn.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-[#FAF8F5] text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

          </div>

          {/* Results Summary Counter */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 font-semibold">
            <span>Showing <strong className="text-[#0265FF] font-bold">{filteredJobs.length}</strong> active verified mandates</span>
            {searchQuery && <span>Filter Keyword: "<strong className="text-slate-900">{searchQuery}</strong>"</span>}
          </div>

          {/* Job Listings Cards */}
          <div className="space-y-4 pt-2">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 bg-[#FAF8F5] rounded-2xl border border-slate-200 space-y-2">
                <Filter className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">No active mandates found matching your search.</h4>
                <p className="text-xs text-slate-500">Try clearing your filters or searching for keywords like "Java", "React", "DevOps", or "Bangalore".</p>
                <button
                  type="button"
                  onClick={() => {
                    setFilterDomain('all');
                    setFilterTech('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0265FF] text-white text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 rounded-2xl bg-[#FAF8F5] hover:bg-white border border-slate-200 hover:border-[#0265FF] hover:shadow-xl hover:shadow-blue-500/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0265FF] border border-blue-200">
                        {job.urgency}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{job.client}</span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-[#0265FF] transition-colors">
                      {job.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0265FF]" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{job.comp}</span>
                      </span>
                      <span className="text-slate-500">• Exp: {job.experience}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                          {t}
                        </span>
                      ))}
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="px-5 py-2.5 rounded-xl bg-[#0265FF] hover:bg-[#004FBF] text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-md shadow-blue-600/20 text-decoration-none"
                    >
                      <span>View Mandate & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </section>
  );
};

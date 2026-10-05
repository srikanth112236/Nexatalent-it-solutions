import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight, CheckCircle2, SlidersHorizontal, RefreshCw, MapPin } from 'lucide-react';

interface ParsedRequirement {
  jobTitle: string;
  skills: string[];
  mandatorySkills: string[];
  experience: string;
  location: string;
  workMode: string;
  salaryCTC: string;
  noticePeriod: string;
  openings: number;
  employmentType: string;
  industry: string;
  visaRequirements: string;
  education: string;
  clientPreferences: string;
}

const PRESET_QUERIES = [
  "I need 5 Java developers in Bangalore with 5+ years experience, Spring Boot, Microservices, immediate joiners and budget up to ₹18 LPA.",
  "Looking for 3 Senior React / Next.js leads in Pune with TypeScript and AWS, 6-8 yrs, notice under 30 days, budget ₹25 LPA.",
  "Require 2 Data Engineers in Hyderabad with PySpark, Databricks, Snowflake, 4+ yrs experience, immediate to 15 days joiners.",
  "Need 1 Principal DevOps SRE in Remote / Delhi NCR with Kubernetes, Terraform, Golang, budget up to ₹35 LPA."
];

const TARGET_HUBS = [
  { city: 'Bangalore', role: 'Staff SRE & Distributed DB', pool: '2,400+ Candidates', sla: '12 Days SLA' },
  { city: 'Hyderabad', role: 'GenAI & GPU Cluster Architects', pool: '1,800+ Candidates', sla: '14 Days SLA' },
  { city: 'Pune', role: 'Cloud SaaS & Full Stack Leads', pool: '1,500+ Candidates', sla: '10 Days SLA' },
  { city: 'London / Remote', role: 'Low-Latency C++ & Quant Trading', pool: '600+ Candidates', sla: '18 Days SLA' },
];

export function AskNexaAiHeroSearch({ 
  onSearchQueryChange,
  onSearch 
}: { 
  onSearchQueryChange?: (q: string) => void;
  onSearch?: (parsed: ParsedRequirement) => void;
}) {
  const [query, setQuery] = useState(PRESET_QUERIES[0]);
  const [selectedHub, setSelectedHub] = useState('Bangalore');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedRequirement | null>({
    jobTitle: 'Senior Java Developer / Microservices Engineer',
    skills: ['Java 17+', 'Spring Boot', 'Microservices', 'RESTful APIs', 'SQL'],
    mandatorySkills: ['Spring Boot', 'Microservices', 'Core Java'],
    experience: '5+ Years (5 to 8 Years range)',
    location: 'Bangalore, Karnataka (Hybrid / On-site)',
    workMode: 'Hybrid (3 days in-office)',
    salaryCTC: 'Up to ₹18,00,000 PA (₹18 LPA)',
    noticePeriod: 'Immediate Joiner (0–15 Days preferred)',
    openings: 5,
    employmentType: 'Full-Time Permanent',
    industry: 'Enterprise Technology / Financial Systems',
    visaRequirements: 'Indian Resident / Valid Employment Authorization',
    education: 'B.Tech / B.E / MCA or equivalent in Computer Science',
    clientPreferences: 'High-throughput transactional systems background, clean code practices'
  });

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (onSearchQueryChange) {
      onSearchQueryChange(val);
    }
  };

  const handleAnalyze = (textToAnalyze?: string) => {
    const text = textToAnalyze || query;
    setIsAnalyzing(true);
    if (onSearchQueryChange) {
      onSearchQueryChange(text);
    }

    setTimeout(() => {
      setIsAnalyzing(false);
      const isReact = text.toLowerCase().includes('react');
      const isData = text.toLowerCase().includes('data') || text.toLowerCase().includes('pyspark');
      const isDevOps = text.toLowerCase().includes('devops') || text.toLowerCase().includes('sre');

      if (isReact) {
        setParsedResult({
          jobTitle: 'Senior React / Frontend Lead',
          skills: ['React 18', 'TypeScript', 'Next.js', 'TailwindCSS', 'Redux / Zustand', 'Jest'],
          mandatorySkills: ['React', 'TypeScript', 'Next.js'],
          experience: '6–8 Years',
          location: 'Pune, Maharashtra (Hybrid)',
          workMode: 'Hybrid (Flexible 2 days office)',
          salaryCTC: 'Up to ₹25,00,000 PA (₹25 LPA)',
          noticePeriod: 'Under 30 Days (Immediate preferred)',
          openings: 3,
          employmentType: 'Full-Time Permanent',
          industry: 'Cloud SaaS / Digital Banking',
          visaRequirements: 'India Work Authorization',
          education: 'B.Tech / M.Tech / MCA',
          clientPreferences: 'Component architecture, micro-frontends, design systems experience'
        });
      } else if (isData) {
        setParsedResult({
          jobTitle: 'Data Engineer / Big Data Specialist',
          skills: ['PySpark', 'Databricks', 'Snowflake', 'Python', 'Apache Kafka', 'Airflow'],
          mandatorySkills: ['PySpark', 'Databricks', 'Snowflake'],
          experience: '4+ Years',
          location: 'Hyderabad, Telangana',
          workMode: 'On-site / Hybrid',
          salaryCTC: 'Up to ₹22,00,000 PA (₹22 LPA)',
          noticePeriod: 'Immediate to 15 Days',
          openings: 2,
          employmentType: 'Full-Time Permanent',
          industry: 'Enterprise Data Platforms',
          visaRequirements: 'India Work Authorization',
          education: 'B.Tech in Computer Science / IT / Data Science',
          clientPreferences: 'ETL pipeline optimization, data lakehouse architecture'
        });
      } else if (isDevOps) {
        setParsedResult({
          jobTitle: 'Principal DevOps / SRE Architect',
          skills: ['Kubernetes', 'Terraform', 'AWS / Azure', 'Golang', 'CI/CD Pipelines', 'Prometheus'],
          mandatorySkills: ['Kubernetes', 'Terraform', 'Golang'],
          experience: '8+ Years',
          location: 'Remote / Delhi NCR',
          workMode: 'Remote-First',
          salaryCTC: 'Up to ₹35,00,000 PA (₹35 LPA)',
          noticePeriod: 'Immediate or 30 Days Buyout',
          openings: 1,
          employmentType: 'Full-Time Permanent',
          industry: 'High-Growth Tech / Infrastructure',
          visaRequirements: 'India Work Authorization',
          education: 'B.Tech / B.E or relevant industry track record',
          clientPreferences: 'SOC2 compliance, infrastructure-as-code, 99.99% uptime systems'
        });
      } else {
        setParsedResult({
          jobTitle: 'Senior Java Developer / Microservices Engineer',
          skills: ['Java 17+', 'Spring Boot', 'Microservices', 'RESTful APIs', 'SQL', 'Docker'],
          mandatorySkills: ['Spring Boot', 'Microservices', 'Core Java'],
          experience: '5+ Years (5 to 8 Years range)',
          location: 'Bangalore, Karnataka (Hybrid / On-site)',
          workMode: 'Hybrid (3 days in-office)',
          salaryCTC: 'Up to ₹18,00,000 PA (₹18 LPA)',
          noticePeriod: 'Immediate Joiner (0–15 Days preferred)',
          openings: 5,
          employmentType: 'Full-Time Permanent',
          industry: 'Enterprise Technology / Financial Systems',
          visaRequirements: 'Indian Resident / Valid Employment Authorization',
          education: 'B.Tech / B.E / MCA or equivalent in Computer Science',
          clientPreferences: 'High-throughput transactional systems background, clean code practices'
        });
      }
    }, 500);
  };

  return (
    <section className="relative w-full pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] text-slate-900 border-b border-slate-200">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 text-[#0265FF] border border-blue-200 shadow-xs uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0265FF]" />
            <span>NEXA AI HIRING ENGINE • VERIFIED TALENT MANDATES</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]"
          >
            “Tell Nexa what talent you need.”
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            Type your requirement in plain English or select a target tech hub. Nexa’s semantic hiring engine extracts structured job specs and displays matching mandates in real time.
          </motion.p>
        </div>

        {/* Global Tech Hub Telemetry Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TARGET_HUBS.map((hub) => {
            const isSelected = selectedHub === hub.city;
            return (
              <button
                key={hub.city}
                type="button"
                onClick={() => {
                  setSelectedHub(hub.city);
                  handleQueryChange(hub.city);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-[#0265FF] shadow-lg shadow-blue-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0265FF]" />
                    <span>{hub.city}</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {hub.sla}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-[#0265FF] truncate">{hub.role}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{hub.pool}</div>
              </button>
            );
          })}
        </div>

        {/* Main AI Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xl shadow-blue-900/5 space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <div className="absolute top-4 left-4 pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-[#0265FF]" />
              </div>
              <textarea
                rows={2}
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="e.g. I need 5 Java developers in Bangalore with 5+ years experience, Spring Boot, Microservices, immediate joiners..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#FAF8F5] border border-slate-200 rounded-2xl text-slate-900 text-sm sm:text-base placeholder-slate-400 focus:outline-none focus:border-[#0265FF] focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-medium"
              />
            </div>
            <div className="flex md:flex-col justify-end gap-2">
              <button
                type="button"
                onClick={() => handleAnalyze()}
                disabled={isAnalyzing}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#0265FF] hover:bg-[#004FBF] text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract Specs</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Quick Sample Queries:</span>
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  handleQueryChange(preset);
                  handleAnalyze(preset);
                }}
                className="text-xs px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-[#0265FF] text-slate-700 border border-slate-200 transition-all text-left truncate max-w-[280px] sm:max-w-xs font-semibold cursor-pointer"
              >
                {preset.slice(0, 44)}...
              </button>
            ))}
          </div>
        </motion.div>

        {/* Structured AI Output Grid */}
        {parsedResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="bg-white border border-blue-200 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-900/5 relative overflow-hidden space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#0265FF] tracking-wider block mb-1">
                  TARGET ROLE SPECIFICATION IDENTIFIED
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                  {parsedResult.jobTitle}
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-[#0265FF] border border-blue-200 font-bold">
                    {parsedResult.openings} Openings
                  </span>
                </h3>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Specs Extracted</span>
              </span>
            </div>

            {/* Structured Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">1. Mandatory Skills</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {parsedResult.mandatorySkills.map((sk, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-100 text-[#0265FF] font-extrabold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">2. Experience Required</span>
                <span className="font-extrabold text-slate-900 text-sm">{parsedResult.experience}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">3. Primary Location</span>
                <span className="font-extrabold text-slate-900 text-sm">{parsedResult.location}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">4. Work Mode</span>
                <span className="font-extrabold text-emerald-700 text-sm">{parsedResult.workMode}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">5. Target CTC Band</span>
                <span className="font-extrabold text-[#0265FF] text-sm">{parsedResult.salaryCTC}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">6. Notice Period</span>
                <span className="font-extrabold text-amber-700 text-sm">{parsedResult.noticePeriod}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">7. Industry Domain</span>
                <span className="font-extrabold text-slate-900 text-xs">{parsedResult.industry}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 space-y-1">
                <span className="text-slate-500 font-semibold block">8. Employment Term</span>
                <span className="font-extrabold text-slate-900 text-xs">{parsedResult.employmentType}</span>
              </div>
            </div>

            {/* Action Strip */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <SlidersHorizontal className="w-4 h-4 text-[#0265FF]" />
                <span>Nexa Talent Database: <strong className="text-slate-900 font-bold">42 Matching Candidate Dossiers Ready</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onSearch && parsedResult) onSearch(parsedResult);
                  const el = document.getElementById('jobs-interactive-filter-deck');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-[#0265FF] hover:bg-[#004FBF] text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95 cursor-pointer"
              >
                <span>View Filtered Mandates Below</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}

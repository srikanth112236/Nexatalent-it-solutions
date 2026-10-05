import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  BarChart3, 
  Building2, 
  FileText,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURED_REPORTS = [
  {
    id: 'salary-guide-2026',
    slug: 'india-tech-salary-guide-2026',
    category: 'Salary & Equity Benchmark 2026',
    title: 'India Technology Compensation & Equity Report',
    stat: '+35%',
    statLabel: 'Generative AI Skill Premium',
    summary: 'Audited analysis of 30,000+ verified tech offers across Bengaluru, Hyderabad, and Pune. Includes base CTC, ESOP vesting, and retention buyouts.',
    highlights: ['Senior Backend CTC up 18%', 'Notice period buyout trends', 'Equity vesting schedules']
  },
  {
    id: 'gcc-playbook',
    slug: 'gcc-setup-playbook-india',
    category: 'GCC Leadership Blueprint',
    title: 'Fortune 500 GCC Setup & Arbitrage Playbook',
    stat: '64%',
    statLabel: 'Operating Cost Arbitrage',
    summary: 'Turnkey institutional guide for global CIOs establishing technical delivery hubs in India. STPI/SEZ clearance, site selection, and leadership hiring.',
    highlights: ['Bengaluru vs Hyderabad cost matrix', 'Grade leveling alignment', 'Minimizing Day-0 dropouts']
  },
  {
    id: 'systems-vetting',
    slug: 'distributed-systems-interview-blueprint',
    category: 'Engineering Evaluation Rubric',
    title: 'Staff Systems Design & Concurrency Scorecard',
    stat: '98.5%',
    statLabel: 'Evaluation Pass Accuracy',
    summary: 'Why traditional LeetCode puzzles fail to evaluate distributed systems competence. A practical 4-stage scorecard for Raft, cache coherence, and kernel bypass.',
    highlights: ['Memory-alignment scoring', 'Live coding sandboxes', 'System design interview rubrics']
  }
];

export const LightInsightsHeroBanner: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState(0);
  const current = FEATURED_REPORTS[selectedReport];

  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        backgroundColor: '#FAF8F5',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(2, 101, 255, 0.07) 0%, rgba(250, 248, 245, 0) 70%)',
        borderBottom: '1px solid #E2E8F0',
        paddingTop: '6rem',
        paddingBottom: '5rem',
        overflow: 'hidden'
      }}
    >
      {/* Background Subtle Grid Pattern */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.35,
          pointerEvents: 'none'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline, Subtext, Primary Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Entity Badge Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-blue-200 shadow-sm"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#0265FF] animate-pulse" />
              <span className="text-xs sm:text-sm font-bold tracking-wide text-[#0265FF] uppercase">
                NexaTalent IT Solutions Private Limited
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                <BookOpen size={13} className="text-[#0265FF]" /> Intelligence & Research Desk
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
            >
              Ground-Truth Tech Sourcing <br className="hidden sm:block" />
              & <span className="bg-gradient-to-r from-[#0265FF] via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Compensation Intelligence
              </span>
            </motion.h1>

            {/* Subheadline Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl"
            >
              Real-world compensation benchmarks, GCC scaling strategies, and technical practitioner vetting scorecards published by NexaTalent IT Solutions based on 30,000+ verified engineering offer records.
            </motion.p>

            {/* Live Macro Metrics Strip */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
            >
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-[#0265FF] font-bold text-xs">
                  <BarChart3 size={14} /> Offers Analyzed
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">30,000+</div>
                <div className="text-[11px] text-slate-500">Verified India Offer Datapoints</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <TrendingUp size={14} /> Tech Practice Hubs
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">6 Cities</div>
                <div className="text-[11px] text-slate-500">BLR, HYD, PUN, BOM, DEL, Remote</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xs">
                  <FileText size={14} /> Active Reports
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">18+</div>
                <div className="text-[11px] text-slate-500">Institutional Playbooks</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
                  <ShieldCheck size={14} /> Audited Accuracy
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">100%</div>
                <div className="text-[11px] text-slate-500">Ground-Truth Sourcing Data</div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <a
                href="#research-library"
                className="px-7 py-4 rounded-xl bg-[#0265FF] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Explore Intelligence Library</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                to="/contact"
                className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition-all flex items-center gap-2"
              >
                <span>Request Custom Salary Audit</span>
                <Sparkles size={16} className="text-amber-500" />
              </Link>
            </motion.div>

          </div>

          {/* Right Column: Featured Research Spotlight Console */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6 relative"
            >
              {/* Header inside Card */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-bold text-[#0265FF] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={14} /> Flagship Report Spotlight
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Nexa Research Edition 2026</h3>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {FEATURED_REPORTS.map((r, idx) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedReport(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedReport === idx
                          ? 'bg-[#0265FF] text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Report Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <span className="text-xs font-bold text-[#0265FF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                      {current.category}
                    </span>
                    <h4 className="text-xl font-extrabold text-slate-900 mt-2.5 leading-snug">
                      {current.title}
                    </h4>
                  </div>

                  {/* Key Stat Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-[#0265FF] font-mono">{current.stat}</div>
                      <div className="text-xs font-semibold text-slate-600">{current.statLabel}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0265FF]">
                      <BarChart3 size={20} />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {current.summary}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-semibold text-slate-500">Key Research Takeaways:</div>
                    {current.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-slate-800 font-medium">
                        <CheckCircle2 size={14} className="text-[#0265FF] shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/insights/${current.slug}`}
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Read Full Executive Article</span>
                    <ChevronRight size={15} />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Building2 size={13} className="text-[#0265FF]" /> Nexa Talent Advisory
                </span>
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <Lock size={13} /> 100% Verifiable Data
                </span>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

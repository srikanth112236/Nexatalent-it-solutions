import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CASE_HIGHLIGHTS = [
  {
    id: 'fintech',
    category: 'FinTech & High-Frequency Trading',
    client: 'Global HFT & Crypto Exchange',
    headline: 'Scaling 45+ Low-Latency C++/Rust Engineers in 14 Days',
    metrics: [
      { label: 'Shortlist Velocity', value: '48 Hours', change: '-80% vs agency avg' },
      { label: 'Technical Pass Rate', value: '94%', change: '3-stage code vetting' },
      { label: 'Cost Arbitrage Savings', value: '₹3.4 Cr', change: 'Audited Cost-Plus' }
    ],
    quote: 'NexaTalent IT Solutions delivered production-ready systems engineers who passed our kernel benchmark on day one.'
  },
  {
    id: 'gcc',
    category: 'Global Capability Center (GCC)',
    client: 'Fortune 500 Enterprise GCC Bangalore',
    headline: 'Zero-CapEx Deployment of a 250-Seat AI & Data Center',
    metrics: [
      { label: 'Squad Expansion', value: '250 Engineers', change: 'Under 90 Days' },
      { label: '90-Day Retention', value: '98.8%', change: 'Unconditional SLA' },
      { label: 'Hiring Cost Reduction', value: '52%', change: 'Direct sourcing graph' }
    ],
    quote: 'NexaTalent set up our entire data platform unit with absolute transparency. Their Cost-Plus framework saved us millions.'
  },
  {
    id: 'health-ai',
    category: 'Healthcare & GenAI Labs',
    client: 'HIPAA-Compliant Medical AI Pioneer',
    headline: 'Rapid Assembly of 18 GenAI & LLM Fine-Tuning Researchers',
    metrics: [
      { label: 'First Candidate Pitch', value: '36 Hours', change: 'Targeted talent graph' },
      { label: 'Compliance Index', value: '100% Pass', change: 'HIPAA & SOC2 vetted' },
      { label: 'Offer Acceptance', value: '96%', change: 'Strategic compensation' }
    ],
    quote: 'Finding LLM researchers with real PyTorch & CUDA experience was impossible until NexaTalent stepped in.'
  }
];

export const LightCaseStudiesHeroBanner: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState(0);
  const current = CASE_HIGHLIGHTS[selectedCase];

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
      {/* Decorative Grid Pattern */}
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
          
          {/* Left Column: Headline, Proof Pitch, Primary Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Pill */}
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
                <BarChart3 size={13} className="text-[#0265FF]" /> Audited Client Outcomes
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
            >
              Proven Enterprise Hiring Impact <br className="hidden sm:block" />
              & <span className="bg-gradient-to-r from-[#0265FF] via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Quantified Case Benchmarks
              </span>
            </motion.h1>

            {/* Subheadline Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl"
            >
              Explore how Fortune 500 enterprises, tech unicorns, and GCCs leverage NexaTalent IT Solutions’ 3-stage practitioner vetting and Cost-Plus transparency to reduce hiring time by 65%, save crores in recruitment overhead, and maintain 98.4% 90-day retention.
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
                  <TrendingUp size={14} /> Total Hires Deployed
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">2,400+</div>
                <div className="text-[11px] text-slate-500">Across IN, US & EU Tech Hubs</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <DollarSign size={14} /> Aggregate Cost Savings
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">₹48.5 Cr</div>
                <div className="text-[11px] text-slate-500">Saved via Cost-Plus Model</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xs">
                  <Clock size={14} /> Avg Shortlist SLA
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">72 Hours</div>
                <div className="text-[11px] text-slate-500">First Vetted Mandate Delivery</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
                  <ShieldCheck size={14} /> 90-Day Retention
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">98.4%</div>
                <div className="text-[11px] text-slate-500">Zero-Surcharge Replacement</div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <a
                href="#featured-case-studies"
                className="px-7 py-4 rounded-xl bg-[#0265FF] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group"
              >
                <span>Explore Client Case Benchmarks</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                to="/contact"
                className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition-all flex items-center gap-2"
              >
                <span>Request Customized ROI Audit</span>
                <Sparkles size={16} className="text-amber-500" />
              </Link>
            </motion.div>

          </div>

          {/* Right Column: Dynamic Case Study Spotlight Selector */}
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
                    <Award size={14} /> Case Benchmark Spotlight
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Verified Client Proof</h3>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {CASE_HIGHLIGHTS.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedCase(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedCase === idx
                          ? 'bg-[#0265FF] text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Case Details */}
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
                      {current.headline}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Client: <span className="text-slate-800 font-bold">{current.client}</span>
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    {current.metrics.map((m) => (
                      <div key={m.label} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[10px] font-semibold text-slate-500">{m.label}</div>
                        <div className="text-base font-extrabold text-slate-900 mt-0.5 font-mono">{m.value}</div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">{m.change}</div>
                      </div>
                    ))}
                  </div>

                  {/* Quote Block */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-700 italic leading-relaxed">
                    "{current.quote}"
                  </div>

                  <Link
                    to={`/case-studies/${current.id}`}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Read Full Technical Case Study</span>
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Building2 size={13} className="text-[#0265FF]" /> Fortune 500 & Unicorn Vetted
                </span>
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 size={13} /> 100% Verified Outcomes
                </span>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

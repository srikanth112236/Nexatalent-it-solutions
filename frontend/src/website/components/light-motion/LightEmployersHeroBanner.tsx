import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Cpu, 
  Briefcase, 
  Lock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EMPLOYER_SOLUTIONS = [
  {
    id: 'lateral-search',
    name: 'Lateral Tech Search',
    badge: '72h Shortlist Velocity',
    title: 'Senior Engineering & Specialized Tech Search',
    description: 'Pre-vetted lateral hiring for Senior Backend (Go/Rust/C++), AI/ML Researchers, and Cloud DevOps. Zero unscreened resume dumps.',
    metrics: [
      { label: 'Shortlist Delivery', value: '72 Hours' },
      { label: 'Technical Pass Rate', value: '94%' },
      { label: '90-Day Retention', value: '98.4%' }
    ]
  },
  {
    id: 'gcc-turnkey',
    name: 'Turnkey GCC Deployment',
    badge: 'Zero-CapEx BOT Model',
    title: 'India Global Capability Center Setup',
    description: 'Autonomous 50–500 seat engineering centers deployed in Bangalore, Hyderabad, and Pune. Entity setup, SEZ clearance, and principal staff.',
    metrics: [
      { label: 'Center Handover', value: '75 Days' },
      { label: 'Cost Arbitrage', value: '64%' },
      { label: 'Entity Compliance', value: '100% Audit' }
    ]
  },
  {
    id: 'contract-staffing',
    name: 'Contract Staff Augmentation',
    badge: 'Audited Cost-Plus Terms',
    title: 'On-Demand Developer Squad Augmentation',
    description: 'Scale engineering bandwidth instantly with pre-screened developers under transparent Cost-Plus open-book contracts.',
    metrics: [
      { label: 'Squad Onboarding', value: '7 Days' },
      { label: 'Margin Transparency', value: 'Cost-Plus' },
      { label: 'EOR Governance', value: 'ISO 27001' }
    ]
  },
  {
    id: 'executive-search',
    name: 'Executive Tech Leadership',
    badge: 'C-Suite & VP Placement',
    title: 'CTO, VP of Eng & Site Director Search',
    description: 'Confidential executive search for site leads, heads of engineering, and principal architects with 90-day replacement guarantees.',
    metrics: [
      { label: 'Candidate Pitch', value: '5 Days' },
      { label: 'Placement Lock', value: '90 Days' },
      { label: 'Offer Acceptance', value: '96%' }
    ]
  }
];

export const LightEmployersHeroBanner: React.FC = () => {
  const [selectedSolution, setSelectedSolution] = useState(0);
  const current = EMPLOYER_SOLUTIONS[selectedSolution];

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
      {/* Decorative Background Grid */}
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
          
          {/* Left Column: Headline, Subheadline, Primary CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Entity Badge */}
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
                <Building2 size={13} className="text-[#0265FF]" /> Enterprise Employer Partner
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
            >
              Why Tech Leaders & GCCs <br className="hidden sm:block" />
              Scale Engineering Squads With <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#0265FF] via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                NexaTalent IT Solutions
              </span>
            </motion.h1>

            {/* Subheadline Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl"
            >
              We replaced broken legacy headhunting with 3-stage practitioner code vetting, open-book Cost-Plus pricing transparency, and 72-hour shortlist SLAs. Tailored for VPs of Engineering, CTOs, and GCC Site Directors.
            </motion.p>

            {/* Key Employer Metrics Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
            >
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-[#0265FF] font-bold text-xs">
                  <Clock size={14} /> Shortlist Velocity
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">72 Hours</div>
                <div className="text-[11px] text-slate-500">First Dossier SLA</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <ShieldCheck size={14} /> Replacement SLA
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">90 Days</div>
                <div className="text-[11px] text-slate-500">Zero Surcharge Swap</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xs">
                  <Cpu size={14} /> Code Vetting
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">3 Stages</div>
                <div className="text-[11px] text-slate-500">System Architecture Sandbox</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
                  <DollarSign size={14} /> Open Book
                </div>
                <div className="mt-1 text-2xl font-extrabold text-slate-900 font-mono">Cost-Plus</div>
                <div className="text-[11px] text-slate-500">100% Audited Terms</div>
              </div>
            </motion.div>

            {/* Action CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <a
                href="#client-registration"
                className="px-7 py-4 rounded-xl bg-[#0265FF] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Submit Technical Requisition</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>

              <Link
                to="/contact"
                className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition-all flex items-center gap-2"
              >
                <span>Schedule Executive Talent Call</span>
                <Sparkles size={16} className="text-amber-500" />
              </Link>
            </motion.div>

            {/* Enterprise Compliance Bar */}
            <div className="pt-2 flex items-center gap-6 text-slate-400 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Lock size={13} className="text-emerald-500" /> ISO 27001 Certified
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck size={13} className="text-[#0265FF]" /> SOC 2 Type II Compliant
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <Award size={13} className="text-purple-500" /> DPDP Data Protection
              </span>
            </div>

          </div>

          {/* Right Column: Interactive Employer Practice Console */}
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
                    <Briefcase size={14} /> Employer Sourcing Suite
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Calibrated Enterprise Capabilities</h3>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {EMPLOYER_SOLUTIONS.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSolution(idx)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedSolution === idx
                          ? 'bg-[#0265FF] text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      0{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Solution Card */}
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
                      {current.badge}
                    </span>
                    <h4 className="text-xl font-extrabold text-slate-900 mt-2.5 leading-snug">
                      {current.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal mt-1.5">
                      {current.description}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2.5 pt-2">
                    {current.metrics.map((m) => (
                      <div key={m.label} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[10px] font-semibold text-slate-500">{m.label}</div>
                        <div className="text-base font-extrabold text-slate-900 mt-0.5 font-mono">{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <a
                    href="#client-registration"
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Request Mandate for {current.name}</span>
                    <ChevronRight size={15} />
                  </a>
                </motion.div>
              </AnimatePresence>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Building2 size={13} className="text-[#0265FF]" /> 120+ Active Enterprise Clients
                </span>
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 size={13} /> 100% Recruiter Verified
                </span>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

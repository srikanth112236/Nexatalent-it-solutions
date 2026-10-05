import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Building2, 
  Zap, 
  FileCheck2,
  Code2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ROLE_PRESETS = [
  { id: 'fullstack', name: 'Full-Stack & Systems', count: 48, skills: 'React, Node, Go, Rust, C++' },
  { id: 'ai-ml', name: 'AI / ML & GenAI', count: 32, skills: 'PyTorch, CUDA, RAG, LLM Fine-Tuning' },
  { id: 'cloud-sre', name: 'Cloud, DevOps & SRE', count: 29, skills: 'AWS, Kubernetes, Terraform, eBPF' },
  { id: 'gcc-leadership', name: 'GCC Leadership & VP', count: 14, skills: 'Site Directors, Principal Architects' }
];

export const LightRequestTalentHeroBanner: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState('fullstack');
  const currentRole = ROLE_PRESETS.find(r => r.id === selectedRole) || ROLE_PRESETS[0];

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
          
          {/* Left Column: Headline, Value Props, Primary Action */}
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
                <Zap size={13} className="text-amber-500" /> Express 72h Requisition Engine
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
            >
              Deploy Calibrated Engineering <br className="hidden sm:block" />
              Talent & Pods in <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[#0265FF] via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                72 Hours Guaranteed
              </span>
            </motion.h1>

            {/* Subheadline Paragraph */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl"
            >
              Zero unscreened resumes. NexaTalent IT Solutions provides enterprise engineering leaders with 3-stage practitioner vetting, open-book Cost-Plus margin transparency, and guaranteed 90-day candidate replacement protection.
            </motion.p>

            {/* Key Value Metric Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
            >
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-[#0265FF] font-bold text-xs">
                  <Clock size={14} /> Shortlist SLA
                </div>
                <div className="mt-1 text-xl font-extrabold text-slate-900 font-mono">72 Hours</div>
                <div className="text-[11px] text-slate-500">First Dossier Delivery</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <ShieldCheck size={14} /> Retention SLA
                </div>
                <div className="mt-1 text-xl font-extrabold text-slate-900 font-mono">90 Days</div>
                <div className="text-[11px] text-slate-500">Free Squad Replacement</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xs">
                  <Cpu size={14} /> Technical Vetting
                </div>
                <div className="mt-1 text-xl font-extrabold text-slate-900 font-mono">3 Stages</div>
                <div className="text-[11px] text-slate-500">Code & Systems Sandbox</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
                  <FileCheck2 size={14} /> Margins
                </div>
                <div className="mt-1 text-xl font-extrabold text-slate-900 font-mono">Cost-Plus</div>
                <div className="text-[11px] text-slate-500">100% Audited Terms</div>
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

            {/* Compliance Bar */}
            <div className="pt-2 flex items-center gap-6 text-slate-400 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Lock size={13} className="text-emerald-500" /> ISO 27001 Certified
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck size={13} className="text-[#0265FF]" /> SOC 2 Type II Compliant
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <Building2 size={13} className="text-purple-500" /> 120+ Tech Orgs Partnered
              </span>
            </div>

          </div>

          {/* Right Column: Interactive Talent Graph & Requisition Preview */}
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
                    <Code2 size={14} /> Live Talent Graph Console
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Instant Pre-Vetted Availability</h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Network
                </span>
              </div>

              {/* Interactive Role Switcher */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-500">Select Target Practice / Pod Role:</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLE_PRESETS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`p-2.5 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                        selectedRole === r.id
                          ? 'bg-blue-50 border-[#0265FF] text-[#0265FF] shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div>{r.name}</div>
                      <div className="text-[10px] font-normal text-slate-500 mt-0.5">{r.count} Candidates Available</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Requisition Output Box */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRole.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Practice Skill Matrix:</span>
                    <span className="text-blue-600 font-bold">{currentRole.count} Pre-Screened Candidates</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 font-mono bg-white p-2.5 rounded-xl border border-slate-200">
                    {currentRole.skills}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      <span>Notice: 0 - 30 Days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-[#0265FF]" />
                      <span>Code Score: 92%+ Pass</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Card Action Link */}
              <a
                href="#client-registration"
                className="w-full py-3.5 rounded-xl bg-[#0265FF] hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <span>Request Shortlist For {currentRole.name}</span>
                <ChevronRight size={15} />
              </a>

              {/* Footer inside Card */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Users size={13} className="text-[#0265FF]" /> Recruiter Verified
                </span>
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <CheckCircle2 size={13} /> Zero Agency Markup
                </span>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

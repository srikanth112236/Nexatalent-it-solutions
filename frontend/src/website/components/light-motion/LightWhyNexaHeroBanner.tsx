import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Award,
  TrendingUp,
  Cpu,
  FileCheck2,
  Lock,
  Building2,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LightWhyNexaHeroBanner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nexatalent' | 'traditional'>('nexatalent');

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
          
          {/* Left Column: Headline, Trust Badges, CTAs */}
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
                <Sparkles size={13} className="text-amber-500" /> Top AI Tech Talent Partner
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
            >
              Why Enterprise Leaders <br className="hidden sm:block" />
              & GCCs Partner With <br className="hidden sm:block" />
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
              We replaced legacy contingency headhunting with structured AI practitioner vetting, auditable Cost-Plus margin transparency, and guaranteed 72-hour shortlist SLAs. Built for scaling engineering hubs, GCCs, and high-growth technology unicorns.
            </motion.p>

            {/* Key Value Metric Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2"
            >
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-[#0265FF] font-bold text-xs">
                  <Clock size={14} /> SLA Velocity
                </div>
                <div className="mt-1.5 text-xl font-extrabold text-slate-900">72 Hours</div>
                <div className="text-[11px] text-slate-500">First Shortlist Delivery</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                  <ShieldCheck size={14} /> Guarantee
                </div>
                <div className="mt-1.5 text-xl font-extrabold text-slate-900">90 Days</div>
                <div className="text-[11px] text-slate-500">Free Candidate Swap</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xs">
                  <Cpu size={14} /> Technical Vetting
                </div>
                <div className="mt-1.5 text-xl font-extrabold text-slate-900">3 Stages</div>
                <div className="text-[11px] text-slate-500">Code & RAG Benchmarks</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs">
                  <FileCheck2 size={14} /> Margin Governance
                </div>
                <div className="mt-1.5 text-xl font-extrabold text-slate-900">Cost-Plus</div>
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
              <Link
                to="/contact"
                className="px-7 py-4 rounded-xl bg-[#0265FF] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 group"
              >
                <span>Schedule Executive Talent Briefing</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#cost-plus"
                className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition-all flex items-center gap-2"
              >
                <span>Explore Cost-Plus Model</span>
                <TrendingUp size={16} className="text-[#0265FF]" />
              </a>
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

          {/* Right Column: Interactive Comparison Matrix Card */}
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
                    <Zap size={14} /> Interactive Benchmark
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">Agency Model Benchmark</h3>
                </div>
                
                {/* Switcher Toggle */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('nexatalent')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'nexatalent'
                        ? 'bg-[#0265FF] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    NexaTalent
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('traditional')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'traditional'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Legacy Agency
                  </button>
                </div>
              </div>

              {/* Dynamic Comparison Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'nexatalent' ? (
                  <motion.div
                    key="nexatalent"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Shortlist Velocity SLA</span>
                        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">72 Hours</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#0265FF] shrink-0" />
                        <span>Pre-vetted talent graph across IN & EU hubs</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Technical Practitioner Vetting</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">3-Stage Engine</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span>Code reviews, system design & RAG benchmarks</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Economic & Pricing Model</span>
                        <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">Cost-Plus Open Book</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-purple-600 shrink-0" />
                        <span>Audited gross margins with zero hidden fees</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Candidate Lock & Guarantee</span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">90-Day Free Replacement</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-amber-600 shrink-0" />
                        <span>98.4% 90-day retention with instant squad swap</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="traditional"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 opacity-75">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Shortlist Velocity SLA</span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">4 - 6 Weeks</span>
                      </div>
                      <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <XCircle size={16} className="text-rose-500 shrink-0" />
                        <span>Slow manual sourcing with high candidate dropoffs</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 opacity-75">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Technical Practitioner Vetting</span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">Resume Forwarding</span>
                      </div>
                      <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <XCircle size={16} className="text-rose-500 shrink-0" />
                        <span>Unscreened resumes dumped onto internal hiring managers</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 opacity-75">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Economic & Pricing Model</span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">Hidden 40-70% Margin</span>
                      </div>
                      <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <XCircle size={16} className="text-rose-500 shrink-0" />
                        <span>Opaque bill rates with massive markups</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 opacity-75">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500">Candidate Lock & Guarantee</span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-full">Limited 30 Days</span>
                      </div>
                      <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <XCircle size={16} className="text-rose-500 shrink-0" />
                        <span>Minimal protection with long replacement delays</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Building2 size={13} className="text-[#0265FF]" /> Trusted by 120+ Tech Orgs
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Users size={13} className="text-emerald-500" /> 2,400+ Engineers Deployed
                </span>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  TrendingUp,
  Activity,
  ChevronDown,
  Award
} from 'lucide-react';

import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { AskNexaAiHeroSearch, AiMatchEngineRadar, NexaTalentIntelligenceSuite } from '../components/ai-engines';

export function HomePage() {
  const [squadSize, setSquadSize] = useState(3);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'dubai' | 'riyadh' | 'bangalore'>('dubai');

  const usPayroll = squadSize * 160000;
  const nexaPayroll = squadSize * 65000;
  const annualSavings = usPayroll - nexaPayroll;

  const hubDetails = {
    dubai: { city: 'Dubai Silicon Oasis Hub', talent: '14,200+ Vetted Engineers', ping: '8ms latency', focus: 'AI & Fintech Pods' },
    riyadh: { city: 'Riyadh KAFD Hub', talent: '9,800+ Vetted Engineers', ping: '10ms latency', focus: 'Enterprise & Security' },
    bangalore: { city: 'Bangalore Tech Center', talent: '45,000+ Vetted Engineers', ping: '12ms latency', focus: 'Full Stack & Backend' },
  };

  const faqs = [
    { q: 'How quickly can engineers start working with our team?', a: 'Once matched and approved, engineers integrate directly into your Slack, Jira, and GitHub repositories within 72 hours.' },
    { q: 'What is the 14-day risk-free trial period?', a: 'You get 14 full days to work directly with the engineer. If you are not 100% satisfied with their output, you pay nothing.' },
    { q: 'How does NexaTalent IT Solutions handle candidate vetting?', a: 'Every engineer undergoes automated algorithmic code tests, live system architecture interviews, and C2-level English communication checks.' },
    { q: 'Who retains the intellectual property rights?', a: 'Your corporate entity retains 100% full ownership of all code, patents, and work output created by the team.' },
  ];

  return (
    <div
      id="main-content"
      className="bg-white min-h-screen text-neutral-900 font-sans relative overflow-x-clip"
    >
      <SeoHead
        title="AI-Powered Talent. Human Intelligence. Better Hiring."
        description="NexaTalent IT Solutions connects companies, recruitment partners, and technology professionals through an intelligent hiring ecosystem designed to discover, match, and deliver talent faster."
        keywords="IT Recruitment, IT Staffing, AI Recruitment Platform, Hire IT Talent, Tech Recruitment Bengaluru, GCC Turnkey Pods, Lateral Sourcing India, Recruitment Operating System"
        canonicalPath="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "NexaTalent IT Solutions",
          "url": "https://nexatalent.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://nexatalent.com/jobs?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />

      <SiteNavbar />

      {/* ============================================================================
       * 1. HERO SECTION — Clean Modern Luxury Light Theme
       * ============================================================================ */}
      <section className="relative pt-32 pb-20 px-6 lg:px-16 bg-white border-b border-neutral-200/80 text-center overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            NexaTalent IT Solutions — Intelligent Hiring Ecosystem
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-neutral-900 tracking-tight leading-[1.08] uppercase">
            AI-Powered Talent. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600">
              Human Intelligence. Better Hiring.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-neutral-600 max-w-3xl mx-auto font-normal leading-relaxed">
            NexaTalent IT Solutions connects companies, recruitment partners, and technology professionals through an intelligent hiring ecosystem designed to discover, match, and deliver top 1% tech talent faster.
          </p>

          {/* 4 Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/employers"
              className="px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-2"
            >
              Hire Talent <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/employers#post-requirement-section"
              className="px-7 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold text-sm rounded-xl transition-all shadow-sm"
            >
              Submit Requirement
            </Link>
            <Link
              to="/candidates"
              className="px-7 py-3.5 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold text-sm rounded-xl transition-all shadow-sm"
            >
              Upload Resume
            </Link>
            <Link
              to="/partners"
              className="px-7 py-3.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-sm rounded-xl transition-all"
            >
              Become a Recruitment Partner
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-10 border-t border-neutral-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-neutral-900">72 Hours</div>
              <div className="text-xs text-neutral-500 font-medium mt-1">Average Match & Deploy</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">99.4%</div>
              <div className="text-xs text-neutral-500 font-medium mt-1">14-Day Trial Pass Rate</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">60%</div>
              <div className="text-xs text-neutral-500 font-medium mt-1">Payroll Cost Arbitrage</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">50,000+</div>
              <div className="text-xs text-neutral-500 font-medium mt-1">Vetted Tech Professionals</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 2. AI TALENT SEARCH ENGINE
       * ============================================================================ */}
      <section className="py-12 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <AskNexaAiHeroSearch />
        </div>
      </section>

      {/* ============================================================================
       * 3. NEXATALENT INTELLIGENCE SUITE
       * ============================================================================ */}
      <section className="py-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <NexaTalentIntelligenceSuite />
        </div>
      </section>

      {/* ============================================================================
       * 4. 6-FACTOR AI MATCH ENGINE RADAR
       * ============================================================================ */}
      <section className="py-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <AiMatchEngineRadar />
        </div>
      </section>

      {/* ============================================================================
       * 5. DRIBBBBL-STYLE BENTO FEATURES GRID
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200">
              High-Velocity Platform Features
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
              Built for Modern Engineering Organizations
            </h2>
            <p className="text-base text-neutral-600">
              Vetted talent, automated algorithmic code benchmarks, and turnkey global HR management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-xl transition-all space-y-4 md:col-span-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900">72-Hour Candidate Matching Engine</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Our AI algorithm evaluates technical competency vectors, system design experience, and timezone availability to present 3 hand-picked candidates matched specifically to your repository.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3.5 py-1 bg-white border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700">PyTorch & LLMs</span>
                <span className="px-3.5 py-1 bg-white border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700">React 19 & Next.js</span>
                <span className="px-3.5 py-1 bg-white border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700">Golang & Rust</span>
                <span className="px-3.5 py-1 bg-white border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700">Kubernetes & AWS</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-900 text-white space-y-4 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold">SOC2 & GDPR Compliant</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  100% intellectual property transfer, hardware security controls, and enterprise NDAs executed before candidate deployment.
                </p>
              </div>
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-emerald-400 font-bold">
                <span>Enterprise Grade Security</span>
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Up to 60% Cost Arbitrage</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Access senior software engineers in Dubai, Riyadh, and Bangalore at a fraction of US/UK local hiring rates.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-indigo-50/60 border border-indigo-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Turnkey Offshore Hubs</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We handle local employment contracts, employee benefits, hardware logistics, and office space setup.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-purple-50/60 border border-purple-200 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900">14-Day Risk-Free Trial</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Work directly with the engineer for 14 days. If you are not satisfied with their code output, pay zero.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 6. 4-STEP ONBOARDING WORKFLOW
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-[#FAF8F5] border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Simple & Transparent Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">From Requirement to Hired in 4 Steps</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Scope Requirements', desc: 'Define your tech stack, seniority, headcount, and target timezone overlap.' },
              { step: '02', title: 'Automated AI Code Vetting', desc: 'Candidates complete algorithm benchmarks, system design defenses, and English checks.' },
              { step: '03', title: 'Inspect Dossiers & Interview', desc: 'Review pre-evaluated candidate profiles and conduct targeted 30-minute interviews.' },
              { step: '04', title: '72-Hour Deployment', desc: 'Selected engineers join your Slack, Jira, and GitHub repositories with zero delay.' },
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-white rounded-3xl border border-neutral-200/80 shadow-md relative space-y-3 hover:shadow-xl transition-all">
                <span className="text-4xl font-black text-amber-500 block">{item.step}</span>
                <h4 className="font-bold text-lg text-neutral-900">{item.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 7. GCC & GLOBAL TALENT CORRIDORS
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Regional Talent Nodes
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
              GCC & Offshore Technology Hubs
            </h2>
            <p className="text-base text-neutral-600 leading-relaxed">
              Direct access to top 1% software engineers, AI architects, and DevOps leads across Dubai, Riyadh, and Bangalore corridors with 4-6 hours of daily timezone overlap.
            </p>

            <div className="flex gap-2">
              {(['dubai', 'riyadh', 'bangalore'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setActiveTab(h)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    activeTab === h
                      ? 'bg-neutral-900 text-white shadow-md'
                      : 'bg-slate-100 text-neutral-700 hover:bg-slate-200'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-neutral-900">{hubDetails[activeTab].city}</h4>
                <span className="text-xs font-mono text-emerald-600 font-bold">{hubDetails[activeTab].ping}</span>
              </div>
              <p className="text-xs text-neutral-600">{hubDetails[activeTab].talent} • Focus: <strong>{hubDetails[activeTab].focus}</strong></p>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 text-white p-8 rounded-3xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span className="text-sm font-bold">NexaTalent Hub Telemetry</span>
              </div>
              <span className="text-xs font-mono text-emerald-400">STATUS: ACTIVE</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-neutral-800/80 rounded-2xl border border-neutral-700 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">Dubai Silicon Oasis Node</div>
                  <div className="text-[11px] text-neutral-400">14,200+ Vetted Engineers • GMT+4</div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded-full">ACTIVE</span>
              </div>
              <div className="p-4 bg-neutral-800/80 rounded-2xl border border-neutral-700 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">Riyadh KAFD Node</div>
                  <div className="text-[11px] text-neutral-400">9,800+ Vetted Engineers • GMT+3</div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded-full">ACTIVE</span>
              </div>
              <div className="p-4 bg-neutral-800/80 rounded-2xl border border-neutral-700 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-white">Bangalore Outer Ring Tech Center</div>
                  <div className="text-[11px] text-neutral-400">45,000+ Vetted Engineers • GMT+5:30</div>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded-full">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 8. INSTANT PAYROLL SAVINGS & ROI CALCULATOR
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Payroll Arbitrage Engine
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Calculate Your Tech Team Payroll Savings
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Access world-class senior engineering talent in Dubai, Riyadh, and Bangalore at up to 60% lower costs than US/UK local hiring without compromising output quality.
            </p>
            <Link to="/employers" className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all">
              Request Rate Card Breakdown →
            </Link>
          </div>

          <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> Interactive Squad Calculator
            </h3>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Number of Senior Engineers:</span>
                <span className="text-emerald-600 text-sm font-extrabold">{squadSize} Engineers</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={squadSize}
                onChange={(e) => setSquadSize(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-xs text-slate-500 font-medium">US/UK Local Payroll</div>
                <div className="text-xl font-bold text-slate-900 mt-1">${usPayroll.toLocaleString()}/yr</div>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-xs text-emerald-700 font-medium">NexaTalent Pod Cost</div>
                <div className="text-xl font-bold text-emerald-800 mt-1">${nexaPayroll.toLocaleString()}/yr</div>
              </div>
            </div>

            <div className="bg-emerald-600 text-white p-5 rounded-2xl text-center space-y-1">
              <div className="text-xs uppercase font-bold tracking-wider opacity-90">Estimated Annual Payroll Savings</div>
              <div className="text-3xl font-black">${annualSavings.toLocaleString()} / year</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 9. DUAL VALUE PROPOSITION SPLIT CARDS
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900">Designed for Both Employers & Talent</h2>
            <p className="text-sm text-neutral-600">Tailored solutions for tech organizations and senior engineers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-neutral-900 text-white rounded-3xl space-y-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  For Employers & GCC Leaders
                </span>
                <h3 className="text-2xl font-bold">Scale Engineering Without Friction</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Access pre-vetted candidate dossiers with validated code benchmarks, salary expectations, and immediate availability. Complete visibility from match to onboarding.
                </p>
              </div>
              <Link to="/employers" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300">
                Open Employer Workspace &rarr;
              </Link>
            </div>

            <div className="p-8 bg-neutral-900 text-white rounded-3xl space-y-6 shadow-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                  For High-Impact Candidates
                </span>
                <h3 className="text-2xl font-bold">Elevate Your Career Trajectory</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Direct access to senior engineering mandates, AI leadership roles, and offshore pod placements at top technology innovators and enterprise scaleups.
                </p>
              </div>
              <Link to="/candidates" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300">
                Access Candidate Hub &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 10. FREQUENTLY ASKED QUESTIONS
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-[#FAF8F6] border-b border-neutral-200/80">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-neutral-900">Frequently Asked Questions</h2>
            <p className="text-sm text-neutral-600">Everything you need to know about scaling tech teams with NexaTalent IT Solutions.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white border border-neutral-200/80 rounded-2xl overflow-hidden transition-all shadow-sm">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex items-center justify-between font-bold text-base text-neutral-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-6 pt-0 text-sm text-neutral-600 leading-relaxed border-t border-neutral-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 11. HIGH-CONVERSION FINAL CTA BANNER
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Start Scaling Today
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Ready to Deploy World-Class Tech Pods?
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto">
            Get 3 hand-picked, pre-vetted candidate dossiers matched to your tech stack delivered to your inbox in 72 hours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/employers"
              className="px-8 py-4 bg-white text-neutral-950 font-bold text-sm rounded-xl shadow-2xl hover:bg-neutral-100 transition-all"
            >
              Get Matched Candidates Now →
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-neutral-900/60 border border-white/30 text-white font-bold text-sm rounded-xl hover:bg-neutral-900 transition-all"
            >
              Schedule Founder Consultation
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

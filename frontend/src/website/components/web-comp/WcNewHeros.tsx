import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MapPin,
  Users,
  Code2,
  ShieldCheck,
  Zap,
  Globe,
  Building2,
  Clock,
  TrendingUp,
  Terminal,
  Search,
  ChevronRight,
  Star,
  Play,
  Activity,
  DollarSign,
  Bot,
  Lock
} from 'lucide-react';

/* Helper wrapper for consistent 100vh light section structure */
function NewHeroWrapper({
  children,
  bgClass = 'bg-white',
}: {
  children: React.ReactNode;
  bgClass?: string;
}) {
  return (
    <section className={`relative border-b border-neutral-200/80 min-h-screen flex flex-col justify-center py-20 px-6 lg:px-16 ${bgClass} text-neutral-900 overflow-hidden`}>
      <div className="mx-auto max-w-7xl w-full">
        {children}
      </div>
    </section>
  );
}

/* ============================================================================
 * NEW-HERO-1: GCC Global Hub Interactive Map & Talent Radar
 * ============================================================================ */
export function NewHero1() {
  const [activeNode, setActiveNode] = useState<'dubai' | 'bangalore' | 'riyadh' | 'singapore'>('dubai');

  const nodes = {
    dubai: { city: 'Dubai, UAE', talent: '14,200+ Vetted Engineers', ping: '8ms latency', focus: 'AI & Fintech Pods' },
    bangalore: { city: 'Bangalore, India', talent: '45,000+ Vetted Engineers', ping: '12ms latency', focus: 'Full Stack & Backend' },
    riyadh: { city: 'Riyadh, KSA', talent: '9,800+ Vetted Engineers', ping: '10ms latency', focus: 'Enterprise & Security' },
    singapore: { city: 'Singapore Hub', talent: '12,500+ Vetted Engineers', ping: '14ms latency', focus: 'Cloud Architecture' },
  };

  return (
    <NewHeroWrapper bgClass="bg-[#FAF9F6]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Global Talent Radar Active
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.15]">
            Assemble Elite Tech Pods Across <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">GCC Corridors</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 max-w-xl font-normal leading-relaxed">
            Direct access to top 1% software engineers, AI architects, and DevOps leads in Dubai, Riyadh, and Bangalore. Fully vetted in 72 hours.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm transition-all flex items-center gap-2 shadow-lg shadow-neutral-900/10 hover:shadow-xl">
              Launch Talent Match <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-6 py-3.5 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-medium text-sm transition-all flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" /> Explore Regional Nodes
            </button>
          </div>
          <div className="pt-6 border-t border-neutral-200/80 grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-neutral-900">72 Hrs</div>
              <div className="text-xs text-neutral-500 font-medium">Avg Match Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">99.2%</div>
              <div className="text-xs text-neutral-500 font-medium">Trial Pass Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900">60%</div>
              <div className="text-xs text-neutral-500 font-medium">Payroll Arbitrage</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/40 relative">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600 animate-pulse" />
              <span className="text-sm font-semibold text-neutral-900">NexaTalent IT Solutions Hub Telemetry</span>
            </div>
            <span className="text-xs font-mono text-neutral-400">STATUS: ONLINE</span>
          </div>

          <div className="py-6 space-y-3">
            {(Object.keys(nodes) as Array<keyof typeof nodes>).map((key) => {
              const isActive = activeNode === key;
              const data = nodes[key];
              return (
                <button
                  key={key}
                  onClick={() => setActiveNode(key)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-neutral-50 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isActive ? 'bg-emerald-600 text-white' : 'bg-white border border-neutral-200 text-neutral-600'}`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">{data.city}</div>
                      <div className="text-xs text-neutral-500">{data.focus}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-emerald-700">{data.talent}</div>
                    <div className="text-[10px] font-mono text-neutral-400">{data.ping}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-neutral-900 text-white p-4 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Selected Node: <strong className="text-emerald-400">{nodes[activeNode].city}</strong></span>
            </div>
            <span className="underline cursor-pointer hover:text-emerald-300">View Active Candidates →</span>
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-2: 3D Stacked Candidate Dossier & Live Matcher
 * ============================================================================ */
export function NewHero2() {
  const [selectedRole, setSelectedRole] = useState(0);

  const roles = [
    { title: 'Lead AI Engineer', exp: '8+ Yrs', stack: ['PyTorch', 'LangChain', 'FastAPI'], salary: '$95k/yr', status: 'Available in 24h' },
    { title: 'Senior Rust Systems Arch', exp: '10+ Yrs', stack: ['Rust', 'WebAssembly', 'gRPC'], salary: '$110k/yr', status: 'In Final Vetting' },
    { title: 'Full Stack React 19 Architect', exp: '7+ Yrs', stack: ['React 19', 'Next.js', 'Node.js'], salary: '$85k/yr', status: 'Ready to Deploy' },
  ];

  return (
    <NewHeroWrapper bgClass="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-full">
            <Bot className="w-3.5 h-3.5" /> Autonomous AI Vetting Engine
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.12]">
            Skip 60-Day Hiring Cycles. Inspect <span className="underline decoration-indigo-500 underline-offset-8">Pre-Vetted Dossiers</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Every candidate comes with automated code benchmarks, live system architecture recordings, and verified background checks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20">
              Request Candidate Dossiers
            </button>
            <button className="px-6 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-sm transition-all">
              Watch 2-Min Platform Walkthrough
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="space-y-4">
            {roles.map((role, idx) => (
              <motion.div
                key={idx}
                onClick={() => setSelectedRole(idx)}
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  selectedRole === idx
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xl ring-4 ring-indigo-500/20'
                    : 'bg-neutral-50 text-neutral-900 border-neutral-200 hover:bg-neutral-100/80'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedRole === idx ? 'bg-indigo-500 text-white' : 'bg-white border text-neutral-700'}`}>
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{role.title}</h3>
                      <span className={`text-xs ${selectedRole === idx ? 'text-neutral-400' : 'text-neutral-500'}`}>{role.exp} Experience</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${selectedRole === idx ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800'}`}>
                    {role.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 my-3">
                  {role.stack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className={`text-xs px-2.5 py-1 rounded-md font-mono ${
                        selectedRole === idx ? 'bg-neutral-800 text-neutral-300' : 'bg-white border border-neutral-200 text-neutral-700'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-200/20">
                  <span className={selectedRole === idx ? 'text-neutral-400' : 'text-neutral-500'}>Annual Compensation: <strong className={selectedRole === idx ? 'text-white' : 'text-neutral-900'}>{role.salary}</strong></span>
                  <span className="flex items-center gap-1 font-semibold text-indigo-400">View Full Vetting Report <ChevronRight className="w-3.5 h-3.5" /></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-3: Swiss Grid Modernist Tech Pod Builder
 * ============================================================================ */
export function NewHero3() {
  const [podSize, setPodSize] = useState(3);
  const [techStack, setTechStack] = useState<'AI' | 'Fullstack' | 'DevOps'>('AI');

  return (
    <NewHeroWrapper bgClass="bg-slate-50/80 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-slate-500 uppercase">
            [ ARCHITECTURAL ENGINE V4.0 ]
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase">
            Build Dedicated <br />
            <span className="text-indigo-600">Tech Squads</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl">
            Precision engineering pods deployed into your Slack & Jira in 72 hours. Zero management overhead, 100% IP ownership.
          </p>
          <div className="pt-4 flex items-center gap-4">
            <button className="px-7 py-4 bg-slate-900 text-white font-bold text-sm tracking-wide uppercase hover:bg-indigo-600 transition-colors">
              Configure Squad Now →
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> SOC2 & GDPR Ready
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border-2 border-slate-900 p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-200 pb-2">
            // INTERACTIVE POD CONFIGURATOR
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2 uppercase">1. Select Core Domain</label>
              <div className="grid grid-cols-3 gap-2">
                {(['AI', 'Fullstack', 'DevOps'] as const).map((domain) => (
                  <button
                    key={domain}
                    onClick={() => setTechStack(domain)}
                    className={`py-2 text-xs font-bold uppercase border transition-all ${
                      techStack === domain
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-900'
                    }`}
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase">2. Squad Headcount</label>
                <span className="text-xs font-mono font-bold text-indigo-600">{podSize} Engineers</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={podSize}
                onChange={(e) => setPodSize(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="bg-slate-100 p-4 border border-slate-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-mono">Estimated Deployment:</span>
                <span className="font-bold text-slate-900">72 Hours</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-mono">Monthly Squad Cost:</span>
                <span className="font-bold text-emerald-600 text-sm">${podSize * 6500}/mo</span>
              </div>
            </div>

            <button className="w-full py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors">
              Lock In Squad Configuration
            </button>
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-4: Glassmorphism Dual-Tier Enterprise Hub
 * ============================================================================ */
export function NewHero4() {
  const [activeTab, setActiveTab] = useState<'scaleup' | 'enterprise'>('scaleup');

  return (
    <NewHeroWrapper bgClass="bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/40">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-neutral-200 text-neutral-700 text-xs font-semibold backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          NexaTalent IT Solutions Enterprise Corridors
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight">
          Engineering Talent Scaled for <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500">
            High-Growth Tech Organizations
          </span>
        </h1>

        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Whether you're scaling a Series A team or expanding a GCC enterprise hub, hire vetted senior engineers with guaranteed performance.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex p-1.5 rounded-2xl bg-neutral-200/60 backdrop-blur-md border border-neutral-300/50">
          <button
            onClick={() => setActiveTab('scaleup')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'scaleup' ? 'bg-white text-neutral-900 shadow-md' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            For Fast-Growing Scaleups
          </button>
          <button
            onClick={() => setActiveTab('enterprise')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'enterprise' ? 'bg-white text-neutral-900 shadow-md' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            For Enterprise GCCs
          </button>
        </div>

        {/* Dynamic Card Content */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/80 shadow-2xl shadow-indigo-500/5 text-left grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTab === 'scaleup' ? (
            <>
              <div className="p-4 rounded-xl bg-white border border-neutral-100">
                <Zap className="w-6 h-6 text-indigo-600 mb-2" />
                <h4 className="font-bold text-sm text-neutral-900">72-Hour Matching</h4>
                <p className="text-xs text-neutral-500 mt-1">Get 3 hand-picked candidates matched to your stack in under 3 days.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-neutral-100">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-sm text-neutral-900">Zero Risk 14-Day Trial</h4>
                <p className="text-xs text-neutral-500 mt-1">Pay only if you are completely satisfied with engineer output.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-neutral-100">
                <DollarSign className="w-6 h-6 text-teal-600 mb-2" />
                <h4 className="font-bold text-sm text-neutral-900">Flexible Monthly Billing</h4>
                <p className="text-xs text-neutral-500 mt-1">Scale engineers up or down without long-term legal lock-ins.</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-white border border-neutral-100">
                <Building2 className="w-6 h-6 text-purple-600 mb-2" />
                <h4 className="font-bold text-sm text-neutral-900">Turnkey Offshore Hubs</h4>
                <p className="text-xs text-neutral-500 mt-1">Set up dedicated 50+ person engineering pods in Riyadh & Bangalore.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-neutral-100">
                <Lock className="w-6 h-6 text-indigo-600 mb-2" />
                <h4 className="font-bold text-sm text-neutral-900">SOC2 & ISO Compliance</h4>
                <p className="text-xs text-neutral-500 mt-1">Full enterprise IP protection, hardware security, and NDA protocols.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-neutral-100">
                <Users className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-sm text-neutral-900">Dedicated HR & EOR</h4>
                <p className="text-xs text-neutral-500 mt-1">We handle global payroll, benefits, local labor law, and equipment.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-5: Live Terminal & Automated AI Vetting Pipeline
 * ============================================================================ */
export function NewHero5() {
  return (
    <NewHeroWrapper bgClass="bg-stone-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 text-white text-xs font-mono rounded-md">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" /> NEXA_VETTING_ENGINE_LOGS
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Automated Code Vetting <br />
            <span className="text-emerald-600">Built for CTOs & Tech Leads</span>
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            We evaluate algorithm efficiency, architecture design, and communication before you spend a single minute in interviews.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <button className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/20">
              View Sample Assessment Report
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 font-mono text-xs text-neutral-300 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-neutral-500 text-[10px]">ai-candidate-evaluation.ts</span>
          </div>

          <p className="text-emerald-400">&gt; Executing live algorithmic test suite for Candidate #4928...</p>
          <p className="text-neutral-400">[PASS] Memory Optimization Test (Time: 1.2ms, Space O(1))</p>
          <p className="text-neutral-400">[PASS] Concurrent WebSocket Stress Test (10k req/sec)</p>
          <p className="text-neutral-400">[PASS] System Architecture Interview Score: 98.4 / 100</p>
          <div className="p-3 bg-neutral-800/80 rounded-lg border border-neutral-700 space-y-1 my-2">
            <div className="flex justify-between text-white font-bold">
              <span>Candidate Match Score:</span>
              <span className="text-emerald-400">99.1% Fit</span>
            </div>
            <div className="w-full bg-neutral-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[99%]" />
            </div>
          </div>
          <p className="text-neutral-500 text-[11px]">&gt; Automated Recommendation: APPROVED FOR IMMEDIATE GCC DEPLOYMENT</p>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-6: Asymmetric Editorial Showcase with Video Testimonial Pill
 * ============================================================================ */
export function NewHero6() {
  return (
    <NewHeroWrapper bgClass="bg-[#FDFBF7]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold tracking-widest text-amber-700 uppercase">
            [ Next-Gen Tech Talent Sourcing ]
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif text-neutral-900 leading-[1.1]">
            Empowering Visionary Companies with <em className="not-italic font-sans font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-500">Unstoppable Tech Talent</em>
          </h1>
          <p className="text-lg text-neutral-600 max-w-xl font-light">
            We bridge the gap between global scaleup requirements and Asia-GCC engineering powerhouses.
          </p>
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-full transition-all">
              Schedule Founder Call
            </button>
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full border border-neutral-200 shadow-sm">
              <Play className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span className="text-xs font-medium text-neutral-700">Watch VP Engineering Review (1:45)</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-neutral-200 shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="VP" className="w-14 h-14 rounded-full object-cover border-2 border-amber-500" />
            <div>
              <div className="font-bold text-neutral-900 text-base">Sarah Al-Mansoor</div>
              <div className="text-xs text-neutral-500">VP of Tech, FinTech Gulf</div>
            </div>
          </div>
          <p className="text-sm text-neutral-700 italic leading-relaxed">
            "NexaTalent IT Solutions built our core backend engineering team in Riyadh in less than 2 weeks. The quality of candidate vetting saved us hundreds of engineering hours."
          </p>
          <div className="flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-100 pt-4">
            <span>Verified Customer Case Study</span>
            <span className="text-amber-600 font-bold">Read Story →</span>
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-7: Aceternity Inspired Glowing Orbit & Skill Constellation
 * ============================================================================ */
export function NewHero7() {
  return (
    <NewHeroWrapper bgClass="bg-white">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold rounded-full">
          <Globe className="w-3.5 h-3.5" /> Vetted Skill Mesh Network
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-900 tracking-tight">
          Every Core Skill Vetted. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600">
            Zero Hiring Friction.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-neutral-600">
          From AI/LLM fine-tuning to high-throughput cloud microservices, get instant access to verified engineers across 40+ modern tech stacks.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl transition-all">
            Browse Skill Matrix
          </button>
        </div>

        {/* Skill Badges Orbit Simulation Grid */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {['PyTorch / AI', 'React 19 & Next.js', 'Rust & Golang', 'Kubernetes & AWS', 'PostgreSQL / Vector', 'Flutter & iOS', 'Cybersecurity', 'DevOps Automation'].map((skill, i) => (
            <div key={i} className="p-3 bg-neutral-50 hover:bg-teal-50/50 border border-neutral-200 hover:border-teal-300 rounded-xl text-xs font-semibold text-neutral-800 transition-all flex items-center justify-center gap-2 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              {skill}
            </div>
          ))}
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-8: High-Density Metric Dashboard & Instant Cost Calculator
 * ============================================================================ */
export function NewHero8() {
  const [engCount, setEngCount] = useState(5);
  const usCost = engCount * 160000;
  const nexaCost = engCount * 65000;
  const savings = usCost - nexaCost;

  return (
    <NewHeroWrapper bgClass="bg-slate-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md uppercase tracking-wider">
            Payroll Arbitrage Engine
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Calculate Your Tech Team <br />
            <span className="text-emerald-600">Cost Savings in Seconds</span>
          </h1>
          <p className="text-base text-slate-600">
            Access world-class engineering talent in India & GCC hubs at up to 60% lower costs than US/UK hires without sacrificing quality.
          </p>
          <button className="px-6 py-3.5 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all">
            Get Custom Rate Card →
          </button>
        </div>

        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> Live Savings Simulator
          </h3>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Number of Senior Engineers:</span>
              <span className="text-emerald-600 text-sm">{engCount} Engineers</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={engCount}
              onChange={(e) => setEngCount(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-500 font-medium">US/UK Local Payroll</div>
              <div className="text-xl font-bold text-slate-900 mt-1">${usCost.toLocaleString()}/yr</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="text-xs text-emerald-700 font-medium">NexaTalent IT Solutions Pod Cost</div>
              <div className="text-xl font-bold text-emerald-800 mt-1">${nexaCost.toLocaleString()}/yr</div>
            </div>
          </div>

          <div className="bg-emerald-600 text-white p-4 rounded-xl text-center">
            <div className="text-xs uppercase font-semibold tracking-wider opacity-90">Estimated Annual Payroll Savings</div>
            <div className="text-3xl font-extrabold mt-1">${savings.toLocaleString()} / year</div>
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-9: Floating Isometric Tech Pod Cards
 * ============================================================================ */
export function NewHero9() {
  return (
    <NewHeroWrapper bgClass="bg-emerald-50/20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
            <Users className="w-3.5 h-3.5" /> Full Pod Deployment
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
            Offshore Tech Pods <br />
            <span className="text-emerald-600">Assembled in 72 Hours</span>
          </h1>
          <p className="text-base text-neutral-600">
            Plug-and-play engineering pods led by vetted Tech Leads. Complete with Scrum Masters, Senior Engineers, and QA Automation.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3.5 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-all">
              Request Pod Breakdown
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          {['Frontend Pod (React 19 + Tailwind)', 'Backend Pod (Node / Python / Postgres)', 'AI & Data Pod (LLM Fine-Tuning + RAG)'].map((pod, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-md flex items-center justify-between hover:shadow-lg transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  #{i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-900">{pod}</h4>
                  <span className="text-xs text-neutral-500">Includes Tech Lead + 2 Senior Devs</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                Ready in 72h
              </span>
            </div>
          ))}
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-10: Minimalist Neo-Brutalist Light Command Center
 * ============================================================================ */
export function NewHero10() {
  return (
    <NewHeroWrapper bgClass="bg-white">
      <div className="border-4 border-black p-8 sm:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-amber-50/40 space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-6">
          <span className="font-mono text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1">
            NEXATALENT IT SOLUTIONS // COMMAND CENTER
          </span>
          <span className="font-mono text-xs font-bold text-black">
            STATUS: 100% VETTED CANDIDATES
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tight leading-none uppercase">
            Hire Vetted Senior <br />
            Engineers. No BS.
          </h1>
          <p className="text-lg font-bold text-neutral-800 max-w-2xl">
            We source, test, and vet top 1% software engineering talent from GCC & Asian tech hubs so you can ship features faster.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <button className="px-8 py-4 bg-black text-white font-black text-sm uppercase tracking-wider hover:bg-neutral-800 shadow-[4px_4px_0px_0px_rgba(245,158,11,1)] transition-all">
            Get 3 Candidates Now →
          </button>
          <button className="px-8 py-4 bg-white border-2 border-black text-black font-black text-sm uppercase tracking-wider hover:bg-amber-100 transition-all">
            Schedule Demo Call
          </button>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-11: Interactive Talent Matrix & Live Search Bar
 * ============================================================================ */
export function NewHero11() {
  const [search, setSearch] = useState('');
  const skills = ['React 19', 'Python', 'AWS', 'Kubernetes', 'Node.js', 'Go', 'Flutter'];

  return (
    <NewHeroWrapper bgClass="bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Search className="w-3.5 h-3.5" /> Instant Candidate Search
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
          Find Your Next Tech Lead in <span className="text-blue-600">Seconds</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Search over 50,000+ pre-vetted engineers across Dubai, Riyadh, Bangalore, and Singapore.
        </p>

        <div className="relative max-w-2xl mx-auto">
          <div className="flex items-center bg-white border-2 border-slate-200 rounded-2xl p-2 shadow-lg focus-within:border-blue-500 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3" />
            <input
              type="text"
              placeholder="e.g. Senior AI Engineer with PyTorch experience..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 text-sm text-slate-900 bg-transparent focus:outline-none"
            />
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all">
              Search Talent
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="text-xs text-slate-400 self-center font-medium">Popular Stacks:</span>
            {skills.map((skill, idx) => (
              <button
                key={idx}
                onClick={() => setSearch(skill)}
                className="px-3 py-1 bg-white border border-slate-200 text-slate-700 hover:border-blue-400 text-xs rounded-full font-medium transition-all"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-12: Split Screen Diagonal Hero with Floating Testimonial Stack
 * ============================================================================ */
export function NewHero12() {
  return (
    <NewHeroWrapper bgClass="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase">
            // Global Tech Workforce
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
            Scale Engineering Without Scaling Overhead
          </h1>
          <p className="text-base text-neutral-600 leading-relaxed">
            We match you with top 1% engineers within 72 hours. Guaranteed trial period included.
          </p>
          <div className="flex gap-4 pt-2">
            <button className="px-6 py-3.5 bg-neutral-900 text-white font-bold text-sm rounded-xl hover:bg-neutral-800 transition-all">
              Start 14-Day Risk Free Trial
            </button>
          </div>
        </div>

        <div className="lg:col-span-6 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" className="w-10 h-10 rounded-full border-2 border-white" alt="Dev" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" className="w-10 h-10 rounded-full border-2 border-white" alt="Dev" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" className="w-10 h-10 rounded-full border-2 border-white" alt="Dev" />
            </div>
            <div className="text-xs font-bold text-slate-800">Joined 500+ GCC Tech Companies</div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 italic">
            "The engineering talent we hired through NexaTalent IT Solutions matched our high standards from day one. Highly recommended!"
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-13: Modern SaaS Tabs & Live Candidate Reel
 * ============================================================================ */
export function NewHero13() {
  const [tab, setTab] = useState(0);
  const profiles = [
    { name: 'Alex V.', role: 'Senior AI Engineer', exp: '9 yrs exp', location: 'Dubai / Remote', rating: '5.0' },
    { name: 'Priya K.', role: 'Full Stack Architect', exp: '8 yrs exp', location: 'Bangalore / Remote', rating: '4.9' },
    { name: 'Tariq M.', role: 'DevOps & Cloud Lead', exp: '11 yrs exp', location: 'Riyadh / Remote', rating: '5.0' },
  ];

  return (
    <NewHeroWrapper bgClass="bg-[#FAF8F6]">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
          Vetted Engineers Ready to Deploy
        </h1>
        <p className="text-base text-neutral-600">
          Select a domain to inspect verified candidate profiles and code scores.
        </p>

        <div className="flex justify-center gap-2">
          {['AI & Data', 'Full Stack', 'Cloud & Security'].map((t, idx) => (
            <button
              key={idx}
              onClick={() => setTab(idx)}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all ${
                tab === idx ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 border border-neutral-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xl max-w-xl mx-auto text-left space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-neutral-900">{profiles[tab].name}</h3>
              <p className="text-xs text-neutral-500">{profiles[tab].role} • {profiles[tab].exp}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="w-4 h-4 fill-amber-500" /> {profiles[tab].rating} Score
            </div>
          </div>
          <div className="text-xs text-neutral-600">
            Location: <strong>{profiles[tab].location}</strong>
          </div>
          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all">
            Schedule Interview with Candidate →
          </button>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-14: Giant Typography with Inline Avatar Marquee
 * ============================================================================ */
export function NewHero14() {
  return (
    <NewHeroWrapper bgClass="bg-white">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-5xl sm:text-7xl font-extrabold text-neutral-900 tracking-tight leading-[1.05]">
          Hire Vetted <span className="inline-flex items-center align-middle px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 text-xl font-bold">Top 1%</span> Tech Talent Without Boundaries
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl">
          Connecting ambitious tech teams in GCC and worldwide with elite developers across software, cloud, and artificial intelligence.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl transition-all">
            Start Hiring Squad
          </button>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-15: Glass Floating Mobile App Mockup & Talent Alert Push
 * ============================================================================ */
export function NewHero15() {
  return (
    <NewHeroWrapper bgClass="bg-indigo-50/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
            <Zap className="w-3.5 h-3.5" /> Instant Match Notifications
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
            Real-Time Talent Matching in Your Inbox & Mobile
          </h1>
          <p className="text-base text-neutral-600">
            Receive instant notifications when top candidates matching your technical criteria become available.
          </p>
          <button className="px-6 py-3.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all">
            Enable Talent Alerts
          </button>
        </div>

        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-neutral-200 shadow-2xl max-w-sm mx-auto space-y-4">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">NexaTalent IT Solutions Push Alert</div>
          <div className="p-4 bg-indigo-50/80 rounded-2xl border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-neutral-900">New Candidate Match</span>
              <span className="text-[10px] text-neutral-400">Just now</span>
            </div>
            <p className="text-xs text-neutral-700">Senior Rust & PyTorch Architect matched to your job criteria (99% Fit Score).</p>
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-16: B2B Enterprise Compliance & Security Shield Hero
 * ============================================================================ */
export function NewHero16() {
  return (
    <NewHeroWrapper bgClass="bg-stone-50">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-200 text-stone-800 text-xs font-bold rounded-md">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Enterprise-Grade Security Guaranteed
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight">
          100% IP Protection & SOC2 Compliant Hiring
        </h1>
        <p className="text-base sm:text-lg text-stone-600">
          All engineers work under strict enterprise NDAs, secure hardware environments, and full labor compliance.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          {['SOC2 Type II', 'ISO 27001', 'GDPR Compliant', 'Full IP Transfer'].map((badge, i) => (
            <div key={i} className="p-4 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 shadow-sm">
              {badge}
            </div>
          ))}
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-17: Aceternity Glow Cards with Interactive Skill Radar
 * ============================================================================ */
export function NewHero17() {
  return (
    <NewHeroWrapper bgClass="bg-[#FAF9F6]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
            Vetted Technical Excellence Guaranteed
          </h1>
          <p className="text-base text-neutral-600">
            Our multi-stage assessment ensures only developers with proven algorithmic skills and clean communication join your project.
          </p>
          <button className="px-6 py-3.5 bg-neutral-900 text-white font-bold text-sm rounded-xl hover:bg-neutral-800 transition-all">
            View Assessment Standard
          </button>
        </div>

        <div className="lg:col-span-6 space-y-4">
          {['1. Live Code & Algorithmic Benchmarks', '2. System Design & Architecture Defense', '3. Professional English Communication'].map((step, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm">
              <h4 className="font-bold text-sm text-neutral-900">{step}</h4>
              <p className="text-xs text-neutral-500 mt-1">Evaluated by senior engineering directors with live scoring metrics.</p>
            </div>
          ))}
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-18: Circular Ripple Pulse Hero with Live Talent Pulse
 * ============================================================================ */
export function NewHero18() {
  return (
    <NewHeroWrapper bgClass="bg-zinc-50">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-200 animate-pulse">
          <Activity className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 tracking-tight">
          Real-Time Global Engineering Talent Pulse
        </h1>
        <p className="text-base text-zinc-600">
          Over 500+ senior engineers ready to interview today across Dubai, Riyadh, and Bangalore hubs.
        </p>
        <button className="px-8 py-3.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-all">
          Connect to Talent Stream
        </button>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-19: Minimalist High-End Magazine Layout
 * ============================================================================ */
export function NewHero19() {
  return (
    <NewHeroWrapper bgClass="bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto space-y-8 border-l-2 border-neutral-900 pl-6 sm:pl-10">
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
          ISSUE 2026 // TECH WORKFORCE EDITION
        </span>
        <h1 className="text-5xl sm:text-7xl font-serif text-neutral-900 leading-[1.05]">
          The Future of Remote Engineering is Vetted.
        </h1>
        <p className="text-lg text-neutral-600 font-light max-w-2xl">
          Unlocking senior talent corridors for high-growth tech firms across the Middle East and worldwide.
        </p>
        <button className="px-8 py-4 bg-neutral-900 text-white font-serif text-sm hover:bg-neutral-800 transition-all">
          Explore Editorial Case Studies →
        </button>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-20: Interactive Pod Velocity & Sprint Calculator
 * ============================================================================ */
export function NewHero20() {
  const [sprints, setSprints] = useState(4);

  return (
    <NewHeroWrapper bgClass="bg-slate-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Accelerate Feature Velocity by 3.2x
          </h1>
          <p className="text-base text-slate-600">
            Engineers onboarded with pre-configured dev environments and ready to contribute code from week one.
          </p>
          <button className="px-6 py-3.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all">
            See Velocity Benchmark
          </button>
        </div>

        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Sprint Delivery Forecast</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Target Sprints:</span>
              <span className="text-indigo-600">{sprints} Sprints</span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={sprints}
              onChange={(e) => setSprints(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
          <div className="p-4 bg-indigo-50 text-indigo-900 rounded-xl text-center text-xs font-bold">
            Expected Features Delivered: {sprints * 8} Core Features
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-21: Floating Interactive Code Comparison Snippet
 * ============================================================================ */
export function NewHero21() {
  return (
    <NewHeroWrapper bgClass="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
            Code Quality You Can Audit Before Hiring
          </h1>
          <p className="text-base text-neutral-600">
            Review real, anonymized production code written by candidates in live tech evaluations.
          </p>
          <button className="px-6 py-3.5 bg-neutral-900 text-white font-bold text-sm rounded-xl hover:bg-neutral-800 transition-all">
            Browse Code Repositories
          </button>
        </div>

        <div className="lg:col-span-6 bg-neutral-900 p-6 rounded-2xl font-mono text-xs text-neutral-200 shadow-2xl space-y-2">
          <p className="text-emerald-400">// NexaTalent IT Solutions Candidate #819 - Production Code Sample</p>
          <p><span className="text-purple-400">export async function</span> <span className="text-blue-400">processAiEmbeddings</span>(data: InputData) {'{'}</p>
          <p className="pl-4 text-neutral-400">const vectorStore = await VectorDB.connect();</p>
          <p className="pl-4 text-neutral-400">return await vectorStore.query(data.embeddings);</p>
          <p>{'}'}</p>
          <div className="pt-2 text-[10px] text-emerald-400 font-bold border-t border-neutral-800">
            ✓ Algorithmic Efficiency Score: 99/100
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-22: Glass B2B Pricing & Talent Guarantee Slider
 * ============================================================================ */
export function NewHero22() {
  return (
    <NewHeroWrapper bgClass="bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
          Transparent Monthly Pricing. <br />
          <span className="text-indigo-600">Zero Hidden Markup.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Flat monthly rates with simple, contract-free subscription models for scaleups and enterprises.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-6">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-bold text-base text-slate-900">Individual Developer</h4>
            <div className="text-2xl font-extrabold text-indigo-600">$4,500 <span className="text-xs text-slate-500 font-normal">/ mo</span></div>
            <p className="text-xs text-slate-500">Dedicated Full-Time Senior Dev embedded into your team.</p>
          </div>
          <div className="p-6 bg-indigo-600 text-white border border-indigo-600 rounded-2xl shadow-xl space-y-4">
            <h4 className="font-bold text-base">Engineering Squad</h4>
            <div className="text-2xl font-extrabold text-white">$14,000 <span className="text-xs text-indigo-200 font-normal">/ mo</span></div>
            <p className="text-xs text-indigo-100">3 Senior Devs + Tech Lead for rapid feature delivery.</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-bold text-base text-slate-900">Enterprise GCC Hub</h4>
            <div className="text-2xl font-extrabold text-slate-900">Custom</div>
            <p className="text-xs text-slate-500">Dedicated 10+ person offshore hub with HR & EOR management.</p>
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-23: 21st.dev Style Bento Grid with Live Salary & Timezone Matrix
 * ============================================================================ */
export function NewHero23() {
  return (
    <NewHeroWrapper bgClass="bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Global Timezone Overlap
          </h1>
          <p className="text-base text-slate-600">
            Work seamlessly across GMT, GST (UTC+4), and IST (UTC+5:30) timezone corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
            <Clock className="w-6 h-6 text-indigo-600" />
            <h4 className="font-bold text-sm text-slate-900">4-6 Hours Overlap</h4>
            <p className="text-xs text-slate-500">Daily synchronous communication during your core working hours.</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
            <Globe className="w-6 h-6 text-emerald-600" />
            <h4 className="font-bold text-sm text-slate-900">Dubai & Riyadh Hubs</h4>
            <p className="text-xs text-slate-500">Local presence for enterprise support and on-site meetings.</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2">
            <Building2 className="w-6 h-6 text-teal-600" />
            <h4 className="font-bold text-sm text-slate-900">Bangalore Tech Center</h4>
            <p className="text-xs text-slate-500">Access to India's top software engineering talent pool.</p>
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-24: Floating Hexagon Talent Mesh & Live AI Chat Preview
 * ============================================================================ */
export function NewHero24() {
  return (
    <NewHeroWrapper bgClass="bg-purple-50/20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 leading-tight">
            Conversational AI Sourcing Assistant
          </h1>
          <p className="text-base text-neutral-600">
            Type your tech requirements in plain English and get instant candidate matches.
          </p>
          <button className="px-6 py-3.5 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition-all">
            Try AI Talent Assistant
          </button>
        </div>

        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-purple-200 shadow-xl space-y-4">
          <div className="p-3 bg-purple-50 rounded-xl text-xs text-purple-900 font-medium">
            "I need a Senior React 19 Developer in Dubai with 6+ years experience in Fintech."
          </div>
          <div className="p-3 bg-neutral-900 text-white rounded-xl text-xs space-y-1">
            <span className="text-emerald-400 font-bold">✓ Matched 4 Candidates:</span>
            <p className="text-neutral-300">1. Tariq A. - 7 Yrs Exp, Fintech Lead (Ready in 24h)</p>
          </div>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

/* ============================================================================
 * NEW-HERO-25: Ultra Modern Futuristic Light Portal with Interactive Cursor Beam
 * ============================================================================ */
export function NewHero25() {
  return (
    <NewHeroWrapper bgClass="bg-white">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-bold shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          NexaTalent IT Solutions Next-Gen Platform
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold text-neutral-900 tracking-tight leading-tight">
          The Global Standard for <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-600">
            Tech Talent Matchmaking
          </span>
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Elevate your technology capabilities with world-class engineers, AI developers, and cloud architects vetted to global standards.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl transition-all shadow-xl">
            Start Building Your Squad
          </button>
        </div>
      </div>
    </NewHeroWrapper>
  );
}

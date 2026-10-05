import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Play,
  DollarSign,
  Award
} from 'lucide-react';

/* Light Wrapper container helper */
function HeroWrapper({
  title: _title,
  subtitle: _subtitle,
  badge: _badge,
  children,
  bgClass = 'bg-white',
}: {
  title?: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  bgClass?: string;
}) {
  return (
    <section className={`relative border-b border-neutral-200/80 min-h-screen flex flex-col justify-center py-20 px-6 lg:px-16 ${bgClass} text-neutral-950 overflow-hidden`}>
      <div className="mx-auto max-w-7xl w-full">
        {children}
      </div>
    </section>
  );
}

/* 30. HERO 30: CYBER RADAR (LIGHT EDITION) */
export function Hero30DarkNeonGrid() {
  return (
    <HeroWrapper title="Hero 30 — Cyber Radar" badge="Hero 30" bgClass="bg-[#F8FAFC]">
      <div className="relative overflow-hidden rounded-3xl bg-white p-8 lg:p-16 border border-neutral-200 shadow-xl">
        <div className="relative z-10 grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-mono font-medium text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              NEXATALENT IT SOLUTIONS RADAR ONLINE v4.2
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.1]">
              Autonomous Talent Sourcing for <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">High-Growth GCC Tech</span>
            </h1>

            <p className="text-base text-neutral-600 max-w-xl leading-relaxed">
              Deploy AI sourcing bots that continuously aggregate, score, and verify elite engineering and product talent across 45+ international ecosystems.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="inline-flex items-center gap-3 rounded-xl bg-neutral-950 px-7 py-3.5 text-sm font-bold text-white hover:bg-neutral-800 transition-all shadow-lg">
                Deploy Talent Bot <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-neutral-200 bg-slate-50 p-6 shadow-md relative font-mono text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 text-neutral-500">
                <span>LIVE RADAR STREAM</span>
                <span className="text-teal-600 font-bold">LATENCY: 12ms</span>
              </div>
              {[
                { name: 'Dr. Sarah K.', role: 'AI Research Lead', match: '98.8%' },
                { name: 'Alex v. D.', role: 'Staff Rust Engineer', match: '97.4%' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white border border-neutral-200">
                  <div>
                    <p className="font-bold text-neutral-900">{item.name}</p>
                    <p className="text-[11px] text-neutral-500">{item.role}</p>
                  </div>
                  <span className="text-teal-600 font-bold">{item.match}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HeroWrapper>
  );
}

/* 31. HERO 31: BENTO ARCHITECTURAL EDITORIAL */
export function Hero31BentoArchitect() {
  return (
    <HeroWrapper title="Hero 31 — Bento Architectural Editorial" badge="Hero 31" bgClass="bg-white">
      <div className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">The Modern Talent Paradigm</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 leading-tight">
            Architecting high-performing technical squads with strategic precision.
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2 lg:col-span-2 rounded-3xl bg-neutral-950 text-white p-8 flex flex-col justify-between min-h-[260px]">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-indigo-400">FEATURE 01</span>
              <Sparkles className="text-indigo-400" size={20} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Turnkey Pod Deployment</h3>
              <p className="mt-2 text-xs text-neutral-400">Full stack engineering squads operational in 10 business days.</p>
            </div>
          </div>

          <div className="rounded-3xl bg-indigo-50 border border-indigo-100 p-8 flex flex-col justify-between min-h-[260px]">
            <span className="text-xs font-mono text-indigo-600">FEATURE 02</span>
            <div>
              <p className="text-4xl font-extrabold text-indigo-950">72 Hrs</p>
              <p className="mt-2 text-xs font-medium text-indigo-700">Average candidate shortlist turnaround</p>
            </div>
          </div>

          <div className="rounded-3xl bg-emerald-50 border border-emerald-100 p-8 flex flex-col justify-between min-h-[260px]">
            <span className="text-xs font-mono text-emerald-700">FEATURE 03</span>
            <div>
              <p className="text-4xl font-extrabold text-emerald-950">45%</p>
              <p className="mt-2 text-xs font-medium text-emerald-700">Arbitrage cost savings vs US/EU hiring</p>
            </div>
          </div>
        </div>
      </div>
    </HeroWrapper>
  );
}

/* 32. HERO 32: INTERACTIVE SALARY ARBITRAGE SIMULATOR (LIGHT MODE) */
export function Hero32SalaryArbitrageHero() {
  const [headcount, setHeadcount] = useState(5);
  const usCost = headcount * 175000;
  const gccCost = headcount * 75000;
  const savings = usCost - gccCost;

  return (
    <HeroWrapper title="Hero 32 — Interactive Salary Arbitrage Simulator" badge="Hero 32" bgClass="bg-[#FAF8F5]">
      <div className="grid gap-12 lg:grid-cols-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="inline-block rounded-full bg-amber-100 border border-amber-200 px-3.5 py-1 text-xs font-bold text-amber-900">
            FINANCIAL OPTIMIZATION ENGINE
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 leading-tight">
            Calculate your squad <span className="text-amber-700">Arbitrage Savings</span> in real time.
          </h1>
          <p className="text-sm text-neutral-600">
            Scale your engineering velocity without diluting talent quality. Compare traditional US/EU compensation against top GCC offshore pods.
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-xl">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center justify-between">
              <span>Interactive ROI Calculator</span>
              <DollarSign className="text-amber-600" size={20} />
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs text-neutral-600 mb-2">
                  <span>Engineers to Hire:</span>
                  <span className="text-amber-700 font-bold font-mono text-sm">{headcount} Engineers</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={headcount}
                  onChange={(e) => setHeadcount(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <p className="text-[11px] text-neutral-500 uppercase">Est. US/EU Cost</p>
                  <p className="text-xl font-bold font-mono text-neutral-900">${usCost.toLocaleString()}/yr</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-[11px] text-emerald-700 uppercase">NexaTalent IT Solutions Pod Cost</p>
                  <p className="text-xl font-bold font-mono text-emerald-900">${gccCost.toLocaleString()}/yr</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <p className="text-xs uppercase tracking-widest text-amber-800 font-semibold">Total Annual Arbitrage Saved</p>
                <p className="text-3xl font-extrabold font-mono text-amber-950 mt-1">${savings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroWrapper>
  );
}

/* 33. HERO 33: TERMINAL CODE VETTING (LIGHT MODE) */
export function Hero33TerminalHero() {
  return (
    <HeroWrapper title="Hero 33 — Terminal Code Vetting & Command Line" badge="Hero 33" bgClass="bg-white">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <span className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1 text-xs font-mono text-indigo-700 border border-neutral-200">
          $ nexatalent init --profile=devsecops
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-950 font-mono">
          Vetted Engineers.<br />
          <span className="text-indigo-600">&lt;Zero-Noise Shortlists /&gt;</span>
        </h1>
        <p className="text-base text-neutral-600 max-w-2xl mx-auto">
          We run algorithmic coding challenges and system design tests before candidates reach your inbox.
        </p>

        <div className="mt-8 text-left rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 overflow-hidden shadow-2xl font-mono text-xs">
          <div className="bg-slate-950 px-4 py-3 flex items-center gap-2 border-b border-slate-800">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-400 text-[11px]">nexatalent-cli-v2.8</span>
          </div>
          <div className="p-6 space-y-2 leading-relaxed">
            <p className="text-slate-400"># Querying top 1% Senior Go / Kubernetes Engineers in GCC</p>
            <p className="text-emerald-400">&gt; SEARCHING TALENT GRAPH... FOUND 182 CANDIDATES</p>
            <p className="text-cyan-400">&gt; FILTERING: System Design &gt;= 95%, Verified Security Clearance</p>
            <p className="text-amber-300">&gt; TOP MATCH: Candidate #8942 — Ex-Stripe Staff Infra Lead (Dubai, UAE)</p>
          </div>
        </div>
      </div>
    </HeroWrapper>
  );
}

/* 34. HERO 34: FULL SCREEN IMMERSIVE VIDEO FRAME (LIGHT MODE) */
export function Hero34ImmersiveVideoHero() {
  return (
    <HeroWrapper title="Hero 34 — Full Screen Immersive Video Frame" badge="Hero 34" bgClass="bg-[#F0F4FF]">
      <div className="relative rounded-3xl overflow-hidden bg-white text-neutral-950 p-8 lg:p-16 border border-indigo-100 shadow-2xl flex items-center">
        <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center w-full">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-200 px-4 py-1.5 text-xs font-semibold text-indigo-800">
              <Play size={12} fill="currentColor" /> WATCH EXECUTIVE OVERVIEW (2 MIN)
            </span>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-950 leading-tight">
              Transforming Global Hiring into a High-Speed Science.
            </h1>

            <p className="text-base text-neutral-600 max-w-xl">
              Discover how Fortune 500 enterprises build resilient, cost-effective engineering capabilities across emerging tech hubs.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <button className="rounded-2xl bg-neutral-950 px-8 py-4 text-sm font-bold text-white hover:bg-neutral-800 transition-all shadow-xl">
                Schedule Strategy Session
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group cursor-pointer w-full max-w-md aspect-video rounded-2xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-2xl overflow-hidden text-white">
              <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                <Play size={24} fill="currentColor" className="ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroWrapper>
  );
}

/* 35. HERO 35: MINIMALIST SWISS EDITORIAL MODERNIST */
export function Hero35SwissEditorial() {
  return (
    <HeroWrapper title="Hero 35 — Minimalist Swiss Editorial Modernist" badge="Hero 35" bgClass="bg-white">
      <div className="border-t-2 border-neutral-950 pt-8 space-y-12">
        <div className="flex justify-between items-baseline border-b border-neutral-200 pb-4 text-xs font-mono text-neutral-500 uppercase tracking-widest">
          <span>SPEC 2026 // EDITION 04</span>
          <span>GLOBAL RECRUITMENT SYSTEM</span>
          <span>DUBAI - RIYADH - BANGALORE</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-neutral-950 uppercase leading-[0.9]">
              PRECISION<br />HIRING<br />FOR TECH LEADERS
            </h1>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <p className="text-sm font-medium text-neutral-700 leading-relaxed border-l-2 border-neutral-950 pl-4">
              Eliminate recruiting friction. We match hyper-specialized engineering talent with high-impact roles in enterprise environments.
            </p>
            <button className="w-full rounded-none bg-neutral-950 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800">
              EXPLORE CANDIDATE DIRECTORY &rarr;
            </button>
          </div>
        </div>
      </div>
    </HeroWrapper>
  );
}

/* 40. HERO 40: GLASSMORPHISM FLOATING GRADIENT SPHERES (LIGHT MODE) */
export function Hero40GlassmorphismSpheres() {
  return (
    <HeroWrapper title="Hero 40 — Glassmorphism Floating Gradient Spheres" badge="Hero 40" bgClass="bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="relative overflow-hidden rounded-3xl bg-white/80 p-10 lg:p-20 border border-indigo-100 text-center shadow-xl backdrop-blur-xl">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-900 border border-indigo-200">
            NEXT-GEN RECRUITMENT TECH
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-neutral-950 leading-tight">
            Seamless global hiring for visionaries.
          </h1>

          <p className="text-base text-neutral-600">
            Connect your hiring goals directly with vetted software engineering talent. Simple, fast, and compliant.
          </p>
        </div>
      </div>
    </HeroWrapper>
  );
}

/* 42. HERO 42: HIGH-TECH EXECUTIVE GUARANTEE SHIELD (LIGHT MODE) */
export function Hero42ExecutivePledgeHero() {
  return (
    <HeroWrapper title="Hero 42 — Executive Guarantee Shield" badge="Hero 42" bgClass="bg-[#FAF8F5]">
      <div className="rounded-3xl border border-amber-200 bg-white p-8 lg:p-14 text-center space-y-6 shadow-xl">
        <div className="mx-auto h-16 w-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
          <Award size={32} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-950">
          Our Executive Hiring Pledge:<br />
          <span className="text-amber-700">100% Risk-Free 90-Day Guarantee</span>
        </h1>
        <p className="text-sm text-neutral-600 max-w-2xl mx-auto">
          If any placed candidate does not meet your performance benchmarks within the first 90 days, we replace them immediately at zero additional cost.
        </p>
      </div>
    </HeroWrapper>
  );
}

/* 45. HERO 45: MODERN BRUTALIST BOLD COLOR BLOCK */
export function Hero45BrutalistColorBlock() {
  return (
    <HeroWrapper title="Hero 45 — Modern Brutalist Bold & Color Block" badge="Hero 45" bgClass="bg-white">
      <div className="bg-lime-400 text-neutral-950 p-8 sm:p-16 rounded-3xl border-4 border-neutral-950 space-y-6">
        <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight leading-none">
          HIRE ENGINEERS THAT ACTUALLY SHIP CODE.
        </h1>
        <button className="rounded-none bg-neutral-950 px-8 py-4 text-sm font-extrabold text-white border-2 border-neutral-950 hover:bg-neutral-800">
          GET STARTED TODAY &rarr;
        </button>
      </div>
    </HeroWrapper>
  );
}

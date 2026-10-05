import { useState } from 'react';
import {
  ShieldCheck,
  Play,
  Activity,
  Sparkles
} from 'lucide-react';
import { SecWrapper } from './WcModularSections1';

/* ============================================================================
 * SECTION 26: Bento Metrics Radar
 * ============================================================================ */
export function Sec26BentoMetricsRadar() {
  return (
    <SecWrapper id="sec-26">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
          <Activity className="w-6 h-6 text-emerald-600" />
          <h4 className="font-bold text-sm text-emerald-900">Real-Time Talent Telemetry</h4>
          <p className="text-xs text-emerald-700">Live candidate availability pings across Dubai, Riyadh, and Bangalore nodes.</p>
        </div>
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 md:col-span-2">
          <h4 className="font-bold text-sm text-slate-900">Vetted Tech Talent Pool Stats</h4>
          <p className="text-xs text-slate-600">50,000+ senior engineers with verified algorithmic competency scores exceeding 95%.</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 27: Workflow Vertical Steps
 * ============================================================================ */
export function Sec27WorkflowVerticalSteps() {
  return (
    <SecWrapper id="sec-27" bgClass="bg-[#FAF8F6]">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-extrabold text-neutral-900 text-center">4-Step Onboarding Pipeline</h2>
        <div className="space-y-4 border-l-2 border-neutral-300 pl-6">
          {[
            { title: '1. Role & Stack Scoping', desc: 'Specify tech stack, seniority requirements, and target timeline.' },
            { title: '2. Automated Code Vetting', desc: 'We evaluate live algorithmic performance and system design skills.' },
            { title: '3. Shortlist Interview', desc: 'Conduct 30-minute targeted candidate interviews.' },
            { title: '4. 72-Hour Deployment', desc: 'Engineer joins your Slack, Jira, and GitHub repositories.' }
          ].map((s, idx) => (
            <div key={idx} className="space-y-1 relative">
              <div className="w-3 h-3 rounded-full bg-indigo-600 absolute -left-[31px] top-1" />
              <h4 className="font-bold text-sm text-neutral-900">{s.title}</h4>
              <p className="text-xs text-neutral-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 28: Talent Dossier Preview Card
 * ============================================================================ */
export function Sec28TalentDossierPreview() {
  return (
    <SecWrapper id="sec-28">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-neutral-200 shadow-xl space-y-4">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h3 className="font-bold text-base text-neutral-900">Candidate #7492 — Vetting Dossier</h3>
            <span className="text-xs text-neutral-500">Senior Full Stack Architect (8 Yrs Exp)</span>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">Top 1% Score</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-neutral-400">Algorithmic Score:</span>
            <div className="font-bold text-neutral-900">98.4 / 100</div>
          </div>
          <div>
            <span className="text-neutral-400">English Fluency:</span>
            <div className="font-bold text-neutral-900">C2 Native / Fluent</div>
          </div>
        </div>
        <button className="w-full py-3 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-800">
          Request Interview with Candidate #7492 →
        </button>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 29: GCC City Selector
 * ============================================================================ */
export function Sec29GccCitySelector() {
  const [city, setCity] = useState<'dubai' | 'riyadh' | 'bangalore'>('dubai');

  const details = {
    dubai: { title: 'Dubai Silicon Oasis Hub', info: '14,200+ Vetted Engineers • GMT+4 Timezone' },
    riyadh: { title: 'Riyadh KAFD Hub', info: '9,800+ Vetted Engineers • GMT+3 Timezone' },
    bangalore: { title: 'Bangalore Tech Center', info: '45,000+ Vetted Engineers • GMT+5:30 Timezone' },
  };

  return (
    <SecWrapper id="sec-29" bgClass="bg-slate-50">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900">GCC & Offshore Talent Corridors</h2>
        <div className="flex justify-center gap-2">
          {(['dubai', 'riyadh', 'bangalore'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-4 py-2 text-xs font-bold rounded-full capitalize transition-all ${
                city === c ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-2xl">
          <h3 className="font-bold text-base text-slate-900">{details[city].title}</h3>
          <p className="text-xs text-slate-500 mt-1">{details[city].info}</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 30: Pricing Cards 3 Tier
 * ============================================================================ */
export function Sec30PricingCards3Tier() {
  return (
    <SecWrapper id="sec-30">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-neutral-200 rounded-2xl space-y-4">
          <h4 className="font-bold text-base text-neutral-900">Single Developer</h4>
          <div className="text-2xl font-extrabold text-neutral-900">$4,500 <span className="text-xs text-neutral-400 font-normal">/ mo</span></div>
          <p className="text-xs text-neutral-500">1 Dedicated Full-Time Senior Dev.</p>
        </div>
        <div className="p-6 bg-neutral-900 text-white border border-neutral-900 rounded-2xl space-y-4 shadow-xl">
          <h4 className="font-bold text-base">Engineering Squad</h4>
          <div className="text-2xl font-extrabold text-emerald-400">$14,000 <span className="text-xs text-neutral-400 font-normal">/ mo</span></div>
          <p className="text-xs text-neutral-300">3 Senior Devs + 1 Tech Lead.</p>
        </div>
        <div className="p-6 bg-white border border-neutral-200 rounded-2xl space-y-4">
          <h4 className="font-bold text-base text-neutral-900">Enterprise GCC Hub</h4>
          <div className="text-2xl font-extrabold text-neutral-900">Custom</div>
          <p className="text-xs text-neutral-500">10+ Person Offshore Engineering Center.</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 31: FAQ Two Column
 * ============================================================================ */
export function Sec31FaqTwoColumn() {
  return (
    <SecWrapper id="sec-31" bgClass="bg-[#FAF8F6]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-neutral-900">How does the 14-day trial work?</h4>
          <p className="text-xs text-neutral-600">Work directly with the engineer for 14 days. Pay only if satisfied with performance.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-neutral-900">Who owns the intellectual property?</h4>
          <p className="text-xs text-neutral-600">You retain 100% full ownership of all code, patents, and work artifacts produced.</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 32: Security Compliance List
 * ============================================================================ */
export function Sec32SecurityComplianceList() {
  return (
    <SecWrapper id="sec-32">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {['SOC2 Type II', 'ISO 27001', 'GDPR Ready', 'Full IP Transfer'].map((item, idx) => (
          <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800">
            ✓ {item}
          </div>
        ))}
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 33: CTA Split With Form
 * ============================================================================ */
export function Sec33CtaSplitWithForm() {
  return (
    <SecWrapper id="sec-33" bgClass="bg-slate-50">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900">Build Your Tech Squad Today</h2>
          <p className="text-sm text-slate-600">Get 3 hand-picked pre-vetted candidate dossiers matched to your stack in 72 hours.</p>
        </div>
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg space-y-3">
          <input type="text" placeholder="Your Name" className="w-full p-3 bg-slate-50 border rounded-xl text-xs" />
          <input type="email" placeholder="Work Email" className="w-full p-3 bg-slate-50 border rounded-xl text-xs" />
          <button className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700">
            Submit Request →
          </button>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 34: Code Snippet Vs Agency
 * ============================================================================ */
export function Sec34CodeSnippetVsAgency() {
  return (
    <SecWrapper id="sec-34">
      <div className="max-w-3xl mx-auto bg-neutral-900 p-6 rounded-2xl text-xs font-mono text-neutral-300 shadow-xl space-y-2">
        <p className="text-red-400">// Traditional Recruiting: 60 Days, 25% Markup</p>
        <p className="text-emerald-400">// NexaTalent IT Solutions AI: 72 Hours, Flat Fee, 14-Day Guarantee</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 35: Team Pods Showcase
 * ============================================================================ */
export function Sec35TeamPodsShowcase() {
  return (
    <SecWrapper id="sec-35" bgClass="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['AI & LLM Fine-Tuning Pod', 'Full Stack SaaS Pod', 'DevOps & Cloud Pod'].map((pod, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h4 className="font-bold text-sm text-slate-900">{pod}</h4>
            <p className="text-xs text-slate-500">Includes 1 Tech Lead + 2 Senior Engineers. Deployed in 72h.</p>
          </div>
        ))}
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 36: Feature Grid 6 Tiles
 * ============================================================================ */
export function Sec36FeatureGrid6Tiles() {
  return (
    <SecWrapper id="sec-36">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {['AI Code Vetting', '72h Deployment', '14-Day Free Trial', '60% Cost Arbitrage', '100% IP Transfer', 'Dubai & Riyadh Hubs'].map((f, i) => (
          <div key={i} className="p-5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 shadow-sm">
            ✓ {f}
          </div>
        ))}
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 37: Stats Big Numbers
 * ============================================================================ */
export function Sec37StatsBigNumbers() {
  return (
    <SecWrapper id="sec-37" bgClass="bg-slate-50">
      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <div className="text-4xl font-extrabold text-slate-900">50,000+</div>
          <div className="text-xs text-slate-500 mt-1">Vetted Devs</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-indigo-600">72 Hrs</div>
          <div className="text-xs text-slate-500 mt-1">Avg Match Time</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-emerald-600">$180k</div>
          <div className="text-xs text-slate-500 mt-1">Savings / Dev</div>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 38: Testimonial Video Grid
 * ============================================================================ */
export function Sec38TestimonialVideoGrid() {
  return (
    <SecWrapper id="sec-38">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-neutral-900 text-white rounded-2xl space-y-2">
          <Play className="w-6 h-6 text-amber-400" />
          <h4 className="font-bold text-sm">VP of Engineering, Dubai FinTech</h4>
          <p className="text-xs text-neutral-400">"Hired 3 AI engineers in 4 days. Incredible talent quality."</p>
        </div>
        <div className="p-6 bg-neutral-900 text-white rounded-2xl space-y-2">
          <Play className="w-6 h-6 text-amber-400" />
          <h4 className="font-bold text-sm">CTO, Riyadh Enterprise SaaS</h4>
          <p className="text-xs text-neutral-400">"Seamless offshore pod deployment into our Jira sprints."</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 39: Tech Stack Filter List
 * ============================================================================ */
export function Sec39TechStackFilterList() {
  return (
    <SecWrapper id="sec-39" bgClass="bg-white">
      <div className="flex flex-wrap justify-center gap-2">
        {['React 19', 'Next.js', 'PyTorch', 'FastAPI', 'Node.js', 'Golang', 'Rust', 'Kubernetes', 'AWS', 'PostgreSQL'].map((t, i) => (
          <span key={i} className="px-3.5 py-1.5 bg-slate-100 border text-slate-700 text-xs font-semibold rounded-full">
            {t}
          </span>
        ))}
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 40: Comparison Matrix Grid
 * ============================================================================ */
export function Sec40ComparisonMatrixGrid() {
  return (
    <SecWrapper id="sec-40" bgClass="bg-slate-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl border text-xs space-y-3">
        <div className="flex justify-between font-bold border-b pb-2">
          <span>Criterion</span>
          <span>Traditional Recruiting</span>
          <span className="text-indigo-600">NexaTalent IT Solutions</span>
        </div>
        <div className="flex justify-between">
          <span>Time to Hire</span>
          <span className="text-slate-400">60 Days</span>
          <span className="font-bold text-indigo-600">72 Hours</span>
        </div>
        <div className="flex justify-between">
          <span>Code Vetting</span>
          <span className="text-slate-400">Manual / None</span>
          <span className="font-bold text-indigo-600">Automated Algorithmic</span>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 41: Values Manifesto
 * ============================================================================ */
export function Sec41ValuesManifesto() {
  return (
    <SecWrapper id="sec-41">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-slate-900">Engineering Quality First. Always.</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          We believe technology teams perform best when provided with vetted, high-autonomy talent.
        </p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 42: Bento Glass Glow
 * ============================================================================ */
export function Sec42BentoGlassGlow() {
  return (
    <SecWrapper id="sec-42" bgClass="bg-indigo-50/40">
      <div className="p-8 bg-white/80 backdrop-blur-md rounded-3xl border border-indigo-100 shadow-xl space-y-4 max-w-2xl mx-auto text-center">
        <Sparkles className="w-8 h-8 text-indigo-600 mx-auto" />
        <h3 className="text-xl font-bold text-indigo-950">Next-Gen Tech Matchmaking</h3>
        <p className="text-xs text-indigo-700">Powered by automated code analysis and talent telemetries.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 43: Step Cards Linear
 * ============================================================================ */
export function Sec43StepCardsLinear() {
  return (
    <SecWrapper id="sec-43">
      <div className="flex flex-col sm:flex-row justify-center gap-4 text-center">
        <div className="p-4 bg-slate-50 border rounded-xl flex-1 font-bold text-xs">1. Job Spec</div>
        <div className="p-4 bg-slate-50 border rounded-xl flex-1 font-bold text-xs">2. AI Match</div>
        <div className="p-4 bg-slate-50 border rounded-xl flex-1 font-bold text-xs">3. 72h Deploy</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 44: Candidate Availability Ticker
 * ============================================================================ */
export function Sec44CandidateAvailabilityTicker() {
  return (
    <SecWrapper id="sec-44" bgClass="bg-emerald-50">
      <div className="flex items-center justify-between text-xs text-emerald-900 font-bold">
        <span>⚡ LIVE TALENT TICKER: 14 Senior AI Engineers Available in Dubai / Remote</span>
        <button className="px-3 py-1 bg-emerald-600 text-white rounded-lg">View Ticker →</button>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 45: GCC Regional Stats
 * ============================================================================ */
export function Sec45GccRegionalStats() {
  return (
    <SecWrapper id="sec-45">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-white border rounded-xl"><div className="font-bold text-sm">Dubai</div><div className="text-xs text-slate-500">14.2k Devs</div></div>
        <div className="p-4 bg-white border rounded-xl"><div className="font-bold text-sm">Riyadh</div><div className="text-xs text-slate-500">9.8k Devs</div></div>
        <div className="p-4 bg-white border rounded-xl"><div className="font-bold text-sm">Bangalore</div><div className="text-xs text-slate-500">45k Devs</div></div>
        <div className="p-4 bg-white border rounded-xl"><div className="font-bold text-sm">Singapore</div><div className="text-xs text-slate-500">12.5k Devs</div></div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 46: Pricing Monthly Toggle
 * ============================================================================ */
export function Sec46PricingMonthlyToggle() {
  const [annual, setAnnual] = useState(false);

  return (
    <SecWrapper id="sec-46" bgClass="bg-slate-50">
      <div className="text-center space-y-4">
        <div className="inline-flex p-1 bg-white rounded-full border">
          <button onClick={() => setAnnual(false)} className={`px-4 py-1 text-xs font-bold rounded-full ${!annual ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Monthly</button>
          <button onClick={() => setAnnual(true)} className={`px-4 py-1 text-xs font-bold rounded-full ${annual ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Annual (15% Off)</button>
        </div>
        <div className="text-xl font-bold text-slate-900">
          Senior Dev: ${annual ? '3,800' : '4,500'} / mo
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 47: FAQ Searchable
 * ============================================================================ */
export function Sec47FaqSearchable() {
  return (
    <SecWrapper id="sec-47">
      <div className="max-w-xl mx-auto space-y-4">
        <input type="text" placeholder="Search questions..." className="w-full p-3 bg-slate-50 border rounded-xl text-xs" />
        <p className="text-xs text-slate-500 text-center">Type any question regarding hiring, payroll, or vetting.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 48: Security IP Ownership
 * ============================================================================ */
export function Sec48SecurityIpOwnership() {
  return (
    <SecWrapper id="sec-48" bgClass="bg-stone-50">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border space-y-2 text-center">
        <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto" />
        <h3 className="font-bold text-base">Full IP Assignment Clause</h3>
        <p className="text-xs text-stone-600">All work product created by engineers belongs exclusively to your corporate entity.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 49: CTA Full Width Dark Accents
 * ============================================================================ */
export function Sec49CtaFullWidthDarkAccents() {
  return (
    <SecWrapper id="sec-49" bgClass="bg-neutral-900" border={false}>
      <div className="text-center text-white space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold">Build Your Tech Squad in 72 Hours</h2>
        <button className="px-6 py-3 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-xl hover:bg-emerald-400">
          Request Candidate Match →
        </button>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 50: Code Evaluation Bench
 * ============================================================================ */
export function Sec50CodeEvaluationBench() {
  return (
    <SecWrapper id="sec-50">
      <div className="max-w-xl mx-auto bg-slate-900 text-white p-6 rounded-2xl font-mono text-xs space-y-2">
        <span className="text-emerald-400 font-bold">✓ Algorithmic Benchmark: Top 1% Pass Rate</span>
        <p className="text-slate-400">Memory Optimization: 100/100 • Speed: 98/100</p>
      </div>
    </SecWrapper>
  );
}

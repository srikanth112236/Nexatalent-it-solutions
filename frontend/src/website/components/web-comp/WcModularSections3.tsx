import { useState } from 'react';
import {
  ShieldCheck,
  Globe,
  TrendingUp,
  Activity,
  DollarSign
} from 'lucide-react';
import { SecWrapper } from './WcModularSections1';

/* ============================================================================
 * SECTION 51: Bento Architectural
 * ============================================================================ */
export function Sec51BentoArchitectural() {
  return (
    <SecWrapper id="sec-51">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl md:col-span-2">
          <h4 className="font-bold text-base text-slate-900">GCC Corridor Access</h4>
          <p className="text-xs text-slate-600 mt-1">Direct recruitment pods operating in Dubai, Riyadh, and Bangalore.</p>
        </div>
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
          <h4 className="font-bold text-sm text-slate-900">72h Matching</h4>
          <p className="text-xs text-slate-500 mt-1">Speed without compromise.</p>
        </div>
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
          <h4 className="font-bold text-sm text-slate-900">100% IP Ownership</h4>
          <p className="text-xs text-slate-500 mt-1">Full corporate transfer.</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 52: Process Interactive Tabs
 * ============================================================================ */
export function Sec52ProcessInteractiveTabs() {
  const [tab, setTab] = useState(0);

  const steps = [
    { title: '1. AI Match', desc: 'AI algorithm selects top 3 candidates matching your repository.' },
    { title: '2. Live Code Test', desc: 'Candidates pass algorithmic and system design benchmarks.' },
    { title: '3. Final Interview', desc: '30-minute culture and technical alignment chat with your team.' },
    { title: '4. 72h Deployment', desc: 'Engineer joins your Slack, Jira, and GitHub.' },
  ];

  return (
    <SecWrapper id="sec-52" bgClass="bg-[#FAF8F6]">
      <div className="max-w-3xl mx-auto space-y-6 text-center">
        <h2 className="text-2xl font-extrabold text-neutral-900">Interactive Vetting Journey</h2>
        <div className="flex justify-center gap-2">
          {steps.map((_s, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
                tab === i ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 border'
              }`}
            >
              Step {i + 1}
            </button>
          ))}
        </div>
        <div className="p-6 bg-white border rounded-2xl">
          <h3 className="font-bold text-base text-neutral-900">{steps[tab].title}</h3>
          <p className="text-xs text-neutral-600 mt-2">{steps[tab].desc}</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 53: Stats Growth Chart
 * ============================================================================ */
export function Sec53StatsGrowthChart() {
  return (
    <SecWrapper id="sec-53">
      <div className="p-8 bg-indigo-50 border border-indigo-200 rounded-3xl text-center space-y-4 max-w-2xl mx-auto">
        <TrendingUp className="w-8 h-8 text-indigo-600 mx-auto" />
        <h3 className="text-2xl font-extrabold text-indigo-950">50,000+ Vetted Engineers Pool</h3>
        <p className="text-xs text-indigo-700">Growing by 2,500+ pre-evaluated senior engineers every month.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 54: Talent Skill Chips Grid
 * ============================================================================ */
export function Sec54TalentSkillChipsGrid() {
  return (
    <SecWrapper id="sec-54" bgClass="bg-white">
      <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
        {['PyTorch', 'LangChain', 'React 19', 'Next.js', 'FastAPI', 'Node.js', 'Golang', 'Rust', 'Kubernetes', 'AWS', 'PostgreSQL', 'Flutter'].map((skill, i) => (
          <span key={i} className="px-3.5 py-1.5 bg-slate-100 border text-slate-800 text-xs font-bold rounded-lg">
            ✓ {skill}
          </span>
        ))}
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 55: GCC Offshore Hub Benefits
 * ============================================================================ */
export function Sec55GccOffshoreHubBenefits() {
  return (
    <SecWrapper id="sec-55" bgClass="bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-2xl space-y-2">
          <Globe className="w-6 h-6 text-emerald-600" />
          <h4 className="font-bold text-sm text-slate-900">4-6h Timezone Overlap</h4>
          <p className="text-xs text-slate-500">Synchronous daily communication during your core work hours.</p>
        </div>
        <div className="p-6 bg-white border rounded-2xl space-y-2">
          <DollarSign className="w-6 h-6 text-indigo-600" />
          <h4 className="font-bold text-sm text-slate-900">60% Cost Arbitrage</h4>
          <p className="text-xs text-slate-500">Access top 1% engineering talent without Silicon Valley rates.</p>
        </div>
        <div className="p-6 bg-white border rounded-2xl space-y-2">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
          <h4 className="font-bold text-sm text-slate-900">Turnkey Compliance</h4>
          <p className="text-xs text-slate-500">We handle local employment law, tax, benefits, and hardware.</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 56: Client Logo Grid 6 Col
 * ============================================================================ */
export function Sec56ClientLogoGrid6Col() {
  return (
    <SecWrapper id="sec-56">
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 text-center text-xs font-bold text-neutral-400">
        <div className="p-4 bg-slate-50 border rounded-xl">FINTECH GULF</div>
        <div className="p-4 bg-slate-50 border rounded-xl">SAUDI CLOUD</div>
        <div className="p-4 bg-slate-50 border rounded-xl">DUBAI AI</div>
        <div className="p-4 bg-slate-50 border rounded-xl">EMIRATES LABS</div>
        <div className="p-4 bg-slate-50 border rounded-xl">BANGALORE HQ</div>
        <div className="p-4 bg-slate-50 border rounded-xl">SINGAPORE DEV</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 57: Testimonial Quote Big Type
 * ============================================================================ */
export function Sec57TestimonialQuoteBigType() {
  return (
    <SecWrapper id="sec-57" bgClass="bg-[#FDFBF7]">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <p className="text-2xl font-serif italic text-neutral-900 leading-relaxed">
          "NexaTalent IT Solutions is hands down the fastest way to deploy high-caliber engineering pods in the Middle East."
        </p>
        <div className="text-xs font-bold text-neutral-600">— Chief Product Officer, GCC Unicorn</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 58: Tech Category Selector
 * ============================================================================ */
export function Sec58TechCategorySelector() {
  const [cat, setCat] = useState('AI');

  return (
    <SecWrapper id="sec-58">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div className="flex justify-center gap-2">
          {['AI & LLM', 'Backend', 'Frontend', 'Cloud'].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 text-xs font-bold rounded-full ${cat === c ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="p-6 bg-slate-50 border rounded-2xl text-xs font-bold text-slate-800">
          Selected Category: {cat} — 12,000+ Vetted Engineers Available
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 59: Pricing Custom Quote Builder
 * ============================================================================ */
export function Sec59PricingCustomQuoteBuilder() {
  const [devs, setDevs] = useState(4);

  return (
    <SecWrapper id="sec-59" bgClass="bg-slate-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border space-y-4">
        <h3 className="font-bold text-base text-slate-900">Custom Squad Quote</h3>
        <div className="flex justify-between text-xs font-bold">
          <span>Squad Size: {devs} Engineers</span>
          <span className="text-indigo-600">${devs * 4500}/mo</span>
        </div>
        <input type="range" min="1" max="10" value={devs} onChange={(e) => setDevs(Number(e.target.value))} className="w-full accent-indigo-600" />
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 60: Security Audit Log Widget
 * ============================================================================ */
export function Sec60SecurityAuditLogWidget() {
  return (
    <SecWrapper id="sec-60">
      <div className="max-w-2xl mx-auto bg-neutral-900 text-neutral-300 p-6 rounded-2xl font-mono text-xs space-y-2 shadow-2xl">
        <span className="text-emerald-400">// SECURITY_AUDIT_LOG.json</span>
        <p>[PASS] Hardware Encryption Verified (AES-256)</p>
        <p>[PASS] Enterprise NDA Verified & Signed</p>
        <p>[PASS] SOC2 Type II Audit Compliance - ACTIVE</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 61: FAQ Accordion Cards
 * ============================================================================ */
export function Sec61FaqAccordionCards() {
  return (
    <SecWrapper id="sec-61" bgClass="bg-[#FAF8F6]">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="p-5 bg-white border rounded-2xl space-y-2">
          <h4 className="font-bold text-sm text-neutral-900">What if an engineer is not a fit?</h4>
          <p className="text-xs text-neutral-600">Our 14-day zero-risk trial ensures immediate replacement at zero additional charge.</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 62: CTA Gradient Glow Pill
 * ============================================================================ */
export function Sec62CtaGradientGlowPill() {
  return (
    <SecWrapper id="sec-62">
      <div className="p-8 bg-gradient-to-r from-indigo-600 to-teal-500 text-white rounded-full text-center max-w-2xl mx-auto shadow-xl">
        <h3 className="text-2xl font-extrabold">Deploy Vetted Tech Squads</h3>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 63: Code Terminal Dark Light Split
 * ============================================================================ */
export function Sec63CodeTerminalDarkLightSplit() {
  return (
    <SecWrapper id="sec-63">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-neutral-900 text-emerald-400 font-mono text-xs rounded-2xl">// Live Code Execution</div>
        <div className="p-6 bg-slate-100 text-slate-800 font-mono text-xs rounded-2xl">// Test Passed (1.2ms)</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 64: Comparison Checkmark Grid
 * ============================================================================ */
export function Sec64ComparisonCheckmarkGrid() {
  return (
    <SecWrapper id="sec-64" bgClass="bg-slate-50">
      <div className="grid grid-cols-3 gap-4 text-center text-xs font-bold">
        <div className="p-4 bg-white border rounded-xl">72h Matching: ✓</div>
        <div className="p-4 bg-white border rounded-xl">Code Vetting: ✓</div>
        <div className="p-4 bg-white border rounded-xl">14-Day Trial: ✓</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 65: Culture Photos Grid
 * ============================================================================ */
export function Sec65CulturePhotosGrid() {
  return (
    <SecWrapper id="sec-65">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900">Global Engineering Culture</h2>
        <p className="text-xs text-slate-600">Connecting engineers across Dubai, Riyadh, and Bangalore.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 66: Bento Hover Perspective
 * ============================================================================ */
export function Sec66BentoHoverPerspective() {
  return (
    <SecWrapper id="sec-66">
      <div className="p-6 bg-white border rounded-2xl shadow-md hover:shadow-2xl transition-all max-w-xl mx-auto text-center">
        <h4 className="font-bold text-sm text-slate-900">Interactive 3D Hover Bento</h4>
        <p className="text-xs text-slate-500 mt-1">Hover over to inspect candidate telemetry.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 67: Process Numbered Grid
 * ============================================================================ */
export function Sec67ProcessNumberedGrid() {
  return (
    <SecWrapper id="sec-67" bgClass="bg-[#FAF8F6]">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-white border rounded-xl font-bold text-xs">01. Request</div>
        <div className="p-4 bg-white border rounded-xl font-bold text-xs">02. Match</div>
        <div className="p-4 bg-white border rounded-xl font-bold text-xs">03. Interview</div>
        <div className="p-4 bg-white border rounded-xl font-bold text-xs">04. Deploy</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 68: Candidate Match Radar Card
 * ============================================================================ */
export function Sec68CandidateMatchRadarCard() {
  return (
    <SecWrapper id="sec-68">
      <div className="max-w-xl mx-auto bg-slate-900 text-white p-6 rounded-2xl space-y-2 text-center">
        <Activity className="w-8 h-8 text-emerald-400 mx-auto" />
        <h3 className="font-bold text-sm">Candidate Radar Match: 99.2%</h3>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 69: GCC Timezone Map Widget
 * ============================================================================ */
export function Sec69GccTimezoneMapWidget() {
  return (
    <SecWrapper id="sec-69" bgClass="bg-slate-50">
      <div className="flex justify-center gap-6 text-center text-xs font-bold">
        <div>London (GMT)</div>
        <div className="text-indigo-600">Dubai (GST +4)</div>
        <div className="text-indigo-600">Riyadh (AST +3)</div>
        <div className="text-emerald-600">Bangalore (IST +5:30)</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 70: Pricing Enterprise Custom
 * ============================================================================ */
export function Sec70PricingEnterpriseCustom() {
  return (
    <SecWrapper id="sec-70">
      <div className="p-8 bg-neutral-900 text-white rounded-3xl text-center space-y-4 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold">Custom Enterprise GCC Hub</h3>
        <p className="text-xs text-neutral-400">Dedicated offshore center with 10+ engineers, custom hardware, and physical office space.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 71: FAQ Contact Support Box
 * ============================================================================ */
export function Sec71FaqContactSupportBox() {
  return (
    <SecWrapper id="sec-71">
      <div className="text-center space-y-3">
        <h4 className="font-bold text-sm text-neutral-900">Still have questions?</h4>
        <button className="px-6 py-2.5 bg-neutral-900 text-white font-bold text-xs rounded-xl">Chat with Sourcing Advisor</button>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 72: Security Certification Grid
 * ============================================================================ */
export function Sec72SecurityCertificationGrid() {
  return (
    <SecWrapper id="sec-72" bgClass="bg-stone-50">
      <div className="grid grid-cols-4 gap-4 text-center text-xs font-bold text-stone-800">
        <div className="p-4 bg-white border rounded-xl">SOC2 Type II</div>
        <div className="p-4 bg-white border rounded-xl">ISO 27001</div>
        <div className="p-4 bg-white border rounded-xl">GDPR Ready</div>
        <div className="p-4 bg-white border rounded-xl">HIPAA Compliant</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 73: CTA Newsletter Mini
 * ============================================================================ */
export function Sec73CtaNewsletterMini() {
  return (
    <SecWrapper id="sec-73">
      <div className="max-w-md mx-auto space-y-3 text-center">
        <h4 className="font-bold text-sm text-neutral-900">GCC Tech Talent Insights</h4>
        <div className="flex gap-2">
          <input type="email" placeholder="Work email..." className="flex-1 p-2.5 bg-slate-100 border rounded-xl text-xs" />
          <button className="px-4 py-2.5 bg-neutral-900 text-white font-bold text-xs rounded-xl">Subscribe</button>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 74: Code Pipeline Steps
 * ============================================================================ */
export function Sec74CodePipelineSteps() {
  return (
    <SecWrapper id="sec-74">
      <div className="max-w-xl mx-auto bg-neutral-900 text-emerald-400 p-6 rounded-2xl font-mono text-xs space-y-1">
        <p>&gt; Step 1: Code Benchmark (Passed)</p>
        <p>&gt; Step 2: System Architecture Defense (Passed)</p>
        <p>&gt; Step 3: English Fluency Check (Passed)</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 75: Comparison Savings Bar Chart
 * ============================================================================ */
export function Sec75ComparisonSavingsBarChart() {
  return (
    <SecWrapper id="sec-75" bgClass="bg-slate-50">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border space-y-4">
        <h4 className="font-bold text-sm text-slate-900 text-center">Annual Cost Comparison</h4>
        <div className="space-y-2 text-xs">
          <div>US/UK Local: <strong className="text-slate-900">$160,000/yr</strong></div>
          <div>NexaTalent IT Solutions GCC: <strong className="text-emerald-600">$54,000/yr</strong></div>
        </div>
      </div>
    </SecWrapper>
  );
}

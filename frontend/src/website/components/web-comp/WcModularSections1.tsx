import React, { useState } from 'react';
import {
  MapPin,
  ShieldCheck,
  Zap,
  Globe,
  Building2,
  Star,
  Play,
  ChevronDown,
  Award,
  Lock
} from 'lucide-react';

/* Standard Section Container Helper for Internal Sections */
export function SecWrapper({
  id,
  children,
  bgClass = 'bg-white',
  border = true
}: {
  id?: string;
  children: React.ReactNode;
  bgClass?: string;
  border?: boolean;
}) {
  return (
    <section id={id} className={`relative py-16 px-6 lg:px-16 ${bgClass} text-neutral-900 ${border ? 'border-b border-neutral-200/80' : ''}`}>
      <div className="mx-auto max-w-7xl w-full">
        {children}
      </div>
    </section>
  );
}

/* ============================================================================
 * SECTION 01: Bento Features (Asymmetric Dribbble Style)
 * ============================================================================ */
export function Sec1BentoFeatures() {
  return (
    <SecWrapper id="sec-1">
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          [ Dribbble-Inspired Bento Grid ]
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
          Everything You Need to Scale Engineering Pods
        </h2>
        <p className="text-base text-neutral-600">
          Vetted talent, automated code benchmarks, and instant payroll integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200/80 hover:shadow-xl transition-all space-y-4 md:col-span-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900">72-Hour Candidate Matching Engine</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Our AI matching algorithm analyzes 40+ technical vectors to present 3 hand-picked candidates matched specifically to your repo's tech stack.
          </p>
          <div className="flex gap-2 pt-2">
            <span className="px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700">PyTorch</span>
            <span className="px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700">React 19</span>
            <span className="px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700">Golang</span>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-neutral-900 text-white space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">SOC2 & GDPR Compliant</h3>
          <p className="text-sm text-neutral-400 leading-relaxed">
            100% intellectual property transfer, hardware security protocols, and enterprise NDAs signed before onboarding.
          </p>
          <span className="inline-block text-xs font-mono text-emerald-400 font-bold">✓ 100% Security Verified</span>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 02: Process Workflow Timeline (4 Steps)
 * ============================================================================ */
export function Sec2ProcessTimeline() {
  const steps = [
    { step: '01', title: 'Share Stack & Job Requirements', desc: 'Tell us your technical requirements, team size, and timezone overlap.' },
    { step: '02', title: 'Automated AI Code Vetting', desc: 'We evaluate code efficiency, architecture defense, and English communication.' },
    { step: '03', title: 'Meet 3 Shortlisted Engineers', desc: 'Conduct targeted 30-minute final interviews with top matched candidates.' },
    { step: '04', title: '72-Hour Onboarding', desc: 'Selected candidates join your Slack, Jira, and GitHub with zero onboarding delay.' },
  ];

  return (
    <SecWrapper id="sec-2" bgClass="bg-[#FAF8F5]">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">How NexaTalent IT Solutions Works</span>
        <h2 className="text-3xl font-extrabold text-neutral-900">From Job Spec to Hired in 4 Simple Steps</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, idx) => (
          <div key={idx} className="p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-sm relative space-y-3">
            <span className="text-3xl font-black text-amber-500">{item.step}</span>
            <h4 className="font-bold text-base text-neutral-900">{item.title}</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 03: Statistics & ROI Metrics Grid
 * ============================================================================ */
export function Sec3StatsMetricsGrid() {
  return (
    <SecWrapper id="sec-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">$180k+</div>
          <div className="text-xs font-bold text-slate-700 mt-2">Avg Annual Savings / Dev</div>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">72 Hours</div>
          <div className="text-xs font-bold text-slate-700 mt-2">Average Match & Hire Time</div>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-3xl sm:text-4xl font-extrabold text-purple-600">99.4%</div>
          <div className="text-xs font-bold text-slate-700 mt-2">14-Day Trial Pass Rate</div>
        </div>
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-3xl sm:text-4xl font-extrabold text-teal-600">50,000+</div>
          <div className="text-xs font-bold text-slate-700 mt-2">Vetted Engineers Pool</div>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 04: Talent Cards Grid
 * ============================================================================ */
export function Sec4TalentCardsGrid() {
  const devs = [
    { name: 'Rashid K.', role: 'Senior AI Engineer', exp: '8+ Yrs Exp', location: 'Dubai, UAE', skills: ['PyTorch', 'LangChain', 'FastAPI'], rate: '$95k/yr' },
    { name: 'Ananya S.', role: 'Full Stack Architect', exp: '9+ Yrs Exp', location: 'Bangalore, IN', skills: ['React 19', 'Next.js', 'PostgreSQL'], rate: '$85k/yr' },
    { name: 'Fariq M.', role: 'Lead DevOps & Cloud', exp: '10+ Yrs Exp', location: 'Riyadh, KSA', skills: ['Kubernetes', 'AWS', 'Terraform'], rate: '$105k/yr' },
  ];

  return (
    <SecWrapper id="sec-4" bgClass="bg-[#F8FAFC]">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase">Live Vetted Profiles</span>
          <h2 className="text-2xl font-extrabold text-slate-900">Featured Senior Engineers</h2>
        </div>
        <button className="text-xs font-bold text-blue-600 hover:underline">View All Candidates →</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {devs.map((dev, idx) => (
          <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-md space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-slate-900">{dev.name}</h3>
                <div className="text-xs text-slate-500">{dev.role} • {dev.exp}</div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                Ready to Hire
              </span>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {dev.location}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {dev.skills.map((s, i) => (
                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded font-mono">
                  {s}
                </span>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500">Rate: <strong className="text-slate-900">{dev.rate}</strong></span>
              <button className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-[11px]">Request Interview</button>
            </div>
          </div>
        ))}
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 05: GCC Hub Corridors
 * ============================================================================ */
export function Sec5GccHubCorridors() {
  return (
    <SecWrapper id="sec-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-bold text-teal-600 uppercase">GCC Talent Corridors</span>
          <h2 className="text-3xl font-extrabold text-neutral-900">Regional Tech Hubs in Dubai, Riyadh & Bangalore</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Establish legal compliance, local payroll, and physical engineering hubs across top Middle East and South Asian technology capitals.
          </p>
        </div>
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {['Dubai (UAE Hub)', 'Riyadh (KSA Hub)', 'Bangalore (Tech Center)'].map((hub, i) => (
            <div key={i} className="p-5 bg-teal-50/50 border border-teal-200 rounded-2xl text-center space-y-2">
              <Globe className="w-6 h-6 text-teal-600 mx-auto" />
              <div className="font-bold text-sm text-neutral-900">{hub}</div>
              <div className="text-xs text-neutral-500">Full EOR & Office Setup</div>
            </div>
          ))}
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 06: Client Logos Marquee
 * ============================================================================ */
export function Sec6ClientLogosMarquee() {
  return (
    <SecWrapper id="sec-6" bgClass="bg-white">
      <div className="text-center text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">
        Trusted by 500+ Tech Scaleups & Enterprise GCCs
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8 text-neutral-400 font-bold text-sm opacity-80">
        <span>FINTECH GULF</span>
        <span>SAUDI TECH LABS</span>
        <span>DUBAI AI VENTURES</span>
        <span>EMIRATES CLOUD</span>
        <span>BANGALORE CORE</span>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 07: Testimonial Carousel Featured Quote
 * ============================================================================ */
export function Sec7TestimonialCarousel() {
  return (
    <SecWrapper id="sec-7" bgClass="bg-neutral-900" border={false}>
      <div className="max-w-3xl mx-auto text-center text-white space-y-6">
        <div className="flex justify-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400" />)}
        </div>
        <p className="text-xl sm:text-2xl font-medium italic leading-relaxed text-neutral-200">
          "NexaTalent IT Solutions allowed us to assemble a 5-person AI engineering squad in Dubai within 4 days. The talent standard and vetting quality exceeded our expectations."
        </p>
        <div>
          <div className="font-bold text-base text-white">Hamad Al-Subaie</div>
          <div className="text-xs text-neutral-400">Chief Technology Officer, Gulf Payments</div>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 08: Tech Stack Matrix
 * ============================================================================ */
export function Sec8TechStackMatrix() {
  const stacks = ['React 19', 'Next.js', 'Python', 'PyTorch', 'Golang', 'Rust', 'Kubernetes', 'AWS', 'PostgreSQL', 'Flutter', 'TypeScript', 'Docker'];

  return (
    <SecWrapper id="sec-8">
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <h2 className="text-2xl font-extrabold text-neutral-900">Supported Technology Stacks</h2>
        <p className="text-xs text-neutral-600">Engineers vetted specifically for modern production codebases.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {stacks.map((stack, i) => (
          <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-sm">
            {stack}
          </div>
        ))}
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 09: Interactive Pricing Calculator
 * ============================================================================ */
export function Sec9InteractivePricingCalculator() {
  const [count, setCount] = useState(3);

  return (
    <SecWrapper id="sec-9" bgClass="bg-slate-50">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <h3 className="text-xl font-bold text-slate-900 text-center">Interactive Squad Investment Estimator</h3>
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
            <span>Engineering Squad Size:</span>
            <span className="text-indigo-600 text-sm">{count} Full-Time Developers</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-slate-50 rounded-xl border">
            <div className="text-xs text-slate-500">Monthly Investment</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">${(count * 4500).toLocaleString()}/mo</div>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="text-xs text-emerald-700 font-bold">Estimated Savings vs US Hiring</div>
            <div className="text-2xl font-extrabold text-emerald-800 mt-1">${(count * 95000).toLocaleString()}/yr</div>
          </div>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 10: Security Shield & Enterprise Protection
 * ============================================================================ */
export function Sec10SecurityShield() {
  return (
    <SecWrapper id="sec-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-neutral-200 rounded-2xl space-y-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h4 className="font-bold text-sm text-neutral-900">100% IP Transfer</h4>
          <p className="text-xs text-neutral-500">All code, patents, and work output belong entirely to your company.</p>
        </div>
        <div className="p-6 bg-white border border-neutral-200 rounded-2xl space-y-2">
          <Lock className="w-6 h-6 text-indigo-600" />
          <h4 className="font-bold text-sm text-neutral-900">Enterprise NDAs</h4>
          <p className="text-xs text-neutral-500">Enforceable strict confidentiality agreements signed prior to work.</p>
        </div>
        <div className="p-6 bg-white border border-neutral-200 rounded-2xl space-y-2">
          <Building2 className="w-6 h-6 text-teal-600" />
          <h4 className="font-bold text-sm text-neutral-900">Hardware & Data Controls</h4>
          <p className="text-xs text-neutral-500">Secure managed laptops with device management and encrypted storage.</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 11: FAQ Accordion (Interactive)
 * ============================================================================ */
export function Sec11FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: 'How quickly can engineers start working with our team?', a: 'After selecting your preferred candidate, engineers can be onboarded into your Slack, Jira, and GitHub repositories within 72 hours.' },
    { q: 'What is the 14-day risk-free trial period?', a: 'You get 14 full days to work directly with the engineer. If you are not 100% satisfied with their output, you pay nothing.' },
    { q: 'How does NexaTalent IT Solutions handle candidate vetting?', a: 'Every engineer undergoes automated code benchmark tests, live system architecture interviews, and English fluency evaluations.' },
    { q: 'Can we hire engineers for permanent placement?', a: 'Yes! We support flexible contract-to-hire and permanent placement options across GCC and international jurisdictions.' },
  ];

  return (
    <SecWrapper id="sec-11" bgClass="bg-[#FAF8F6]">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-neutral-900">Frequently Asked Questions</h2>
          <p className="text-xs text-neutral-600">Everything you need to know about scaling with NexaTalent IT Solutions.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="bg-white border border-neutral-200 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-neutral-900"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 12: CTA Gradient Banner
 * ============================================================================ */
export function Sec12CtaGradientBanner() {
  return (
    <SecWrapper id="sec-12" bgClass="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-500" border={false}>
      <div className="text-center text-white space-y-6 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Ready to Build Your Engineering Squad?
        </h2>
        <p className="text-base text-indigo-100">
          Get 3 hand-picked, pre-vetted candidate dossiers delivered to your inbox in 72 hours.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-4 bg-white text-neutral-950 font-bold text-sm rounded-xl shadow-xl hover:bg-neutral-100 transition-all">
            Get Matched Candidates Now →
          </button>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 13: Code Vetting Terminal Widget
 * ============================================================================ */
export function Sec13CodeVettingTerminal() {
  return (
    <SecWrapper id="sec-13">
      <div className="max-w-4xl mx-auto bg-neutral-900 p-6 rounded-2xl font-mono text-xs text-neutral-300 shadow-2xl space-y-2">
        <div className="flex justify-between text-neutral-500 text-[10px] pb-2 border-b border-neutral-800">
          <span>NEXATALENT_AUTOMATED_BENCHMARK_V4.sh</span>
          <span>STATUS: ALL TESTS PASSED</span>
        </div>
        <p className="text-emerald-400">&gt; npm run test:system-architecture</p>
        <p className="text-neutral-400">✓ Test 1: Algorithmic Memory Optimization (O(1) Memory) - PASSED</p>
        <p className="text-neutral-400">✓ Test 2: Concurrent API Stress Handling (50k req/s) - PASSED</p>
        <p className="text-emerald-400">&gt; Candidate Vetting Score: 98.6 / 100 [APPROVED]</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 14: Versus Comparison Table
 * ============================================================================ */
export function Sec14VersusComparisonTable() {
  return (
    <SecWrapper id="sec-14" bgClass="bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center">NexaTalent IT Solutions vs Traditional Hiring</h2>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md text-xs">
          <div className="grid grid-cols-3 p-4 bg-slate-100 font-bold text-slate-800 border-b">
            <span>Feature</span>
            <span>Traditional Recruitment</span>
            <span className="text-indigo-600">NexaTalent IT Solutions AI Match</span>
          </div>
          <div className="grid grid-cols-3 p-4 border-b">
            <span className="font-bold text-slate-900">Time to Hire</span>
            <span className="text-slate-500">60 - 90 Days</span>
            <span className="font-bold text-indigo-600">72 Hours</span>
          </div>
          <div className="grid grid-cols-3 p-4 border-b">
            <span className="font-bold text-slate-900">Vetting Guarantee</span>
            <span className="text-slate-500">Resume Only</span>
            <span className="font-bold text-indigo-600">Automated Code Test + 14-Day Trial</span>
          </div>
          <div className="grid grid-cols-3 p-4">
            <span className="font-bold text-slate-900">Annual Cost</span>
            <span className="text-slate-500">$160k+ per engineer</span>
            <span className="font-bold text-emerald-600">Starting $54k/yr (Up to 60% Savings)</span>
          </div>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 15: Company Values Grid
 * ============================================================================ */
export function Sec15CompanyValuesGrid() {
  return (
    <SecWrapper id="sec-15">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
        {['Speed', 'Precision', 'Transparency', 'Security'].map((val, i) => (
          <div key={i} className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="text-xl font-bold text-slate-900">{val}</div>
            <p className="text-xs text-slate-500">Built into every candidate match and team deployment.</p>
          </div>
        ))}
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 16: Candidate Video Pill Preview
 * ============================================================================ */
export function Sec16CandidateVideoPill() {
  return (
    <SecWrapper id="sec-16" bgClass="bg-[#FAF8F5]">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-neutral-200 shadow-xl flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-2xl bg-neutral-900 flex items-center justify-center text-white shrink-0 overflow-hidden">
          <Play className="w-8 h-8 text-amber-400 fill-amber-400" />
        </div>
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
            Video Vetting Snippet (1:30)
          </span>
          <h4 className="font-bold text-base text-neutral-900">Watch Senior AI Dev Architecture Defense</h4>
          <p className="text-xs text-neutral-500">Hear candidate explain microservice decoupling and vector database queries.</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 17: Feature Split Image Right
 * ============================================================================ */
export function Sec17FeatureSplitImageRight() {
  return (
    <SecWrapper id="sec-17">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-3xl font-extrabold text-neutral-900">Dedicated Candidate Match Dashboard</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Manage interviewing schedules, review code assessment reports, and approve contracts all in one place.
          </p>
        </div>
        <div className="lg:col-span-6 bg-slate-100 p-8 rounded-3xl border border-slate-200 shadow-inner text-center text-xs font-bold text-slate-400">
          [ Candidate Dashboard Interface Preview ]
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 18: Feature Split Image Left
 * ============================================================================ */
export function Sec18FeatureSplitImageLeft() {
  return (
    <SecWrapper id="sec-18" bgClass="bg-[#F8FAFC]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 bg-neutral-900 p-6 rounded-2xl text-emerald-400 font-mono text-xs shadow-xl">
          // Live API Candidate Query <br />
          const candidate = await nexaTalent.match(&#123; role: 'Lead AI Engineer', location: 'Dubai' &#125;);
        </div>
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900">Programmatic Talent Sourcing</h2>
          <p className="text-sm text-slate-600">Integrate NexaTalent IT Solutions APIs directly into your HR tech stack for instant headcount expansion.</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 19: Bento Grid Light 2
 * ============================================================================ */
export function Sec19BentoGridLight2() {
  return (
    <SecWrapper id="sec-19">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2">
          <h4 className="font-bold text-indigo-900 text-base">Instant Slack Integration</h4>
          <p className="text-xs text-indigo-700">Engineers join your Slack channels on day 1 for seamless communication.</p>
        </div>
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
          <h4 className="font-bold text-emerald-900 text-base">Jira & GitHub Sync</h4>
          <p className="text-xs text-emerald-700">Full sprint velocity tracking and automated pull request workflows.</p>
        </div>
        <div className="p-6 bg-purple-50 border border-purple-200 rounded-2xl space-y-2">
          <h4 className="font-bold text-purple-900 text-base">Global Payroll & Tax</h4>
          <p className="text-xs text-purple-700">Zero legal overhead. We manage local employment tax and compliance.</p>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 20: Step Number Cards
 * ============================================================================ */
export function Sec20StepNumberCards() {
  return (
    <SecWrapper id="sec-20" bgClass="bg-stone-50">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { num: '01', title: 'Scope Requirement', desc: 'Define tech stack, seniority, and budget.' },
          { num: '02', title: 'Inspect Vetted Dossiers', desc: 'Review pre-evaluated candidate profiles.' },
          { num: '03', title: 'Deploy Squad', desc: 'Start 14-day risk-free engineering trial.' }
        ].map((item, i) => (
          <div key={i} className="p-6 bg-white border border-stone-200 rounded-2xl space-y-2">
            <span className="text-2xl font-black text-stone-900">{item.num}</span>
            <h4 className="font-bold text-sm text-stone-900">{item.title}</h4>
            <p className="text-xs text-stone-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 21: ROI Stats Highlight
 * ============================================================================ */
export function Sec21RoiStatsHighlight() {
  return (
    <SecWrapper id="sec-21">
      <div className="bg-emerald-600 text-white p-8 rounded-3xl text-center space-y-4">
        <h2 className="text-3xl font-extrabold">60% Payroll Cost Reduction</h2>
        <p className="text-sm text-emerald-100 max-w-xl mx-auto">
          Hire world-class senior developers in Dubai, Riyadh, and Bangalore at a fraction of Silicon Valley rates.
        </p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 22: Integration Grid
 * ============================================================================ */
export function Sec22IntegrationGrid() {
  return (
    <SecWrapper id="sec-22" bgClass="bg-[#FAF8F6]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-neutral-900">Seamless Dev Tools Integration</h2>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-neutral-700">
          <span className="px-4 py-2 bg-white border rounded-xl">Slack</span>
          <span className="px-4 py-2 bg-white border rounded-xl">Jira</span>
          <span className="px-4 py-2 bg-white border rounded-xl">GitHub</span>
          <span className="px-4 py-2 bg-white border rounded-xl">GitLab</span>
          <span className="px-4 py-2 bg-white border rounded-xl">Linear</span>
          <span className="px-4 py-2 bg-white border rounded-xl">Notion</span>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 23: Executive Pledge Box
 * ============================================================================ */
export function Sec23ExecutivePledgeBox() {
  return (
    <SecWrapper id="sec-23">
      <div className="max-w-3xl mx-auto p-8 bg-slate-900 text-white rounded-3xl space-y-4 text-center">
        <Award className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="text-2xl font-bold">100% Satisfaction Guarantee</h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
          If any developer does not meet your technical expectations during the initial 14-day trial period, we replace them immediately at zero cost.
        </p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 24: Micro Testimonials Grid
 * ============================================================================ */
export function Sec24MicroTestimonialsGrid() {
  return (
    <SecWrapper id="sec-24" bgClass="bg-slate-50">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { text: 'NexaTalent IT Solutions saved our launch deadline by matching 2 Senior React Engineers in 48 hours.', author: 'VP of Tech, FinTech UAE' },
          { text: 'The candidate code vetting report gave us 100% confidence before the interview.', author: 'CTO, Saudi HealthTech' },
          { text: 'Unbeatable payroll arbitrage without any sacrifice in code quality or communication.', author: 'Head of Eng, Dubai Scaleup' }
        ].map((item, i) => (
          <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 text-xs">
            <p className="italic text-slate-700">"{item.text}"</p>
            <div className="font-bold text-slate-900">{item.author}</div>
          </div>
        ))}
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 25: Final CTA Light
 * ============================================================================ */
export function Sec25FinalCtaLight() {
  return (
    <SecWrapper id="sec-25">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-neutral-900">Start Hiring Vetted Tech Talent Today</h2>
        <p className="text-sm text-neutral-600">Get matched with your first 3 candidate dossiers in under 72 hours.</p>
        <div className="flex justify-center gap-3">
          <input type="email" placeholder="Enter work email..." className="px-4 py-3 bg-neutral-100 border border-neutral-300 rounded-xl text-xs w-64 focus:outline-none" />
          <button className="px-6 py-3 bg-neutral-900 text-white font-bold text-xs rounded-xl hover:bg-neutral-800">Get Matched Now →</button>
        </div>
      </div>
    </SecWrapper>
  );
}

import { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  Lock,
  Award
} from 'lucide-react';
import { SecWrapper } from './WcModularSections1';

/* ============================================================================
 * SECTION 76: Bento Brutalist Light
 * ============================================================================ */
export function Sec76BentoBrutalistLight() {
  return (
    <SecWrapper id="sec-76">
      <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-amber-50/50 space-y-4 max-w-3xl mx-auto">
        <span className="font-mono text-xs font-black bg-black text-white px-3 py-1">NEO-BRUTALIST BENTO</span>
        <h3 className="text-3xl font-black uppercase text-black">Vetted Senior Tech Squads</h3>
        <p className="text-xs font-bold text-neutral-800">Deploy 100% evaluated developers into your codebase in 72 hours.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 77: Process Chevron Stepper
 * ============================================================================ */
export function Sec77ProcessChevronStepper() {
  return (
    <SecWrapper id="sec-77" bgClass="bg-[#FAF8F6]">
      <div className="flex flex-wrap justify-center gap-2 text-xs font-bold text-neutral-700">
        <span className="px-4 py-2 bg-white border rounded-lg">1. Requirements →</span>
        <span className="px-4 py-2 bg-white border rounded-lg">2. AI Vetting →</span>
        <span className="px-4 py-2 bg-white border rounded-lg">3. Interview →</span>
        <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg">4. Hired</span>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 78: Talent Verification Badge Card
 * ============================================================================ */
export function Sec78TalentVerificationBadgeCard() {
  return (
    <SecWrapper id="sec-78">
      <div className="max-w-xl mx-auto p-6 bg-white border rounded-2xl shadow-md space-y-3">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h4 className="font-bold text-sm text-neutral-900">Background & Degree Verified</h4>
        </div>
        <p className="text-xs text-neutral-500">Identity, criminal record, employment history, and education authenticated.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 79: GCC Talent Density Map
 * ============================================================================ */
export function Sec79GccTalentDensityMap() {
  return (
    <SecWrapper id="sec-79" bgClass="bg-slate-50">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white border rounded-xl"><div className="font-bold text-sm">Dubai Internet City</div><div className="text-xs text-slate-500">14.2k Devs</div></div>
        <div className="p-4 bg-white border rounded-xl"><div className="font-bold text-sm">Riyadh KAFD</div><div className="text-xs text-slate-500">9.8k Devs</div></div>
        <div className="p-4 bg-white border rounded-xl"><div className="font-bold text-sm">Bangalore Outer Ring</div><div className="text-xs text-slate-500">45k Devs</div></div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 80: Pricing Trial Guarantee Banner
 * ============================================================================ */
export function Sec80PricingTrialGuaranteeBanner() {
  return (
    <SecWrapper id="sec-80">
      <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-center space-y-2 max-w-xl mx-auto">
        <Award className="w-8 h-8 text-emerald-600 mx-auto" />
        <h3 className="font-bold text-base">14-Day Zero Risk Engineering Trial</h3>
        <p className="text-xs text-emerald-700">If you're not satisfied, pay nothing.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 81: FAQ Category Tabs
 * ============================================================================ */
export function Sec81FaqCategoryTabs() {
  const [tab, setTab] = useState('Process');

  return (
    <SecWrapper id="sec-81" bgClass="bg-white">
      <div className="max-w-2xl mx-auto space-y-4 text-center">
        <div className="flex justify-center gap-2">
          {['Process', 'Pricing', 'Legal'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 text-xs font-bold rounded-full ${tab === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>{t}</button>
          ))}
        </div>
        <div className="p-4 bg-slate-50 border rounded-xl text-xs font-bold text-slate-800">
          Viewing FAQ Category: {tab}
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 82: Security Data Privacy Shield
 * ============================================================================ */
export function Sec82SecurityDataPrivacyShield() {
  return (
    <SecWrapper id="sec-82" bgClass="bg-stone-50">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border space-y-2 text-center">
        <Lock className="w-8 h-8 text-indigo-600 mx-auto" />
        <h3 className="font-bold text-base">Data Encryption & Compliance</h3>
        <p className="text-xs text-stone-600">AES-256 encrypted endpoints and strict zero-logging candidate telemetry.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 83: CTA Floating Badge Container
 * ============================================================================ */
export function Sec83CtaFloatingBadgeContainer() {
  return (
    <SecWrapper id="sec-83">
      <div className="max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-extrabold text-neutral-900">Assemble Your Tech Pod</h2>
        <button className="px-6 py-3 bg-neutral-900 text-white font-bold text-xs rounded-xl">Get Started →</button>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 84: Code AI Prompt Matcher
 * ============================================================================ */
export function Sec84CodeAiPromptMatcher() {
  return (
    <SecWrapper id="sec-84" bgClass="bg-purple-50/30">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border space-y-3">
        <div className="text-xs font-bold text-purple-900">AI Prompt Matcher</div>
        <input type="text" placeholder="e.g. Need PyTorch engineer in Dubai..." className="w-full p-3 bg-purple-50 border rounded-xl text-xs" />
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 85: Comparison Feature Table
 * ============================================================================ */
export function Sec85ComparisonFeatureTable() {
  return (
    <SecWrapper id="sec-85">
      <div className="max-w-3xl mx-auto bg-white border rounded-2xl text-xs p-6 space-y-2">
        <div className="flex justify-between font-bold border-b pb-2">
          <span>Feature</span>
          <span>NexaTalent IT Solutions</span>
        </div>
        <div className="flex justify-between">
          <span>72h Deployment</span>
          <span className="text-emerald-600 font-bold">✓ Included</span>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 86: Values Icon Pill Grid
 * ============================================================================ */
export function Sec86ValuesIconPillGrid() {
  return (
    <SecWrapper id="sec-86" bgClass="bg-slate-50">
      <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-800">
        <div className="p-4 bg-white border rounded-xl">⚡ Fast Matching</div>
        <div className="p-4 bg-white border rounded-xl">🔒 100% Secure</div>
        <div className="p-4 bg-white border rounded-xl">💎 Top 1% Quality</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 87: Bento Glassmorphism Cards
 * ============================================================================ */
export function Sec87BentoGlassmorphismCards() {
  return (
    <SecWrapper id="sec-87">
      <div className="p-8 bg-white/70 backdrop-blur-lg border rounded-3xl shadow-xl max-w-xl mx-auto text-center space-y-2">
        <Sparkles className="w-8 h-8 text-indigo-600 mx-auto" />
        <h3 className="font-bold text-base text-neutral-900">Glassmorphism UI Component</h3>
        <p className="text-xs text-neutral-500">Sleek Dribbble aesthetic card design.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 88: Process Timeline Vertical Dots
 * ============================================================================ */
export function Sec88ProcessTimelineVerticalDots() {
  return (
    <SecWrapper id="sec-88" bgClass="bg-[#FAF8F6]">
      <div className="max-w-xl mx-auto space-y-4">
        <div className="font-bold text-sm text-neutral-900">Step 1: Match → Step 2: Test → Step 3: Deploy</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 89: Candidate Featured Dossier Card
 * ============================================================================ */
export function Sec89CandidateFeaturedDossierCard() {
  return (
    <SecWrapper id="sec-89">
      <div className="max-w-xl mx-auto bg-slate-900 text-white p-6 rounded-2xl space-y-2">
        <span className="px-2.5 py-0.5 bg-amber-400 text-neutral-950 font-bold text-[10px] rounded-full">Candidate of the Week</span>
        <h4 className="font-bold text-base">Senior AI Engineer (PyTorch / LLM Fine-Tuning)</h4>
        <p className="text-xs text-slate-400">Ready to deploy in 24 hours.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 90: GCC Offshore Pod Structure
 * ============================================================================ */
export function Sec90GccOffshorePodStructure() {
  return (
    <SecWrapper id="sec-90" bgClass="bg-slate-50">
      <div className="text-center max-w-xl mx-auto space-y-2 text-xs font-bold text-slate-800">
        <div className="p-4 bg-white border rounded-xl">Tech Lead + 2 Senior Devs + QA Engineer</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 91: Pricing Transparent Breakdown
 * ============================================================================ */
export function Sec91PricingTransparentBreakdown() {
  return (
    <SecWrapper id="sec-91">
      <div className="max-w-xl mx-auto bg-white p-6 border rounded-2xl text-xs space-y-2">
        <h4 className="font-bold text-sm text-slate-900">Transparent Billing</h4>
        <p className="text-slate-500">85% goes directly to developer compensation, 15% platform management.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 92: FAQ Expand All Toggle
 * ============================================================================ */
export function Sec92FaqExpandAllToggle() {
  return (
    <SecWrapper id="sec-92" bgClass="bg-[#FAF8F6]">
      <div className="text-center space-y-2">
        <button className="px-4 py-2 bg-neutral-900 text-white font-bold text-xs rounded-lg">Expand All Questions</button>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 93: Security EOR Compliance
 * ============================================================================ */
export function Sec93SecurityEorCompliance() {
  return (
    <SecWrapper id="sec-93">
      <div className="max-w-xl mx-auto bg-white p-6 border rounded-2xl text-xs space-y-2 text-center">
        <Building2 className="w-8 h-8 text-teal-600 mx-auto" />
        <h4 className="font-bold text-sm">Full EOR Labor Law Compliance</h4>
        <p className="text-neutral-500">We manage local employment contracts, healthcare, and tax filings.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 94: CTA Minimalist Centered
 * ============================================================================ */
export function Sec94CtaMinimalistCentered() {
  return (
    <SecWrapper id="sec-94">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-neutral-900">Scale Tech Engineering Fast</h2>
        <button className="px-8 py-4 bg-neutral-900 text-white font-bold text-xs rounded-xl">Get Started Now →</button>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 95: Code Live Test Output
 * ============================================================================ */
export function Sec95CodeLiveTestOutput() {
  return (
    <SecWrapper id="sec-95" bgClass="bg-slate-50">
      <div className="max-w-xl mx-auto bg-neutral-900 text-emerald-400 p-6 rounded-2xl font-mono text-xs space-y-1">
        <p>✓ Test 1: Algorithmic Memory Optimization (PASSED)</p>
        <p>✓ Test 2: System Architecture Defense (PASSED)</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 96: Comparison Cost Calculator Table
 * ============================================================================ */
export function Sec96ComparisonCostCalculatorTable() {
  return (
    <SecWrapper id="sec-96">
      <div className="max-w-xl mx-auto bg-white p-6 border rounded-2xl text-xs space-y-2">
        <div className="flex justify-between font-bold">
          <span>Senior AI Engineer</span>
          <span className="text-emerald-600">$95k/yr (Save $65k)</span>
        </div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 97: Culture Global Corridors
 * ============================================================================ */
export function Sec97CultureGlobalCorridors() {
  return (
    <SecWrapper id="sec-97" bgClass="bg-[#FDFBF7]">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <h3 className="font-serif text-2xl text-neutral-900">Global Engineering Talent Corridors</h3>
        <p className="text-xs text-neutral-500 font-light">Connecting top tech hubs in Dubai, Riyadh, and Bangalore.</p>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 98: Bento Asymmetric Grid
 * ============================================================================ */
export function Sec98BentoAsymmetricGrid() {
  return (
    <SecWrapper id="sec-98">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-slate-50 border rounded-2xl md:col-span-2 font-bold text-sm">Vetted Sourcing Engine</div>
        <div className="p-6 bg-slate-50 border rounded-2xl font-bold text-sm">72h Matching</div>
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 99: Process Fast Track Badge
 * ============================================================================ */
export function Sec99ProcessFastTrackBadge() {
  return (
    <SecWrapper id="sec-99" bgClass="bg-emerald-50">
      <div className="p-4 bg-white border border-emerald-200 rounded-xl text-center font-bold text-xs text-emerald-900 max-w-md mx-auto">
        ⚡ Fast-Track Hiring Active: 24h Interview Guarantee
      </div>
    </SecWrapper>
  );
}

/* ============================================================================
 * SECTION 100: Final Grand Showcase CTA
 * ============================================================================ */
export function Sec100FinalGrandShowcaseCta() {
  return (
    <SecWrapper id="sec-100" bgClass="bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 text-white" border={false}>
      <div className="text-center space-y-6 max-w-3xl mx-auto py-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono rounded-full">
          <Sparkles className="w-3.5 h-3.5" /> NEXATALENT IT SOLUTIONS PLATFORM COMPLETE SHOWCASE
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Ready to Deploy World-Class Tech Pods?
        </h2>
        <p className="text-base text-neutral-300">
          Get 3 hand-picked, pre-vetted candidate dossiers matched to your repository in under 72 hours. Zero legal overhead, 100% IP transfer guaranteed.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm rounded-xl transition-all shadow-xl">
            Launch Talent Match Request →
          </button>
        </div>
      </div>
    </SecWrapper>
  );
}

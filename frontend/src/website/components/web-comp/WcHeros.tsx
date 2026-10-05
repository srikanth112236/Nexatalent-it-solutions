import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2, Play } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll('[data-reveal]');
    gsap.fromTo(
      els,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ref]);
}

/* ============================================================================
   HERO 1 — AI SOURCING AGENT (PROPER LIGHT THEME FULL SCREEN)
   ============================================================================ */
export function Hero1AiPartner() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="min-h-screen flex flex-col justify-center bg-white px-6 py-20 lg:px-16 text-center relative overflow-hidden border-b border-neutral-200/80">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 h-96 w-[700px] bg-gradient-to-b from-teal-100/50 via-emerald-50/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6">
        <div data-reveal className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-teal-800 shadow-sm">
          <Sparkles size={14} className="text-teal-600" />
          AUTONOMOUS TALENT SOURCING FOR HIGH-GROWTH TECH
        </div>

        <h1 data-reveal className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-950 leading-tight">
          Your Intelligent GCC Hiring Partner,<br />
          <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            On Demand &amp; Fully Vetted.
          </span>
        </h1>

        <p data-reveal className="mx-auto max-w-2xl text-base text-neutral-600 leading-relaxed">
          Streamline technical sourcing, algorithmic code screening, and interview scheduling across Dubai, Riyadh, and Bangalore with NexaTalent IT Solutions's AI engine.
        </p>

        <div data-reveal className="pt-2 flex flex-wrap justify-center gap-4">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-3 rounded-full bg-neutral-950 px-8 py-4 text-xs font-bold text-white shadow-xl hover:bg-neutral-800 transition-all">
            Deploy Sourcing Agent <ArrowRight size={14} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-7 py-4 text-xs font-bold text-neutral-800 shadow-sm hover:bg-neutral-50 transition-all">
            <Play size={14} fill="currentColor" /> Watch 2-Min Demo
          </motion.button>
        </div>

        <div data-reveal className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-teal-200/80 bg-gradient-to-b from-[#E6F4F1] to-[#D4ECE6] p-8 lg:p-10 shadow-xl text-neutral-900">
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur shadow-sm">
              <p className="text-4xl font-extrabold text-teal-900">98.4%</p>
              <p className="mt-1 text-xs font-bold text-teal-800">Faster Placement Cycle</p>
              <p className="mt-1 text-[11px] text-neutral-500">From mandate to offer in days</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur shadow-sm">
              <p className="text-4xl font-extrabold text-teal-900">72 Hrs</p>
              <p className="mt-1 text-xs font-bold text-teal-800">Average Shortlist Delivery</p>
              <p className="mt-1 text-[11px] text-neutral-500">3-5 pre-screened senior profiles</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur shadow-sm">
              <p className="text-4xl font-extrabold text-teal-900">45%</p>
              <p className="mt-1 text-xs font-bold text-teal-800">Arbitrage Cost Savings</p>
              <p className="mt-1 text-[11px] text-neutral-500">Vs traditional US/EU agency fees</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   HERO 2 — EXECUTIVE TECH & GCC HIRING (LIGHT THEME FULL SCREEN)
   ============================================================================ */
export function Hero2MarketingCareers() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="min-h-screen flex flex-col justify-center bg-[#FAF8F5] px-6 py-20 lg:px-16 text-center relative overflow-hidden border-b border-neutral-200/80">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        <span data-reveal className="inline-block rounded-full bg-amber-100 px-4 py-1.5 text-xs font-bold text-amber-900 border border-amber-200 shadow-sm">
          EXECUTIVE TECH &amp; GCC HIRING
        </span>

        <h1 data-reveal className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-950 leading-tight">
          Where World-Class Engineering Squads<br />
          <span className="text-amber-700">Are Architected &amp; Deployed.</span>
        </h1>

        <p data-reveal className="text-base text-neutral-600 max-w-xl mx-auto">
          We bring high-growth tech enterprises and tier-1 candidates together, backed by 15+ years of GCC market expertise.
        </p>

        <div data-reveal className="pt-2 flex justify-center gap-4">
          <button className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-8 py-4 text-xs font-bold text-white shadow-lg hover:bg-neutral-800 transition-all">
            Request Talent Mandate <ArrowRight size={14} />
          </button>
        </div>

        <div data-reveal className="relative mx-auto mt-8 max-w-4xl rounded-3xl border border-amber-200/80 bg-white p-8 shadow-xl text-left">
          <div className="flex items-center justify-between border-b border-amber-100 pb-4">
            <span className="text-xs font-bold text-neutral-900">ACTIVE GCC CANDIDATE BENCH</span>
            <span className="text-xs font-mono font-bold text-emerald-600">● 100% PRE-VETTED</span>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { role: 'Staff Cloud Architect', exp: '11 Yrs Exp', loc: 'Dubai, UAE', skills: ['AWS', 'K8s', 'Go'] },
              { role: 'Senior AI Research Lead', exp: '8 Yrs Exp', loc: 'Riyadh, KSA', skills: ['PyTorch', 'Python', 'LLMs'] },
              { role: 'Principal DevOps Lead', exp: '9 Yrs Exp', loc: 'Bangalore, IN', skills: ['Terraform', 'CI/CD', 'Azure'] },
            ].map((c, i) => (
              <div key={i} className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-3">
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-neutral-900">{c.role}</p>
                  <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-2 py-0.5 rounded">{c.loc}</span>
                </div>
                <p className="text-[11px] text-neutral-500">{c.exp} &bull; Vetted Score 98%</p>
                <div className="flex flex-wrap gap-1">
                  {c.skills.map((s) => (
                    <span key={s} className="rounded bg-white px-2 py-0.5 text-[10px] text-neutral-600 border border-neutral-200">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   HERO 4 — ENGINEERING POD CONFIGURATOR (LIGHT THEME FULL SCREEN)
   ============================================================================ */
export function Hero4WebDesigner() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="min-h-screen flex flex-col justify-center bg-[#FDFBF7] px-6 py-20 lg:px-16 text-center relative overflow-hidden border-b border-neutral-200/80">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <span data-reveal className="text-xs font-bold uppercase tracking-widest text-indigo-700">
          ENGINEERING POD CONFIGURATOR
        </span>
        <h1 data-reveal className="text-4xl sm:text-6xl font-black text-neutral-950 uppercase leading-none">
          PRECISION ENGINEERING SQUADS ON DEMAND.
        </h1>
        <p data-reveal className="text-base text-neutral-600 max-w-2xl mx-auto">
          We match hyper-specialized technical leads with enterprise products across MENA, Europe, and Asia in turnkey 5-person squads.
        </p>

        <div data-reveal className="grid sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <span className="text-xs font-mono font-bold text-indigo-600">POD SIZE A</span>
            <h4 className="text-lg font-bold text-neutral-900 mt-2">3-Person Core Squad</h4>
            <p className="text-xs text-neutral-500 mt-1">1 Lead + 2 Sr Engineers</p>
            <p className="text-xs font-bold text-neutral-900 mt-4">Launch in 5 Business Days</p>
          </div>
          <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-200 shadow-md">
            <span className="text-xs font-mono font-bold text-indigo-700">MOST POPULAR</span>
            <h4 className="text-lg font-bold text-indigo-950 mt-2">5-Person Full Squad</h4>
            <p className="text-xs text-indigo-700 mt-1">1 Architect + 3 Engineers + 1 QA</p>
            <p className="text-xs font-bold text-indigo-950 mt-4">Launch in 10 Business Days</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <span className="text-xs font-mono font-bold text-indigo-600">ENTERPRISE</span>
            <h4 className="text-lg font-bold text-neutral-900 mt-2">10-Person Scale Squad</h4>
            <p className="text-xs text-neutral-500 mt-1">Full Turnkey Offshore Hub</p>
            <p className="text-xs font-bold text-neutral-900 mt-4">Launch in 15 Business Days</p>
          </div>
        </div>

        <div data-reveal className="pt-2 flex justify-center gap-4">
          <button className="rounded-none bg-neutral-950 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800">
            EXPLORE POD CONFIGURATIONS &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   HERO 5 — EXECUTIVE CONSULTATION (LIGHT THEME FULL SCREEN)
   ============================================================================ */
export function Hero5Creators() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="min-h-screen flex flex-col justify-center bg-white px-6 py-20 lg:px-16 text-center relative overflow-hidden border-b border-neutral-200/80">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <span data-reveal className="rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-xs font-bold text-indigo-800">
          EXECUTIVE SEARCH &amp; LEADERSHIP
        </span>
        <h1 data-reveal className="text-4xl sm:text-6xl font-extrabold text-neutral-950">
          Empowering Tech Leaders to Build Without Limits.
        </h1>
        <p data-reveal className="text-base text-neutral-600 max-w-xl mx-auto">
          NexaTalent IT Solutions manages sourcing, technical evaluations, and international payroll compliance so CTOs and VPs can focus on building products.
        </p>

        <div data-reveal className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 max-w-3xl mx-auto text-left grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5"><ShieldCheck size={16} /> 90-Day Guarantee</span>
            <p className="text-sm font-bold text-neutral-900">Zero Risk Candidate Replacement</p>
            <p className="text-xs text-neutral-500">Free candidate replacement if performance metrics aren't met in the first 90 days.</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><CheckCircle2 size={16} /> Global Compliance</span>
            <p className="text-sm font-bold text-neutral-900">Local EOR &amp; Tax Sponsorship</p>
            <p className="text-xs text-neutral-500">Full legal protection across UAE, KSA, UK, India, and EU hiring jurisdictions.</p>
          </div>
        </div>

        <button data-reveal className="rounded-full bg-indigo-600 px-8 py-4 text-xs font-bold text-white shadow-xl hover:bg-indigo-500 transition-all">
          Book Executive Consultation
        </button>
      </div>
    </section>
  );
}

/* ============================================================================
   HERO 6 — TURNKEY RECRUITMENT ACCELERATION (LIGHT THEME FULL SCREEN)
   ============================================================================ */
export function Hero6MarketingAgency() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="min-h-screen flex flex-col justify-center bg-[#F8FAFC] px-6 py-20 lg:px-16 text-center relative overflow-hidden border-b border-neutral-200/80">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <h1 data-reveal className="text-4xl sm:text-6xl font-extrabold text-slate-900">
          Accelerate Talent Delivery by 4x.
        </h1>
        <p data-reveal className="text-base text-slate-600 max-w-2xl mx-auto">
          Turnkey recruitment solutions tailored for high-growth tech startups and Fortune 500 GCC enterprises.
        </p>

        <div data-reveal className="grid sm:grid-cols-4 gap-4 text-center">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"><p className="text-3xl font-extrabold text-slate-900">4.2x</p><p className="text-xs text-slate-500 mt-1">Faster Hiring Speed</p></div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"><p className="text-3xl font-extrabold text-blue-600">72h</p><p className="text-xs text-slate-500 mt-1">First Shortlist</p></div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"><p className="text-3xl font-extrabold text-emerald-600">99.2%</p><p className="text-xs text-slate-500 mt-1">Code Screen Pass</p></div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"><p className="text-3xl font-extrabold text-purple-600">45%</p><p className="text-xs text-slate-500 mt-1">Cost Savings</p></div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   HERO 7 — ENTERPRISE GCC MAP (LIGHT THEME FULL SCREEN)
   ============================================================================ */
export function Hero7FuelingBrands() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} className="min-h-screen flex flex-col justify-center bg-white px-6 py-20 lg:px-16 text-center relative overflow-hidden border-b border-neutral-200/80">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        <span data-reveal className="rounded-full bg-blue-50 border border-blue-100 px-4 py-1.5 text-xs font-bold text-blue-800">
          GLOBAL RECRUITMENT CORRIDORS
        </span>
        <h1 data-reveal className="text-4xl sm:text-6xl font-extrabold text-neutral-950">
          Fueling the Next Generation of GCC Tech Leaders.
        </h1>
        <p data-reveal className="text-base text-neutral-600 max-w-xl mx-auto">
          Connecting technology hubs across London, Dubai, Riyadh, Abu Dhabi, and Bangalore.
        </p>

        <div data-reveal className="grid sm:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200"><p className="text-xs font-mono font-bold text-blue-600">LONDON ➔ DUBAI</p><p className="text-sm font-bold text-neutral-900 mt-1">Fintech &amp; Quant Leads</p><p className="text-xs text-neutral-500 mt-2">120+ Placements Active</p></div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200"><p className="text-xs font-mono font-bold text-blue-600">BANGALORE ➔ RIYADH</p><p className="text-sm font-bold text-neutral-900 mt-1">Cloud Engineering Pods</p><p className="text-xs text-neutral-500 mt-2">340+ Engineers Active</p></div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200"><p className="text-xs font-mono font-bold text-blue-600">EU ➔ ABU DHABI</p><p className="text-sm font-bold text-neutral-900 mt-1">AI &amp; Robotics Research</p><p className="text-xs text-neutral-500 mt-2">85+ Specialists Active</p></div>
        </div>
      </div>
    </section>
  );
}

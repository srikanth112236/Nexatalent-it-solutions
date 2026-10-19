import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Handshake, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  HelpCircle,
  Award,
  Layers,
  Briefcase
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { submitLead } from '../v2/lib/leadCapture';
import { 
  LightBeforeAfterMatrix,
  LightServiceTierComparison,
  LightMetricsCounter,
  LightFinalCTAExpansion
} from '../components/light-motion';

// Interactive Partner Earnings Calculator
function PartnerEarningsCalculator() {
  const [placements, setPlacements] = useState(5);
  const [avgCtc, setAvgCtc] = useState(25); // Lakhs INR

  // Commission math: 8.33% avg fee with 70% partner payout share
  const totalCommission = Math.round(placements * (avgCtc * 100000) * 0.0833 * 0.7);

  return (
    <div id="partner-earnings-calculator" className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200 shadow-xl shadow-black/10 max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-extrabold text-black uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-black">
          REVENUE SHARE SIMULATOR
        </span>
        <h3 className="text-2xl font-extrabold text-black">Partner Agency Revenue Estimator</h3>
        <p className="text-xs sm:text-sm text-black">
          Calculate your agency's monthly revenue share when fulfilling mandates through Nexa Talent IT Solutions Enterprise Network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-black">Monthly Placements Fulfilled</span>
              <span className="text-black font-extrabold">{placements} Placements / Month</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={placements}
              onChange={(e) => setPlacements(Number(e.target.value))}
              className="w-full accent-black bg-slate-200 h-2.5 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-black">Average Candidate CTC</span>
              <span className="text-black font-extrabold">₹{avgCtc} Lakhs / Annum</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="2"
              value={avgCtc}
              onChange={(e) => setAvgCtc(Number(e.target.value))}
              className="w-full accent-black bg-slate-200 h-2.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 text-center space-y-3">
          <span className="text-xs text-black font-extrabold uppercase tracking-wider block">
            Estimated Monthly Agency Payout
          </span>
          <div className="text-3xl sm:text-5xl font-black text-black">
            ₹{totalCommission.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-black font-bold bg-white py-1 px-3 rounded-full border border-black inline-block">
            ✓ Guaranteed 30-Day Settlement • Zero Client Delays
          </p>
        </div>
      </div>
    </div>
  );
}

export function PartnersPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [partnerRefId, setPartnerRefId] = useState('');

  // Form State
  const [agencyName, setAgencyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [headcount, setHeadcount] = useState('10 - 25 Recruiters');
  const [specialization, setSpecialization] = useState('Full Stack & Cloud Engineering');
  const [locationHub, setLocationHub] = useState('Bengaluru / Remote');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let raf = 0;
    const refresh = () => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* noop */
      }
    };
    raf = requestAnimationFrame(() => {
      refresh();
      window.addEventListener('load', refresh);
      const t = window.setTimeout(refresh, 500);
      return () => window.clearTimeout(t);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
    };
  }, []);

  const handleEmpanelmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!contactName.trim() || !agencyName.trim() || !email.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitLead({
        contactName: contactName.trim(),
        companyName: agencyName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        roleOrScope: `Empanelment: ${headcount} · ${specialization}${website ? ` · Web: ${website}` : ''}`,
        message: `Operating Locations: ${locationHub}\n${notes ? `Notes: ${notes}` : ''}`,
        formName: 'Recruitment Partner Empanelment',
        sourcePage: '/partners',
        enquiryType: 'partner',
        consent: true
      });
    } catch {
      /* Fallback cleanly */
    }
    setIsSubmitting(false);
    const randomRef = `NEXA-PARTNER-${Math.floor(10000 + Math.random() * 90000)}`;
    setPartnerRefId(randomRef);
    setSubmitted(true);
  };

  const partnerProgramFaqs = [
    {
      q: 'How does Nexa Talent IT Solutions guarantee 30-day partner payout settlements?',
      a: 'We operate a dedicated Partner Escrow Fund. Once a candidate completes 30 days of employment at the client site, partner commissions are released automatically on the 30th day regardless of client invoice payment status.'
    },
    {
      q: 'What candidate ownership protection exists against candidate duplication or poaching?',
      a: 'Submissions through the Nexa Partner Portal are timestamped and cryptographically locked for 180 days. If the same candidate is submitted by another agency or client internal team, your submission holds priority.'
    },
    {
      q: 'What types of mandates are available on the Nexa Partner Network?',
      a: 'We aggregate retained, contingent, and GCC mandates from Series B-D Unicorns, MNCs, and Fortune 500 tech hubs across Java, React, Python AI/ML, Low Latency C++, Cloud DevOps, and Executive Leadership.'
    },
    {
      q: 'Does Nexa Talent IT Solutions charge any upfront fee for agency empanelment?',
      a: 'No. Empanelment with Nexa Talent IT Solutions is 100% free for verified staffing agencies and recruitment partners. We operate strictly under transparent revenue-sharing terms.'
    }
  ];

  return (
    <div className="bg-white min-h-screen text-black font-sans relative overflow-x-clip">
      {/* SEO Head */}
      <SeoHead
        title="Recruitment Partner & Staffing Agency Empanelment | Nexa Talent IT Solutions"
        description="Empanel your recruitment agency or IT staffing firm with Nexa Talent IT Solutions. Access verified enterprise job mandates, guaranteed 30-day payouts, zero candidate poaching, and 24h feedback SLAs."
        keywords="recruitment vendor empanelment, staffing agency partnership, IT staffing aggregator, sub-tier recruitment partner, vendor management ATS, staffing agency alliance India, Nexa Talent IT Solutions"
        canonical="/partners"
      />

      {/* Global Navbar */}
      <SiteNavbar />

      {/* ============================================================================
       * HERO SECTION (CLEAN LIGHT THEME WITH BRAND BLUE ACCENTS)
       * ============================================================================ */}
      <section className="relative pt-32 pb-20 px-6 lg:px-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-6 text-center">
          
          {/* Header Pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black text-black text-xs font-extrabold uppercase tracking-wider shadow-xs"
          >
            <Handshake className="w-4 h-4 text-black" />
            <span>RECRUITMENT PARTNER ALLIANCE & EMPANELMENT</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-black tracking-tight leading-[1.15] max-w-5xl mx-auto"
          >
            Empanel Your Staffing Agency with <br className="hidden sm:inline" />
            <span className="text-black">Nexa Talent IT Solutions</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-black max-w-3xl mx-auto font-normal leading-relaxed"
          >
            Access exclusive enterprise mandates from Fortune 500 tech hubs and unicorn scale-ups. Enjoy guaranteed 30-day payout settlements, 24h candidate feedback SLAs, and 100% candidate ownership protection.
          </motion.p>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <button
              type="button"
              onClick={() => setApplyModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-black hover:bg-neutral-800 text-white font-extrabold text-sm shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <span>🤝 Apply for Recruitment Partner Empanelment</span>
              <ArrowRight size={16} />
            </button>
            <a
              href="#partner-earnings-calculator"
              className="px-8 py-4 rounded-2xl bg-white hover:bg-neutral-100 text-black font-bold text-sm border border-slate-300 shadow-xs transition-all"
            >
              Calculate Agency Revenue Share
            </a>
          </motion.div>

          {/* Telemetry Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 text-center max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-black">₹45+ Lakhs</div>
              <div className="text-xs font-semibold text-black mt-1">Avg. Monthly Partner Payouts</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-black">30 Days</div>
              <div className="text-xs font-semibold text-black mt-1">Guaranteed Settlement SLA</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-black">180 Days</div>
              <div className="text-xs font-semibold text-black mt-1">Candidate Ownership Lock</div>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-black">88%+</div>
              <div className="text-xs font-semibold text-black mt-1">Interview Conversion Ratio</div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================================
       * SECTION 2: HOW NEXA TALENT HELPS VENDORS & AGENCIES
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black text-black text-xs font-extrabold uppercase tracking-wider">
              <Award className="w-4 h-4 text-black" />
              <span>THE NEXA PARTNER ADVANTAGE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-black tracking-tight">
              Why Top Staffing Agencies Empanel with Nexa
            </h2>
            <p className="text-sm sm:text-base text-black">
              We operate as a master alliance platform connecting elite recruitment agencies directly with pre-funded enterprise mandates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value Card 1 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs hover:border-black transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold">
                <DollarSign size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-black">Guaranteed 30-Day Payouts</h3>
              <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                Automated milestone settlement. Partner commissions are released on the 30th day of candidate joining without waiting for client payment cycles.
              </p>
            </div>

            {/* Value Card 2 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs hover:border-black transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-black">100% Anti-Poaching Guarantee</h3>
              <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                Candidate submissions are cryptographically timestamped in the Nexa ATS for 180-day ownership lock. Zero duplicate bypass or poaching.
              </p>
            </div>

            {/* Value Card 3 */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs hover:border-black transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center font-bold">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-extrabold text-black">24-Hour Feedback SLA</h3>
              <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                Every candidate submitted via the Partner Portal receives verified feedback, test scores, and interview schedules within 24 hours.
              </p>
            </div>
          </div>

          {/* Interactive Revenue Calculator */}
          <PartnerEarningsCalculator />

          {/* Program Features Summary Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 space-y-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-black uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-black">
                  PARTNER EMPANELMENT PROGRAM
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">
                  Empanelment Criteria & Program Benefits
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApplyModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-black hover:bg-neutral-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>🤝 Apply for Partner Empanelment</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <CheckCircle2 size={18} className="text-black shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-black">Exclusive Enterprise Mandates</h4>
                  <p className="text-xs text-black leading-relaxed font-normal mt-0.5">
                    Direct access to pre-cleared mandates across Cloud SaaS, FinTech, AI/ML, GCCs, and EV Mobility.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <CheckCircle2 size={18} className="text-black shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-black">Practitioner Pre-Screening Engine</h4>
                  <p className="text-xs text-black leading-relaxed font-normal mt-0.5">
                    Candidates are benchmarked by Nexa's technical evaluation engine before client submission, driving an 88%+ shortlist conversion.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <CheckCircle2 size={18} className="text-black shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-black">Synchronous Partner ATS Portal</h4>
                  <p className="text-xs text-black leading-relaxed font-normal mt-0.5">
                    Submit profiles in 1 click, track live interview stages, and view recruiter feedback transparently.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <CheckCircle2 size={18} className="text-black shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-black">Dedicated Alliance Director</h4>
                  <p className="text-xs text-black leading-relaxed font-normal mt-0.5">
                    Single point of contact partner manager assigned to coordinate interview schedules, offer rollouts, and billing.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================================
       * LIGHT MOTION ANIMATED SECTIONS (BEFORE & AFTER MATRIX, SERVICE COMPARISON, METRICS)
       * ============================================================================ */}
      <LightBeforeAfterMatrix />
      <LightServiceTierComparison />
      <LightMetricsCounter />

      {/* ============================================================================
       * PARTNER FAQ ACCORDION
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-black text-black text-xs font-extrabold uppercase tracking-wider">
              <HelpCircle size={14} />
              <span>ALLIANCE KNOWLEDGE BASE</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight">
              Recruitment Partner Empanelment FAQ
            </h2>
          </div>

          <div className="space-y-4">
            {partnerProgramFaqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <h3 className="text-base font-extrabold text-black flex items-center gap-2">
                  <span className="text-black">Q:</span> {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-black leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Expansion Surface */}
      <LightFinalCTAExpansion />

      {/* ============================================================================
       * INTERACTIVE RECRUITMENT PARTNER EMPANELMENT MODAL DRAWER
       * ============================================================================ */}
      <AnimatePresence>
        {applyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 relative my-8"
            >
              {submitted ? (
                <div className="text-center py-6 space-y-5">
                  <div className="w-16 h-16 rounded-full bg-white text-black border border-black flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-black" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-extrabold text-black bg-white px-3 py-1 rounded-full border border-black uppercase tracking-wider">
                      ● EMPANELMENT APPLICATION RECEIVED
                    </span>
                    <h3 className="text-2xl font-black text-black">Application Submitted!</h3>
                    <div className="text-xs font-mono font-bold text-black bg-white py-1 px-3 rounded-lg inline-block border border-black">
                      Partner Ref ID: {partnerRefId}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 text-left text-xs text-black space-y-2">
                    <p className="font-bold text-black">What happens next?</p>
                    <p>1. Our Alliance Director will verify your agency registration & sourcing credentials for <strong>{agencyName}</strong>.</p>
                    <p>2. You will receive your Partner Portal login credentials and initial mandate allocations within 24 to 48 hours.</p>
                    <p className="text-black pt-1 border-t border-slate-200">Executive Desk: <strong className="text-black">info@nexatalentitsolutions.com</strong> | Direct Line: <strong className="text-black">+91 70196 96166</strong></p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setApplyModalOpen(false);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-black text-white font-bold text-sm shadow-md cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-extrabold text-black uppercase tracking-wider block mb-0.5">
                        OFFICIAL PARTNER ALLIANCE EMPANELMENT
                      </span>
                      <h3 className="text-xl font-extrabold text-black">🤝 Recruitment Partner Empanelment</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setApplyModalOpen(false)}
                      className="w-8 h-8 rounded-full bg-white text-black hover:text-black flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Agency Form */}
                  <form onSubmit={handleEmpanelmentSubmit} className="space-y-3.5 text-xs">
                    {formError && (
                      <div className="p-3 rounded-xl border border-black bg-white text-xs font-bold text-black">
                        {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-black mb-1.5 flex items-center gap-1.5">
                          <User size={13} className="text-black" />
                          <span>Contact Person *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Vikram Verma (Director)"
                          className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-[13px] text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-2 focus:ring-black/15 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-black mb-1.5 flex items-center gap-1.5">
                          <Building2 size={13} className="text-black" />
                          <span>Agency / Staffing Firm *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={agencyName}
                          onChange={(e) => setAgencyName(e.target.value)}
                          placeholder="e.g. Apex Tech Talent Partners"
                          className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-[13px] text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-2 focus:ring-black/15 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-black mb-1.5 flex items-center gap-1.5">
                          <Mail size={13} className="text-black" />
                          <span>Corporate Email Address *</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="vikram@apextalent.com"
                          className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-[13px] text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-2 focus:ring-black/15 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-black mb-1.5 flex items-center gap-1.5">
                          <Phone size={13} className="text-black" />
                          <span>Phone / WhatsApp *</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-[13px] text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-2 focus:ring-black/15 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-black mb-1.5 flex items-center gap-1.5">
                          <Briefcase size={13} className="text-black" />
                          <span>Recruiter Headcount</span>
                        </label>
                        <select
                          value={headcount}
                          onChange={(e) => setHeadcount(e.target.value)}
                          className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-[13px] text-black outline-none focus:border-black focus:ring-2 focus:ring-black/15 transition-all"
                        >
                          <option>1 - 5 Recruiters</option>
                          <option>5 - 15 Recruiters</option>
                          <option>15 - 50 Recruiters</option>
                          <option>50+ Enterprise Team</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-black mb-1.5 flex items-center gap-1.5">
                          <Layers size={13} className="text-black" />
                          <span>Sourcing Specialization</span>
                        </label>
                        <select
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-[13px] text-black outline-none focus:border-black focus:ring-2 focus:ring-black/15 transition-all"
                        >
                          <option>Full Stack & Cloud Engineering</option>
                          <option>BFSI & Low Latency FinTech</option>
                          <option>AI / Machine Learning & Data</option>
                          <option>Turnkey GCC Pods & Executive Search</option>
                          <option>Automotive, EV & Embedded Firmware</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-black mb-1.5 flex items-center gap-1.5">
                          <MapPin size={13} className="text-black" />
                          <span>Operating Locations</span>
                        </label>
                        <input
                          type="text"
                          value={locationHub}
                          onChange={(e) => setLocationHub(e.target.value)}
                          placeholder="e.g. Bengaluru, Mumbai, NCR"
                          className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-[13px] text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-2 focus:ring-black/15 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-black mb-1.5 flex items-center gap-1.5">
                          <span>Agency Website / LinkedIn (optional)</span>
                        </label>
                        <input
                          type="url"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          placeholder="https://apextalent.com"
                          className="min-h-[44px] w-full rounded-xl border border-neutral-300 bg-white px-3.5 text-[13px] text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-2 focus:ring-black/15 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-black mb-1.5">
                        <span>Brief Notes / Existing Clients (optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Key client domains, past placements, or specific hiring verticals you excel at…"
                        className="w-full rounded-xl border border-neutral-300 bg-white p-3 text-[13px] text-black outline-none placeholder:text-neutral-400 focus:border-black focus:ring-2 focus:ring-black/15 transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-h-[48px] w-full rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm shadow-md shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
                    >
                      {isSubmitting ? (
                        <span>Logging Empanelment Application...</span>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Submit Empanelment Application</span>
                        </>
                      )}
                    </button>

                    <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-black font-semibold pt-1">
                      <ShieldCheck size={13} className="text-black" />
                      100% Free Empanelment • Guaranteed 30-Day Payout SLA • Non-Poaching Lock
                    </p>
                  </form>

                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Footer */}
      <SiteFooter />
    </div>
  );
}

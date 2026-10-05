import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Layers, 
  Building2, 
  Award, 
  FileCheck2, 
  Sparkles, 
  Search,
  ArrowRight,
  CheckCircle2,
  Globe2
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { 
  CaseStudyClientLogoWallTicker, 
  PricingGccRoiCostSimulator,
  DetailGccTurnkeyPodConfigurator,
  DetailFintechAndLowLatencyGuild,
  DetailCloudAndAiSpecialization
} from '../components/sample-library';
import { 
  LightIndustryPracticeGrid,
  LightDashboardAssembly,
  HorizontalCardsRail 
} from '../components/light-motion';

// 8 Primary Delivery Models directly aligned with Official Company Profile PDF
const EIGHT_DELIVERY_MODELS = [
  {
    id: 'permanent',
    title: '1. Permanent Recruitment',
    tag: 'Direct Full-Time Hiring',
    icon: Users,
    desc: 'Direct hiring for full-time technology, engineering, corporate, and leadership positions with candidate replacement guarantees.',
    highlights: ['End-to-end profile mapping', 'Rigorous technical pre-screening', '90-day replacement commitment'],
    href: '/solutions/permanent-hiring'
  },
  {
    id: 'augmentation',
    title: '2. IT Staff Augmentation',
    tag: 'Flexible Capacity Sourcing',
    icon: Layers,
    desc: 'Deploy pre-vetted technology professionals for project delivery, capacity spikes, and specialized skill requirements.',
    highlights: ['Rapid deployment within 72 hrs', 'Elastic scaling up or down', 'Full timezone overlap'],
    href: '/solutions/contract-staffing'
  },
  {
    id: 'contract',
    title: '3. Contract Staffing',
    tag: 'Time-Bound Workforce',
    icon: FileCheck2,
    desc: 'Comprehensive support for time-bound, project-based, and ongoing contract workforce requirements with payroll compliance.',
    highlights: ['Statutory & labor law governed', 'Single-window invoicing', 'Zero client overhead'],
    href: '/solutions/contract-staffing'
  },
  {
    id: 'gcc-pods',
    title: '4. Turnkey GCC Engineering Pods',
    tag: 'Offshore R&D BOT Model',
    icon: Globe2,
    desc: 'Build dedicated offshore engineering teams, center-of-excellence hubs, and project pods in 75 days across India corridors.',
    highlights: ['Complete BOT execution', '60% cost-plus arbitrage', 'Turnkey site directors & leads'],
    href: '/solutions/gcc-hiring'
  },
  {
    id: 'bulk-hiring',
    title: '5. Bulk & Volume Sourcing Drives',
    tag: 'Rapid Scale Campaigns',
    icon: Sparkles,
    desc: 'Structured sourcing drives and weekend hiring sprints when talent demand increases rapidly for 10 to 100+ roles.',
    highlights: ['Dedicated sourcing squads', 'Batch interview coordination', 'High offer acceptance rates'],
    href: '/solutions/recruitment-process-support'
  },
  {
    id: 'rpo',
    title: '6. RPO & Embedded TA Support',
    tag: 'Extended Recruitment Capacity',
    icon: Building2,
    desc: 'Dedicated recruitment resources working as a seamless, transparent extension of your internal talent acquisition function.',
    highlights: ['Dedicated recruiters & tools', 'Transparent KPI tracking', 'Reduced cost-per-hire'],
    href: '/solutions/recruitment-process-support'
  },
  {
    id: 'niche-specialist',
    title: '7. Niche & Specialist Tech Search',
    tag: 'Rare Skill Sourcing',
    icon: Search,
    desc: 'Targeted market mapping and proactive outreach for hard-to-find skills (Low-Latency C++, AI/LLMs, FPGA, eBPF, SRE).',
    highlights: ['Active passive-talent headhunting', 'Live code sandbox vetting', 'Sub-millisecond tech validation'],
    href: '/solutions/executive-search'
  },
  {
    id: 'executive',
    title: '8. Executive & Leadership Search',
    tag: 'Confidential C-Suite Hiring',
    icon: Award,
    desc: 'Confidential sourcing and structured search for Senior VPs, Directors of Engineering, Chief Technology Officers, and GCC Site Leaders.',
    highlights: ['Confidential mandate handling', 'Board-level stakeholder alignment', 'Proven leadership track record'],
    href: '/solutions/executive-search'
  }
];

// 9-Stage Vendor Empanelment & Delivery Methodology (PDF Page 4)
const DELIVERY_STAGES = [
  { step: '01', title: 'Vendor Introduction', desc: 'Sharing company profile, credentials, and commercial proposal.' },
  { step: '02', title: 'Empanelment & NDA', desc: 'Aligning MSA, NDA, compliance protocols, and vendor onboarding.' },
  { step: '03', title: 'Requirement Intake', desc: 'Capturing JDs, must-have skills, compensation bands, and work model.' },
  { step: '04', title: 'Talent Mapping', desc: 'Mapping passive tech communities and multi-channel candidate pools.' },
  { step: '05', title: 'Rigorous Screening', desc: 'Evaluating technical depth, experience, and candidate alignment.' },
  { step: '06', title: 'Quality Submission', desc: 'Submitting curated candidate dossiers with detailed recruiter observations.' },
  { step: '07', title: 'Interview Management', desc: 'Coordinating scheduling, candidate prep, and structured feedback.' },
  { step: '08', title: 'Offer & Joining', desc: 'Negotiation support, background verification, and joining follow-up.' },
  { step: '09', title: 'Post-Joining Support', desc: 'Ensuring early integration, 90-day performance tracking, and retention.' }
];

const SOLUTIONS_FAQS = [
  {
    q: 'How does Nexa Talent IT Solutions structure vendor empanelment for enterprise clients?',
    a: 'We work under standard Master Service Agreements (MSA) and Non-Disclosure Agreements (NDA) aligned with your procurement rules. Our terms, SLA benchmarks, and candidate replacement guarantees are documented prior to requisition intake.'
  },
  {
    q: 'What is your average turnaround time for candidate profile submissions?',
    a: 'For contract staffing and lateral software roles, initial pre-screened candidate dossiers are submitted within 48 to 72 hours of requirement intake.'
  },
  {
    q: 'Do you charge candidates any recruitment fees?',
    a: 'No. Nexa Talent IT Solutions operates on a strict zero-candidate-fee model. All recruitment engagements are funded exclusively through enterprise client agreements.'
  },
  {
    q: 'What replacement guarantees do you provide for permanent hiring?',
    a: 'We offer a standard 90-day candidate replacement guarantee for all permanent hires. If a candidate leaves within 90 days, we provide a replacement at no additional fee.'
  }
];

export function SolutionsPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans relative overflow-x-clip">
      {/* SEO & Meta Tags */}
      <SeoHead
        title="Enterprise IT Hiring & GCC Solutions | Nexa Talent IT Solutions"
        description="Official talent solutions catalog of Nexa Talent IT Solutions Private Limited. Explore Permanent Recruitment, IT Staff Augmentation, Contract Staffing, Turnkey GCC Pods, Bulk Sourcing, and Executive Search."
        keywords="Nexa Talent IT Solutions, IT recruitment company Mumbai, contract staffing solutions, turnkey GCC pods India, executive search tech, IT staff augmentation"
        canonical="/solutions"
      />

      {/* 1. Global Site Navbar */}
      <SiteNavbar />

      {/* ============================================================================
       * SECTION 1: CLEAN WHITE BACKGROUND HERO WITH SUBTLE PARALLAX & BRAND TEXT OVERLAY
       * ============================================================================ */}
      <section className="relative pt-32 pb-20 px-6 lg:px-16 bg-[#FAF8F5] border-b border-slate-200/80 text-center overflow-hidden">
        {/* Subtle Parallax Decorative Background */}
        <motion.div 
          style={{ y: heroParallaxY }}
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        >
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80')` 
            }} 
          />
        </motion.div>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-5xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0265FF] text-xs font-bold uppercase tracking-wider shadow-xs"
          >
            <Sparkles size={14} className="text-[#0265FF]" />
            <span>NEXA TALENT IT SOLUTIONS PRIVATE LIMITED</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]"
          >
            Enterprise IT Hiring & <br />
            <span className="text-[#0265FF]">Turnkey GCC Solutions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Flexible recruitment models designed to complement internal TA teams — supporting <strong className="text-slate-900">Permanent Hiring</strong>, <strong className="text-slate-900">IT Staff Augmentation</strong>, <strong className="text-slate-900">Turnkey GCC Pods</strong>, <strong className="text-slate-900">Bulk Drives</strong>, and <strong className="text-slate-900">Executive Search</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs sm:text-sm font-bold text-[#0265FF] tracking-widest uppercase pt-2"
          >
            ✦ YOUR TALENT | OUR TECHNOLOGY | A BETTER TOMORROW ✦
          </motion.div>

          {/* Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/employers"
              className="px-8 py-4 rounded-full bg-[#0265FF] hover:bg-[#004FBF] text-white font-bold text-sm shadow-[0_10px_30px_rgba(2,101,255,0.3)] transition-all flex items-center gap-2"
            >
              <span>Hire Talent Now</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href="#delivery-models"
              className="px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-sm transition-all"
            >
              Explore 8 Delivery Models
            </a>
          </motion.div>
        </div>
      </section>

      {/* ============================================================================
       * SECTION 2: CLIENT LOGO WALL TICKER & SLA TELEMETRY BAR (CLEAN WHITE BG)
       * ============================================================================ */}
      <CaseStudyClientLogoWallTicker />

      <section className="py-6 px-6 lg:px-16 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 shadow-xs">
            <div className="text-2xl font-extrabold text-[#0265FF]">120 Mins</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Enterprise Response SLA</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 shadow-xs">
            <div className="text-2xl font-extrabold text-[#0265FF]">72 Hours</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Shortlist Turnaround</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 shadow-xs">
            <div className="text-2xl font-extrabold text-[#0265FF]">99.4%</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">Engineering Retention</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 shadow-xs">
            <div className="text-2xl font-extrabold text-[#0265FF]">100% NDA</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">DPDP & ISO 27001 Governed</div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * SECTION 3: THE 8 PRIMARY TALENT ACQUISITION & STAFFING DELIVERY MODELS
       * ============================================================================ */}
      <section id="delivery-models" className="py-20 px-6 lg:px-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#0265FF] uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              SOLUTIONS CATALOG
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Our 8 Primary <span className="text-[#0265FF]">Delivery & Staffing Models</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Aligned with the official Nexa Talent IT Solutions service portfolio to meet any recruitment scenario.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EIGHT_DELIVERY_MODELS.map((model) => {
              const IconComp = model.icon;
              return (
                <motion.div
                  key={model.id}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(2, 101, 255, 0.1)' }}
                  className="bg-[#FAF8F5] rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-400 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white text-[#0265FF] flex items-center justify-center font-bold border border-blue-100">
                        <IconComp size={24} />
                      </div>
                      <span className="text-[10px] font-bold text-[#0265FF] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        {model.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900">{model.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2 font-normal">
                        {model.desc}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                      {model.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                          <CheckCircle2 size={14} className="text-[#0265FF] shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={model.href}
                    className="pt-4 flex items-center justify-between text-xs font-bold text-[#0265FF] hover:text-[#004FBF] transition-colors"
                  >
                    <span>Inspect Delivery Model Spec</span>
                    <ArrowRight size={14} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================================
       * ANIMATED MOTION SECTION 1: REAL-TIME ENGINEERING DASHBOARD ASSEMBLY
       * ============================================================================ */}
      <LightDashboardAssembly />

      {/* ============================================================================
       * SECTION 4: 16 CORE PRACTICE VERTICALS GRID (16 SECTOR DOMAINS)
       * ============================================================================ */}
      <LightIndustryPracticeGrid />

      {/* ============================================================================
       * ANIMATED MOTION SECTION 2: HORIZONTAL MANDATE SCROLL RAIL
       * ============================================================================ */}
      <HorizontalCardsRail />

      {/* ============================================================================
       * SECTION 5: INTERACTIVE GCC TURNKEY POD CONFIGURATOR (SQUAD BUILDER)
       * ============================================================================ */}
      <DetailGccTurnkeyPodConfigurator />

      {/* ============================================================================
       * ANIMATED MOTION SECTION 3: FINTECH & LOW-LATENCY SYSTEMS PRACTICE GUILD
       * ============================================================================ */}
      <DetailFintechAndLowLatencyGuild />

      {/* ============================================================================
       * ANIMATED MOTION SECTION 4: CLOUD & GENERATIVE AI SPECIALIZATION GUILD
       * ============================================================================ */}
      <DetailCloudAndAiSpecialization />

      {/* ============================================================================
       * SECTION 6: 9-STAGE RECRUITMENT DELIVERY METHODOLOGY (PDF PAGE 4)
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-[#FAF8F5] border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#0265FF] uppercase tracking-widest bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
              PROCESS RIGOR
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Our 9-Stage <span className="text-[#0265FF]">Recruitment Delivery Workflow</span>
            </h2>
            <p className="text-sm text-slate-600">
              Structured step-by-step process discipline guaranteeing requirement ownership and fast closure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DELIVERY_STAGES.map((s) => (
              <div key={s.step} className="p-6 bg-white rounded-3xl border border-slate-200 space-y-3 relative overflow-hidden shadow-sm">
                <span className="text-4xl font-extrabold text-blue-100 absolute top-4 right-4">{s.step}</span>
                <h4 className="font-bold text-base text-slate-900 relative z-10">{s.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed relative z-10 font-normal">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================
       * SECTION 7: INTERACTIVE GCC ROI & COST ARBITRAGE SIMULATOR
       * ============================================================================ */}
      <PricingGccRoiCostSimulator />

      {/* ============================================================================
       * SECTION 8: ENTERPRISE FAQ & FINAL HIGH-CONVERSION SOLID BLUE CTA BANNER
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600">
              Clear answers regarding vendor empanelment, commercial terms, and SLAs.
            </p>
          </div>

          <div className="space-y-3">
            {SOLUTIONS_FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-[#FAF8F5] rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex items-center justify-between font-bold text-sm text-slate-900 hover:text-[#0265FF] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ArrowRight size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-[#0265FF]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-xs text-slate-600 leading-relaxed border-t border-slate-200/80 pt-4 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Solid Brand Blue (#0265FF) CTA Banner */}
      <section className="py-20 px-6 lg:px-16 bg-[#0265FF] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-white" />
            <span>START VENDOR EMPANELMENT</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Empanel Nexa Talent IT Solutions as Your Extended Talent Partner
          </h2>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
            Get matched with pre-vetted senior candidates within 72 hours under our 14-day zero-risk trial guarantee.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/employers"
              className="px-8 py-4 rounded-full bg-white text-[#0265FF] font-bold text-sm shadow-2xl hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              <span>Submit Requisition Now</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-full bg-white/10 border border-white/30 text-white font-bold text-sm hover:bg-white/20 transition-all"
            >
              Request Vendor Empanelment Pack
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Global Site Footer */}
      <SiteFooter />
    </div>
  );
}

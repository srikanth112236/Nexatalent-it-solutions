import { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  Clock,
  Cpu,
  Lock,
  HelpCircle,
  FileText
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { INDUSTRIES_DATA } from './IndustriesPage';
import { 
  LightTwoColumnPinnedStory,
  OneSideStickyFeatureStack,
  LightFinalCTAExpansion
} from '../components/light-motion';

// Mapping for URL slug aliases across navigation & footer
const SLUG_ALIASES: Record<string, string> = {
  'cloud-infrastructure': 'technology',
  'cloud-native': 'technology',
  'cloud': 'technology',
  'fintech': 'bfsi',
  'fintech-crypto': 'bfsi',
  'ai-machine-learning': 'technology',
  'ai-ml': 'technology',
  'gcc-india': 'gcc',
  'security': 'technology',
  'data': 'technology',
};

export function IndustryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const normalizedSlug = slug ? (SLUG_ALIASES[slug.toLowerCase()] || slug.toLowerCase()) : 'technology';
  const industry = INDUSTRIES_DATA.find((i) => i.slug === normalizedSlug) || INDUSTRIES_DATA[0];

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
  }, [slug]);

  if (!industry) {
    return <Navigate to="/industries" replace />;
  }

  const Icon = industry.icon || Cpu;

  // Domain-specific FAQ items
  const industryFaqs = [
    {
      q: `How quickly can Nexa Talent IT Solutions deploy pre-vetted candidates in ${industry.title}?`,
      a: `For standard individual contributor and senior lead mandates in ${industry.title}, our initial calibrated shortlist is delivered within 5 to 12 business days. Dedicated GCC pods or volume mandates deploy within 30 to 45 days.`
    },
    {
      q: `How does Nexa Talent IT Solutions verify technical skills specific to ${industry.title}?`,
      a: `Every candidate undergoes practitioner-led screening evaluated by former principal engineers and domain specialists. We assess real-world system design, concurrency constraints, and industry compliance standards.`
    },
    {
      q: `What replacement terms apply to placements in ${industry.title}?`,
      a: `All placements under our specialized practice models are backed by an unconditional 90-day replacement warranty with immediate priority sourcing squads assigned at zero additional fee.`
    },
    {
      q: `Can you support build-operate-transfer (BOT) capability centers for ${industry.title}?`,
      a: `Yes. We provide turnkey GCC and BOT solutions including legal entity compliance, employer-of-record (EOR) management, facility procurement, and leadership pod recruiting.`
    }
  ];

  return (
    <div className="bg-white min-h-screen text-black font-sans relative overflow-x-clip">
      {/* SEO & Meta Tags */}
      <SeoHead
        title={`${industry.title} Recruitment Practice | Nexa Talent IT Solutions`}
        description={`${industry.tagline}. Specialized IT staffing, contract squads, and executive search for ${industry.title}. Over ${industry.metrics.placed} delivered with a 90-day warranty.`}
        keywords={`${industry.title} hiring, ${industry.title} tech recruitment, ${industry.roles.slice(0, 3).join(', ')}, Nexa Talent IT Solutions`}
        canonical={`/industries/${industry.slug}`}
      />

      {/* Global Header */}
      <SiteNavbar />

      {/* ============================================================================
       * HERO SECTION (CLEAN LIGHT THEME WITH BRAND BLUE ACCENTS)
       * ============================================================================ */}
      <section className="relative pt-32 pb-16 px-6 lg:px-16 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-semibold text-black">
            <Link to="/" className="hover:text-black transition-colors">Home</Link>
            <ChevronRight size={14} className="text-black" />
            <Link to="/industries" className="hover:text-black transition-colors">Industries Vertical Catalog</Link>
            <ChevronRight size={14} className="text-black" />
            <span className="text-black font-bold">{industry.title}</span>
          </div>

          {/* Practice Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-black text-black text-xs font-bold uppercase tracking-wider"
          >
            <Icon size={14} className="text-black" />
            <span>Dedicated Industry Practice • {industry.metrics.placed}</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-black tracking-tight leading-[1.15]"
          >
            Talent & Engineering Solutions for <span className="text-black">{industry.title}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-black max-w-3xl font-normal leading-relaxed"
          >
            {industry.tagline}. {industry.description}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-4"
          >
            <Link
              to="/employers"
              className="px-8 py-4 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-sm shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all flex items-center gap-2"
            >
              <span>Get Talent for {industry.title}</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 rounded-full bg-white hover:bg-neutral-100 text-black font-bold text-sm border border-slate-300 shadow-xs transition-all"
            >
              Talk to a Hiring Expert
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ============================================================================
       * SLA & DOMAIN TELEMETRY STRIP (CLEAN WHITE BG)
       * ============================================================================ */}
      <section className="py-8 px-6 lg:px-16 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-black">{industry.metrics.placed}</div>
            <div className="text-xs font-semibold text-black mt-1">Domain Placements</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-black">{industry.metrics.avgSla}</div>
            <div className="text-xs font-semibold text-black mt-1">Average Shortlist SLA</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-black">{industry.metrics.retention}</div>
            <div className="text-xs font-semibold text-black mt-1">1-Year Retention Rate</div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-black">90 Days</div>
            <div className="text-xs font-semibold text-black mt-1">Replacement Guarantee</div>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * SECTION 2: INDUSTRY BOTTLENECK vs NEXA TALENT ARCHITECTURE
       * ============================================================================ */}
      <section className="py-16 px-6 lg:px-16 bg-white border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bottlenecks Card */}
            <div className="p-8 rounded-3xl bg-white border border-black space-y-4 shadow-xs">
              <span className="text-xs font-bold text-black uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-black inline-block">
                INDUSTRY TALENT CHALLENGE
              </span>
              <h3 className="text-xl font-extrabold text-black">
                Core Hiring Bottlenecks in {industry.title}
              </h3>
              <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                {industry.challenges}
              </p>
            </div>

            {/* Nexa Solution Card */}
            <div className="p-8 rounded-3xl bg-white border border-black space-y-4 shadow-xs">
              <span className="text-xs font-bold text-black uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-black inline-block">
                NEXA TALENT METHODOLOGY
              </span>
              <h3 className="text-xl font-extrabold text-black">
                Our Delivery Architecture
              </h3>
              <p className="text-xs sm:text-sm text-black leading-relaxed font-normal">
                {industry.nexaSolution}
              </p>
            </div>
          </div>

          {/* High-Demand Roles Matrix */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-black uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-black">
                TALENT SOURCING COVERAGE
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
                High-Demand Engineering & Leadership Roles
              </h2>
              <p className="text-xs sm:text-sm text-black">
                Pre-evaluated candidate pipelines actively maintained for {industry.title} mandates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {industry.roles.map((r, i) => (
                <div key={i} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 flex flex-col justify-between shadow-xs hover:border-black transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-black bg-white px-2.5 py-0.5 rounded-full border border-black uppercase">
                        Active Pool
                      </span>
                      <span className="text-[10px] font-bold text-black flex items-center gap-1">
                        <Clock size={12} />
                        SLA: {industry.metrics.avgSla}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-base text-black">{r}</h4>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-black font-semibold">
                    <span className="flex items-center gap-1 text-black">
                      <CheckCircle2 size={14} />
                      Practitioner Assessed
                    </span>
                    <span className="text-black">Vetted</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Advantage Table */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-bold text-black uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-black">
                SERVICE BENCHMARK
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
                Institutional Advantage & Service Delivery
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-300 text-black font-extrabold">
                    <th className="py-3 px-4">Evaluation Criteria</th>
                    <th className="py-3 px-4 text-black">Nexa Talent Practice Pod</th>
                    <th className="py-3 px-4 text-black">General Recruitment Agencies</th>
                    <th className="py-3 px-4 text-black">In-House TA Only</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-black">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-black">Domain Vetting Depth</td>
                    <td className="py-3.5 px-4 font-extrabold text-black">Practitioner Architectural Screen</td>
                    <td className="py-3.5 px-4 text-black">Keyword Resume Scanning</td>
                    <td className="py-3.5 px-4 text-black">General Recruiter Screen</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-black">Average Shortlist SLA</td>
                    <td className="py-3.5 px-4 font-extrabold text-black">{industry.metrics.avgSla}</td>
                    <td className="py-3.5 px-4 text-black">30 - 60 Days</td>
                    <td className="py-3.5 px-4 text-black">45+ Days</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-black">Replacement Guarantee</td>
                    <td className="py-3.5 px-4 font-extrabold text-black">90-Day Unconditional Warranty</td>
                    <td className="py-3.5 px-4 text-black">30 Days or None</td>
                    <td className="py-3.5 px-4 text-black">N/A (Re-hiring Overhead)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-black">Statutory & Legal Compliance</td>
                    <td className="py-3.5 px-4 font-extrabold text-black">100% PF, ESI, GST Governed</td>
                    <td className="py-3.5 px-4 text-black">Varies / Partial</td>
                    <td className="py-3.5 px-4 text-black">Internal HR Overhead</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Governance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-extrabold text-base text-black">90-Day Placement Warranty</h4>
              <p className="text-xs text-black leading-relaxed font-normal">
                Complete replacement warranty backed by dedicated rapid-response sourcing squads for any candidate attrition within 90 days.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <Lock size={20} />
              </div>
              <h4 className="font-extrabold text-base text-black">100% IP Escrow & Legal Assignment</h4>
              <p className="text-xs text-black leading-relaxed font-normal">
                Strict non-disclosure protocols and legal assignment ensuring all code, IP, and domain knowledge belong 100% to your enterprise.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <FileText size={20} />
              </div>
              <h4 className="font-extrabold text-base text-black">Zero Candidate Fee Ethics</h4>
              <p className="text-xs text-black leading-relaxed font-normal">
                Nexa Talent IT Solutions operates under a strict zero-candidate-fee code of ethics. Candidates are never charged recruitment fees.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================================
       * LIGHT MOTION ANIMATED SECTIONS (CLEAN LIGHT THEME WITH STICKY SCROLL PINNING)
       * ============================================================================ */}
      <LightTwoColumnPinnedStory />
      <OneSideStickyFeatureStack />

      {/* ============================================================================
       * DOMAIN FAQ ACCORDION SECTION
       * ============================================================================ */}
      <section className="py-20 px-6 lg:px-16 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-black text-black text-xs font-extrabold uppercase tracking-wider">
              <HelpCircle size={14} />
              <span>PRACTICE FAQ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight">
              Frequently Asked Questions on {industry.title} Hiring
            </h2>
          </div>

          <div className="space-y-4">
            {industryFaqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <h4 className="text-base font-extrabold text-black flex items-center gap-2">
                  <span className="text-black">Q:</span> {faq.q}
                </h4>
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

      {/* Global Footer */}
      <SiteFooter />
    </div>
  );
}

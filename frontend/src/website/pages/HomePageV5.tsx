import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, 
  Building2, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Layers, 
  Award, 
  PhoneCall, 
  Mail, 
  MapPin, 
  UserCheck 
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { 
  FullScreenHorizontalSplitCurtain, 
  ParallaxDepthFloatMatrix, 
  LightIndustryPracticeGrid 
} from '../components/light-motion';

export function HomePageV5() {
  const [partnerForm, setPartnerForm] = useState({ companyName: '', contactPerson: '', email: '', phone: '', hiringNeed: 'IT Recruitment' });
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  useEffect(() => {
    const t1 = window.setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch {
        /* noop */
      }
    }, 400);
    return () => window.clearTimeout(t1);
  }, []);

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerSubmitted(true);
  };

  return (
    <div
      id="main-content"
      className="bg-white min-h-screen text-slate-900 font-sans relative overflow-x-clip"
    >
      <SeoHead
        title="Technology Recruitment & Staffing Solutions | NexaTalent IT Solutions"
        description="NexaTalent IT Solutions connects companies, recruitment partners, and technology professionals through IT recruitment, permanent staffing, contract staffing, executive search, and vendor empanelment."
        keywords="IT Recruitment, IT Staffing, Permanent Staffing, Contract Staffing, Executive Search, Vendor Empanelment, Technology Hiring India"
        canonicalPath="/"
      />

      <SiteNavbar />

      {/* ============================================================================
       * 1. HERO SECTION (ANIMATED SPLIT CURTAIN WITH DUAL CTAS)
       * ============================================================================ */}
      <FullScreenHorizontalSplitCurtain />

      {/* ============================================================================
       * 2. TRUST / QUICK SERVICES RIBBON
       * ============================================================================ */}
      <section className="py-6 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">OUR CORE SERVICES:</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-slate-300">
            <span className="hover:text-emerald-400 transition-colors">IT Recruitment</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-emerald-400 transition-colors">Contract Staffing</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-emerald-400 transition-colors">Executive Search</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-emerald-400 transition-colors">Permanent Hiring</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-emerald-400 transition-colors">Bulk Volume Hiring</span>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 3. WHO WE ARE (CORPORATE STORYTELLING)
       * ============================================================================ */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="p-10 sm:p-14 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xl shadow-slate-200/50 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-8 space-y-4">
            <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 uppercase tracking-wider">
              WHO WE ARE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Your Trusted Technology & Talent Partner
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              NexaTalent IT Solutions is a technology recruitment and staffing company helping organizations identify, attract, and hire skilled professionals across IT and business functions. We support companies with permanent recruitment, contract staffing, executive search, contract-to-hire, and specialized talent acquisition.
            </p>
            <p className="text-slate-700 text-sm font-semibold">
              Our goal is simple: Connect the right talent with the right organization.
            </p>
          </div>
          <div className="md:col-span-4 flex flex-col gap-3">
            <Link
              to="/about"
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Learn About Us</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="w-full py-3.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs text-center border border-slate-300 transition-all"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 4. CORE SERVICES GRID (6 CLEAN CARDS)
       * ============================================================================ */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 uppercase tracking-wider">
            OUR RECRUITMENT SOLUTIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Tailored Staffing & Recruitment Services
          </h2>
          <p className="text-base text-slate-600 font-medium">
            Flexible engagement models designed for enterprise corporations, growing tech startups, and hiring teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">IT & Tech Recruitment</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Specialized technology talent across software development, cloud, data, AI, cybersecurity, and microservices.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Permanent Staffing</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              End-to-end recruitment process management for full-time corporate hires with warranty support.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Contract Staffing</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Flexible workforce solutions for immediate project bandwidth, temporary demands, and agile squads.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Contract-to-Hire</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Evaluate candidate technical competency and cultural fit on contract before making a permanent offer.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Executive Search</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Confidential executive search for CXO, VP Engineering, Director, and Head-level leadership positions.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Bulk Volume Hiring</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Structured hiring drives and batch recruitment support for high-volume corporate expansion.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 5. WHY NEXATALENT (OUR 6 CORE RECRUITMENT PILLARS - STRAIGHT CLEAN GRID)
       * ============================================================================ */}
      <ParallaxDepthFloatMatrix />

      {/* ============================================================================
       * 6. OUR PRACTICE AREAS (EXACT 3-IN-A-ROW GRID)
       * ============================================================================ */}
      <LightIndustryPracticeGrid />

      {/* ============================================================================
       * 7. OUR RECRUITMENT PROCESS (STEP-BY-STEP WORKFLOW)
       * ============================================================================ */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200 uppercase tracking-wider">
            OUR RECRUITMENT METHODOLOGY
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our 6-Step Recruitment Workflow
          </h2>
          <p className="text-base text-slate-600 font-medium">
            A transparent, structured hiring process from initial requirement gathering to seamless candidate onboarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Requirement Alignment', desc: 'We analyze your role specifications, technical stack, culture fit, and compensation structure.' },
            { step: '02', title: 'Targeted Sourcing', desc: 'Our recruiters source candidates across verified networks, tech communities, and active talent pools.' },
            { step: '03', title: 'Screening & Evaluation', desc: 'Candidates undergo structured technical and behavioral screening before resume submission.' },
            { step: '04', title: 'Shortlist Delivery', desc: 'You receive calibrated candidate profiles with concise technical evaluation summaries.' },
            { step: '05', title: 'Interview Coordination', desc: 'We manage end-to-end interview scheduling, feedback collection, and expectation alignment.' },
            { step: '06', title: 'Offer & Joining Support', desc: 'We assist with offer negotiation, background checks, and joining follow-up to ensure low drop-offs.' }
          ].map((item) => (
            <div key={item.step} className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-2">
              <span className="text-2xl font-black text-blue-600 font-mono block">{item.step}</span>
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================================
       * 8. VENDOR EMPANELMENT & RECRUITMENT PARTNERSHIPS ⭐
       * ============================================================================ */}
      <section id="vendor-empanelment" className="py-20 px-6 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          
          <div className="md:col-span-7 space-y-6">
            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-800 uppercase tracking-wider inline-flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>RECRUITMENT PARTNER ALLIANCE</span>
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Looking for a Reliable <br />
              <span className="text-emerald-400">Recruitment Partner?</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              Partner with NexaTalent IT Solutions to expand your delivery capabilities and access additional hiring opportunities. We collaborate with organizations, enterprises, staffing companies, and recruitment partners to deliver reliable IT and non-IT talent.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 font-medium pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>IT & Non-IT Recruitment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Permanent & Contract Staffing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Executive Search Mandates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sub-Vendor & Delivery Partnerships</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/partners"
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
              >
                <span>Request Vendor Empanelment</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-800/90 p-8 rounded-3xl border border-slate-700 shadow-2xl">
            {partnerSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Partnership Request Received</h3>
                <p className="text-xs text-slate-300">Our partnership desk will review your details and contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white mb-2">Quick Empanelment Inquiry</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Acme Staffing"
                    value={partnerForm.companyName}
                    onChange={(e) => setPartnerForm({ ...partnerForm, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500"
                    placeholder="Your Name"
                    value={partnerForm.contactPerson}
                    onChange={(e) => setPartnerForm({ ...partnerForm, contactPerson: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-emerald-500"
                    placeholder="name@company.com"
                    value={partnerForm.email}
                    onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md mt-2"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ============================================================================
       * 9. FOR EMPLOYERS MODULE (SUBMIT REQUIREMENT)
       * ============================================================================ */}
      <section id="post-requirement" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="p-10 sm:p-14 rounded-3xl bg-blue-50/60 border border-blue-200/90 text-center space-y-6">
          <span className="text-xs font-extrabold text-blue-600 bg-white px-3.5 py-1.5 rounded-full border border-blue-200 uppercase tracking-wider">
            FOR EMPLOYERS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Looking for the Right Talent?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            Whether you need a single specialist or an entire engineering squad, NexaTalent helps you source, screen, and deliver qualified candidates.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/employers"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2"
            >
              <span>Submit Your Requirement →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 10. FOR CANDIDATES MODULE
       * ============================================================================ */}
      <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-200/80">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
          <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-3.5 py-1 rounded-full uppercase tracking-wider">
            FOR CANDIDATES
          </span>
          <h3 className="text-2xl font-bold text-slate-900">Looking for Your Next Career Opportunity?</h3>
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            Explore active technology roles or register your candidate profile with our recruitment team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/jobs" className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all">
              View Open Jobs
            </Link>
            <Link to="/candidates" className="px-6 py-2.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 hover:bg-slate-200 transition-all">
              Register Profile
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 11. DIRECT CONTACT SECTION
       * ============================================================================ */}
      <section className="py-16 px-6 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h3 className="text-2xl font-extrabold text-slate-900">Ready to Hire? Talk to Our Recruitment Team</h3>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 font-semibold">
            <a href="mailto:ceo@nexatalentitsolutions.com" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>ceo@nexatalentitsolutions.com</span>
            </a>
            <span className="text-slate-400">•</span>
            <a href="tel:+917019696166" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>+91 70196 96166</span>
            </a>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Mumbai Corporate Office</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================================
       * 12. CORPORATE FOOTER
       * ============================================================================ */}
      <SiteFooter />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import { Hero04EditorialIvoryLuxury } from '../components/hero-collection';
import {
  CandidateDashboardMetrics,
  ResumeUploadAiExtractor,
  NexaAiCareerScanner,
  JobsForMeAiStream
} from '../components/ai-engines';
import {
  JobsSalaryAndArbitrageCalculator,
  JobsTalentBenchSpotlight,
  JobsInterviewProcessRoadmap,
  JobsCandidatePerksAndWorkspaceGrid,
  JobsReferralEngineAndRewards,
  JobsCandidateCareerConcierge,
  FaqAccordionInteractiveSearch,
  CaseStudyVideoTestimonialBento
} from '../components/sample-library';
// 7 High-End Animated Motion Components from SampleShowcase
import {
  LightCandidateProfileDrop,
  PinnedCircularProgressReveal,
  SignatureTalentRadar,
  SignatureInteractiveTimelineDial,
  LightStackedCards,
  LightCardExpandSection,
  TwoSectionDualStickyComparison,
  VerticalParallaxTalentArb,
  LightDirectContactSection
} from '../components/light-motion';
import { User, Phone, Mail, KeyRound } from 'lucide-react';

function CandidateAuthGateway() {
  const [activeView, setActiveView] = useState<'analysis' | 'login'>('analysis');
  const [method, setMethod] = useState<'mobile' | 'email' | 'google' | 'otp'>('mobile');
  const [phone, setPhone] = useState('+91 98450 12890');
  const [email, setEmail] = useState('vikram.sharma.dev@gmail.com');
  const [otp, setOtp] = useState('8429');
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticated(true);
  };

  const handleGoToContact = () => {
    window.location.href = '/contact?inquiry=candidate#contact-form';
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-b border-slate-200">
      <div className="max-w-4xl mx-auto">
        {/* Stealth Privacy Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-slate-900 text-white flex items-center justify-between text-xs font-medium shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>🔒 <strong>Candidate Stealth Mode Active:</strong> Your profile & current employer disclosures remain strictly confidential until you explicitly approve direct interview invites.</span>
          </div>
          <span className="hidden sm:inline-block px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-bold font-mono">100% Zero Fee</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2 shadow-sm">
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>📊 CANDIDATE EXPERIENCE ANALYSIS & PROFILE DETAILS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            Candidate Experience Analysis, Skill Diagnostics & Access Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl mx-auto">
            NexaTalent IT Solutions evaluates your technical experience, domain expertise, and compensation benchmarks to match you with top GCC & enterprise mandates.
          </p>
        </motion.div>

        {/* View Switcher Tabs */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setActiveView('analysis')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeView === 'analysis'
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            <span>📈 Experience Analysis & Details</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('login')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeView === 'login'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            <span>🔐 Candidate Sign-In & Access</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50"
        >
          {activeView === 'analysis' ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Engineering Profile & Experience Diagnostics</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time benchmark score generated by NexaTalent AI Engines</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200">
                  <span>Target Salary Band: ₹38L – ₹48L CTC</span>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Experience Level</span>
                  <div className="text-xl font-black text-slate-900 mt-1">8.5 Yrs (Lead Architect)</div>
                  <p className="text-[11px] text-slate-500 mt-1">Distributed Systems, Cloud & High-Concurrency Microservices</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Market Talent Percentile</span>
                  <div className="text-xl font-black text-emerald-600 mt-1">Top 6% (94th Percentile)</div>
                  <p className="text-[11px] text-slate-500 mt-1">Validated against 12,000+ India Engineering profiles</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Stealth Status</span>
                  <div className="text-xl font-black text-blue-600 mt-1">100% Confidential</div>
                  <p className="text-[11px] text-slate-500 mt-1">Current employer disclosures strictly shielded</p>
                </div>
              </div>

              {/* Skill Stack Diagnostics */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Core Tech Stack & Mastery Analysis</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-slate-800">System Architecture & Scalability</div>
                      <div className="text-[11px] text-slate-500">Distributed Microservices, Kafka, Redis</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">96%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Full-Stack React & Node.js</div>
                      <div className="text-[11px] text-slate-500">TypeScript, Next.js, GraphQL, REST</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">94%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Cloud Infra & Kubernetes</div>
                      <div className="text-[11px] text-slate-500">AWS, Terraform, CI/CD Pipelines</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">92%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-slate-800">Database & Low-Latency Engines</div>
                      <div className="text-[11px] text-slate-500">PostgreSQL, MongoDB, ElasticSearch</div>
                    </div>
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">90%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons inside Analysis View */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleGoToContact}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <span>Need Direct Advisory? Go to Contact Us Form →</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('login')}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
                >
                  Log In to Access Mandates →
                </button>
              </div>
            </div>
          ) : (
            <>
              {authenticated ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Authenticated Candidate Session Active</h3>
                  <p className="text-xs text-slate-600 mb-4">Welcome back, <strong>Vikram Sharma</strong>! Your AI Match Score (82/100) and 24 live job recommendations are synchronized.</p>
                  <a href="/candidate/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-500 transition-all">
                    Enter Candidate Management Hub →
                  </a>
                </div>
              ) : (
                <>
                  {/* Methods Bar */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    <button
                      type="button"
                      onClick={() => setMethod('mobile')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        method === 'mobile' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Mobile OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('email')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        method === 'email' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email & Password</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('google')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        method === 'google' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>Google Account</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod('otp')}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        method === 'otp' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Direct OTP Fast-Track</span>
                    </button>
                  </div>

                  <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4">
                    {method === 'mobile' && (
                      <div>
                        <label className="block text-xs text-slate-600 mb-1 font-semibold">Enter 10-Digit Mobile Number</label>
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 text-xs font-medium"
                          />
                          <button type="submit" className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md">
                            Send OTP
                          </button>
                        </div>
                      </div>
                    )}

                    {method === 'email' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-slate-600 mb-1 font-semibold">Email Address</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 text-xs font-medium"
                          />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md">
                          Continue with Email
                        </button>
                      </div>
                    )}

                    {method === 'google' && (
                      <div className="text-center py-2">
                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 border border-slate-300 shadow-sm"
                        >
                          <span className="text-blue-600 font-black text-sm">G</span>
                          <span>Continue with Google OAuth</span>
                        </button>
                      </div>
                    )}

                    {method === 'otp' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-slate-600 mb-1 font-semibold">Enter 4-Digit OTP sent to +91 98450 12890</label>
                          <input
                            type="text"
                            required
                            maxLength={4}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 text-center font-mono tracking-widest text-base font-bold"
                          />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md">
                          Verify OTP & Enter Candidate Hub
                        </button>
                      </div>
                    )}
                  </form>
                </>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export function CandidatesPage() {
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

  return (
    <div
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'clip',
        overflowY: 'visible',
        isolation: 'isolate',
        backgroundColor: '#ffffff',
      }}
    >
      <SeoHead
        title="Candidate Career Services & AI Talent Matching"
        description="Upload your resume. Discover AI-matched engineering opportunities with verified compensation benchmarks, 1-click apply, and zero candidate fees."
        keywords="Candidate Registration, AI Resume Parsing, Tech Jobs India, Software Engineer Jobs Bengaluru, Resume Score, AI Career Scanner"
        canonicalPath="/candidates"
      />

      {/* 1. Global Navbar */}
      <SiteNavbar />

      {/* 2. Candidate Hero */}
      <Hero04EditorialIvoryLuxury />

      {/* 3. Candidate Auth Gateway (Mobile, Email, Google, OTP) */}
      <CandidateAuthGateway />

      {/* 4. Feature 4: Candidate Dashboard Metrics (87% completion, 82/100 score, 24 matching) */}
      <CandidateDashboardMetrics />

      {/* 5. Animated SampleShowcase Section 1: Candidate Profile Drop Animation */}
      <LightCandidateProfileDrop />

      {/* 6. Feature 5: Smart Resume Upload & 14-Entity Extractor */}
      <ResumeUploadAiExtractor maxSizeMB={15} />

      {/* 7. Feature 6: Nexa AI Career Scanner (74/100 score + "Improve My Resume") */}
      <NexaAiCareerScanner />

      {/* 8. Animated SampleShowcase Section 2: Circular Progress Assessment Reveal */}
      <PinnedCircularProgressReveal />

      {/* 9. Feature 7: "Jobs For Me" AI Matching Stream */}
      <JobsForMeAiStream />

      {/* 10. Animated SampleShowcase Section 3: Signature Talent Radar */}
      <SignatureTalentRadar />

      {/* 11. Salary & Arbitrage Calculator */}
      <JobsSalaryAndArbitrageCalculator />

      {/* 12. Animated SampleShowcase Section 4: Interactive Timeline Dial */}
      <SignatureInteractiveTimelineDial />

      {/* 13. Talent Bench Spotlight */}
      <JobsTalentBenchSpotlight />

      {/* 14. Animated SampleShowcase Section 5: Stacked Cards of Interview Coaching */}
      <LightStackedCards />

      {/* 15. Interview Process Roadmap */}
      <JobsInterviewProcessRoadmap />

      {/* 16. Animated SampleShowcase Section 6: Expandable Career Cards */}
      <LightCardExpandSection />

      {/* 17. Perks & Workspace Grid */}
      <JobsCandidatePerksAndWorkspaceGrid />

      {/* 18. Animated SampleShowcase Section 7: Dual Sticky Comparison */}
      <TwoSectionDualStickyComparison />

      {/* 19. Animated SampleShowcase Section 8: Vertical Parallax Talent Arbitrage Rail */}
      <VerticalParallaxTalentArb />

      {/* 20. Referral Engine & Rewards */}
      <JobsReferralEngineAndRewards />

      {/* 20. Candidate Career Concierge */}
      <JobsCandidateCareerConcierge />

      {/* 21. Video Testimonial Bento */}
      <CaseStudyVideoTestimonialBento />

      {/* 22. Candidate FAQ Accordion */}
      <FaqAccordionInteractiveSearch />

      {/* 23. Support Desk Contact & Footer */}
      <LightDirectContactSection />
      <SiteFooter />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';
import {
  ClientThreeWayIntake,
  ClientRequirementDashboard,
  ClientAiShortlistDeck
} from '../components/ai-engines';
import {
  DetailContractStaffingScaleEngine,
  DetailGccTurnkeyPodConfigurator,
  DetailExecutiveSearchPlaybook,
  PricingCostPlusTransparencyBreakdown,
  PricingGccRoiCostSimulator,
  DetailServiceLevelGuaranteeSla,
  AboutSecurityComplianceVault,
  FaqAccordionInteractiveSearch,
  CaseStudyClientLogoWallTicker
} from '../components/sample-library';
// High-End Animated Motion Components
import {
  LightEmployersHeroBanner,
  CorridorVettingTunnel,
  LightProgressiveWorkflow,
  OneSideStickyFeatureStack,
  OneSideStickySplitMilestones,
  SignatureCompensationHeatmap,
  VerticalParallaxCaseStudy,
  PinnedSpeedometerGauge,
  DualPinnedConvergenceShowcase,
  LightDirectContactSection
} from '../components/light-motion';
import { Building2, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

function ClientRegistrationSection() {
  const [step, setStep] = useState(1);
  const [registered, setRegistered] = useState(false);
  const [refId, setRefId] = useState('');
  const [formData, setFormData] = useState({
    companyName: 'Fintech ScaleOps Technologies Ltd',
    website: 'https://fintechscaleops.io',
    industry: 'Technology / Software & Digital Enterprise',
    contactPerson: 'Aditi Deshmukh (VP of Engineering & Talent)',
    email: 'aditi.d@fintechscaleops.io',
    phone: '+91 99800 11223',
    gstCin: '29AAACF1234H1Z1 / U72200KA2021PTC145678',
    companySize: '250–500 Employees (Series C Funded)',
    hiringLocations: 'Bangalore, Pune, Hyderabad'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      const generatedId = 'NEXA-ENT-' + Math.floor(100000 + Math.random() * 900000);
      setRefId(generatedId);
      setRegistered(true);
    }
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-b border-slate-200" id="client-registration">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ENTERPRISE CLIENT REGISTRATION & KYC</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-950 mb-2">
            Register Your Organization for IT Recruitment & Staffing
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Direct access to pre-screened technical talent. All enterprise accounts undergo express administrative KYC verification before account activation.
          </p>
        </motion.div>

        {/* Step Indicator Bar */}
        {!registered && (
          <div className="flex items-center justify-between max-w-md mx-auto mb-6 text-xs font-bold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${step >= 1 ? 'bg-emerald-600' : 'bg-slate-300'}`}>1</span>
              <span>Company Info</span>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200 mx-3"></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-300'}`}>2</span>
              <span>Contact & Scale</span>
            </div>
            <div className="flex-1 h-0.5 bg-slate-200 mx-3"></div>
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-300'}`}>3</span>
              <span>KYC & Scope</span>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50"
        >
          {registered ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise Client Application Received</h3>
              <div className="inline-block bg-slate-100 border border-slate-300 font-mono text-slate-800 text-xs px-3 py-1.5 rounded-lg mb-4">
                Reference ID: <strong className="text-emerald-700">{refId}</strong>
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
                Your GST ({formData.gstCin.split('/')[0]}) & corporate email domain have been logged for express verification. An executive account manager will activate your Client Portal within 2 hours.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shadow-sm">
                Admin Verification Pending: Under 2 Hours SLA
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Corporate Website *</label>
                    <input
                      type="url"
                      required
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-600 mb-1 font-semibold">Industry Sector *</label>
                    <input
                      type="text"
                      required
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Contact Person & Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Official Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Direct Phone / Mobile *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Company Size / Scale *</label>
                    <input
                      type="text"
                      required
                      value={formData.companySize}
                      onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">GST / CIN Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.gstCin}
                      onChange={(e) => setFormData({ ...formData, gstCin: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1 font-semibold">Active Hiring Locations *</label>
                    <input
                      type="text"
                      required
                      value={formData.hiringLocations}
                      onChange={(e) => setFormData({ ...formData, hiringLocations: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Admin Verification Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="font-medium">
                  Admin Verification Protocol: Accounts are validated against MCA and corporate domain registries under 2-Hour SLA.
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  {step === 3 ? 'Submit Organization Application & Unlock Console' : `Proceed to Step ${step + 1}`}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export function EmployersPage() {
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
        title="Technology Recruitment & Staffing Solutions for Employers"
        description="Submit your technical hiring requirements. Partner with NexaTalent IT Solutions for IT recruitment, permanent staffing, contract staffing, and executive search."
        keywords="Hire IT Talent, Enterprise Tech Recruitment, Contract Staffing India, IT Staff Augmentation, Executive Search"
        canonicalPath="/employers"
      />

      {/* 1. Global Navbar */}
      <SiteNavbar />

      {/* 2. Light Premier Enterprise Employer Hero Banner */}
      <LightEmployersHeroBanner />

      {/* 3. Client Trust Logo Wall */}
      <CaseStudyClientLogoWallTicker />

      {/* 4. Client KYC Registration */}
      <ClientRegistrationSection />

      {/* 5. Feature 9: 3-Way Requisition Intake (Form / JD / AI Prompt) */}
      <ClientThreeWayIntake />

      {/* 6. Feature 10: Active Requirements Dashboard */}
      <ClientRequirementDashboard />

      {/* 7. Feature 11: Client AI Shortlist Deck */}
      <ClientAiShortlistDeck />

      {/* 8. Recruiter Verification Safeguard Callout */}
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 border-b border-slate-200">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto flex items-start sm:items-center gap-4 p-6 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm"
        >
          <UserCheck className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div className="text-xs sm:text-sm text-slate-700">
            <h4 className="font-bold text-slate-950 text-base mb-1">
              Recruiter Verification Required — Never Hire by Algorithmic Blindness
            </h4>
            <p className="text-slate-600 leading-relaxed font-medium">
              Every candidate shortlisted by Nexa AI has been personally interviewed by an internal Nexa technical recruiter. We independently verify GitHub repositories, system design comprehension, salary expectations, and actual notice buyout agreements.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 9. Animated SampleShowcase Section 1: Corridor Vetting Tunnel */}
      <CorridorVettingTunnel />

      {/* 10. Turnkey GCC Pod Configurator */}
      <DetailGccTurnkeyPodConfigurator />

      {/* 11. Animated SampleShowcase Section 2: Progressive Workflow */}
      <LightProgressiveWorkflow />

      {/* 12. Contract Staffing Scale Engine */}
      <DetailContractStaffingScaleEngine />

      {/* 13. Animated SampleShowcase Section 3: One-Side Sticky Feature Stack */}
      <OneSideStickyFeatureStack />

      {/* 14. Executive Search Playbook */}
      <DetailExecutiveSearchPlaybook />

      {/* 15. Animated SampleShowcase Section 4: Split Milestones */}
      <OneSideStickySplitMilestones />

      {/* 16. Cost-Plus Pricing Transparency */}
      <PricingCostPlusTransparencyBreakdown />

      {/* 17. Animated SampleShowcase Section 5: Signature Compensation Heatmap */}
      <SignatureCompensationHeatmap />

      {/* 18. GCC ROI & Cost Arbitrage Simulator */}
      <PricingGccRoiCostSimulator />

      {/* 19. Animated SampleShowcase Section 6: Vertical Parallax Case Study */}
      <VerticalParallaxCaseStudy />

      {/* 20. Service Level Guarantee (SLA) */}
      <DetailServiceLevelGuaranteeSla />

      {/* 21. Animated SampleShowcase Section 7: Pinned Speedometer Gauge */}
      <PinnedSpeedometerGauge />

      {/* 22. Animated SampleShowcase Section 8: Dual Pinned Convergence Showcase */}
      <DualPinnedConvergenceShowcase />

      {/* 23. Security & IP Vault */}
      <AboutSecurityComplianceVault />

      {/* 23. Enterprise Client FAQ */}
      <FaqAccordionInteractiveSearch />

      {/* 24. Direct Contact Hotline & Footer */}
      <LightDirectContactSection />
      <SiteFooter />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Scale, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Printer,
  Building2
} from 'lucide-react';
import { SiteNavbar, SiteFooter } from '../components/SiteChrome';
import { SeoHead } from '../components/SeoHead';

const LEGAL_SECTIONS = [
  {
    id: 'privacy-policy',
    route: '/privacy-policy',
    title: 'Privacy Policy',
    icon: Lock,
    summary: 'Comprehensive data privacy policy governing personal data processing under the Indian Digital Personal Data Protection (DPDP) Act 2023, Information Technology Act 2000, and GDPR.',
    content: [
      {
        heading: '1. Corporate Identity & Data Fiduciary Details',
        text: 'NEXA TALENT IT SOLUTIONS PRIVATE LIMITED ("NexaTalent IT Solutions", "we", "us", "our") operates as a Data Fiduciary under the Digital Personal Data Protection (DPDP) Act, 2023. Corporate Identification Number (CIN): U72200MH2021PTC145678. Registered Office: 4th and 7th Floor, Skyline Icon, Andheri - Kurla Rd, Chimatpada, Marol, Andheri East, Mumbai, Maharashtra 400059, India. Executive Email: info@nexatalentitsolutions.com.'
      },
      {
        heading: '2. Categories of Personal Data Collected',
        text: 'We collect candidate information strictly for recruitment, profile calibration, and statutory employment verification: full legal name, contact information, educational credentials, work history, verified compensation records, notice periods, and technical evaluation transcripts. From enterprise clients and recruitment partners, we collect company registration details, GST/CIN, requisition specifications, and authorized billing contacts.'
      },
      {
        heading: '3. Legal Grounds & Explicit Candidate Consent',
        text: 'Candidate profiles are processed solely with explicit, revocable consent. Before any candidate profile is shared with prospective employers or clients, explicit consent is logged with a cryptographic timestamp. Candidates retain unconditional statutory rights to inspect, rectify, or request complete erasure of their data from our talent graph.'
      },
      {
        heading: '4. Data Retention, Security & Storage',
        text: 'Personal records are stored in enterprise-grade cloud environments located within India, protected by AES-256 encryption at rest and TLS 1.3 encryption in transit. Records are retained only for the duration necessary to satisfy recruitment mandates or statutory taxation obligations, after which data is purged.'
      },
      {
        heading: '5. Candidate Rights: Access, Correction & Erasure',
        text: 'Every candidate may request a copy of their stored profile, correct inaccurate fields (skills, experience, compensation, notice period), or demand complete erasure from our talent graph at any time. Nominated requests are actioned within 15 working days. Erasure requests are honoured unless retention is mandated by applicable law.'
      },
      {
        heading: '6. Employer & Partner Data',
        text: 'Enterprise client data — company registration, GST/CIN, requisition specifications and billing contacts — is processed strictly for mandate delivery, invoicing and statutory compliance. Client dossiers are never shared with competing organisations and are covered by mutual non-disclosure terms in every Master Services Agreement.'
      },
      {
        heading: '7. Cookies, Analytics & Tracking',
        text: 'We use strictly essential session tokens for portal sign-in and anonymised analytics to measure page performance. We deploy no third-party advertising trackers. Full disclosures sit in our Cookie Policy.'
      },
      {
        heading: '8. Grievance Redressal & Data Protection Officer',
        text: 'In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and DPDP Act 2023, the appointed Data Protection Officer is: Executive Compliance Desk, NEXA TALENT IT SOLUTIONS PRIVATE LIMITED, 4th and 7th Floor, Skyline Icon, Andheri - Kurla Rd, Marol, Andheri East, Mumbai 400059. Direct Grievance Email: info@nexatalentitsolutions.com. Phone: +91 70196 96166. Acknowledgement SLA: within 24 hours; resolution within 15 working days.'
      }
    ]
  },
  {
    id: 'terms',
    route: '/terms',
    title: 'Terms of Service',
    icon: Scale,
    summary: 'Institutional terms and conditions governing enterprise clients, candidate professionals, and recruitment vendors accessing NexaTalent IT Solutions services.',
    content: [
      {
        heading: '1. Contractual Framework',
        text: 'These Terms of Service govern your access to the NexaTalent IT Solutions platform, applicant tracking workflows, and AI talent matching engine. Commercial engagements with employers and recruitment partners are additionally governed by formal Master Services Agreements (MSAs) and Statements of Work (SOWs).'
      },
      {
        heading: '2. Non-Circumvention & Candidate Ownership Covenants',
        text: 'Enterprise clients agree that any candidate introduced by NexaTalent IT Solutions remains the proprietary introduction of NexaTalent IT Solutions for a period of 12 months from the date of presentation. Direct hiring or indirect engagement through third parties without commercial settlement constitutes breach of contract and triggers full contractual placement fee liability.'
      },
      {
        heading: '3. 90-Day Unconditional Replacement Warranty',
        text: 'For permanent lateral placements, NexaTalent IT Solutions provides a 90-calendar-day replacement warranty. If a placed professional voluntarily resigns or is terminated for cause within 90 days of joining, our dedicated rapid sourcing pod will deliver a calibrated replacement at zero additional fee.'
      },
      {
        heading: '4. Candidate Representations & Integrity Verification',
        text: 'Candidates warrant that all information provided—including employment tenure, educational degrees, and CTC slips—is true, complete, and verifiable. Falsification of credentials results in immediate termination of representation and permanent blacklisting across the Nexa partner ecosystem.'
      },
      {
        heading: '5. Commercial Terms & Fee Structure',
        text: 'Placement fees, retainer milestones and payment schedules are defined per engagement in the executed MSA/SOW. All fees are levied exclusively on the employer — NexaTalent IT Solutions never charges candidates. Invoices are raised with GST as applicable; payment terms are 15 days from invoice unless agreed otherwise in writing.'
      },
      {
        heading: '6. Confidentiality & IP Assignment',
        text: 'Client requisitions, compensation bands and interview assessments shared during an engagement are treated as confidential. All code, IP and proprietary assets created by deployed professionals belong 100% to the client enterprise under the executed agreements.'
      },
      {
        heading: '7. Limitation of Liability & Governing Law',
        text: 'To the maximum extent permitted by law, NexaTalent IT Solutions liability per engagement is capped at the fees paid for that engagement. These terms are governed by the laws of India with exclusive jurisdiction of the courts at Mumbai, Maharashtra.'
      }
    ]
  },
  {
    id: 'cookie-policy',
    route: '/cookie-policy',
    title: 'Cookie Policy',
    icon: Eye,
    summary: 'Disclosures on essential authentication session tokens, performance analytics, and privacy-preserving cookies.',
    content: [
      {
        heading: '1. Purpose of Cookies',
        text: 'NexaTalent IT Solutions utilizes cookies and secure local storage tokens to maintain authenticated portal sessions, remember theme preferences, and optimize candidate search latency.'
      },
      {
        heading: '2. Cookie Taxonomy',
        text: 'Strictly Essential Cookies: required for secure login, OTP verification, and CSRF protection. Analytics Cookies: anonymized Google Analytics (GA4) telemetry measuring page load speed and search performance. We do not deploy third-party advertising tracking cookies.'
      },
      {
        heading: '3. Managing Your Preferences',
        text: 'Essential cookies cannot be disabled without breaking sign-in. Analytics cookies can be blocked through your browser settings with no loss of core functionality. Clearing site data signs you out of all portals.'
      },
      {
        heading: '4. Retention of Cookie Data',
        text: 'Session tokens expire on logout or after 24 hours of inactivity. Aggregated analytics are retained for 14 months and contain no personally identifiable information.'
      }
    ]
  },
  {
    id: 'accessibility',
    route: '/accessibility',
    title: 'Accessibility Statement',
    icon: CheckCircle2,
    summary: 'Commitment to universal accessibility and Web Content Accessibility Guidelines (WCAG) 2.1 Level AA conformance.',
    content: [
      {
        heading: '1. Universal Design Commitment',
        text: 'NexaTalent IT Solutions is engineered to ensure equitable access for all individuals, including persons with visual, auditory, cognitive, or motor impairments.'
      },
      {
        heading: '2. Technical Conformance',
        text: 'Our web application implements semantic HTML landmarks, ARIA labeling, high-contrast text color ratios (exceeding 4.5:1), keyboard-accessible navigation traps, and screen-reader navigable candidate scorecards.'
      },
      {
        heading: '3. Feedback & Assistance',
        text: 'Encountered an accessibility barrier? Write to info@nexatalentitsolutions.com with the page URL and assistive technology used — we acknowledge within 2 business days and prioritise remediation.'
      },
      {
        heading: '4. Ongoing Review',
        text: 'Accessibility is reviewed on every release cycle, including keyboard-only walkthroughs and contrast audits of new templates, forms and portal workspaces.'
      }
    ]
  },
  {
    id: 'data-protection',
    route: '/data-protection',
    title: 'Data Protection & Non-Solicitation',
    icon: ShieldCheck,
    summary: 'Enterprise IP security guarantees, confidential candidate dossier protection, and bilateral anti-poaching protocols.',
    content: [
      {
        heading: '1. Intellectual Property & Code Assessment Protection',
        text: 'All proprietary technical challenges, coding assessments, and architecture rubrics shared during interview processes remain the intellectual property of their respective owners. NexaTalent IT Solutions never stores candidate proprietary code for commercial resale.'
      },
      {
        heading: '2. Bilateral Anti-Poaching Guarantee',
        text: 'NexaTalent IT Solutions strictly honors enterprise anti-poaching commitments. We do not proactively recruit, solicit, or headhunt employees from active enterprise clients with whom an operative MSA is in place.'
      },
      {
        heading: '3. Candidate Dossier Confidentiality',
        text: 'Candidate dossiers — resumes, compensation records, assessment transcripts — are shared with a prospective employer only after explicit candidate consent, and solely for evaluating that specific mandate.'
      },
      {
        heading: '4. Data Security Controls',
        text: 'Role-based portal access, audit-logged dossier views, encrypted storage and NDAs for every recruiter and sub-vendor protect enterprise and candidate data end to end.'
      },
      {
        heading: '5. Reporting Misuse',
        text: 'Suspected misuse of confidential hiring data can be reported to info@nexatalentitsolutions.com. Verified breaches trigger contractual remedies and, where applicable, criminal proceedings under the IT Act, 2000.'
      }
    ]
  },
  {
    id: 'disclaimer',
    route: '/disclaimer',
    title: 'Legal & Recruitment Disclaimer',
    icon: AlertCircle,
    summary: 'Statutory ethical recruitment representations and absolute Candidate Zero-Fee Guarantee.',
    content: [
      {
        heading: '1. Absolute Candidate Zero-Fee Guarantee',
        text: 'NexaTalent IT Solutions operates under a strict, uncompromised ethical recruitment code. NexaTalent IT Solutions NEVER charges any fee, registration charge, security deposit, documentation fee, or background verification fee from candidates or jobseekers. All recruitment fees are compensated exclusively by corporate employers.'
      },
      {
        heading: '2. Fraud Warning & Impersonation Advisory',
        text: 'Any individual, agency, or communication soliciting money, UPI payments, or gift cards under the NexaTalent IT Solutions name is fraudulent. Please report any fraudulent activity immediately to legal@nexatalent.com for criminal prosecution under Section 66D of the IT Act.'
      },
      {
        heading: '3. No Guarantee of Placement',
        text: 'Participation in NexaTalent IT Solutions candidate screening, resume parsing, or interview scheduling does not constitute an express or implied guarantee of employment, visa issuance, or offer release. Final hiring decisions rest exclusively with the respective employer organization.'
      },
      {
        heading: '4. Information Accuracy',
        text: 'Salary benchmarks, hiring timelines and market insights published on this website are directional guidance compiled from live mandate data — not offers, quotations or contractual commitments. Confirm specifics with your practice lead before budgeting.'
      }
    ]
  }
];

export function LegalPage() {
  const location = useLocation();
  const currentPath = location.pathname;

  const initialSection = LEGAL_SECTIONS.find((s) => s.route === currentPath) || LEGAL_SECTIONS[0];
  const [activeTab, setActiveTab] = useState(initialSection.id);

  useEffect(() => {
    const matched = LEGAL_SECTIONS.find((s) => s.route === location.pathname);
    if (matched) {
      setActiveTab(matched.id);
    }
  }, [location.pathname]);

  const activeDoc = LEGAL_SECTIONS.find((s) => s.id === activeTab) || LEGAL_SECTIONS[0];

  return (
    <div
      className="font-sans"
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
        title={activeDoc.title}
        description={activeDoc.summary}
        canonicalPath={activeDoc.route}
        keywords={`NexaTalent IT Solutions ${activeDoc.title}, DPDP Act India, Recruitment Legal Terms, Non-Solicitation Agreement, Candidate Zero Fee Guarantee`}
      />

      <SiteNavbar />

      {/* Hero Header */}
      <section style={{
        position: 'relative',
        paddingTop: '5.5rem',
        paddingBottom: '2rem',
        background: '#ffffff',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#000000', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ color: '#000000', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span>Legal & Governance</span>
            <ChevronRight size={14} />
            <span style={{ color: '#000000', fontWeight: 600 }}>{activeDoc.title}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                backgroundColor: '#000000',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '0.65rem'
              }}>
                <ShieldCheck size={13} />
                <span>Statutory Governance Documentation • Enterprise Compliance & DPDP 2023</span>
              </div>
              <h1 style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#000000',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginBottom: '0.35rem'
              }}>
                {activeDoc.title}
              </h1>
              <p style={{ color: '#000000', fontSize: '0.85rem' }}>
                Governing Entity: NexaTalent IT Solutions Pvt. Ltd. (CIN: U72200MH2021PTC145678) • Last Revised: October 2026
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '10px',
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Printer size={15} />
              <span>Print Official Copy</span>
            </button>
          </div>

        </div>
      </section>

      {/* Main Layout */}
      <section style={{ padding: '2.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Sidebar Menu */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            position: 'sticky',
            top: '6rem'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#000000', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
              Statutory Documentation Suite
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {LEGAL_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <Link
                    key={sec.id}
                    to={sec.route}
                    onClick={() => setActiveTab(sec.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: isActive ? '#000000' : 'transparent',
                      color: isActive ? '#ffffff' : '#000000',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={16} color={isActive ? '#ffffff' : '#000000'} />
                    <span>{sec.title}</span>
                  </Link>
                );
              })}
            </div>

            {/* Quick Clause TOC Jump Links */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#000000', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                On This Page Clauses:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {activeDoc.content.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#clause-${idx}`}
                    style={{ fontSize: '0.75rem', color: '#000000', textDecoration: 'none', fontWeight: 600 }}
                  >
                    • {item.heading.split('.')[0]}. {item.heading.split('.')[1] || item.heading}
                  </a>
                ))}
              </div>
            </div>

            {/* Entity Verification Card */}
            <div style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: '14px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#000000', marginBottom: '0.5rem' }}>
                <Building2 size={16} color="#000000" />
                <span>Corporate Verification</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#000000', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div><strong>Entity:</strong> NEXA TALENT IT SOLUTIONS PRIVATE LIMITED</div>
                <div><strong>CIN:</strong> U72200MH2021PTC145678</div>
                <div><strong>Location:</strong> Skyline Icon, Marol, Mumbai 400059</div>
                <div><strong>Email:</strong> info@nexatalentitsolutions.com</div>
              </div>
            </div>
          </div>

          {/* Right: Policy Document Body */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            padding: '2rem',
            boxShadow: '0 4px 25px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              padding: '0.85rem 1.1rem',
              borderRadius: '12px',
              backgroundColor: '#fafafa',
              border: '1px solid #000000',
              marginBottom: '1.5rem',
              color: '#000000',
              fontSize: '0.85rem',
              fontWeight: 500,
              lineHeight: 1.55
            }}>
              {activeDoc.summary}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {activeDoc.content.map((sec, idx) => (
                <div key={sec.heading} id={`clause-${idx}`} style={{ scrollMarginTop: '6rem' }}>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#000000', marginBottom: '0.35rem' }}>
                    {sec.heading}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#1a1a1a', lineHeight: 1.65 }}>
                    {sec.text}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#000000' }}>
                Jurisdiction: High Court of Bombay, Mumbai, Maharashtra, India. Governed under the laws of the Republic of India.
              </div>
              <Link
                to="/contact"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#000000',
                  textDecoration: 'none'
                }}
              >
                Statutory Escalation & Inquiries →
              </Link>
            </div>
          </div>

        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

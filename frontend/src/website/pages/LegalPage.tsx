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
        text: 'NEXA TALENT IT SOLUTIONS PRIVATE LIMITED ("NexaTalent IT Solutions", "we", "us", "our") operates as a Data Fiduciary under the Digital Personal Data Protection (DPDP) Act, 2023. Corporate Identification Number (CIN): U72200MH2021PTC145678. Registered Office: 4th and 7th Floor, Skyline Icon, Andheri - Kurla Rd, Chimatpada, Marol, Andheri East, Mumbai, Maharashtra 400059, India. Executive Email: ceo@nexatalentitsolution.com.'
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
        heading: '5. Grievance Redressal & Data Protection Officer',
        text: 'In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and DPDP Act 2023, the appointed Data Protection Officer is: Executive Compliance Desk, NEXA TALENT IT SOLUTIONS PRIVATE LIMITED, 4th and 7th Floor, Skyline Icon, Andheri - Kurla Rd, Marol, Andheri East, Mumbai 400059. Direct Grievance Email: ceo@nexatalentitsolution.com. Phone: +91 70196 96166. Acknowledgement SLA: within 24 hours; resolution within 15 working days.'
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
        paddingTop: '7.5rem', 
        paddingBottom: '3.5rem', 
        background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
            <Link to="/" style={{ color: '#64748B', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span>Legal & Governance</span>
            <ChevronRight size={14} />
            <span style={{ color: '#4361EE', fontWeight: 600 }}>{activeDoc.title}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.3rem 0.8rem',
                borderRadius: '6px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '0.75rem'
              }}>
                <ShieldCheck size={14} />
                <span>Statutory Governance Documentation • ISO 27001 & DPDP 2023</span>
              </div>
              <h1 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 800,
                color: '#0B132B',
                lineHeight: 1.2,
                marginBottom: '0.5rem'
              }}>
                {activeDoc.title}
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                Governing Entity: NexaTalent IT Solutions Pvt. Ltd. (CIN: U72200KA2021PTC145678) • Last Revised: September 2026
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
                border: '1px solid #CBD5E1',
                backgroundColor: '#ffffff',
                color: '#334155',
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
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          
          {/* Left Sidebar Menu */}
          <div style={{
            backgroundColor: '#F8FAFC',
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            position: 'sticky',
            top: '6rem'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem', paddingLeft: '0.5rem' }}>
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
                      backgroundColor: isActive ? '#EEF2FF' : 'transparent',
                      color: isActive ? '#4361EE' : '#334155',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={16} color={isActive ? '#4361EE' : '#64748B'} />
                    <span>{sec.title}</span>
                  </Link>
                );
              })}
            </div>

            {/* Quick Clause TOC Jump Links */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                On This Page Clauses:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {activeDoc.content.map((item, idx) => (
                  <a
                    key={idx}
                    href={`#clause-${idx}`}
                    style={{ fontSize: '0.75rem', color: '#4361EE', textDecoration: 'none', fontWeight: 600 }}
                  >
                    • {item.heading.split('.')[0]}. {item.heading.split('.')[1] || item.heading}
                  </a>
                ))}
              </div>
            </div>

            {/* Entity Verification Card */}
            <div style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: '14px', backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#0B132B', marginBottom: '0.5rem' }}>
                <Building2 size={16} color="#0265FF" />
                <span>Corporate Verification</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div><strong>Entity:</strong> NEXA TALENT IT SOLUTIONS PRIVATE LIMITED</div>
                <div><strong>CIN:</strong> U72200MH2021PTC145678</div>
                <div><strong>Location:</strong> Skyline Icon, Marol, Mumbai 400059</div>
                <div><strong>Email:</strong> ceo@nexatalentitsolution.com</div>
              </div>
            </div>
          </div>

          {/* Right: Policy Document Body */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            padding: '3rem',
            boxShadow: '0 4px 25px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              padding: '1.25rem',
              borderRadius: '14px',
              backgroundColor: '#EEF2FF',
              border: '1px solid #C7D2FE',
              marginBottom: '2.5rem',
              color: '#1E1B4B',
              fontSize: '0.95rem',
              fontWeight: 500,
              lineHeight: 1.6
            }}>
              {activeDoc.summary}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {activeDoc.content.map((sec, idx) => (
                <div key={sec.heading} id={`clause-${idx}`} style={{ scrollMarginTop: '6rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B132B', marginBottom: '0.75rem' }}>
                    {sec.heading}
                  </h2>
                  <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.8 }}>
                    {sec.text}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '3.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                Jurisdiction: High Court of Karnataka, Bengaluru, India. Governed under the laws of the Republic of India.
              </div>
              <Link
                to="/contact"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#4361EE',
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

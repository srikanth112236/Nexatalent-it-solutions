import React, { useState } from 'react';
import { Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MegaFooter: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  return (
    <footer
      style={{
        backgroundColor: '#090d16',
        borderTop: '1px solid var(--color-border)',
        padding: '5rem 2rem 3rem 2rem',
        position: 'relative',
        color: 'var(--color-text-secondary)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Newsletter & Dispatch Bar */}
        <div
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-2xl)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            marginBottom: '4.5rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.4rem' }}>
              Subscribe to the Engineering Talent Index
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: '500px' }}>
              Bi-weekly technical compensation benchmarks, GCC scaling analysis, and hiring velocity reports read by 14,000+ engineering leaders.
            </p>
          </div>

          {subscribed ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--color-success)',
                fontWeight: 600,
                fontSize: '0.9375rem',
              }}
            >
              <CheckCircle2 size={20} />
              <span>Subscription Confirmed. Welcome to the Index.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="email"
                required
                placeholder="engineering.leader@company.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '0.875rem',
                  minWidth: '280px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <span>Subscribe</span>
                <Send size={14} />
              </button>
            </form>
          )}
        </div>

        {/* 5-Column Mega Navigation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem',
          }}
        >
          {/* Col 1: Solutions */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Solutions
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/solutions/contingent" style={{ color: 'inherit', textDecoration: 'none' }}>Contingent Search</Link></li>
              <li><Link to="/solutions/retained" style={{ color: 'inherit', textDecoration: 'none' }}>Retained Executive Search</Link></li>
              <li><Link to="/solutions/gcc" style={{ color: 'inherit', textDecoration: 'none' }}>GCC Turnkey Incubation</Link></li>
              <li><Link to="/solutions/screening" style={{ color: 'inherit', textDecoration: 'none' }}>Technical Screening as a Service</Link></li>
              <li><Link to="/employers" style={{ color: 'inherit', textDecoration: 'none' }}>Employer Portal & SLAs</Link></li>
            </ul>
          </div>

          {/* Col 2: Verticals */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Practices
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/industries/fintech" style={{ color: 'inherit', textDecoration: 'none' }}>FinTech & High Frequency</Link></li>
              <li><Link to="/industries/ai-ml" style={{ color: 'inherit', textDecoration: 'none' }}>AI & Foundation Models</Link></li>
              <li><Link to="/industries/cloud-native" style={{ color: 'inherit', textDecoration: 'none' }}>Cloud Native & SRE</Link></li>
              <li><Link to="/industries/healthtech" style={{ color: 'inherit', textDecoration: 'none' }}>HealthTech & Bio</Link></li>
              <li><Link to="/industries/automotive" style={{ color: 'inherit', textDecoration: 'none' }}>Automotive & Mobility</Link></li>
            </ul>
          </div>

          {/* Col 3: Hub Locations */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Global Hubs
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/locations/bangalore" style={{ color: 'inherit', textDecoration: 'none' }}>Bangalore, India</Link></li>
              <li><Link to="/locations/hyderabad" style={{ color: 'inherit', textDecoration: 'none' }}>Hyderabad, India</Link></li>
              <li><Link to="/locations/pune" style={{ color: 'inherit', textDecoration: 'none' }}>Pune, India</Link></li>
              <li><Link to="/locations/london" style={{ color: 'inherit', textDecoration: 'none' }}>London, UK</Link></li>
              <li><Link to="/locations/san-francisco" style={{ color: 'inherit', textDecoration: 'none' }}>San Francisco, US</Link></li>
              <li><Link to="/jobs?location=remote" style={{ color: 'inherit', textDecoration: 'none' }}>Global Asynchronous Remote</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Portals */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Platform Portals
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/portals/employer" style={{ color: 'inherit', textDecoration: 'none' }}>Employer Client Portal</Link></li>
              <li><Link to="/portals/candidate" style={{ color: 'inherit', textDecoration: 'none' }}>Candidate Passport</Link></li>
              <li><Link to="/portals/recruiter" style={{ color: 'inherit', textDecoration: 'none' }}>Recruiter Workspace</Link></li>
              <li><Link to="/portals/superadmin" style={{ color: 'inherit', textDecoration: 'none' }}>SuperAdmin Console</Link></li>
              <li><Link to="/components" style={{ color: 'inherit', textDecoration: 'none' }}>Component Library (All 40)</Link></li>
            </ul>
          </div>

          {/* Col 5: Company & Compliance */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Trust & Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li><Link to="/case-studies" style={{ color: 'inherit', textDecoration: 'none' }}>Client Case Studies</Link></li>
              <li><Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Candidate Privacy Charter</Link></li>
              <li><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Service Level Agreement (SLA)</Link></li>
              <li><Link to="/security" style={{ color: 'inherit', textDecoration: 'none' }}>SOC-2 Type II Attestation</Link></li>
              <li><Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Escalation & Support</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            fontSize: '0.8125rem',
            color: 'var(--color-text-tertiary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
              NexaTalent Operating System
            </span>
            <span>© {new Date().getFullYear()} NexaTalent Inc. All rights reserved.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-success)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
              <span>SLA Core Systems Operational (99.98%)</span>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={14} color="var(--color-primary-400)" />
              ISO 27001 Certified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

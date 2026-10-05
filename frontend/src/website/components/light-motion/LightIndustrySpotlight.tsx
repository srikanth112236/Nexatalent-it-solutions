import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LightIndustrySpotlight: React.FC = () => {
  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface, #ffffff)',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              fontSize: '0.8125rem',
              fontWeight: 800,
              color: '#2563eb',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            <span>NEXATALENT VERTICAL PRACTICE SPOTLIGHT</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
            Low-Latency Systems & High-Frequency Trading
          </h2>
          <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Inside our fastest-moving technical recruitment practice: placing sub-microsecond systems engineers.
          </p>
        </div>

        {/* 2-Column Split */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em' }}>
              CALIBRATED COMPETENCY PROFILE
            </span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', lineHeight: 1.25, marginTop: '0.5rem', marginBottom: '1rem' }}>
              Kernel Bypass, Solarflare & C++20 Specialists
            </h3>
            <p style={{ color: 'var(--nt-muted, #475569)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              We test cache-line padding, SIMD vectorization, memory barrier semantics, and network interface bypass protocols. Zero generic software engineers; only proven quantitative builders.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
              {[
                'Demonstrated production experience below 1-microsecond execution loops',
                'Deep knowledge of Solarflare OpenOnload and DPDK packet engines',
                'Forensic verification of lock-free queue implementations',
                '48-hour shortlist guarantee of 3 verified Principal candidates',
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9375rem', color: 'var(--nt-ink-2, #1e293b)' }}>
                  <CheckCircle2 size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Link
              to="/employers?practice=fintech"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
              }}
            >
              <span>Request FinTech Mandate Shortlist</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right Visual Stats Card */}
          <div
            style={{
              backgroundColor: 'var(--nt-surface-2, #f8fafc)',
              borderRadius: '24px',
              border: '1px solid #cbd5e1',
              padding: '3rem 2.5rem',
              textAlign: 'center',
              boxShadow: '0 20px 45px -15px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Zap size={28} />
            </div>

            <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', lineHeight: 1 }}>
              Low-Latency
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--nt-muted, #64748b)', marginTop: '0.5rem', textTransform: 'uppercase' }}>
              FinTech Systems Practice
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--nt-border, #e2e8f0)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)' }}>Structured</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--nt-muted, #64748b)', marginTop: '0.2rem' }}>Shortlist Workflow</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a' }}>90 Days</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--nt-muted, #64748b)', marginTop: '0.2rem' }}>Replacement Escrow</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.8125rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Full SLA Escrow Guarantee Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

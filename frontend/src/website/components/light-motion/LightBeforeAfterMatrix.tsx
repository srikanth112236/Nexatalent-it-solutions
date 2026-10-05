import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, XCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

const comparisons = [
  {
    feature: 'Sourcing Methodology',
    traditional: 'Keyword searches on LinkedIn, spamming passive engineers with irrelevant InMails',
    nexatalent: 'Semantic vector parsing of actual GitHub PRs, system design talks & concurrency commits',
  },
  {
    feature: 'Technical Vetting',
    traditional: 'Non-technical screening with limited code comprehension',
    nexatalent: 'Practitioner panel conducting structured system design scorecards',
  },
  {
    feature: 'Shortlist Flow',
    traditional: 'Long silences, black-box waiting, and unfiltered resume dumps',
    nexatalent: 'Calibrated shortlist delivery with documented evaluation criteria',
  },
  {
    feature: 'Placement Terms',
    traditional: 'Partial credit arrangements with restrictive clauses',
    nexatalent: 'Defined replacement terms with priority escalation paths',
  },
  {
    feature: 'Client Transparency',
    traditional: 'Opaque email threads, missed calendar invites, and zero candidate telemetry',
    nexatalent: 'Synchronous employer portal with stage progress and interview links',
  },
];

export const LightBeforeAfterMatrix: React.FC = () => {
  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface, #ffffff)',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1150px', margin: '0 auto', textAlign: 'center' }}>
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
          <span>NEXATALENT OPERATING SYSTEM ADVANTAGE</span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
          Conventional Agency vs. NexaTalent IT Solutions Platform
        </h2>
        <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto 4rem auto', lineHeight: 1.6 }}>
          See how our deterministic engineering infrastructure eliminates traditional recruiter failure modes.
        </p>

        {/* Matrix Comparison Table */}
        <div
          style={{
            borderRadius: '24px',
            border: '1px solid var(--nt-border, #e2e8f0)',
            overflow: 'hidden',
            boxShadow: '0 20px 45px -15px rgba(0,0,0,0.06)',
            textAlign: 'left',
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 2fr 2fr',
              backgroundColor: 'var(--nt-surface-2, #f8fafc)',
              borderBottom: '2px solid var(--nt-border, #e2e8f0)',
              padding: '1.25rem 2rem',
              fontWeight: 800,
              fontSize: '0.875rem',
              color: 'var(--nt-ink-2, #334155)',
            }}
          >
            <div>OPERATIONAL DIMENSION</div>
            <div style={{ color: '#ef4444' }}>CONVENTIONAL RECRUITER</div>
            <div style={{ color: '#2563eb' }}>NEXATALENT IT SOLUTIONS OPERATING SYSTEM</div>
          </div>

          {/* Rows */}
          {comparisons.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 2fr 2fr',
                padding: '1.5rem 2rem',
                borderBottom: idx < comparisons.length - 1 ? '1px solid var(--nt-border, #e2e8f0)' : 'none',
                backgroundColor: idx % 2 === 0 ? 'var(--nt-surface, #ffffff)' : '#fcfdfd',
                alignItems: 'center',
                gap: '1.5rem',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--nt-ink, #0f172a)' }}>
                {item.feature}
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--nt-muted, #64748b)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item.traditional}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--nt-ink, #0f172a)', fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.5, backgroundColor: '#eff6ff', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                <CheckCircle2 size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{item.nexatalent}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ marginTop: '2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 700, fontSize: '0.875rem' }}>
          <ShieldCheck size={18} />
          <span>Every mandate run on structured screening with defined terms</span>
        </div>
      </div>
    </section>
  );
};

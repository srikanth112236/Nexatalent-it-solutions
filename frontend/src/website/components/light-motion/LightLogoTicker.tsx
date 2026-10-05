import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const logos = [
  'AlphaFin HFT', 'OmniCloud Labs', 'Foundry Neural', 'Stripe GCC',
  'Databricks Hub', 'Brex Engineering', 'Monzo Core', 'Ramp Systems',
  'Snowflake India', 'Coinbase Infra', 'Notion Labs', 'Figma Systems'
];

export const LightLogoTicker: React.FC = () => {
  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface, #ffffff)',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        padding: '3.5rem 2rem',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#2563eb',
            marginBottom: '0.75rem',
          }}
        >
          <Sparkles size={13} />
          <span>NEXATALENT CLIENT PARTNERSHIPS</span>
        </div>
        <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--nt-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Trusted by Tier-1 Engineering Leaders & Venture-Backed Unicorns
        </p>
      </div>

      {/* Marquee Row 1 */}
      <div style={{ display: 'flex', overflow: 'hidden', userSelect: 'none', gap: '2rem', marginBottom: '1.25rem' }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
          style={{ display: 'flex', gap: '2rem', flexShrink: 0 }}
        >
          {[...logos, ...logos].map((logo, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.85rem 1.75rem',
                borderRadius: '14px',
                backgroundColor: 'var(--nt-surface-2, #f8fafc)',
                border: '1px solid var(--nt-border, #e2e8f0)',
                color: 'var(--nt-ink-2, #334155)',
                fontWeight: 800,
                fontSize: '0.9375rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              {logo}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Marquee Row 2 (Reverse) */}
      <div style={{ display: 'flex', overflow: 'hidden', userSelect: 'none', gap: '2rem' }}>
        <motion.div
          animate={{ x: ['-50%', '0%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 28 }}
          style={{ display: 'flex', gap: '2rem', flexShrink: 0 }}
        >
          {[...logos, ...logos].reverse().map((logo, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.85rem 1.75rem',
                borderRadius: '14px',
                backgroundColor: 'var(--nt-surface-2, #f8fafc)',
                border: '1px solid var(--nt-border, #e2e8f0)',
                color: 'var(--nt-ink-2, #334155)',
                fontWeight: 800,
                fontSize: '0.9375rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              {logo}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

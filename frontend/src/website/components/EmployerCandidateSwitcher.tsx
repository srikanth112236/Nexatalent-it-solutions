import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../shared/primitives';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface SwitcherOption {
  title: string;
  description: string;
  benefits: string[];
  ctaLabel: string;
  ctaLink: string;
  tag: string;
}

export const EmployerCandidateSwitcher: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'employer' | 'candidate'>('employer');

  const content: Record<'employer' | 'candidate', SwitcherOption> = {
    employer: {
      title: 'Accelerate Hiring with Pre-Qualified Specialists',
      description: 'Zero resume spam. Review candidate technical portfolios, code architectures, and verified salary parameters within 48 to 72 hours of qualification.',
      benefits: [
        'Dedicated senior technical recruiter & sector talent advisor',
        'Pre-vetted engineering & product portfolios',
        'Transparent compensation benchmarks & interview scheduling',
        'Full replacement warranty on permanent placements',
      ],
      ctaLabel: 'Request Talent Requisition',
      ctaLink: '/employers',
      tag: 'For Employers & Engineering Directors',
    },
    candidate: {
      title: 'Access Unlisted Senior Engineering & Leadership Mandates',
      description: 'Connect directly with hiring decision makers at venture-backed scaleups, Fortune 500 tech teams, and high-growth global GCC operations.',
      benefits: [
        'Confidential representation to vetted engineering teams',
        'Direct compensation transparency before interview stage',
        'Comprehensive technical and architectural interview prep',
        'Long-term career advisement and executive placement',
      ],
      ctaLabel: 'Explore Career Opportunities',
      ctaLink: '/jobs',
      tag: 'For Senior Developers & Tech Leaders',
    },
  };

  const current = content[activeTab];

  return (
    <section style={{ maxWidth: '1100px', margin: '4rem auto', padding: '0 2rem' }}>
      {/* 21st.dev Style Sliding Pill Switcher with Framer Motion layoutId */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            padding: '5px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--color-border)',
            position: 'relative',
          }}
        >
          {(['employer', 'candidate'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  position: 'relative',
                  padding: '0.625rem 1.75rem',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: isActive ? 'var(--nt-surface, #ffffff)' : 'var(--color-text-muted)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: 'color 0.2s ease',
                  fontFamily: 'var(--font-family-sans)',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSwitcherPill"
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 32,
                    }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: 'var(--radius-pill)',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
                      zIndex: -1,
                    }}
                  />
                )}
                {tab === 'employer' ? 'I am Hiring Talent' : 'I am Exploring Roles'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Surface Card with dynamic animated content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          transition={{ duration: 0.35, ease: motionTokens.ease.standard }}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--color-border)',
            padding: '3rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {current.tag}
            </span>
            <h3 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, margin: '0.75rem 0 1rem 0', color: '#ffffff' }}>
              {current.title}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              {current.description}
            </p>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link to={current.ctaLink} style={{ textDecoration: 'none', display: 'inline-block' }}>
                <Button variant="primary" size="lg">
                  {current.ctaLabel} &rarr;
                </Button>
              </Link>
            </motion.div>
          </div>

          <div style={{ backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--color-border-subtle)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Core Advantages
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {current.benefits.map((b, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.3 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.925rem', color: 'var(--color-text)' }}
                >
                  <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>✓</span>
                  <span>{b}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../shared/primitives';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface AnimatedHeroProps {
  badgeText?: string;
  headline?: string;
  subheadline?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  metrics?: Array<{ label: string; value: string }>;
}

export const AnimatedHero: React.FC<AnimatedHeroProps> = ({
  badgeText = 'NexaTalent IT Solutions Intelligence Operating System',
  headline = 'Precision Hiring Powered by Global Tech Architecture',
  subheadline = 'Connecting venture-backed enterprises, scale-ups, and global GCC hubs with verified elite engineering and leadership talent.',
  primaryCtaText = 'Request Specialist Talent',
  primaryCtaLink = '/employers',
  secondaryCtaText = 'Browse Open Roles',
  secondaryCtaLink = '/jobs',
  metrics = [
    { label: 'Verified Engineers', value: '45,000+' },
    { label: 'Avg Sourcing Time', value: '4.2 Days' },
    { label: 'Shortlist Acceptance', value: '94%' },
  ],
}) => {
  return (
    <section
      style={{
        position: 'relative',
        padding: '7rem 2rem 5rem 2rem',
        overflow: 'hidden',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.18), transparent 70%)',
      }}
    >
      {/* Background Grid Pattern (Aceternity style with breathing glow) */}
      <motion.div
        animate={{
          opacity: [0.6, 0.9, 0.6],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
        {/* Glow Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: motionTokens.ease.emphasis }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '0.4rem 1.25rem',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            color: 'var(--color-primary-400)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '2rem',
            boxShadow: '0 0 25px rgba(59, 130, 246, 0.25)',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}
          />
          <span>{badgeText}</span>
        </motion.div>

        {/* Headline with Staggered Entrance */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: motionTokens.ease.standard }}
          style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.75rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.035em',
            marginBottom: '1.5rem',
            color: '#ffffff',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          {headline}
        </motion.h1>

        {/* Subheadline with Drift */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28, ease: motionTokens.ease.standard }}
          style={{
            fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto',
          }}
        >
          {subheadline}
        </motion.p>

        {/* Action Buttons with Spring Hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: motionTokens.ease.standard }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}
        >
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link to={primaryCtaLink} style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="lg">
                {primaryCtaText} &rarr;
              </Button>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link to={secondaryCtaLink} style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="lg">
                {secondaryCtaText}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Metric Strip with Staggered Items */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.65, delay: 0.2, ease: motionTokens.ease.standard }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            padding: '1.75rem 2rem',
            backgroundColor: 'rgba(17, 23, 38, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
          }}
        >
          {metrics.map((m, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
              whileHover={{ y: -3 }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
                {m.value}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-primary-400)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                {m.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

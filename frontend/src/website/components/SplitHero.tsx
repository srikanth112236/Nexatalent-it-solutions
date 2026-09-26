import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Badge } from '../../shared/primitives';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface SplitHeroProps {
  tagline?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const SplitHero: React.FC<SplitHeroProps> = ({
  tagline = 'Human Rigor + Systematic Scale',
  title = 'The Intelligent Hiring Engine for Modern Engineering Teams',
  description = 'Eliminate recruitment noise with pre-assessed, validated technology specialists delivered straight into your pipeline with zero agency friction.',
  ctaText = 'Start Hiring Campaign',
  ctaLink = '/employers',
}) => {
  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 2rem', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
        {/* Left Column: Copy with Staggered Entrance */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: motionTokens.ease.standard }}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Badge variant="accent" style={{ marginBottom: '1.25rem' }}>{tagline}</Badge>
          </motion.div>

          <h1
            style={{
              fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
              color: '#ffffff',
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            {description}
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link to={ctaLink} style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg">{ctaText} &rarr;</Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link to="/about" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="lg">How We Verify</Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Column: Aceternity 3D-Tilt Interactive Scorecard Card */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: motionTokens.ease.emphasis }}
          whileHover={{
            rotateY: 4,
            rotateX: -4,
            scale: 1.015,
            transition: { duration: 0.3 },
          }}
          style={{
            position: 'relative',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            padding: '2.25rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.15)',
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Radial Spotlight */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.15, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-20%',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary-400)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                }}
              >
                NT
              </motion.div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>Candidate Quality Index</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
                  Verified Pipeline Calibration
                </div>
              </div>
            </div>
            <Badge variant="success">98.2% Accuracy</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
            {/* Skill Bar 1 */}
            <div style={{ padding: '1.125rem', backgroundColor: 'rgba(15, 23, 42, 0.65)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Architecture & Distributed Consensus</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Top 2% (Percentile 98)</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '96%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.2, ease: motionTokens.ease.standard }}
                  style={{ height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: '3px' }}
                />
              </div>
            </div>

            {/* Skill Bar 2 */}
            <div style={{ padding: '1.125rem', backgroundColor: 'rgba(15, 23, 42, 0.65)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Production Incident Leadership & SRE</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>Top 5% (Percentile 95)</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '92%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.35, ease: motionTokens.ease.standard }}
                  style={{ height: '100%', backgroundColor: '#38bdf8', borderRadius: '3px' }}
                />
              </div>
            </div>

            {/* Skill Bar 3 */}
            <div style={{ padding: '1.125rem', backgroundColor: 'rgba(15, 23, 42, 0.65)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Notice Period & Retention Reliability</span>
                <span style={{ color: 'var(--color-primary-400)', fontWeight: 700 }}>100% Guaranteed</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: 0.5, ease: motionTokens.ease.standard }}
                  style={{ height: '100%', backgroundColor: 'var(--color-success)', borderRadius: '3px' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

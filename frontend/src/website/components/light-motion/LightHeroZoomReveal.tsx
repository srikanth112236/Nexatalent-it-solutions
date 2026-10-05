import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motionTokens } from '../../../shared/motion/motionTokens';

export interface LightHeroZoomRevealProps {
  badge?: string;
  headline?: string;
  highlightText?: string;
  subtitle?: string;
}

export const LightHeroZoomReveal: React.FC<LightHeroZoomRevealProps> = ({
  badge = 'C01 · C03 · C09 · C10 Shortlist Pattern',
  headline = 'Engineered for High-Stakes',
  highlightText = 'Technical Leadership',
  subtitle = 'Transforming executive recruiting from black-box keyword matching into deterministic, calibrated engineering placement.',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax and zoom transforms
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const scaleZoom = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface-2, #f8fafc)',
        color: 'var(--nt-ink, #0f172a)',
        padding: '6rem 2rem 5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.12), rgba(248, 250, 252, 1))',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        {/* C01 / Micro Badge Entrance */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.standard }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            color: '#2563eb',
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
          }}
        >
          <Sparkles size={14} />
          <span>{badge}</span>
        </motion.div>

        {/* C10 Text Line Reveal */}
        <div style={{ overflow: 'hidden', marginBottom: '0.5rem' }}>
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease.standard }}
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              color: 'var(--nt-ink, #0f172a)',
            }}
          >
            {headline}
          </motion.h1>
        </div>

        <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
          <motion.h2
            initial={{ y: '100%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: motionTokens.duration.slow, delay: 0.1, ease: motionTokens.ease.standard }}
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {highlightText}
          </motion.h2>
        </div>

        {/* Subtitle with fade + translate (C01) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.standard, delay: 0.2 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--nt-muted, #475569)',
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.standard, delay: 0.3 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}
        >
          <Link
            to="/employers"
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
              boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Request Shortlist (48h SLA)</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/jobs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--nt-surface, #ffffff)',
              color: 'var(--nt-ink-2, #334155)',
              padding: '0.875rem 1.75rem',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <span>Explore Mandates</span>
          </Link>
        </motion.div>

        {/* C09 Center Zoom & Parallax Interactive Showcase Card */}
        <motion.div
          style={{
            y: yParallax,
            scale: scaleZoom,
            maxWidth: '1020px',
            margin: '0 auto',
            borderRadius: '24px',
            backgroundColor: 'var(--nt-surface, #ffffff)',
            border: '1px solid var(--nt-border, #e2e8f0)',
            padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Deterministic Screening Engine
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)' }}>
                Principal Distributed Database Architect Calibration
              </h3>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8125rem', color: '#059669', fontWeight: 700 }}>
              <CheckCircle2 size={15} />
              <span>98.4% DNA Calibration Match</span>
            </div>
          </div>

          {/* Interactive Metric Strip inside Lighter Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--nt-surface-2, #f8fafc)', borderRadius: '16px', border: '1px solid var(--nt-border, #e2e8f0)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--nt-muted, #64748b)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                <Zap size={14} color="#2563eb" />
                <span>Turnaround Velocity</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)' }}>38 Hours</div>
              <div style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: 600 }}>10h ahead of SLA</div>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--nt-surface-2, #f8fafc)', borderRadius: '16px', border: '1px solid var(--nt-border, #e2e8f0)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--nt-muted, #64748b)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                <Shield size={14} color="#0891b2" />
                <span>Replacement Warranty</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)' }}>90 Days</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--nt-muted, #64748b)' }}>Unconditional escrow backed</div>
            </div>

            <div style={{ padding: '1.25rem', backgroundColor: 'var(--nt-surface-2, #f8fafc)', borderRadius: '16px', border: '1px solid var(--nt-border, #e2e8f0)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--nt-muted, #64748b)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                <Sparkles size={14} color="#a855f7" />
                <span>Direct Offer-to-Join</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)' }}>94.8%</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--nt-muted, #64748b)' }}>Proactive counter-offer defense</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

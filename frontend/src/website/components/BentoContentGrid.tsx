import React from 'react';
import { Cpu, ShieldCheck, Globe, Activity, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface BentoContentGridProps {
  badge?: string;
  title?: string;
  subtitle?: string;
}

export const BentoContentGrid: React.FC<BentoContentGridProps> = ({
  badge = 'Architectural Advantages',
  title = 'Engineered as an Operating System for High-Caliber Hiring',
  subtitle = 'Modular talent infrastructure built for technology leaders who cannot afford hiring misfires.',
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: motionTokens.stagger.medium, 
        delayChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: motionTokens.duration.slow, 
        ease: motionTokens.ease.outQuart || motionTokens.ease.standard 
      } 
    }
  };

  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <motion.div 
        style={{ maxWidth: '1200px', margin: '0 auto' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div style={{ textAlign: 'center', marginBottom: '3.5rem' }} variants={itemVariants}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-primary-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {badge}
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)', marginTop: '0.5rem' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0.75rem auto 0 auto' }}>
            {subtitle}
          </p>
        </motion.div>

        {/* Aceternity Bento Grid (2x2 with varying spans) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '1.5rem',
          }}
        >
          {/* Bento Item 1: Large Span (7 Cols) */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.01, rotateX: 2, rotateY: -2 }}
            style={{
              gridColumn: 'span 7',
              borderRadius: 'var(--radius-2xl)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
              perspective: 1000,
              transformStyle: 'preserve-3d',
            }}
          >
            <motion.div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--color-primary-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={motionTokens.spring.snappy}
            >
              <Cpu size={24} />
            </motion.div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
              Semantic Vector Matching Engine
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              We do not query buzzwords. Our proprietary indexing parses GitHub contributions, system concurrency limits, architecture publications, and validated compensation expectations across 45,000+ engineers.
            </p>

            {/* Terminal snippet mockup */}
            <motion.div
              style={{
                backgroundColor: 'rgba(10, 15, 29, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: '#94a3b8',
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div style={{ color: '#22c55e', marginBottom: '0.25rem' }}>
                $ nexatalent calibrate --role "Principal SRE" --stack "Rust, K8s, eBPF"
              </div>
              <motion.div 
                style={{ color: 'var(--color-text-tertiary)' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
              >
                [MATCHED] Candidate #NT-8812 · 98.6% Alignment · Calibrated by Ex-VP Eng
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bento Item 2: Medium Span (5 Cols) */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02, rotateX: 2, rotateY: 2 }}
            style={{
              gridColumn: 'span 5',
              borderRadius: 'var(--radius-2xl)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-md)',
              perspective: 1000,
            }}
          >
            <div>
              <motion.div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
                whileHover={{ scale: 1.1, rotate: -10 }}
                transition={motionTokens.spring.snappy}
              >
                <ShieldCheck size={24} />
              </motion.div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                90-Day Unconditional Guarantee
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Every senior and executive placement is insured with our strict 90-day replacement commitment. If a candidate is not the right fit, we remount the search immediately at zero additional expense.
              </p>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem' }}>
              <span>100% Contractually Enforced</span>
            </div>
          </motion.div>

          {/* Bento Item 3: Medium Span (5 Cols) */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.02, rotateX: -2, rotateY: -2 }}
            style={{
              gridColumn: 'span 5',
              borderRadius: 'var(--radius-2xl)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              perspective: 1000,
            }}
          >
            <div>
              <motion.div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(168, 85, 247, 0.15)',
                  color: '#c084fc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={motionTokens.spring.snappy}
              >
                <Globe size={24} />
              </motion.div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                Global Cross-Border Footprint
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Connecting enterprise clients across the United States, United Kingdom, and the premier Indian engineering hubs of Bangalore, Hyderabad, and Pune.
              </p>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-primary-400)', fontWeight: 600 }}>
              6 Jurisdictions · Global Relocation Support
            </div>
          </motion.div>

          {/* Bento Item 4: Large Span (7 Cols) */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, scale: 1.01, rotateX: -2, rotateY: 2 }}
            style={{
              gridColumn: 'span 7',
              borderRadius: 'var(--radius-2xl)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-md)',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)',
              perspective: 1000,
            }}
          >
            <motion.div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--color-primary-400)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
              whileHover={{ scale: 1.1, rotate: -10 }}
              transition={motionTokens.spring.snappy}
            >
              <Activity size={24} />
            </motion.div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
              Real-Time Client SLA Portal
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Never wonder where your candidates stand. Access a private, encrypted dashboard with live candidate status, feedback submission, video recording links, and SLA clocks.
            </p>
            <Link
              to="/portals/employer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-primary-400)',
                textDecoration: 'none',
              }}
            >
              <span>Explore Employer Portal Experience</span>
              <motion.div whileHover={{ x: 3, y: -3 }} transition={motionTokens.spring.snappy}>
                <ArrowUpRight size={16} />
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

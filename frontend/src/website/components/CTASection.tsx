import React, { useRef } from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface CTASectionProps {
  badge?: string;
  title?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  highlights?: string[];
}

export const CTASection: React.FC<CTASectionProps> = ({
  badge = 'Ready to Transform Your Engineering Bench?',
  title = 'Lock in Your First Elite Tech Shortlist in Under 72 Hours',
  description = 'Join over 120+ VC-backed unicorns and enterprise engineering leaders who trust NexaTalent IT Solutions for precision hiring.',
  primaryCtaText = 'Initiate Enterprise Search',
  primaryCtaLink = '/contact',
  secondaryCtaText = 'Browse Active Mandates',
  secondaryCtaLink = '/jobs',
  highlights = [
    'Zero upfront retainers for qualifying roles',
    'Guaranteed 90-day replacement warranty',
    'Pre-calibrated senior engineers only',
  ],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const words = title.split(' ');

  return (
    <section
      ref={containerRef}
      style={{
        padding: '5rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: motionTokens.duration.deliberate, ease: motionTokens.ease.emphasis }}
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.95) 70%)',
          padding: '4rem 2.5rem',
          textAlign: 'center',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Glow ambient background spot with Parallax */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            x: '-50%',
            y: yBackground,
            width: '600px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ...motionTokens.spring.gentle }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'var(--color-primary-400)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={14} />
            {badge}
          </motion.div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 800,
              color: 'var(--color-text)',
              maxWidth: '850px',
              margin: '0 auto 1.25rem auto',
              lineHeight: 1.2,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * motionTokens.stagger.small, ...motionTokens.spring.snappy }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: motionTokens.duration.slow }}
            style={{
              fontSize: '1.0625rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '650px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6,
            }}
          >
            {description}
          </motion.p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '2.5rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9, ...motionTokens.spring.bouncy }}
            >
              <Link
                to={primaryCtaLink}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    padding: '0.875rem 1.875rem',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)',
                  }}
                >
                  <span>{primaryCtaText}</span>
                  <ArrowRight size={18} />
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0, ...motionTokens.spring.bouncy }}
            >
              <Link
                to={secondaryCtaLink}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    padding: '0.875rem 1.75rem',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                >
                  <span>{secondaryCtaText}</span>
                </motion.div>
              </Link>
            </motion.div>
          </div>

          {/* Bullet Highlights */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            {highlights.map((h, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2 + idx * motionTokens.stagger.small, ...motionTokens.spring.gentle }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span>{h}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

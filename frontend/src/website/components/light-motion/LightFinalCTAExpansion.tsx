import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LightFinalCTAExpansion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // Scale expansion on scroll
  const scale = useTransform(scrollYProgress, [0, 0.9], [0.92, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.9], ['36px', '0px']);

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        padding: '5rem 0 0 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem', padding: '0 2rem' }}>
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
            fontWeight: 700,
            color: '#2563eb',
            marginBottom: '1rem',
          }}
        >
          <Sparkles size={14} />
          P10 Final CTA Expansion Pattern
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
          Ready to Upgrade Your Engineering Talent Infrastructure?
        </h2>
      </div>

      {/* Expanding CTA Surface */}
      <motion.div
        style={{
          scale,
          borderRadius,
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0369a1 100%)',
          color: '#ffffff',
          padding: '6rem 2rem 7rem 2rem',
          textAlign: 'center',
          boxShadow: '0 -20px 50px rgba(37, 99, 235, 0.2)',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
            }}
          >
            <Zap size={14} />
            Immediate Calibration SLA
          </div>

          <h3
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.5rem',
            }}
          >
            Receive 3 to 5 Calibrated Profiles in Under 48 Hours
          </h3>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 3rem auto',
            }}
          >
            Join 120+ tier-1 technology scale-ups, global enterprise GCCs, and high-frequency trading firms scaling with NexaTalent.
          </p>

          {/* Action Row */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link
              to="/employers"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#ffffff',
                color: '#1e40af',
                padding: '1rem 2.25rem',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '1.0625rem',
                textDecoration: 'none',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Submit Hiring Mandate</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/jobs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                padding: '1rem 2rem',
                borderRadius: '14px',
                fontWeight: 700,
                fontSize: '1.0625rem',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <span>Browse Open Roles</span>
            </Link>
          </div>

          {/* Trust Guarantees */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2.5rem',
              flexWrap: 'wrap',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} color="#4ade80" />
              <span>90-Day Unconditional Warranty</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={18} color="#4ade80" />
              <span>Zero Placement Fee Until Start</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={18} color="#4ade80" />
              <span>SOC-2 Type II Certified</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

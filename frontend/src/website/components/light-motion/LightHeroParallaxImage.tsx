import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Cpu, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LightHeroParallaxImage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Multilayer parallax transformations
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const foregroundImageY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const floatingCardLeftY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const floatingCardRightY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface, #ffffff)',
        color: 'var(--nt-ink, #0f172a)',
        padding: '6rem 2rem 7rem 2rem',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
      }}
    >
      {/* Background Decorative Mesh Parallax */}
      <motion.div
        style={{
          scale: bgScale,
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(37, 99, 235, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Top Text Content with Parallax */}
        <motion.div style={{ y: textY, textAlign: 'center', marginBottom: '4rem' }}>
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
            Hero Parallax & Multi-Layer Depth Scrolling
          </div>

          <h2 style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)', lineHeight: 1.15 }}>
            Precision Calibration Engineered for Scale
          </h2>

          <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.125rem', maxWidth: '680px', margin: '1rem auto 2.5rem auto', lineHeight: 1.6 }}>
            Multi-layer parallax surfaces demonstrate talent benchmarking depth with high-velocity 48-hour delivery.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
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
              }}
            >
              <span>Initiate Shortlist SLA</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>

        {/* Multi-Layer Parallax Composition Stage */}
        <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto', minHeight: '480px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* Main Central High-Res Showcase Card (Moving at normal parallax) */}
          <motion.div
            style={{
              y: foregroundImageY,
              width: '100%',
              maxWidth: '820px',
              backgroundColor: 'var(--nt-surface, #ffffff)',
              borderRadius: '28px',
              border: '1px solid #cbd5e1',
              padding: '3rem',
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.12)',
              position: 'relative',
              zIndex: 3,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--nt-border, #e2e8f0)', paddingBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)' }}>
                    NexaTalent IT Solutions Unified Intelligence Engine
                  </h3>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--nt-muted, #64748b)' }}>Real-Time Synchronization: Active</span>
                </div>
              </div>

              <span style={{ backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.8125rem', fontWeight: 800, padding: '0.3rem 0.75rem', borderRadius: '9999px' }}>
                98.6% Calibration
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--nt-surface-2, #f8fafc)', borderRadius: '16px', border: '1px solid var(--nt-border, #e2e8f0)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--nt-muted, #64748b)', textTransform: 'uppercase' }}>Time to Calibration</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2563eb', marginTop: '0.25rem' }}>36h</div>
                <div style={{ fontSize: '0.8125rem', color: '#16a34a', fontWeight: 600 }}>12h Ahead of SLA</div>
              </div>

              <div style={{ padding: '1.25rem', backgroundColor: 'var(--nt-surface-2, #f8fafc)', borderRadius: '16px', border: '1px solid var(--nt-border, #e2e8f0)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--nt-muted, #64748b)', textTransform: 'uppercase' }}>Verified Bench</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', marginTop: '0.25rem' }}>45,000+</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--nt-muted, #64748b)' }}>Top 3.5% Engineers</div>
              </div>

              <div style={{ padding: '1.25rem', backgroundColor: 'var(--nt-surface-2, #f8fafc)', borderRadius: '16px', border: '1px solid var(--nt-border, #e2e8f0)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--nt-muted, #64748b)', textTransform: 'uppercase' }}>Warranty Escrow</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16a34a', marginTop: '0.25rem' }}>90 Days</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--nt-muted, #64748b)' }}>Full Replacement</div>
              </div>
            </div>
          </motion.div>

          {/* Floating Parallax Card Left (Faster speed) */}
          <motion.div
            style={{
              y: floatingCardLeftY,
              position: 'absolute',
              left: '-20px',
              bottom: '-30px',
              backgroundColor: 'var(--nt-surface, #ffffff)',
              borderRadius: '20px',
              border: '2px solid #2563eb',
              padding: '1.25rem 1.75rem',
              boxShadow: '0 20px 40px -10px rgba(37, 99, 235, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              zIndex: 4,
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)' }}>Distributed DB Architect</div>
              <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>48h Shortlist Verified</div>
            </div>
          </motion.div>

          {/* Floating Parallax Card Right (Even faster speed) */}
          <motion.div
            style={{
              y: floatingCardRightY,
              position: 'absolute',
              right: '-20px',
              top: '40px',
              backgroundColor: 'var(--nt-surface, #ffffff)',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              padding: '1.25rem 1.75rem',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              zIndex: 4,
            }}
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)' }}>SOC-2 & ISO 27001</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--nt-muted, #64748b)' }}>Enterprise Security Tier</div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Trust Guarantee */}
        <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', color: 'var(--nt-muted, #475569)', fontSize: '0.875rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={18} color="#16a34a" />
            <span>Guaranteed 48-Hour SLA</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Zap size={18} color="#2563eb" />
            <span>100% Pre-Vetted by Architects</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={18} color="#7c3aed" />
            <span>90-Day Placement Insurance</span>
          </div>
        </div>
      </div>
    </section>
  );
};

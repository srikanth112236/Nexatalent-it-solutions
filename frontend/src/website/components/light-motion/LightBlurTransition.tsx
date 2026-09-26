import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const LightBlurTransition: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Pattern 36: Progressive Blur to Sharp on scroll
      gsap.fromTo('.blur-reveal-target', 
        { filter: 'blur(16px)', opacity: 0.3, scale: 0.96 },
        {
          filter: 'blur(0px)',
          opacity: 1,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 50%',
            end: 'center 45%',
            scrub: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: '6rem 2rem',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
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
            Pattern 36 & 37 · Progressive Blur to Sharp Transition
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Encrypted Candidate Dossier Clarification
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Scroll down to watch candidate dossiers transition from blurred confidential privacy mode into razor-sharp calibrated telemetry.
          </p>
        </div>

        {/* Blurred to Sharp Card Target */}
        <div
          className="blur-reveal-target"
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            borderRadius: '24px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            padding: '3rem 2.5rem',
            boxShadow: '0 20px 45px -15px rgba(0, 0, 0, 0.08)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Forensic Calibration Dossier #NT-4402
                </h4>
                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Staff Machine Learning Systems Architect · Verified Active Candidate
                </div>
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ecfdf5', color: '#059669', padding: '0.35rem 0.85rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 700 }}>
              <CheckCircle2 size={15} />
              <span>Full Identity & Code Verified</span>
            </div>
          </div>

          <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Candidate has 8+ years scaling real-time distributed model inference across Kubernetes clusters. Passed rigorous ex-Staff Architect system design review with a 4.9/5.0 consensus rating.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Current Comp Band</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>₹65L - ₹85L</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Notice Period</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#16a34a', marginTop: '0.2rem' }}>30 Days (Buyout Ready)</div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Calibration Rating</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb', marginTop: '0.2rem' }}>Top 1.4%</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.8125rem', fontWeight: 600 }}>
            <ShieldCheck size={16} />
            <span>Strict NDA Enforced · Zero unconsented employer alerts</span>
          </div>
        </div>
      </div>
    </section>
  );
};

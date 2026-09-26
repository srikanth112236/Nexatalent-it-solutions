import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Users, Cpu, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const LightDataHumanTransformation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Data to Human Transformation on Scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 40%',
          end: 'bottom 60%',
          scrub: 1,
        },
      });

      tl.to('.trans-data-layer', { opacity: 0.15, scale: 0.95, duration: 1 }, 0)
        .fromTo('.trans-human-layer', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 }, 0.4);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        padding: '6rem 2rem',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
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
            Pattern 38 & 39 · Data to Human Transformation
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Algorithmic Rigor Backed by Human Empathy
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            AI surfaces the technical probability. Senior Partner recruiters manage the human nuances, psychology, and career aspirations.
          </p>
        </div>

        {/* Transformation Arena */}
        <div
          style={{
            maxWidth: '880px',
            margin: '0 auto',
            borderRadius: '24px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            padding: '3rem 2.5rem',
            boxShadow: '0 20px 45px -15px rgba(0, 0, 0, 0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Data Layer */}
          <div className="trans-data-layer" style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 800, fontSize: '0.875rem', marginBottom: '1rem' }}>
              <Cpu size={18} />
              <span>STEP 01: HIGH-DIMENSIONAL VECTOR EXTRACTION</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['Vector Cosine: 0.984', 'Concurrency Latency: < 2ms', 'Repo PRs: 412 Verified', 'Comp Expectation: Locked'].map((tag, idx) => (
                <span key={idx} style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.8125rem', fontWeight: 600, padding: '0.35rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Human Transformation Layer */}
          <div
            className="trans-human-layer"
            style={{
              backgroundColor: '#eff6ff',
              borderRadius: '20px',
              border: '2px solid #2563eb',
              padding: '2.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#ffffff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
              }}
            >
              <Users size={28} />
            </div>

            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              STEP 02: Dedicated Partner Representation
            </h4>

            <p style={{ color: '#334155', fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '620px', margin: '0 auto 1.5rem auto' }}>
              We never let algorithms make hiring decisions. A dedicated Senior Practice Lead conducts direct interviews, prepares candidates for system rounds, coordinates buyouts, and defends against counter-offers.
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontWeight: 700, fontSize: '0.875rem' }}>
              <ShieldCheck size={18} />
              <span>Human Recruiter Override & Ethical Charter Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

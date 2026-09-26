import React, { useState } from 'react';
import { Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export const LightBackgroundGridSpotlight: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 400, y: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="theme-light"
      style={{
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        padding: '6rem 2rem',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
        overflow: 'hidden',
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      {/* Spotlight Radial Follow (Pattern 45) */}
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          inset: 0,
          background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.12), transparent 80%)`,
        }}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ marginBottom: '4rem' }}>
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
            Pattern 44 & 45 · Background Grid & Cursor Spotlight Follow
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Interactive Vector Matching Radar
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Move your cursor across the architectural grid to illuminate candidate vectors and active calibration radars.
          </p>
        </div>

        {/* Illuminated Spotlight Content Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '2.5rem',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
              <Terminal size={16} />
              <span>RADAR CLUSTER 01</span>
            </div>
            <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Distributed Storage Engines
            </h4>
            <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Specialists in LSM trees, Raft consensus, and zero-allocation networking. Verified across 1,200+ production repositories.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.8125rem', fontWeight: 700 }}>
              <CheckCircle2 size={15} />
              <span>18 Contenders Active on Bench</span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '2.5rem',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0891b2', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
              <Terminal size={16} />
              <span>RADAR CLUSTER 02</span>
            </div>
            <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Low-Latency C++20 / HFT
            </h4>
            <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Lock-free ring buffers, cache-line optimization, and sub-850ns exchange gateways for Tier-1 trading organizations.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontSize: '0.8125rem', fontWeight: 700 }}>
              <CheckCircle2 size={15} />
              <span>12 Contenders Active on Bench</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

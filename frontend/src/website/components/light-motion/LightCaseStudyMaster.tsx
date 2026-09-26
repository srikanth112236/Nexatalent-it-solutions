import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LightCaseStudyMaster: React.FC = () => {
  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
              fontWeight: 800,
              color: '#2563eb',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            <span>23 / 40 · VERIFIED CASE OUTCOME</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '0.75rem' }}>
            Proven Execution in High-Stakes Turnaround
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Examining our 75-day full-hub deployment for AlphaFin Global's Tier-1 low-latency GCC.
          </p>
        </div>

        {/* Master Case Study Box */}
        <motion.div
          whileHover={{ y: -4 }}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            padding: '3.5rem 3rem',
            boxShadow: '0 25px 50px -15px rgba(0,0,0,0.06)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
                FinTech & Low-Latency HFT
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Bangalore Tech Hub</span>
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.3, marginBottom: '1rem' }}>
              Scaling an India GCC from 0 to 45 Senior Staff Engineers in 75 Days
            </h3>

            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              AlphaFin needed an immediate distributed core pod to build sub-microsecond gateways. NexaTalent deployed a dedicated 3-partner squad, established standardized concurrency testing rubrics, and achieved zero offer drop-offs during notice periods.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>100% of engineering hires passed 12-month retention audit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} color="#16a34a" />
                <span>Zero agency markup surprises: fixed 18-day average time-to-hire</span>
              </div>
            </div>

            <Link
              to="/employers?case=alphafin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.75rem 1.75rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9375rem',
                textDecoration: 'none',
              }}
            >
              <span>Read Full Architectural Brief</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right Metrics Grid */}
          <div style={{ backgroundColor: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '1.5rem' }}>
              <TrendingUp size={16} />
              <span>DELIVERED PERFORMANCE METRICS</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '2.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>45</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', marginTop: '0.35rem' }}>Hires Closed</div>
              </div>

              <div>
                <div style={{ fontSize: '2.75rem', fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>18d</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', marginTop: '0.35rem' }}>Avg Time-to-Hire</div>
              </div>

              <div>
                <div style={{ fontSize: '2.75rem', fontWeight: 900, color: '#16a34a', lineHeight: 1 }}>98%</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', marginTop: '0.35rem' }}>12-Mo Retention</div>
              </div>

              <div>
                <div style={{ fontSize: '2.75rem', fontWeight: 900, color: '#7c3aed', lineHeight: 1 }}>75d</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b', marginTop: '0.35rem' }}>Total Hub Incubation</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontSize: '0.8125rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Full 90-day escrow warranty completed without claims</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

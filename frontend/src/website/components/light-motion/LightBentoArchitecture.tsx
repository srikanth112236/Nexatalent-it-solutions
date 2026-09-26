import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Cpu, Database, Network, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LightBentoArchitecture: React.FC = () => {
  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
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
          <span>19 / 40 · ARCHITECTURAL BENTO GRID</span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '0.75rem' }}>
          Four Pillars of Engineering Precision
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto 4rem auto', lineHeight: 1.6 }}>
          Modular technical infrastructure engineered to solve deep systems, low-latency, and scale-up bottlenecks.
        </p>

        {/* 4-Cell Asymmetric Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2rem',
            textAlign: 'left',
          }}
        >
          {/* Bento Cell 1: Large Span (7 Columns) */}
          <motion.div
            whileHover={{ y: -6 }}
            style={{
              gridColumn: 'span 7',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '3rem',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '1rem' }}>
                <Terminal size={18} />
                <span>SEMANTIC VECTOR CALIBRATION</span>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.75rem' }}>
                45,000+ Verified Senior Engineering Embeddings
              </h3>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Our ingestion engine extracts verified code contributions, distributed consensus patterns, and commit timelines. We match on actual technical DNA rather than resume keywords.
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem',
                fontFamily: 'monospace',
                fontSize: '0.8125rem',
                color: '#334155',
              }}
            >
              <div style={{ color: '#2563eb', fontWeight: 700 }}>$ query --vector "Staff SRE, eBPF, Raft consensus"</div>
              <div style={{ color: '#059669', marginTop: '0.35rem' }}>✓ 18 active candidates calibrated (Cosine similarity: 0.984)</div>
            </div>
          </motion.div>

          {/* Bento Cell 2: Span (5 Columns) */}
          <motion.div
            whileHover={{ y: -6 }}
            style={{
              gridColumn: 'span 5',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '3rem',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0891b2', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '1rem' }}>
                <Cpu size={18} />
                <span>ARCHITECT SCREENING PANEL</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                Vetted Exclusively by Ex-Staff Practitioners
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Every profile is scrutinized across failure-mode analysis, concurrency, and memory leaks before presentation.
              </p>
            </div>

            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0891b2' }}>100% Pre-Vetted</span>
              <ShieldCheck size={24} color="#16a34a" />
            </div>
          </motion.div>

          {/* Bento Cell 3: Span (5 Columns) */}
          <motion.div
            whileHover={{ y: -6 }}
            style={{
              gridColumn: 'span 5',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '3rem',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#7c3aed', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '1rem' }}>
                <Database size={18} />
                <span>TURNKEY GCC PODS</span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '0.75rem' }}>
                0 to 50 Engineers in 75 Days
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                Incubating high-performance enterprise GCC pods in Bangalore, Hyderabad, and Pune with turnkey operational support.
              </p>
            </div>

            <Link
              to="/employers"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#7c3aed',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              <span>Explore GCC Playbook</span>
              <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* Bento Cell 4: Span (7 Columns) */}
          <motion.div
            whileHover={{ y: -6 }}
            style={{
              gridColumn: 'span 7',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: '3rem',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '1rem' }}>
                <Network size={18} />
                <span>SYNCHRONOUS SLA GUARANTEE</span>
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.25, marginBottom: '0.75rem' }}>
                48-Hour Shortlist Delivery Commitment
              </h3>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                No agency delays. Direct calendar booking, real-time candidate feedback loops, and an unconditional 90-day replacement escrow warranty.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#16a34a' }}>48h</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Contractual SLA</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#2563eb' }}>94.8%</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Offer Acceptance</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#7c3aed' }}>90 Days</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Escrow Warranty</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

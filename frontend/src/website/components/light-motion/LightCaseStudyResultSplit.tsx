import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, CheckCircle2, Quote } from 'lucide-react';

export const LightCaseStudyResultSplit: React.FC = () => {
  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface, #ffffff)',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
            <span>NEXATALENT CHALLENGE VS. SOLUTION ARCHITECTURE</span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
            Inside the Deployment Blueprint
          </h2>
          <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Comparing parent enterprise roadblocks to the calibrated operating system deployed by our team.
          </p>
        </div>

        {/* 2-Column Split: Challenge on Left, Solution on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
          {/* Challenge Box */}
          <motion.div
            whileHover={{ y: -4 }}
            style={{
              backgroundColor: '#fff7ed',
              borderRadius: '24px',
              border: '1px solid #fed7aa',
              padding: '3rem 2.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ea580c', fontWeight: 800, fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={20} />
              <span>THE CLIENT CHALLENGE</span>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#9a3412', marginBottom: '1rem' }}>
              65% Engineering Sieve Drop-off Rate
            </h3>

            <p style={{ color: '#7c2d12', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              The client spent 6 months working with 4 contingent agencies, burning over 240 senior engineering hours on candidate interviews where 9 out of 10 contenders failed basic concurrency architecture tests.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--nt-surface, #ffffff)', borderRadius: '12px', color: '#9a3412', fontSize: '0.875rem', fontWeight: 600 }}>
                ✕ Generic resume keyword matching without code-level depth
              </div>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--nt-surface, #ffffff)', borderRadius: '12px', color: '#9a3412', fontSize: '0.875rem', fontWeight: 600 }}>
                ✕ Multiple candidate no-shows on offer day-1 joining
              </div>
            </div>
          </motion.div>

          {/* Solution Box */}
          <motion.div
            whileHover={{ y: -4 }}
            style={{
              backgroundColor: '#eff6ff',
              borderRadius: '24px',
              border: '1px solid #bfdbfe',
              padding: '3rem 2.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563eb', fontWeight: 800, fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              <CheckCircle2 size={20} />
              <span>THE NEXATALENT IT SOLUTIONS SOLUTION</span>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e40af', marginBottom: '1rem' }}>
              Structured Shortlist + Practitioner Panel Vetting
            </h3>

            <p style={{ color: '#1e3a8a', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              NexaTalent IT Solutions assigns a practitioner reviewer to write objective concurrency rubrics, screens profiles before presentation, and calibrates compensation expectations before first round interviews.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--nt-surface, #ffffff)', borderRadius: '12px', color: '#1e40af', fontSize: '0.875rem', fontWeight: 600 }}>
                ✓ Shortlisted profiles advance with documented evaluation notes
              </div>
              <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--nt-surface, #ffffff)', borderRadius: '12px', color: '#1e40af', fontSize: '0.875rem', fontWeight: 600 }}>
                ✓ Joining supported with regular transition check-ins
              </div>
            </div>
          </motion.div>
        </div>

        {/* Executive Quote Strip */}
        <div
          style={{
            backgroundColor: 'var(--nt-surface-2, #f8fafc)',
            borderRadius: '20px',
            border: '1px solid var(--nt-border, #e2e8f0)',
            padding: '2.5rem 3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          }}
        >
          <Quote size={40} color="#2563eb" style={{ flexShrink: 0 }} />
          <div>
            <p style={{ fontStyle: 'italic', color: 'var(--nt-ink-2, #334155)', fontSize: '1.0625rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              "NexaTalent IT Solutions operates more like a specialized distributed systems consultancy than a recruiting agency. The candidates arrived pre-screened to our exact scale requirements."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <strong style={{ color: 'var(--nt-ink, #0f172a)' }}>Director of Infrastructure</strong>
              <span style={{ color: 'var(--nt-muted, #64748b)' }}>· AlphaFin Global Hub</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

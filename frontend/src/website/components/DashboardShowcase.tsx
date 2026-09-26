import React, { useState } from 'react';
import { Layers, Activity, Cpu, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface DashboardShowcaseProps {
  title?: string;
  badge?: string;
  subtitle?: string;
  views?: Array<{
    id: string;
    label: string;
    icon?: string;
    tagline: string;
    stats: Array<{ label: string; value: string; trend?: string }>;
    previewTitle: string;
    previewSubtitle: string;
  }>;
}

export const DashboardShowcase: React.FC<DashboardShowcaseProps> = ({
  badge = 'Live Talent OS Preview',
  title = 'Real-Time Visibility into Every Placement Stage',
  subtitle = 'Enterprise teams eliminate recruiter black boxes with our synchronous talent intelligence workspace.',
  views = [
    {
      id: 'ai-matching',
      label: 'AI Match Engine',
      tagline: 'Semantic vector search across 45,000+ verified tech leaders',
      stats: [
        { label: 'Match Confidence', value: '98.4%', trend: '+3.2%' },
        { label: 'Screening Cycle', value: '< 180s', trend: '-85%' },
        { label: 'Tech Calibration', value: 'Level 4 Vetted', trend: 'Verified' },
      ],
      previewTitle: 'Senior Distributed Systems Architect',
      previewSubtitle: 'Candidate Calibrated #NT-9082 · 12 yrs exp · Go/Rust/K8s',
    },
    {
      id: 'pipeline',
      label: 'Pipeline Health & SLAs',
      tagline: 'Live tracking of shortlist submission, client interview, and offer stages',
      stats: [
        { label: 'Time to Shortlist', value: '3.8 Days', trend: '2x Market' },
        { label: 'Offer Acceptance', value: '94.2%', trend: '+12%' },
        { label: 'Active Pipeline', value: '18 Roles', trend: 'Healthy' },
      ],
      previewTitle: 'Enterprise GCC Engineering Scaling Track',
      previewSubtitle: '14 Active candidates across final calibration round',
    },
    {
      id: 'compliance',
      label: 'Compliance & Verification',
      tagline: 'Automated background checks, credential proofs, and compensation benchmarks',
      stats: [
        { label: 'Verification Rate', value: '100%', trend: 'ISO/SOC2' },
        { label: 'Notice Period Accuracy', value: '99.1%', trend: 'Enforced' },
        { label: 'Diversity Index', value: '44%', trend: '+8%' },
      ],
      previewTitle: 'Global Hub Regulatory & Payroll Verification',
      previewSubtitle: 'Compliance audit status: Fully cleared across 6 jurisdictions',
    },
  ],
}) => {
  const [activeTab, setActiveTab] = useState(views[0]?.id || 'ai-matching');
  const activeView = views.find((v) => v.id === activeTab) || views[0];

  return (
    <section
      style={{
        padding: '5rem 2rem',
        position: 'relative',
        background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(99, 102, 241, 0.08), transparent 70%)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.standard }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              fontSize: '0.8125rem',
              color: 'var(--color-primary-400)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            <Activity size={14} />
            {badge}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              color: 'var(--color-text)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              color: 'var(--color-text-secondary)',
              fontSize: '1.0625rem',
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>

          {/* Navigation Pill Controls */}
          <div
            style={{
              display: 'inline-flex',
              marginTop: '2rem',
              padding: '0.375rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(17, 23, 38, 0.8)',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(12px)',
              gap: '0.25rem',
            }}
          >
            {views.map((v) => (
              <div key={v.id} style={{ position: 'relative' }}>
                {activeTab === v.id && (
                  <motion.div
                    layoutId="dashboardTabActive"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'var(--color-primary)',
                      borderRadius: 'var(--radius-full)',
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
                      zIndex: 0
                    }}
                    transition={motionTokens.spring.snappy}
                  />
                )}
                <button
                  onClick={() => setActiveTab(v.id)}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '0.625rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    color: activeTab === v.id ? '#ffffff' : 'var(--color-text-secondary)',
                    transition: 'color 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  {v.label}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dashboard Mockup (Aceternity 3D-effect border + glass HUD) */}
        <motion.div
          initial={{ opacity: 0, rotateX: 5, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, rotateX: 0, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease.emphasis }}
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            background: 'linear-gradient(135deg, rgba(17, 23, 38, 0.95), rgba(10, 15, 29, 0.98))',
            boxShadow:
              '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            perspective: '1000px',
          }}
        >
          {/* Mockup Browser Window Header */}
          <div
            style={{
              padding: '1rem 1.5rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.2 }} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.3 }} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#eab308' }} />
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.4 }} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e' }} />
              <span
                style={{
                  marginLeft: '1rem',
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-tertiary)',
                  fontFamily: 'monospace',
                }}
              >
                app.nexatalent.com/{activeView.id}
              </span>
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <motion.div 
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)' }} 
              />
              Realtime Synced
            </div>
          </div>

          {/* Inner Content Area */}
          <div style={{ padding: '2.5rem' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: motionTokens.duration.standard }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                      {activeView.previewTitle}
                    </h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                      {activeView.previewSubtitle}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      fontSize: '0.875rem',
                      color: 'var(--color-primary-400)',
                    }}
                  >
                    <Cpu size={16} />
                    <span>AI Calibration Active</span>
                  </div>
                </div>

                {/* Metrics HUD Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  {activeView.stats.map((stat, idx) => (
                    <motion.div
                      key={`${activeView.id}-stat-${idx}`}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ 
                        delay: idx * motionTokens.stagger.medium, 
                        ...motionTokens.spring.snappy 
                      }}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'rgba(30, 41, 59, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)', marginBottom: '0.375rem' }}>
                        {stat.label}
                      </div>
                      <div
                        style={{
                          fontSize: '1.75rem',
                          fontWeight: 800,
                          color: 'var(--color-text)',
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '0.75rem',
                        }}
                      >
                        {stat.value}
                        {stat.trend && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--color-success)',
                              backgroundColor: 'rgba(34, 197, 94, 0.15)',
                              padding: '0.125rem 0.5rem',
                              borderRadius: 'var(--radius-sm)',
                            }}
                          >
                            {stat.trend}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pipeline Stage Bar */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, ...motionTokens.spring.gentle }}
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px dashed rgba(255, 255, 255, 0.12)',
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Layers size={18} color="var(--color-primary-400)" />
                    <span style={{ fontSize: '0.9375rem', color: 'var(--color-text)' }}>
                      Enterprise SLA: Guaranteed 48-Hour Shortlist or zero advisory fee
                    </span>
                  </div>
                  <a
                    href="/portals/employer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      fontSize: '0.875rem',
                      color: 'var(--color-primary-400)',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    <span>Launch Interactive Demo</span>
                    <ArrowUpRight size={15} />
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

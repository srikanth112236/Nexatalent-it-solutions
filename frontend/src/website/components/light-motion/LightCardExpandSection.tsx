import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Cpu, Layers } from 'lucide-react';
import { motionTokens } from '../../../shared/motion/motionTokens';

interface ExpandingCardItem {
  id: string;
  badge: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  stat: string;
  statLabel: string;
  deliverables: string[];
  sla: string;
  accent: string;
}

const items: ExpandingCardItem[] = [
  {
    id: 'exp-1',
    badge: 'Foundational Scale',
    title: 'Staff & Principal SRE / Distributed DB Mandates',
    shortDesc: 'Precision placement of high-concurrency distributed state specialists and storage architects.',
    longDesc: 'Our specialized infrastructure practice parses Raft consensus commits, low-level Linux kernel networking, and eBPF tracing across 12,000+ vetted engineers. Every shortlisted profile is pre-interviewed by former Staff Architects who verify scale limits under actual load conditions.',
    stat: '19 Days',
    statLabel: 'Median Time to Offer Acceptance',
    deliverables: [
      'Forensic concurrency and system architecture vetting',
      'Guaranteed 3 to 5 candidate dossiers in under 48 hours',
      'Unconditional 90-day placement replacement guarantee',
    ],
    sla: '48h Calibration SLA',
    accent: '#2563eb',
  },
  {
    id: 'exp-2',
    badge: 'Deep Tech Vertical',
    title: 'High-Throughput Machine Learning & LLMOps Pods',
    shortDesc: 'Assembling elite teams orchestrating distributed GPU clusters, vLLM, and model inference.',
    longDesc: 'We evaluate CUDA memory optimization, distributed Megatron-LM scaling, and multi-node training stability. We connect you directly with research scientists and infrastructure leads who have production track records scaling 70B+ parameter models.',
    stat: '94.8%',
    statLabel: 'Offer-to-Joining Conversion Rate',
    deliverables: [
      'Vector and model architecture screening rubrics',
      'Candidate equity and top-band compensation benchmarking',
      'Active counter-offer defense and transition advisory',
    ],
    sla: '72h Complex Pod SLA',
    accent: '#0891b2',
  },
  {
    id: 'exp-3',
    badge: 'Executive Advisory',
    title: 'VP of Engineering & Head of India GCC Search',
    shortDesc: 'Confidential executive retained searches for enterprise parent engineering hubs.',
    longDesc: 'Led directly by Senior Managing Partners, our executive practice maps 100% of the active and passive Tier-1 technical leadership market. We evaluate cultural alignment, team scaling history from 10 to 200+ engineers, and parental stakeholder alignment.',
    stat: '100%',
    statLabel: 'Retained Executive Search Completion',
    deliverables: [
      'Comprehensive 360-degree market talent map report',
      'Discreet, confidential outreach preserving brand posture',
      'Extended 180-day executive warranty & board transition packet',
    ],
    sla: 'Dedicated Partner Lead',
    accent: '#7c3aed',
  },
];

export const LightCardExpandSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        padding: '6rem 2rem',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
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
              fontWeight: 700,
              color: '#2563eb',
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} />
            S08 Card to Full Section Expansion Pattern
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Interactive Practice Deep Dives
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Click any practice card to expand into an immersive full-section view with deep technical rubrics and verified metrics.
          </p>
        </div>

        {/* 3 Interactive Expandable Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              layoutId={`card-${item.id}`}
              onClick={() => setSelectedId(item.id)}
              whileHover={{ y: -8, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }}
              transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.standard }}
              style={{
                borderRadius: '24px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '2.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px -2px rgba(0,0,0,0.04)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: `${item.accent}12`,
                      color: item.accent,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {item.badge}
                  </span>
                  <div style={{ color: item.accent }}>
                    <Maximize2 size={16} />
                  </div>
                </div>

                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: `${item.accent}15`,
                    color: item.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  {idx === 0 && <Cpu size={22} />}
                  {idx === 1 && <Sparkles size={22} />}
                  {idx === 2 && <Layers size={22} />}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.35, marginBottom: '0.75rem' }}>
                  {item.title}
                </h3>

                <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {item.shortDesc}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#16a34a' }}>
                  {item.sla}
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: item.accent, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>Expand Section</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full Section Expanded Modal Overlay */}
        <AnimatePresence>
          {selectedId && selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
              }}
            >
              <motion.div
                layoutId={`card-${selectedItem.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  maxWidth: '850px',
                  backgroundColor: '#ffffff',
                  borderRadius: '28px',
                  border: '1px solid #e2e8f0',
                  padding: '3.5rem 3rem',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  position: 'relative',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                }}
              >
                <button
                  onClick={() => setSelectedId(null)}
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#475569',
                  }}
                >
                  <X size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      backgroundColor: `${selectedItem.accent}15`,
                      color: selectedItem.accent,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {selectedItem.badge}
                  </span>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#16a34a' }}>
                    {selectedItem.sla}
                  </span>
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.25, marginBottom: '1.25rem' }}>
                  {selectedItem.title}
                </h2>

                <p style={{ fontSize: '1.0625rem', color: '#475569', lineHeight: 1.7, marginBottom: '2rem' }}>
                  {selectedItem.longDesc}
                </p>

                {/* Metric Strip */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                      Performance Outcome
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: selectedItem.accent }}>
                      {selectedItem.stat}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 600 }}>
                      {selectedItem.statLabel}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 700, fontSize: '0.875rem' }}>
                    <ShieldCheck size={20} />
                    <span>90-Day Replacement Guarantee</span>
                  </div>
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                    Standard Calibration Deliverables:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {selectedItem.deliverables.map((d, dIdx) => (
                      <div key={dIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9375rem', color: '#1e293b' }}>
                        <CheckCircle2 size={16} color={selectedItem.accent} style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSelectedId(null)}
                    style={{
                      padding: '0.875rem 2rem',
                      borderRadius: '12px',
                      backgroundColor: selectedItem.accent,
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                    }}
                  >
                    Initiate Practice Mandate
                  </button>
                  <button
                    onClick={() => setSelectedId(null)}
                    style={{
                      padding: '0.875rem 1.5rem',
                      borderRadius: '12px',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      border: '1px solid #cbd5e1',
                      fontWeight: 600,
                      fontSize: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    Close Preview
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

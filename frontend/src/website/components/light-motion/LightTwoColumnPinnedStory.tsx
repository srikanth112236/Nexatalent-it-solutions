import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Cpu, Sparkles, Terminal, FileCode2, ShieldCheck, ChevronRight } from 'lucide-react';

interface StageInfo {
  id: string;
  step: string;
  title: string;
  shortLabel: string;
  description: string;
  metric: string;
  metricLabel: string;
  progress: number;
  rubricItems: string[];
}

const stages: StageInfo[] = [
  {
    id: 'stage-1',
    step: 'PHASE 01',
    title: 'Vector Talent Graph Calibration',
    shortLabel: 'Vector Graph Calibration',
    description: 'We do not search keywords. Our semantic indexing queries code repositories, architectural commit histories, system concurrency bounds, and compensation profiles across 45,000+ engineers.',
    metric: '45k+',
    metricLabel: 'Indexed Engineering Profiles',
    progress: 25,
    rubricItems: [
      'Semantic embeddings for distributed consensus protocols',
      'Verified GitHub pull requests and production scale evidence',
      'Active notice-period tracking & real-time counter-offer radar',
    ],
  },
  {
    id: 'stage-2',
    step: 'PHASE 02',
    title: 'Architect-Led Production Rubrics',
    shortLabel: 'Architect Rubric Evaluation',
    description: 'Every shortlisted candidate is evaluated by practitioner panels through live system design, concurrency constraints, memory profiling, and failure-mode analysis.',
    metric: '100%',
    metricLabel: 'Practitioner Assessed Dossiers',
    progress: 50,
    rubricItems: [
      'Practitioner evaluation panel led by principal engineers',
      'Standardized scoring across concurrency & distributed DBs',
      'Recorded debriefs delivered directly into client portal',
    ],
  },
  {
    id: 'stage-3',
    step: 'PHASE 03',
    title: 'Calibrated Shortlist & Synchronous Portal',
    shortLabel: 'Calibrated Delivery Portal',
    description: 'Following mandate intake, receive calibrated, interview-ready contenders with mapped notice periods and compensation alignments. Review, comment, and schedule in one click.',
    metric: '5-14 Days',
    metricLabel: 'Average Shortlist Delivery Flow',
    progress: 75,
    rubricItems: [
      'Direct calendar booking with candidate without email ping-pong',
      'Live stage updates through the hiring portal',
      'Managed transition advocacy through joining',
    ],
  },
  {
    id: 'stage-4',
    step: 'PHASE 04',
    title: 'Offer Support & Defined Tenure Terms',
    shortLabel: 'Tenure & Offer Governance',
    description: 'The engagement does not stop at signature. Buyout discussions, joining coordination, and tenure replacement terms are handled with documented care.',
    metric: '90 Days',
    metricLabel: 'Unconditional Replacement Warranty',
    progress: 100,
    rubricItems: [
      'Regular touchpoints through notice periods',
      'Defined replacement terms on every placement',
      'Post-placement check-ins at 30, 60, and 90 days',
    ],
  },
];

export const LightTwoColumnPinnedStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const triggers = containerRef.current.querySelectorAll('.story-scroll-trigger');
    if (!triggers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(idx)) {
              setActiveStage(idx);
            }
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '-15% 0px -25% 0px',
      }
    );

    triggers.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToStage = (index: number) => {
    setActiveStage(index);
    if (!containerRef.current) return;
    const target = containerRef.current.querySelector(`[data-index="${index}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const current = stages[activeStage] || stages[0];

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        padding: '6rem 1.5rem',
        position: 'relative',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              fontSize: '0.8125rem',
              fontWeight: 800,
              color: '#0265FF',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <Sparkles size={14} />
            <span>RIGOROUS TALENT VETTING METHODOLOGY</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0F172A' }}>
            Deterministic Talent Verification In Action
          </h2>
          <p style={{ color: '#475569', fontSize: '1.0625rem', maxWidth: '660px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            Scroll through our 4-phase evaluation framework while the interactive assessment console stays pinned on the left.
          </p>
        </div>

        {/* 2-Column Split Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '2.5rem',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {/* LEFT PINNED HUD CONSOLE (Col Span 5) */}
          <div
            className="lg:col-span-5 col-span-12"
            style={{
              position: 'sticky',
              top: '100px',
              alignSelf: 'start',
              borderRadius: '24px',
              backgroundColor: '#FAF8F5',
              border: '1px solid #e2e8f0',
              padding: '2rem',
              boxShadow: '0 20px 40px -15px rgba(2, 101, 255, 0.08)',
              zIndex: 10,
            }}
          >
            {/* Header Badge & Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backgroundColor: '#0265FF',
                  color: '#ffffff',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  letterSpacing: '0.04em',
                }}
              >
                {current.step}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', backgroundColor: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
                ● IN FOCUS ({activeStage + 1}/4)
              </span>
            </div>

            {/* Interactive Phase Selector Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
              {stages.map((stg, i) => {
                const isSelected = activeStage === i;
                return (
                  <button
                    key={stg.id}
                    onClick={() => scrollToStage(i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '12px',
                      border: isSelected ? '1px solid #0265FF' : '1px solid transparent',
                      backgroundColor: isSelected ? '#ffffff' : 'transparent',
                      color: isSelected ? '#0265FF' : '#64748b',
                      fontWeight: isSelected ? 800 : 600,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>0{i + 1}.</span>
                      <span>{stg.shortLabel}</span>
                    </span>
                    {isSelected && <ChevronRight size={14} color="#0265FF" />}
                  </button>
                );
              })}
            </div>

            {/* Active Telemetry Box */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                Phase Performance SLA Metric
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0265FF', lineHeight: 1 }}>
                {current.metric}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 700, marginTop: '0.4rem' }}>
                ✓ {current.metricLabel}
              </div>
            </div>

            {/* Verification Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                Active Verification Rubric:
              </div>
              {current.rubricItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: '#334155', lineHeight: 1.4 }}>
                  <CheckCircle2 size={15} color="#0265FF" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontWeight: 600 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.35rem' }}>
                <span>Framework Progression</span>
                <span style={{ color: '#0265FF' }}>{current.progress}%</span>
              </div>
              <div style={{ height: '6px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${current.progress}%`,
                    backgroundColor: '#0265FF',
                    borderRadius: '9999px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>

          {/* RIGHT SCROLLING CARDS (Col Span 7) */}
          <div className="lg:col-span-7 col-span-12" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <div
                  key={stage.id}
                  data-index={idx}
                  className="story-scroll-trigger"
                  style={{
                    borderRadius: '24px',
                    backgroundColor: isActive ? '#ffffff' : '#FAF8F5',
                    border: isActive ? '2px solid #0265FF' : '1px solid #e2e8f0',
                    padding: '2.5rem',
                    boxShadow: isActive ? '0 20px 40px -10px rgba(2, 101, 255, 0.14)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                  }}
                  onClick={() => scrollToStage(idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          backgroundColor: isActive ? '#EFF6FF' : '#f1f5f9',
                          color: isActive ? '#0265FF' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {idx === 0 && <Cpu size={20} />}
                        {idx === 1 && <FileCode2 size={20} />}
                        {idx === 2 && <Terminal size={20} />}
                        {idx === 3 && <ShieldCheck size={20} />}
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isActive ? '#0265FF' : '#64748b', textTransform: 'uppercase' }}>
                          {stage.step} Execution Node
                        </span>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {stage.title}
                        </h4>
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isActive ? '#059669' : '#94a3b8',
                        backgroundColor: isActive ? '#ecfdf5' : '#f1f5f9',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        border: isActive ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                      }}
                    >
                      {isActive ? '● Active Step' : 'Stage Ready'}
                    </span>
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {stage.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', backgroundColor: isActive ? '#f8fafc' : '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0265FF', textTransform: 'uppercase' }}>
                      Calibrated Output & Audit Standard:
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#1e293b', fontWeight: 600 }}>
                      {stage.rubricItems[0]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

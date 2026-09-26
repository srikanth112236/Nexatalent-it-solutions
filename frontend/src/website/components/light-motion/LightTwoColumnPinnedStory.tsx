import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle2, Cpu, Sparkles, Terminal, FileCode2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface StageInfo {
  id: string;
  step: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  rubricItems: string[];
}

const stages: StageInfo[] = [
  {
    id: 'stage-1',
    step: 'PHASE 01',
    title: 'Vector Talent Graph Calibration',
    description: 'We do not search keywords. Our semantic indexing queries code repositories, architectural commit histories, system concurrency bounds, and compensation profiles across 45,000+ engineers.',
    metric: '45k+',
    metricLabel: 'Indexed Engineering Profiles',
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
    description: 'Every shortlisted candidate is evaluated by former Staff and Principal Engineers through live system design, concurrency constraints, memory leak profiling, and failure-mode analysis.',
    metric: '100%',
    metricLabel: 'Technically Pre-Vetted Dossiers',
    rubricItems: [
      'Ex-Staff & Principal Engineer evaluation panel',
      'Standardized scoring across concurrency & distributed DBs',
      'Full recorded debriefs delivered directly into client portal',
    ],
  },
  {
    id: 'stage-3',
    step: 'PHASE 03',
    title: '48h Shortlist & Synchronous SLA Portal',
    description: 'Within 48 hours of mandate intake, receive 3 to 5 calibrated, interview-ready contenders with verified notice periods and compensation alignments. Review, comment, and schedule in one click.',
    metric: '48 Hours',
    metricLabel: 'Shortlist Delivery Commitment',
    rubricItems: [
      'Direct calendar booking with candidate without email ping-pong',
      'Live candidate SLA clocks and real-time stage updates',
      'Zero candidate leakage through managed transition advocacy',
    ],
  },
  {
    id: 'stage-4',
    step: 'PHASE 04',
    title: 'Offer Defense & 90-Day Warranty Protection',
    description: 'The engagement does not stop at signature. We proactively manage buyouts, handle counter-offer psychology, ensure day-1 joining, and back every hire with an unconditional 90-day replacement guarantee.',
    metric: '94.8%',
    metricLabel: 'Offer-to-Joining Conversion',
    rubricItems: [
      'Continuous daily touchpoints during 30 to 90-day notice periods',
      '100% unconditional replacement warranty on every placement',
      'Quarterly post-placement retention audits at 30, 60, and 90 days',
    ],
  },
];

export const LightTwoColumnPinnedStory: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !leftColRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>('.story-scroll-trigger');

    const ctx = gsap.context(() => {
      sections.forEach((sec, idx) => {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActiveStage(idx),
          onEnterBack: () => setActiveStage(idx),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const current = stages[activeStage] || stages[0];

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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Section Heading */}
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
            C06 & S04 Two-Column Pinned Story Pattern
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Deterministic Talent Verification In Action
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            The left overview stays sticky while right-side verification milestones progress through our 4-phase vetting engine.
          </p>
        </div>

        {/* 2-Column Split Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '4rem',
            alignItems: 'flex-start',
            position: 'relative',
          }}
        >
          {/* Left Pinned HUD Panel */}
          <div
            ref={leftColRef}
            style={{
              position: 'sticky',
              top: '100px',
              alignSelf: 'start',
              borderRadius: '24px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '2.5rem',
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                }}
              >
                {current.step}
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#64748b' }}>
                Active Verification Phase
              </span>
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '1rem' }}>
              {current.title}
            </h3>

            <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {current.description}
            </p>

            {/* Live Indicator Box */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Phase Performance Metric
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>
                {current.metric}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#059669', fontWeight: 600, marginTop: '0.4rem' }}>
                ✓ {current.metricLabel}
              </div>
            </div>

            {/* Checklist items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {current.rubricItems.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: '#334155' }}>
                  <CheckCircle2 size={15} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Scrolling Story Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {stages.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <div
                  key={stage.id}
                  className="story-scroll-trigger"
                  style={{
                    borderRadius: '24px',
                    backgroundColor: isActive ? '#ffffff' : '#f8fafc',
                    border: isActive ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    padding: '2.5rem',
                    boxShadow: isActive ? '0 20px 40px -10px rgba(37, 99, 235, 0.15)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: isActive ? 'rgba(37, 99, 235, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                          color: isActive ? '#2563eb' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {idx === 0 && <Cpu size={18} />}
                        {idx === 1 && <FileCode2 size={18} />}
                        {idx === 2 && <Terminal size={18} />}
                        {idx === 3 && <CheckCircle2 size={18} />}
                      </div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: isActive ? '#2563eb' : '#64748b' }}>
                        {stage.step}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: isActive ? '#16a34a' : '#94a3b8',
                        backgroundColor: isActive ? '#ecfdf5' : '#f1f5f9',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                      }}
                    >
                      {isActive ? 'In Focus' : 'Stage Ready'}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                    {stage.title}
                  </h4>

                  <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {stage.description}
                  </p>

                  <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '12px', fontSize: '0.8125rem', color: '#1e293b' }}>
                    <strong style={{ color: '#2563eb' }}>Calibrated Output:</strong> {stage.rubricItems[0]}
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

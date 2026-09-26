import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitPullRequest, Search, CheckCircle2, ShieldCheck, UserCheck, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface WorkflowStep {
  step: string;
  day: string;
  title: string;
  desc: string;
  tag: string;
}

const steps: WorkflowStep[] = [
  {
    step: '01',
    day: 'Day 01',
    title: 'DNA Alignment & Rubric Locking',
    desc: 'Domain Lead meets your VP of Engineering to write code-level rubrics, concurrency boundaries, and compensation bands.',
    tag: 'Architect Intake',
  },
  {
    step: '02',
    day: 'Day 02',
    title: 'Semantic Vector Extraction',
    desc: 'Vector search across 45k+ profiles parses GitHub commits, distributed architecture papers, and live compensation radars.',
    tag: 'Deep Sourcing',
  },
  {
    step: '03',
    day: 'Day 03 (48h)',
    title: '48h Calibration Dossier Delivery',
    desc: 'Receive 3 to 5 pre-screened, interview-ready candidate dossiers with full system design scorecards in your client portal.',
    tag: 'Contractual SLA',
  },
  {
    step: '04',
    day: 'Days 05 - 12',
    title: 'Synchronous Interview Sprint',
    desc: 'Direct calendar integration eliminates agency delay. Instant feedback submission and automated debrief captures.',
    tag: 'Accelerated Sprints',
  },
  {
    step: '05',
    day: 'Days 14 - 20',
    title: 'Offer Defense & Buyout Alignment',
    desc: 'Pre-offer alignment prevents counter-offers. Active daily touchpoints during 30 to 90-day notice period transitions.',
    tag: '94.8% Joining Rate',
  },
  {
    step: '06',
    day: 'Days 21 - 90',
    title: '90-Day Placement Escrow Warranty',
    desc: 'Post-onboarding pulse checks at 30, 60, and 90 days. Unconditional replacement warranty active throughout.',
    tag: '100% Guaranteed',
  },
];

export const LightProgressiveWorkflow: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pathRef.current) return;

    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    // Set initial dasharray and offset
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const ctx = gsap.context(() => {
      // Draw SVG line as user scrolls through the workflow
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 40%',
          end: 'bottom 80%',
          scrub: 0.5,
        },
      });

      // Animate workflow step cards
      const stepElements = gsap.utils.toArray<HTMLElement>('.workflow-step-node');
      stepElements.forEach((node) => {
        gsap.fromTo(
          node,
          { opacity: 0.4, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
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
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
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
            <GitPullRequest size={14} />
            C07, S05 & S09 Progressive SVG Workflow Line Drawing
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a' }}>
            The 6-Stage Deterministic Hiring Protocol
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            As you scroll, the dynamic SVG connection line draws between each phase, activating milestones in real time.
          </p>
        </div>

        {/* Workflow Timeline with Connecting Line */}
        <div style={{ position: 'relative', padding: '1rem 0' }}>
          {/* Vertical Dynamic SVG Line */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            <svg
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
              preserveAspectRatio="none"
              viewBox="0 0 4 1000"
            >
              <line x1="2" y1="0" x2="2" y2="1000" stroke="#e2e8f0" strokeWidth="4" />
              <path
                ref={pathRef}
                d="M 2 0 L 2 1000"
                stroke="#2563eb"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          </div>

          {/* Steps Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', position: 'relative', zIndex: 2 }}>
            {steps.map((st, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={st.step}
                  className="workflow-step-node"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '3rem',
                    alignItems: 'center',
                  }}
                >
                  {/* Left Column */}
                  <div style={{ textAlign: isEven ? 'right' : 'left', order: isEven ? 1 : 2 }}>
                    {isEven ? (
                      <div
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '20px',
                          border: '1px solid #e2e8f0',
                          padding: '2rem',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em' }}>
                            {st.tag}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                            {st.day}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                          {st.title}
                        </h3>
                        <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
                          {st.desc}
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#cbd5e1' }}>{st.step}</div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div style={{ textAlign: isEven ? 'left' : 'right', order: isEven ? 2 : 1 }}>
                    {!isEven ? (
                      <div
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '20px',
                          border: '1px solid #e2e8f0',
                          padding: '2rem',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                            {st.day}
                          </span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em' }}>
                            {st.tag}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                          {st.title}
                        </h3>
                        <p style={{ fontSize: '0.9375rem', color: '#475569', lineHeight: 1.6 }}>
                          {st.desc}
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '3rem', fontWeight: 900, color: '#cbd5e1' }}>{st.step}</div>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {idx === 0 && <Search size={22} />}
                          {idx === 2 && <Calendar size={22} />}
                          {idx === 4 && <UserCheck size={22} />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom SLA Stamp */}
        <div
          style={{
            marginTop: '4rem',
            padding: '1.5rem 2rem',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={24} color="#059669" />
            <div>
              <div style={{ fontWeight: 800, color: '#065f46' }}>Guaranteed Service Level Agreement (SLA)</div>
              <div style={{ fontSize: '0.8125rem', color: '#047857' }}>48h Shortlist · 94.8% Offer-to-Joining · 90-Day Unconditional Replacement Warranty</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 700, fontSize: '0.875rem' }}>
            <CheckCircle2 size={16} />
            <span>Active Contractual Standard</span>
          </div>
        </div>
      </div>
    </section>
  );
};

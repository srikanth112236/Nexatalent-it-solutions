import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Clock, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface TimelineMilestone {
  dayLabel: string;
  title: string;
  description: string;
  deliverables: string[];
  status?: 'completed' | 'in-progress' | 'upcoming';
  slaHighlight?: string;
}

export interface ProcessTimelineProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  milestones?: TimelineMilestone[];
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
  badge = 'Guaranteed SLA Protocol',
  title = 'From Mandate Intake to Placement in 25 Days',
  subtitle = 'A deterministic, milestone-driven technical hiring protocol built to eliminate recruiting lag and bad hires.',
  milestones = [
    {
      dayLabel: 'Day 01',
      title: 'Architect Calibration & Role Blueprint',
      description: 'Deep technical intake call with our Principal Practice Leads to lock the rubric, compensation bands, and concurrency thresholds.',
      deliverables: ['Custom technical evaluation rubric', 'Market compensation mapping report', 'Target company talent map'],
      slaHighlight: 'Completed in 24 hours',
    },
    {
      dayLabel: 'Day 03 - 05',
      title: 'Vetted Shortlist Delivery',
      description: 'Presentation of 3 to 5 thoroughly screened senior candidates with recorded technical evaluations and background verification.',
      deliverables: ['Pre-calibrated candidate dossiers', 'System design assessment scores', 'Notice period commitment verification'],
      slaHighlight: 'Strict 72-hour SLA',
    },
    {
      dayLabel: 'Day 06 - 15',
      title: 'Synchronous Client Interview Sprints',
      description: 'Rapid-fire interview coordination with automated calendar booking, prep notes for candidates, and same-day feedback collection.',
      deliverables: ['Zero-friction interview scheduling', 'Post-interview debrief within 2 hours', 'Candidate sentiment monitoring'],
      slaHighlight: '94% Interview show rate',
    },
    {
      dayLabel: 'Day 16 - 25',
      title: 'Offer Defense & Onboarding Lock',
      description: 'Proactive counter-offer mitigation, equity consultation, and dual-signoff tracking up until day 1 joining.',
      deliverables: ['Comprehensive counter-offer defense', 'Pre-onboarding check-ins', 'Full 90-day replacement warranty'],
      slaHighlight: '98% Joining reliability',
    },
  ],
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current || !lineRef.current) return;

    const ctx = gsap.context(() => {
      // Pin the section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 20%',
          end: 'bottom 40%',
          scrub: 1,
        }
      });

      // Animate line drawing down
      tl.fromTo(
        lineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, ease: 'none', duration: 1 }
      );

      // Reveal milestones progressively
      milestoneRefs.current.forEach((el) => {
        if (!el) return;
        
        // Individual scroll trigger for each milestone
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.2)',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'bottom 60%',
              toggleActions: 'play none none reverse'
            }
          }
        );
        
        // Pulse effect for the icon node
        const iconNode = el.querySelector('.timeline-icon-node');
        if (iconNode) {
          gsap.to(iconNode, {
            boxShadow: '0 0 25px rgba(59, 130, 246, 0.6)',
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: 'sine.inOut',
            scrollTrigger: {
              trigger: el,
              start: 'top 70%',
              toggleActions: 'play pause resume pause'
            }
          });
        }
      });
    }, sectionRef);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} style={{ padding: '5rem 2rem', position: 'relative' }}>
      <div ref={containerRef} style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-primary-400)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              padding: '0.35rem 0.875rem',
              borderRadius: '9999px',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              marginBottom: '1rem',
            }}
          >
            <Zap size={14} />
            {badge}
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>

        {/* Timeline Items */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Vertical Connecting Line Base */}
          <div
            style={{
              position: 'absolute',
              top: '2rem',
              bottom: '2rem',
              left: '28px',
              width: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              zIndex: 0,
            }}
          />
          {/* Animated Connecting Line */}
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              top: '2rem',
              bottom: '2rem',
              left: '28px',
              width: '2px',
              backgroundColor: 'var(--color-primary)',
              zIndex: 0,
            }}
          />

          {milestones.map((milestone, idx) => (
            <div
              key={idx}
              ref={el => milestoneRefs.current[idx] = el}
              style={{
                display: 'flex',
                gap: '2rem',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {/* Milestone Icon Node */}
              <div
                className="timeline-icon-node"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-surface)',
                  border: '2px solid var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)',
                  transition: 'background-color 0.3s ease',
                }}
              >
                <Clock size={20} color="var(--color-primary-400)" />
              </div>

              {/* Milestone Content Card */}
              <div
                style={{
                  flex: 1,
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 800,
                      color: 'var(--color-primary-400)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {milestone.dayLabel}
                  </span>
                  {milestone.slaHighlight && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-success)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(34, 197, 94, 0.25)',
                      }}
                    >
                      {milestone.slaHighlight}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  {milestone.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {milestone.description}
                </p>

                {/* Deliverables List */}
                <div
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Key Deliverables
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem' }}>
                    {milestone.deliverables.map((del, dIdx) => (
                      <div key={dIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: 'var(--color-text)' }}>
                        <CheckCircle2 size={13} color="var(--color-primary-400)" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

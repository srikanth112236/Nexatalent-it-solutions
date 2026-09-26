import React, { useState, useEffect, useRef } from 'react';
import { UserCheck, Building2, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface RecruitmentJourneyMapProps {
  badge?: string;
  title?: string;
  subtitle?: string;
}

export const RecruitmentJourneyMap: React.FC<RecruitmentJourneyMapProps> = ({
  badge = 'End-to-End Orchestration',
  title = 'The Synchronous Talent Journey Map',
  subtitle = 'See how employer hiring velocity aligns seamlessly with candidate career advocacy at every key milestone.',
}) => {
  const [activeTrack, setActiveTrack] = useState<'employer' | 'candidate'>('employer');
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const employerMilestones = [
    {
      step: '01',
      phase: 'Mandate Calibration',
      timing: 'Day 1',
      title: 'Architect Intake & DNA Locking',
      action: 'Domain Lead aligns with your VP of Eng to lock production rubrics, tech depth questions, and compensation limits.',
    },
    {
      step: '02',
      phase: 'Vetted Delivery',
      timing: 'Day 3',
      title: '48h Calibration Shortlist',
      action: 'Receive 3 to 5 dossiers with system design ratings, notice period verifications, and recorded technical debriefs.',
    },
    {
      step: '03',
      phase: 'Interviews',
      timing: 'Days 5 - 12',
      title: 'Zero-Dropoff Sprints',
      action: 'Rapid-fire candidate coordination. Direct calendar integration with your hiring managers and automated debriefs.',
    },
    {
      step: '04',
      phase: 'Offer Defense',
      timing: 'Days 14 - 20',
      title: 'Compensation Lock & Closure',
      action: 'Pre-offer alignment prevents counter-offer leakage. Continuous candidate touchpoints until day 1 start.',
    },
    {
      step: '05',
      phase: 'Warranty',
      timing: 'Days 21 - 90',
      title: '90-Day Placement Insurance',
      action: 'Post-onboarding pulse checks at 30, 60, and 90 days. Unconditional replacement warranty active throughout.',
    },
  ];

  const candidateMilestones = [
    {
      step: '01',
      phase: 'Private Assessment',
      timing: 'Initial Call',
      title: 'Career DNA & Comp Mapping',
      action: 'Confidential conversation mapping your technical strengths, architectural ambitions, and target salary thresholds.',
    },
    {
      step: '02',
      phase: 'Curated Mandates',
      timing: 'Within 24 Hours',
      title: 'Direct Access to Leadership',
      action: 'Personal introduction to Tier-1 engineering founders and CTOs with zero generic job board spam.',
    },
    {
      step: '03',
      phase: 'Interview Coaching',
      timing: 'Pre-Round',
      title: 'Insider Technical Briefings',
      action: 'Detailed company tech stack overview, engineering culture debrief, and system design round preparation.',
    },
    {
      step: '04',
      phase: 'Negotiation',
      timing: 'Offer Stage',
      title: 'Maximized Equity & Comp Band',
      action: 'Dedicated agent negotiates top-band compensation, sign-on bonuses, and equity grants on your behalf.',
    },
    {
      step: '05',
      phase: 'Onboarding',
      timing: 'Day 1 & Beyond',
      title: 'Seamless Transition Care',
      action: 'Resignation guidance, buyout assistance, and ongoing mentorship checkpoints throughout your first 90 days.',
    },
  ];

  const milestones = activeTrack === 'employer' ? employerMilestones : candidateMilestones;

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
    
    // Clear previous ScrollTriggers
    ScrollTrigger.getAll().forEach(t => t.kill());

    const cards = trackRef.current.querySelectorAll('.journey-card');
    
    // Create timeline for progressive reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 20%',
        end: 'bottom center',
        scrub: 1,
        pin: true,
      }
    });

    cards.forEach((card, index) => {
      tl.fromTo(card, 
        { opacity: 0, x: 50, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power2.out' },
        index * 0.5
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [activeTrack]);

  return (
    <section ref={sectionRef} style={{ padding: '5rem 2rem', position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-primary-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {badge}
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)', marginTop: '0.5rem' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0.75rem auto 2rem auto' }}>
            {subtitle}
          </p>

          {/* Perspective Toggle Buttons */}
          <div
            style={{
              display: 'inline-flex',
              padding: '0.375rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(17, 23, 38, 0.8)',
              border: '1px solid var(--color-border)',
              gap: '0.35rem',
            }}
          >
            <button
              onClick={() => setActiveTrack('employer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeTrack === 'employer' ? 'var(--color-primary)' : 'transparent',
                color: activeTrack === 'employer' ? '#ffffff' : 'var(--color-text-secondary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <Building2 size={16} />
              <span>Employer Mandate Journey</span>
            </button>

            <button
              onClick={() => setActiveTrack('candidate')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: activeTrack === 'candidate' ? 'var(--color-primary)' : 'transparent',
                color: activeTrack === 'candidate' ? '#ffffff' : 'var(--color-text-secondary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <UserCheck size={16} />
              <span>Candidate Career Journey</span>
            </button>
          </div>
        </div>

        {/* Milestone Steps Horizontal Track */}
        <div
          ref={trackRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {milestones.map((m, idx) => (
            <div
              key={`${activeTrack}-${idx}`}
              className="journey-card"
              style={{
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '1.75rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
                opacity: 0,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: 'var(--color-primary-400)',
                    }}
                  >
                    {m.step}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: 'var(--color-text-tertiary)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {m.timing}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--color-text-secondary)',
                    marginBottom: '0.35rem',
                  }}
                >
                  {m.phase}
                </div>

                <h3
                  style={{
                    fontSize: '1.0625rem',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    lineHeight: 1.3,
                    marginBottom: '0.75rem',
                  }}
                >
                  {m.title}
                </h3>

                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  {m.action}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-success)',
                  fontWeight: 600,
                  marginTop: '1.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <CheckCircle2 size={13} />
                <span>Verified Milestone</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

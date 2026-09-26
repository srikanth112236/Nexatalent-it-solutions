import React, { useState } from 'react';

const workflowSteps = [
  { step: '01', title: 'Mandate Qualification', desc: 'Calibrating tech stack, architecture depth, culture fit, and compensation bands.' },
  { step: '02', title: 'Talent Sourcing', desc: 'Algorithmic matching across 45,000+ verified developers, architects, and managers.' },
  { step: '03', title: 'Technical Screening', desc: 'Deep-dive peer evaluations on system design, code craftsmanship, and past production impact.' },
  { step: '04', title: 'Shortlist Submission', desc: 'Curated dossier of 3-5 interview-ready candidates with transparent salary notes.' },
  { step: '05', title: 'Client Interviews', desc: 'Frictionless calendar scheduling, panel debriefs, and real-time candidate feedback.' },
  { step: '06', title: 'Offer & Joining', desc: 'Offer calibration, counter-offer management, resignation guidance, and day-one onboarding.' },
];

export const RecruitmentWorkflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section style={{ maxWidth: '1280px', margin: '5rem auto', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Methodical Rigor
        </span>
        <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, margin: '0.5rem 0 1rem 0' }}>
          The NexaTalent Six-Stage Hiring Protocol
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto' }}>
          Every candidate presented to your team has passed rigorous multi-point validation to protect your engineering bandwidth.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {workflowSteps.map((s, idx) => {
          const isSelected = activeStep === idx;
          return (
            <div
              key={s.step}
              onClick={() => setActiveStep(idx)}
              style={{
                padding: '2rem',
                backgroundColor: isSelected ? 'var(--color-surface-raised)' : 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                boxShadow: isSelected ? 'var(--shadow-glow-primary)' : 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: isSelected ? 'var(--color-primary)' : 'var(--color-text-subtle)' }}>
                  {s.step}
                </span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-border-strong)' }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: isSelected ? '#ffffff' : 'var(--color-text)' }}>
                {s.title}
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

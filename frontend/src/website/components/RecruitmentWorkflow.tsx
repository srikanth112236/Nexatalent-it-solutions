import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

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
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          Methodical Rigor
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: motionTokens.ease.standard }}
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, margin: '0.5rem 0 1rem 0', color: '#ffffff' }}
        >
          The NexaTalent Six-Stage Hiring Protocol
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: motionTokens.ease.standard }}
          style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}
        >
          Every candidate presented to your team has passed rigorous multi-point validation to protect your engineering bandwidth.
        </motion.p>
      </div>

      {/* Interactive 6-Card Animated Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {workflowSteps.map((s, idx) => {
          const isSelected = activeStep === idx;
          return (
            <motion.div
              key={s.step}
              onClick={() => setActiveStep(idx)}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: idx * 0.08,
                duration: 0.5,
                ease: motionTokens.ease.standard,
              }}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              style={{
                padding: '2.25rem 2rem',
                backgroundColor: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                boxShadow: isSelected
                  ? '0 15px 35px rgba(59, 130, 246, 0.25), 0 0 20px rgba(59, 130, 246, 0.2)'
                  : 'var(--shadow-sm)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.25s ease, background-color 0.25s ease',
              }}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeWorkflowGlow"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    backgroundColor: 'var(--color-primary)',
                    boxShadow: '0 0 12px var(--color-primary)',
                  }}
                />
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    color: isSelected ? 'var(--color-primary-400)' : 'var(--color-text-subtle)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {s.step}
                </span>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isSelected && (
                    <motion.div
                      animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                      }}
                    />
                  )}
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-border-strong)',
                      transition: 'background-color 0.2s ease',
                    }}
                  />
                </div>
              </div>

              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '0.625rem',
                  color: isSelected ? '#ffffff' : 'var(--color-text)',
                  transition: 'color 0.2s ease',
                }}
              >
                {s.title}
              </h3>

              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                {s.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Check, ChevronLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface StepItem {
  number: number;
  label: string;
  title: string;
  summary: string;
  details: string[];
  ctaLabel?: string;
}

export interface ProcessStepperProps {
  title?: string;
  badge?: string;
  steps?: StepItem[];
  onComplete?: () => void;
}

export const ProcessStepper: React.FC<ProcessStepperProps> = ({
  badge = 'Interactive Engagement Steps',
  title = 'How Enterprise Hiring Works With NexaTalent IT Solutions',
  steps = [
    {
      number: 1,
      label: 'Intake & Calibration',
      title: 'Define Technical DNA & Non-Negotiables',
      summary: 'We pair you with a Domain Principal Recruiter who conducts a deep architectural intake session.',
      details: [
        'System architecture expectations (e.g. QPS, concurrency, database sharding)',
        'Comp band calibration against top-tier tech benchmarks',
        'Specific company culture, ownership, and leadership attributes',
      ],
      ctaLabel: 'Proceed to Sourcing Sprint',
    },
    {
      number: 2,
      label: 'Sourcing & AI Match',
      title: 'Precision Screening across 45,000+ Vetted Profiles',
      summary: 'Our semantic AI engine scans verified engineers and reaches out with bespoke, recruiter-crafted pitches.',
      details: [
        'Proprietary access to high-demand passive engineers',
        'Zero mass spamming — 68% candidate reply rate',
        'First-round technical screening completed by ex-architects',
      ],
      ctaLabel: 'Proceed to Shortlist Review',
    },
    {
      number: 3,
      label: 'Shortlist Delivery',
      title: 'Reviewed & Dossiered Candidate Presentations',
      summary: 'Receive a tight shortlist of 3 to 5 prime contenders with complete compensation and verification records.',
      details: [
        'Detailed candidate evaluation rubrics and code assessments',
        'Verified notice periods (immediate to 30-day joins prioritized)',
        'One-click calendar scheduling directly inside your client portal',
      ],
      ctaLabel: 'Proceed to Final Offer Lock',
    },
    {
      number: 4,
      label: 'Closing & Guarantee',
      title: 'Seamless Offer Acceptance with 90-Day Guarantee',
      summary: 'We handle delicate compensation negotiations, counter-offer mitigation, and candidate onboarding.',
      details: [
        '94% offer-to-joining acceptance track record',
        'Continuous touchpoints during candidate resignation period',
        '90-day replacement warranty for ultimate peace of mind',
      ],
      ctaLabel: 'Start Your First Mandate',
    },
  ],
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const activeStep = steps[currentStep] || steps[0];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 50 : -50,
        opacity: 0,
        position: 'absolute' as any,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      position: 'relative' as any,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 50 : -50,
        opacity: 0,
        position: 'absolute' as any,
      };
    }
  };

  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.standard }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
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
        </motion.div>

        {/* Progress Bar Line */}
        <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', marginBottom: '1.5rem', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={motionTokens.spring.gentle}
            style={{ height: '100%', backgroundColor: 'var(--color-primary)' }}
          />
        </div>

        {/* Horizontal Step Header Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          {steps.map((s, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <button
                key={s.number}
                onClick={() => {
                  setDirection(idx > currentStep ? 1 : -1);
                  setCurrentStep(idx);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: isCurrent ? 'rgba(59, 130, 246, 0.15)' : 'var(--color-surface)',
                  border: isCurrent ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <motion.div
                  animate={{ 
                    scale: isCurrent ? [1, 1.2, 1] : 1,
                    backgroundColor: isDone ? 'var(--color-success)' : isCurrent ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.05)'
                  }}
                  transition={motionTokens.spring.snappy}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {isDone ? <Check size={16} /> : s.number}
                </motion.div>
                <div style={{ display: 'none', mdDisplay: 'block' } as any}>
                  <div style={{ fontSize: '0.75rem', color: isCurrent ? 'var(--color-primary-400)' : 'var(--color-text-tertiary)', fontWeight: 600 }}>
                    Step 0{s.number}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: isCurrent ? 'var(--color-text)' : 'var(--color-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.label}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Step Body Card Container with hidden overflow for slide */}
        <div
          style={{
            borderRadius: 'var(--radius-2xl)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            padding: '3rem',
            position: 'relative',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            minHeight: '350px'
          }}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={motionTokens.spring.gentle}
              style={{ width: '100%' }}
            >
              <div style={{ maxWidth: '800px' }}>
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    color: 'var(--color-primary-400)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Stage 0{activeStep.number} of 0{steps.length}
                </span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginTop: '0.5rem', marginBottom: '1rem' }}>
                  {activeStep.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  {activeStep.summary}
                </p>

                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Included in this phase:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {activeStep.details.map((detail, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * motionTokens.stagger.medium, duration: motionTokens.duration.fast }}
                        key={idx} 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text)' }}
                      >
                        <ShieldCheck size={18} color="var(--color-primary-400)" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9375rem' }}>{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {currentStep > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePrev}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      <ChevronLeft size={16} />
                      <span>Previous</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover="hover"
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.75rem',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: 'var(--color-primary)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                    }}
                  >
                    <span>{activeStep.ctaLabel || 'Continue'}</span>
                    <motion.div variants={{ hover: { x: 5 } }}>
                      <ArrowRight size={16} />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

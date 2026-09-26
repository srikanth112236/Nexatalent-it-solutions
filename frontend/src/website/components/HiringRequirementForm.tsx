import React, { useState } from 'react';
import { Sparkles, Zap, FileCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface HiringRequirementFormProps {
  title?: string;
  subtitle?: string;
  onSubmitMandate?: (mandate: any) => void;
}

export const HiringRequirementForm: React.FC<HiringRequirementFormProps> = ({
  title = 'Configure Your Technical Mandate',
  subtitle = 'Submit your hiring specifications to initiate our 48-hour calibration shortlist SLA.',
  onSubmitMandate,
}) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  
  const [roleTitle, setRoleTitle] = useState('');
  const [seniority, setSeniority] = useState('Staff Engineer');
  const [headcount, setHeadcount] = useState('1 - 2 Engineers');
  const [location, setLocation] = useState('Bangalore / Hybrid');
  const [budget, setBudget] = useState('₹50L - ₹80L (or $120k - $160k)');
  const [urgency, setUrgency] = useState('Within 14 Days (Priority)');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Golang', 'Kubernetes']);
  const [contactEmail, setContactEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = 3;

  const availableSkills = [
    'Golang',
    'Rust',
    'Kubernetes',
    'Distributed Systems',
    'Python / PyTorch',
    'TypeScript / React',
    'Kafka / Event-Driven',
    'AWS / Cloud Native',
    'C++ / High Frequency',
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      nextStep();
      return;
    }
    setIsSubmitted(true);
    onSubmitMandate?.({
      roleTitle,
      seniority,
      headcount,
      location,
      budget,
      urgency,
      skills: selectedSkills,
      contactEmail,
    });
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: motionTokens.duration.standard,
        ease: motionTokens.ease.standard,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 40 : -40,
      opacity: 0,
      transition: {
        duration: motionTokens.duration.fast,
        ease: motionTokens.ease.standard,
      },
    }),
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: motionTokens.stagger.small,
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: motionTokens.spring.snappy }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease.standard }}
      style={{
        borderRadius: 'var(--radius-2xl)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '3rem 2.5rem',
        maxWidth: '850px',
        margin: '0 auto',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.4) 0%, rgba(17, 23, 38, 0.9) 100%)',
        overflow: 'hidden'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, ...motionTokens.spring.snappy }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.875rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            fontSize: '0.8125rem',
            color: 'var(--color-primary-400)',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}
        >
          <Zap size={14} />
          Fast-Track Client Intake
        </motion.div>
        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--color-text)' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginTop: '0.5rem' }}>
          {subtitle}
        </p>
      </div>

      {!isSubmitted && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
          </div>
          <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={motionTokens.spring.gentle}
              style={{ height: '100%', backgroundColor: 'var(--color-primary)' }}
            />
          </div>
        </div>
      )}

      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={motionTokens.spring.snappy}
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: 'rgba(34, 197, 94, 0.08)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <FileCheck size={48} color="var(--color-success)" style={{ margin: '0 auto 1.25rem auto' }} />
          </motion.div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            Mandate Intake Registered
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '540px', margin: '0 auto 1.5rem auto' }}>
            Your mandate for <strong style={{ color: 'var(--color-text)' }}>{roleTitle || 'Senior Technical Talent'}</strong> has been assigned to our Specialized Engineering Squad. We have sent the confirmation packet and SLA guarantee to <strong style={{ color: 'var(--color-text)' }}>{contactEmail}</strong>.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-primary-400)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <Sparkles size={16} />
            Shortlist Delivery Target: Within 48 Hours
          </motion.div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
              >
                <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  <motion.div variants={staggerItem}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                      Target Role Title *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Lead SRE / Distributed DB Architect"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border)',
                        color: 'var(--color-text)', fontSize: '0.9375rem', outline: 'none',
                      }}
                    />
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                      Seniority Level
                    </label>
                    <select
                      value={seniority}
                      onChange={(e) => setSeniority(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border)',
                        color: 'var(--color-text)', fontSize: '0.9375rem', outline: 'none',
                      }}
                    >
                      <option value="Senior Engineer (4-7 yrs)">Senior Engineer (4-7 yrs)</option>
                      <option value="Staff Engineer (7-10 yrs)">Staff Engineer (7-10 yrs)</option>
                      <option value="Principal Engineer (10-14 yrs)">Principal Engineer (10-14 yrs)</option>
                      <option value="Engineering Manager / Director">Engineering Manager / Director</option>
                      <option value="VP of Engineering / CTO">VP of Engineering / CTO</option>
                    </select>
                  </motion.div>
                  <motion.div variants={staggerItem}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                      Headcount Needed
                    </label>
                    <select
                      value={headcount}
                      onChange={(e) => setHeadcount(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border)',
                        color: 'var(--color-text)', fontSize: '0.9375rem', outline: 'none',
                      }}
                    >
                      <option value="1 Engineer">1 Engineer</option>
                      <option value="2 - 5 Engineers">2 - 5 Engineers</option>
                      <option value="5 - 15 Engineers">5 - 15 Engineers</option>
                    </select>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
              >
                <motion.div variants={staggerContainer} initial="hidden" animate="show">
                  <motion.div variants={staggerItem} style={{ marginBottom: '1.75rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>
                      Required Core Technologies & Domains
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                      {availableSkills.map((skill, idx) => {
                        const selected = selectedSkills.includes(skill);
                        return (
                          <motion.button
                            type="button"
                            key={skill}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05, ...motionTokens.spring.snappy }}
                            onClick={() => toggleSkill(skill)}
                            style={{
                              padding: '0.5rem 1rem',
                              borderRadius: '9999px',
                              border: selected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                              backgroundColor: selected ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                              color: selected ? 'var(--color-primary-400)' : 'var(--color-text-secondary)',
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            <AnimatePresence>
                              {selected && (
                                <motion.span
                                  initial={{ width: 0, opacity: 0, scale: 0 }}
                                  animate={{ width: 'auto', opacity: 1, scale: 1 }}
                                  exit={{ width: 0, opacity: 0, scale: 0 }}
                                >
                                  ✓
                                </motion.span>
                              )}
                            </AnimatePresence>
                            {skill}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    <motion.div variants={staggerItem}>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                        Location / Hub
                      </label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{
                          width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                          backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border)',
                          color: 'var(--color-text)', fontSize: '0.9375rem', outline: 'none',
                        }}
                      >
                        <option value="Bangalore / Hybrid">Bangalore / Hybrid</option>
                        <option value="Hyderabad / Hybrid">Hyderabad / Hybrid</option>
                        <option value="Pune / Hybrid">Pune / Hybrid</option>
                        <option value="Remote (India)">Remote (India)</option>
                        <option value="Global Remote (Worldwide)">Global Remote (Worldwide)</option>
                        <option value="London / Europe">London / Europe</option>
                        <option value="US / Bay Area / NYC">US / Bay Area / NYC</option>
                      </select>
                    </motion.div>

                    <motion.div variants={staggerItem}>
                      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                        Target Budget / Band
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹50L - ₹80L"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        style={{
                          width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                          backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border)',
                          color: 'var(--color-text)', fontSize: '0.9375rem', outline: 'none',
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}
              >
                <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <motion.div variants={staggerItem}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                      Hiring Velocity Urgency
                    </label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border)',
                        color: 'var(--color-text)', fontSize: '0.9375rem', outline: 'none',
                      }}
                    >
                      <option value="Immediate SLA (72-hour delivery)">Immediate SLA (72-hour delivery)</option>
                      <option value="Within 14 Days (Priority)">Within 14 Days (Priority)</option>
                      <option value="Standard 30 Days">Standard 30 Days</option>
                      <option value="Confidential Executive Search">Confidential Executive Search</option>
                    </select>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                      Your Enterprise Email (For Shortlist Delivery) *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="lead@company.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                        backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--color-border)',
                        color: 'var(--color-text)', fontSize: '0.9375rem', outline: 'none',
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                style={{
                  padding: '0.875rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : <div />}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={step === totalSteps && contactEmail ? { boxShadow: ['0 4px 15px rgba(59, 130, 246, 0.4)', '0 4px 25px rgba(59, 130, 246, 0.8)', '0 4px 15px rgba(59, 130, 246, 0.4)'] } : {}}
              transition={step === totalSteps && contactEmail ? { duration: 1.5, repeat: Infinity } : undefined}
              style={{
                padding: '0.875rem 2rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {step === totalSteps ? (
                <>
                  <Sparkles size={16} />
                  <span>Launch Mandate</span>
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

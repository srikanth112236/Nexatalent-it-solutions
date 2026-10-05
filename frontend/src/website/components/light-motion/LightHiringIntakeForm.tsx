import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const LightHiringIntakeForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    practice: 'Distributed Systems',
    seniority: 'Staff / Principal',
    targetSla: '48 Hours',
    company: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      className="theme-light"
      style={{
        backgroundColor: 'var(--nt-surface-2, #f8fafc)',
        borderBottom: '1px solid var(--nt-border, #e2e8f0)',
        padding: '6rem 2rem',
      }}
    >
      <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
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
            fontWeight: 800,
            color: '#2563eb',
            marginBottom: '1rem',
          }}
        >
          <Sparkles size={14} />
          <span>NEXATALENT 48H MANDATE CONFIGURATOR</span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
          Configure Your Hiring Mandate
        </h2>
        <p style={{ color: 'var(--nt-muted, #64748b)', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto 3.5rem auto', lineHeight: 1.6 }}>
          Define role specifications and lock your contractually guaranteed 48-hour calibration delivery SLA.
        </p>

        {/* Multi-Step Form Card */}
        <div
          style={{
            backgroundColor: 'var(--nt-surface, #ffffff)',
            borderRadius: '24px',
            border: '1px solid #cbd5e1',
            padding: '3.5rem 3rem',
            boxShadow: '0 25px 50px -15px rgba(0, 0, 0, 0.06)',
            textAlign: 'left',
          }}
        >
          {/* Progress Indicator */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--nt-muted, #64748b)', marginBottom: '0.5rem' }}>
              <span>Step {step} of 3: {step === 1 ? 'Technical Discipline' : step === 2 ? 'Seniority & Timeline' : 'Contact Credentials'}</span>
              <span style={{ color: '#2563eb' }}>{step === 1 ? '33%' : step === 2 ? '66%' : '100%'}</span>
            </div>
            <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
                style={{ height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }}
              />
            </div>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--nt-ink, #0f172a)', marginBottom: '0.75rem' }}>
                Mandate Successfully Configured
              </h3>
              <p style={{ color: 'var(--nt-muted, #475569)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 2rem auto' }}>
                Your dedicated Practice Lead has been assigned. You will receive 3 calibrated dossiers within our guaranteed 48-hour SLA window.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 700, fontSize: '0.875rem' }}>
                <ShieldCheck size={18} />
                <span>90-Day Replacement Escrow Warranty Active</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <label style={{ display: 'block', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)', marginBottom: '1rem' }}>
                      Select Engineering Practice Domain:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                      {['Distributed Systems', 'Generative AI & LLM', 'HFT & FinTech C++', 'Cloud Native SRE', 'Turnkey GCC Squad', 'Data Engineering'].map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setFormData({ ...formData, practice: p })}
                          style={{
                            padding: '1rem',
                            borderRadius: '14px',
                            border: formData.practice === p ? '2px solid #2563eb' : '1px solid var(--nt-border, #e2e8f0)',
                            backgroundColor: formData.practice === p ? '#eff6ff' : '#f8fafc',
                            color: formData.practice === p ? '#2563eb' : '#334155',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          padding: '0.75rem 1.75rem',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <span>Next Step</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <label style={{ display: 'block', fontSize: '0.9375rem', fontWeight: 800, color: 'var(--nt-ink, #0f172a)', marginBottom: '1rem' }}>
                      Target Seniority Level:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                      {['Senior Engineer (5-8 Yrs)', 'Staff / Principal (8-14 Yrs)', 'VP Engineering / CTO', 'Full GCC Pod (10+ Hires)'].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setFormData({ ...formData, seniority: s })}
                          style={{
                            padding: '1rem',
                            borderRadius: '14px',
                            border: formData.seniority === s ? '2px solid #2563eb' : '1px solid var(--nt-border, #e2e8f0)',
                            backgroundColor: formData.seniority === s ? '#eff6ff' : '#f8fafc',
                            color: formData.seniority === s ? '#2563eb' : '#334155',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: 'var(--nt-surface, #ffffff)',
                          color: 'var(--nt-muted, #475569)',
                          border: '1px solid #cbd5e1',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          cursor: 'pointer',
                        }}
                      >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          padding: '0.75rem 1.75rem',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <span>Next Step</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--nt-ink-2, #334155)', marginBottom: '0.4rem' }}>
                          Company Name:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Acme Cloud Scale"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.875rem 1.25rem',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            outline: 'none',
                            fontSize: '0.9375rem',
                            color: 'var(--nt-ink, #0f172a)',
                            backgroundColor: 'var(--nt-surface-2, #f8fafc)',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: 'var(--nt-ink-2, #334155)', marginBottom: '0.4rem' }}>
                          Work Email (for Encrypted Portal Access):
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="vp.eng@acme.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.875rem 1.25rem',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            outline: 'none',
                            fontSize: '0.9375rem',
                            color: 'var(--nt-ink, #0f172a)',
                            backgroundColor: 'var(--nt-surface-2, #f8fafc)',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: 'var(--nt-surface, #ffffff)',
                          color: 'var(--nt-muted, #475569)',
                          border: '1px solid #cbd5e1',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          cursor: 'pointer',
                        }}
                      >
                        <ArrowLeft size={16} />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          padding: '0.875rem 2rem',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '1rem',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(37, 99, 235, 0.35)',
                        }}
                      >
                        <Zap size={18} />
                        <span>Lock 48h Shortlist SLA</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

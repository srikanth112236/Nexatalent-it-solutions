import React, { useState } from 'react';
import { Send, CheckCircle2, Clock, ShieldCheck, Mail, User, Building, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface ContactFormProps {
  title?: string;
  subtitle?: string;
  onSubmitSuccess?: (data: any) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  title = 'Initiate a High-Priority Conversation',
  subtitle = 'Connect directly with a dedicated Recruitment Practice Lead. Guaranteed response within 4 hours.',
  onSubmitSuccess,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    company: '',
    phone: '',
    inquiryType: 'hiring-talent',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      onSubmitSuccess?.(formData);
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0, rotateX: 15, y: 50, transformPerspective: 1000 },
    visible: { 
      opacity: 1, 
      rotateX: 0, 
      y: 0, 
      transition: { 
        duration: motionTokens.duration.slow, 
        ease: motionTokens.ease.standard,
        staggerChildren: motionTokens.stagger.medium
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: motionTokens.spring.gentle }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      style={{
        borderRadius: 'var(--radius-2xl)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '3rem 2.5rem',
        maxWidth: '700px',
        margin: '0 auto',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <motion.div variants={itemVariants} style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
          {subtitle}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={motionTokens.spring.bouncy}
            style={{
              padding: '2.5rem',
              textAlign: 'center',
              backgroundColor: 'rgba(34, 197, 94, 0.08)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 15, -10, 0] }}
              transition={{ delay: 0.2, ...motionTokens.spring.bouncy }}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
              }}
            >
              <CheckCircle2 size={32} />
            </motion.div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              Inquiry Dispatched Successfully
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', lineHeight: 1.5 }}>
              Thank you, {formData.fullName}. A senior practice director has been assigned to your request and will reach out via <strong style={{ color: 'var(--color-text)' }}>{formData.workEmail}</strong> shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit} 
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* Inquiry Type Radio / Pill */}
            <motion.div variants={itemVariants}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                I am interested in:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                {[
                  { id: 'hiring-talent', label: 'Hiring Tech Talent' },
                  { id: 'gcc-setup', label: 'GCC Incubation' },
                  { id: 'executive-search', label: 'Executive Search' },
                  { id: 'candidate', label: 'Career Opportunities' },
                ].map((type) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    key={type.id}
                    onClick={() => setFormData({ ...formData, inquiryType: type.id })}
                    style={{
                      padding: '0.625rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.inquiryType === type.id ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: formData.inquiryType === type.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                      color: formData.inquiryType === type.id ? 'var(--color-primary-400)' : 'var(--color-text-secondary)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Full Name & Work Email */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <motion.div variants={itemVariants}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--color-text-tertiary)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <motion.input
                    whileFocus={{ scale: 1.01, borderColor: 'var(--color-primary)' }}
                    required
                    type="text"
                    placeholder="e.g. Natasha Rao"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                  Work Email *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--color-text-tertiary)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <motion.input
                    whileFocus={{ scale: 1.01, borderColor: 'var(--color-primary)' }}
                    required
                    type="email"
                    placeholder="natasha@company.com"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Company & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <motion.div variants={itemVariants}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                  Organization / Company
                </label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} color="var(--color-text-tertiary)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <motion.input
                    whileFocus={{ scale: 1.01, borderColor: 'var(--color-primary)' }}
                    type="text"
                    placeholder="e.g. Apex Global Systems"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                  Direct Phone / WhatsApp
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="var(--color-text-tertiary)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <motion.input
                    whileFocus={{ scale: 1.01, borderColor: 'var(--color-primary)' }}
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Message Area */}
            <motion.div variants={itemVariants}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.375rem' }}>
                Brief Mandate Scope or Specific Objectives
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.01, borderColor: 'var(--color-primary)' }}
                rows={4}
                placeholder="Tell us about the roles, seniority, tech stack, or headcount goals..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'border-color 0.2s',
                }}
              />
            </motion.div>

            {/* Submit Button & SLA Assurance */}
            <motion.div variants={itemVariants} style={{ marginTop: '0.5rem' }}>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(59, 130, 246, 0.6)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: loading ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
                  transition: 'background-color 0.2s',
                }}
              >
                <Send size={16} />
                <span>{loading ? 'Transmitting Request...' : 'Send Inquiry to Practice Lead'}</span>
              </motion.button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  marginTop: '1rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} color="var(--color-primary-400)" />
                  Response within 4 business hours
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={12} color="var(--color-success)" />
                  Strict NDA Protected
                </span>
              </div>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

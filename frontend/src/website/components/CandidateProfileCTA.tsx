import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface CandidateProfileCTAProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  perks?: string[];
  ctaLink?: string;
}

const AnimatedCounter: React.FC<{ value: number; duration?: number }> = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

export const CandidateProfileCTA: React.FC<CandidateProfileCTAProps> = ({
  badge = 'For Elite Engineers & Tech Leaders',
  title = 'Confidential Career Representation with Zero Spam',
  subtitle = 'Get matched directly with VP/Director-level hiring decision-makers at tier-1 product organizations, hypergrowth scale-ups, and global GCCs.',
  perks = [
    '100% Confidential — your current employer will never see your profile',
    'Transparent salary benchmarks & verified equity upside',
    'Dedicated technical agent to prep, advocate, and negotiate on your behalf',
  ],
  ctaLink = '/register?type=candidate',
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0].name);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionTokens.duration.slow,
        ease: motionTokens.ease.standard,
        staggerChildren: motionTokens.stagger.medium,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: motionTokens.spring.snappy }
  };

  return (
    <section style={{ padding: '5rem 2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Blobs */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1100px',
          margin: '0 auto',
          borderRadius: 'var(--radius-2xl)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          padding: '3.5rem 3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          boxShadow: 'var(--shadow-xl)',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
        }}
      >
        {/* Left Side: Copy and Perks */}
        <div>
          <motion.div variants={itemVariants}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.875rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-primary-400)',
                marginBottom: '1rem',
              }}
            >
              <Sparkles size={14} />
              {badge}
            </div>
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--color-text)',
              lineHeight: 1.25,
              marginBottom: '1rem',
            }}
          >
            {title}
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '2rem',
            }}
          >
            {subtitle}
          </motion.p>

          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2rem' }}>
            {perks.map((perk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + idx * 0.1, ...motionTokens.spring.snappy }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}
              >
                <CheckCircle2 size={16} color="var(--color-primary-400)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.9375rem', color: 'var(--color-text)' }}>{perk}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              to={ctaLink}
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(59, 130, 246, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  padding: '0.875rem 1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                }}
              >
                <span>Create Candidate Passport</span>
                <ArrowRight size={18} />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
                <AnimatedCounter value={500} />+
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Placements</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)' }}>
                $<AnimatedCounter value={120} duration={1.5} />M+
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Salaries Negotiated</div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Interactive Resume Drop / Quick Profile */}
        <motion.div
          variants={itemVariants}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          animate={{
            scale: dragOver ? 1.02 : 1,
            borderColor: dragOver ? 'var(--color-primary)' : 'var(--color-border)',
            backgroundColor: dragOver ? 'rgba(59, 130, 246, 0.08)' : 'rgba(15, 23, 42, 0.5)',
          }}
          transition={motionTokens.spring.snappy}
          style={{
            borderRadius: 'var(--radius-xl)',
            border: '2px dashed var(--color-border)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <AnimatePresence mode="wait">
            {!uploadedFile ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={motionTokens.spring.snappy}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    color: 'var(--color-primary-400)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                  }}
                >
                  <UploadCloud size={28} />
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  Fast-Track Evaluation
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Drag & drop your CV / GitHub / LinkedIn profile for instant AI skill parsing and recruiter review.
                </p>

                <label
                  style={{
                    display: 'inline-block',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '0.625rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                    }}
                  >
                    <span>Browse Document (PDF / DOCX)</span>
                  </motion.div>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedFile(e.target.files[0].name);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                </label>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={motionTokens.spring.snappy}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                  }}
                >
                  <CheckCircle2 size={28} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  Resume Attached
                </h3>
                <p style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  {uploadedFile}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUploadedFile(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  Remove & Upload New
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
              marginTop: '1.5rem'
            }}
          >
            <Lock size={12} color="var(--color-success)" />
            <span>Strict Privacy Guaranteed · Zero unsolicited contacts</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

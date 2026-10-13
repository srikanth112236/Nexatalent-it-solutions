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
    <section className="font-sans" style={{ padding: '5rem 2rem', position: 'relative', overflow: 'hidden', backgroundColor: '#ffffff' }}>
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
          background: 'none',
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
          backgroundColor: '#ffffff',
          border: '1px solid #000000',
          padding: '3.5rem 3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
          boxShadow: 'var(--shadow-xl)',
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
                backgroundColor: '#000000',
                border: '1px solid #000000',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '1rem',
              }}
            >
              <Sparkles size={14} color="#ffffff" />
              {badge}
            </div>
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: '#000000',
              lineHeight: 1.25,
              marginBottom: '1rem',
            }}
          >
            {title}
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            style={{
              color: '#000000',
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
                <CheckCircle2 size={16} color="#000000" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span style={{ fontSize: '0.9375rem', color: '#000000' }}>{perk}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link
              to={ctaLink}
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  padding: '0.875rem 1.75rem',
                  borderRadius: 'var(--radius-lg)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                }}
              >
                <span>Create Candidate Passport</span>
                <ArrowRight size={18} />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#000000' }}>
                <AnimatedCounter value={500} />+
              </div>
              <div style={{ fontSize: '0.75rem', color: '#000000' }}>Placements</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#000000' }}>
                $<AnimatedCounter value={120} duration={1.5} />M+
              </div>
              <div style={{ fontSize: '0.75rem', color: '#000000' }}>Salaries Negotiated</div>
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
            borderColor: dragOver ? '#000000' : '#000000',
            backgroundColor: dragOver ? 'rgba(0, 0, 0, 0.04)' : '#ffffff',
          }}
          transition={motionTokens.spring.snappy}
          style={{
            borderRadius: 'var(--radius-xl)',
            border: '2px dashed #000000',
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
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                  }}
                >
                  <UploadCloud size={28} />
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#000000', marginBottom: '0.5rem' }}>
                  Fast-Track Evaluation
                </h3>

                <p style={{ fontSize: '0.875rem', color: '#000000', marginBottom: '1.5rem', lineHeight: 1.5 }}>
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
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '0.625rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#ffffff',
                      border: '1px solid #000000',
                      color: '#000000',
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
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                  }}
                >
                  <CheckCircle2 size={28} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#000000', marginBottom: '0.5rem' }}>
                  Resume Attached
                </h3>
                <p style={{ color: '#000000', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  {uploadedFile}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setUploadedFile(null)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#ffffff',
                    border: '1px solid #000000',
                    color: '#000000',
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
              color: '#000000',
              marginTop: '1.5rem'
            }}
          >
            <Lock size={12} color="#000000" />
            <span>Strict Privacy Guaranteed · Zero unsolicited contacts</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

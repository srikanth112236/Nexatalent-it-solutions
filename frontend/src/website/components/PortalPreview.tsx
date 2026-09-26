import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Button, Badge } from '../../shared/primitives';
import { motionTokens } from '../../shared/motion/motionTokens';

export const PortalPreview: React.FC = () => {
  const [activePortal, setActivePortal] = useState<'employer' | 'candidate' | 'recruiter'>('employer');

  const previews = {
    employer: {
      title: 'Employer Requisition Workspace',
      desc: 'Real-time candidate submissions, blind scorecards, and instant feedback loops.',
      route: '/employer',
      stats: '7 Active Roles • 22 Shortlisted Candidates',
    },
    candidate: {
      title: 'Candidate Career Hub',
      desc: 'Confidential application tracking, schedule panel interviews, and manage verified documents.',
      route: '/candidate',
      stats: '96% Profile Match • 2 Scheduled Rounds',
    },
    recruiter: {
      title: 'Recruiter Operations Cockpit',
      desc: 'ATS kanban pipelines, automated candidate reach-outs, and target attainment metrics.',
      route: '/recruiter',
      stats: '12 Managed Mandates • 64 Active Talent Pipeline',
    },
  };

  const curr = previews[activePortal];

  // Magnetic Button Logic
  const buttonRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const magneticX = useSpring(mouseX, springConfig);
  const magneticY = useSpring(mouseY, springConfig);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    mouseX.set(x * 0.2);
    mouseY.set(y * 0.2);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease.standard }}
      style={{ maxWidth: '1280px', margin: '5rem auto', padding: '0 2rem' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ ...motionTokens.spring.snappy, delay: 0.1 }}
        >
          <Badge variant="primary" style={{ marginBottom: '1rem' }}>Platform Technology</Badge>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.standard, delay: 0.2 }}
          style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800 }}
        >
          Purpose-Built Portals for Every Stakeholder
        </motion.h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {(['employer', 'candidate', 'recruiter'] as const).map((p) => (
          <div key={p} style={{ position: 'relative' }}>
            {activePortal === p && (
              <motion.div
                layoutId="portalActivePill"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'var(--color-primary)',
                  borderRadius: 'var(--radius-pill)',
                  zIndex: 0
                }}
                transition={motionTokens.spring.snappy}
              />
            )}
            <button
              type="button"
              onClick={() => setActivePortal(p)}
              style={{
                position: 'relative',
                zIndex: 1,
                padding: '0.625rem 1.25rem',
                borderRadius: 'var(--radius-pill)',
                border: activePortal === p ? '1px solid transparent' : '1px solid var(--color-border)',
                backgroundColor: 'transparent',
                color: activePortal === p ? '#ffffff' : 'var(--color-text-muted)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'color 0.2s',
                textTransform: 'capitalize',
              }}
            >
              {p} Portal Preview
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activePortal}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.outQuart }}
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--color-border)',
            padding: '3rem',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div style={{ maxWidth: '580px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...motionTokens.spring.bouncy, delay: 0.1 }}
            >
              <Badge variant="accent" style={{ marginBottom: '1rem' }}>{curr.stats}</Badge>
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: motionTokens.duration.standard, delay: 0.2 }}
              style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ffffff' }}
            >
              {curr.title}
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: motionTokens.duration.slow, delay: 0.3 }}
              style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}
            >
              {curr.desc}
            </motion.p>
            
            <motion.div
              ref={buttonRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ x: magneticX, y: magneticY, display: 'inline-block' }}
            >
              <Link to={curr.route} style={{ textDecoration: 'none' }}>
                <Button variant="primary">Launch {activePortal} Portal &rarr;</Button>
              </Link>
            </motion.div>
          </div>

          <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-xl)', padding: '2rem', border: '1px solid var(--color-border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Live Portal Interface Mock
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1, 2, 3].map((item, idx) => (
                <motion.div 
                  key={item}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: motionTokens.duration.standard, 
                    delay: 0.3 + idx * motionTokens.stagger.medium,
                    ease: motionTokens.ease.outQuart
                  }}
                  style={{ height: '40px', backgroundColor: 'var(--color-bg)', borderRadius: '6px' }} 
                />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
};

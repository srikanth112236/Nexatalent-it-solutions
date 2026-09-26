import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface FloatingCTAProps {
  headline?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({
  badge = 'Active SLA Guaranteed',
  headline = 'Need senior engineers in under 72 hours?',
  ctaText = 'Submit Mandate',
  ctaLink = '/employers',
  secondaryText = 'Browse Open Roles',
  secondaryLink = '/jobs',
}) => {
  const [visible, setVisible] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 250);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && show && (
        <motion.aside
          aria-label="Quick Actions"
          initial={{ y: 150, opacity: 0, scale: 0.9, x: '-50%' }}
          animate={{ y: 0, opacity: 1, scale: 1, x: '-50%' }}
          exit={{ y: 150, opacity: 0, scale: 0.9, x: '-50%' }}
          transition={motionTokens.spring.snappy}
          whileHover={{ y: -5, x: '-50%', scale: 1.02 }}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: '50%',
            zIndex: 900,
            width: 'calc(100% - 2rem)',
            maxWidth: '860px',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(59, 130, 246, 0.2)',
            padding: '0.875rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Left Message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <motion.div
              animate={{ 
                boxShadow: ['0 0 10px var(--color-success)', '0 0 20px var(--color-success)', '0 0 10px var(--color-success)'],
                opacity: [1, 0.7, 1]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success)',
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-400)', textTransform: 'uppercase' }}>
                  {badge}
                </span>
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
                {headline}
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to={secondaryLink}
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                fontWeight: 600,
                padding: '0.4rem 0.75rem',
              }}
            >
              {secondaryText}
            </Link>

            <Link
              to={ctaLink}
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: ['0 4px 12px rgba(59, 130, 246, 0.4)', '0 4px 20px rgba(59, 130, 246, 0.8)', '0 4px 12px rgba(59, 130, 246, 0.4)'] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{ctaText}</span>
                <ArrowRight size={14} />
              </motion.div>
            </Link>

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setVisible(false)}
              aria-label="Dismiss banner"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-tertiary)',
                cursor: 'pointer',
                padding: '0.25rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
            >
              <X size={16} />
            </motion.button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface TrustSignalItem {
  iconName?: string;
  headline: string;
  subtext: string;
}

export interface TrustSignalStripProps {
  signals?: TrustSignalItem[];
}

export const TrustSignalStrip: React.FC<TrustSignalStripProps> = ({
  signals = [
    {
      headline: 'SOC-2 Type II & ISO 27001',
      subtext: 'Enterprise-grade data encryption and candidate confidentiality compliance',
    },
    {
      headline: '90-Day Warranty Protected',
      subtext: '100% unconditional candidate replacement guarantee on all placements',
    },
    {
      headline: 'Strict 48-Hour Shortlist SLA',
      subtext: 'Guaranteed 3 to 5 pre-screened senior profiles within 2 business days',
    },
    {
      headline: 'Zero Unsolicited Outreach',
      subtext: 'Targeted technical pitches with verified candidate consent protocols',
    },
  ],
}) => {
  const containerVariants = {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      filter: 'blur(0px)',
      transition: { 
        duration: motionTokens.duration.slow, 
        ease: motionTokens.ease.standard,
        staggerChildren: motionTokens.stagger.medium
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: motionTokens.spring.gentle
    }
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={containerVariants}
      style={{
        padding: '2.5rem 2rem',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {signals.map((sig, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                cursor: 'default',
                padding: '0.5rem',
                borderRadius: 'var(--radius-lg)',
                transition: 'background-color 0.3s ease'
              }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: idx * 0.1 + 0.2, ...motionTokens.spring.bouncy }}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: 'var(--color-primary-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 0 0 rgba(59, 130, 246, 0)'
                }}
                whileHover={{
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)'
                }}
              >
                <ShieldCheck size={20} />
              </motion.div>
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.2rem' }}>
                  {sig.headline}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {sig.subtext}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

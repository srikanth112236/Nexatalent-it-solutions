import React from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

const partners = [
  'DATADOG', 'STRIPE', 'SNOWFLAKE', 'MONGODB', 'CLOUDFLARE', 'AMAZON AWS', 'MICROSOFT AZURE', 'SCALE AI', 'HASHICORP',
];

export const LogoMarquee: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease.outQuart }}
      style={{
        padding: '3rem 0',
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style>
        {`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 2rem)); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(calc(-50% - 2rem)); }
            100% { transform: translateX(0); }
          }
          .marquee-container:hover .marquee-content {
            animation-play-state: paused;
          }
        `}
      </style>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Trusted by Engineering Teams & GCC Hubs Globally
      </div>

      <div className="marquee-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', userSelect: 'none' }}>
        
        {/* Top Row - Scrolls Left */}
        <div className="marquee-content" style={{ display: 'flex', gap: '4rem', width: 'max-content', animation: 'scroll-left 40s linear infinite' }}>
          {[...partners, ...partners].map((name, i) => (
            <motion.div
              key={`top-${i}`}
              whileHover={{ scale: 1.1, opacity: 1, color: 'var(--color-text)' }}
              transition={motionTokens.spring.snappy}
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--color-text-subtle)',
                letterSpacing: '0.05em',
                opacity: 0.7,
                cursor: 'default'
              }}
            >
              {name}
            </motion.div>
          ))}
        </div>

        {/* Bottom Row - Scrolls Right */}
        <div className="marquee-content" style={{ display: 'flex', gap: '4rem', width: 'max-content', animation: 'scroll-right 45s linear infinite' }}>
          {[...partners, ...partners].reverse().map((name, i) => (
            <motion.div
              key={`bottom-${i}`}
              whileHover={{ scale: 1.1, opacity: 1, color: 'var(--color-text)' }}
              transition={motionTokens.spring.snappy}
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--color-text-subtle)',
                letterSpacing: '0.05em',
                opacity: 0.5,
                cursor: 'default'
              }}
            >
              {name}
            </motion.div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

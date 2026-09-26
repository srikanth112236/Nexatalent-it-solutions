import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

const AnimatedNumber = ({ valueStr }: { valueStr: string }) => {
  const numMatch = valueStr.match(/[\d.]+/);
  const prefix = valueStr.split(/[\d.]+/)[0] || '';
  const suffix = valueStr.split(/[\d.]+/)[1] || '';
  const targetNumber = numMatch ? parseFloat(numMatch[0]) : 0;
  
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  useEffect(() => {
    if (!isInView || targetNumber === 0) return;
    
    let startTimestamp: number;
    const duration = 2000;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Use easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(easeProgress * targetNumber);
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayValue(targetNumber);
      }
    };
    
    requestAnimationFrame(step);
  }, [isInView, targetNumber]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {prefix}
      {Number.isInteger(targetNumber) ? Math.floor(displayValue) : displayValue.toFixed(1)}
      {suffix}
    </span>
  );
};

export const MetricsCounter: React.FC = () => {
  const stats = [
    { value: '45k+', label: 'Vetted Specialists', detail: 'Pre-screened tech talent' },
    { value: '94%', label: 'Offer Acceptance', detail: 'Calibrated compensation' },
    { value: '4.2d', label: 'Average Time-to-Shortlist', detail: 'From mandate kick-off' },
    { value: '98.6%', label: '90-Day Retention', detail: 'On permanent placements' },
  ];

  return (
    <section style={{ maxWidth: '1280px', margin: '4rem auto', padding: '0 2rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 40, boxShadow: '0 0 0 rgba(var(--color-primary-rgb), 0)' }}
        whileInView={{ 
          opacity: 1, 
          y: 0,
          boxShadow: '0 20px 40px -20px rgba(var(--color-primary-rgb), 0.3)'
        }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease.outQuart }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          padding: '3rem 2.5rem',
          backgroundColor: 'rgba(var(--color-surface-rgb), 0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid rgba(var(--color-border-rgb), 0.5)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            border: '2px solid var(--color-primary)',
            pointerEvents: 'none',
            opacity: 0.1
          }}
        />
        
        {stats.map((s, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + (idx * motionTokens.stagger.medium), duration: motionTokens.duration.standard, ...motionTokens.spring.snappy }}
            style={{ textAlign: 'center', zIndex: 1 }}
          >
            <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
              <AnimatedNumber valueStr={s.value} />
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
              {s.label}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {s.detail}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

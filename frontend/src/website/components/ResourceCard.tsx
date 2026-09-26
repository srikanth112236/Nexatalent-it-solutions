import React, { useEffect, useRef } from 'react';
import { Download, FileText, ArrowUpRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useInView, animate } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface ResourceCardProps {
  id: string;
  title: string;
  type: string; // 'Salary Report' | 'Whitepaper' | 'GCC Playbook'
  description: string;
  pages?: number;
  format?: string;
  downloadsCount?: string;
  isGated?: boolean;
  downloadUrl?: string;
}

const Counter = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView && ref.current) {
      const numStr = value.replace(/[^\d.]/g, '');
      const num = parseFloat(numStr);
      if (isNaN(num)) {
        ref.current.textContent = value;
        return;
      }
      const prefix = value.split(/[\d.]/)[0] || '';
      const suffix = value.replace(prefix, '').replace(/[\d.]/g, '') || '';
      
      const controls = animate(0, num, {
        duration: motionTokens.duration.slow * 2,
        ease: motionTokens.ease.standard,
        onUpdate: (v) => {
          if (ref.current) {
            ref.current.textContent = `${prefix}${Math.round(v).toLocaleString()}${suffix}`;
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref}>{value}</span>;
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  title,
  type = 'Salary Benchmark Guide',
  description,
  pages = 42,
  format = 'PDF',
  downloadsCount = '3,200+ Downloads',
  isGated = true,
  downloadUrl = `/resources/${id}`,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={motionTokens.spring.gentle}
      whileHover={{ y: -8, scale: 1.02, boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.2)' }}
      style={{
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', overflow: 'hidden' }}>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ...motionTokens.spring.snappy }}
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-primary-400)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              padding: '0.25rem 0.625rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {type}
          </motion.span>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: motionTokens.duration.standard }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <FileText size={14} />
            <span>{pages} Pages · {format}</span>
          </motion.div>
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.4,
            marginBottom: '0.75rem',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
          <Counter value={downloadsCount} />
        </span>

        <motion.div whileHover="hover">
          <Link
            to={downloadUrl}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: 'var(--color-primary-400)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              variants={{
                hover: { y: -2, scale: 1.1, transition: motionTokens.spring.snappy }
              }}
            >
              {isGated ? <Lock size={13} /> : <Download size={13} />}
            </motion.div>
            <span>Download Guide</span>
            <motion.div
              variants={{
                hover: { x: 2, y: -2, transition: motionTokens.spring.snappy }
              }}
            >
              <ArrowUpRight size={14} />
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

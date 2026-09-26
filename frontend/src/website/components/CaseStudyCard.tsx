import React from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface CaseStudyCardProps {
  id?: string;
  client: string;
  industry: string;
  headline: string;
  metrics: Array<{ label: string; value: string }>;
  tags?: string[];
  duration?: string;
  link?: string;
  featured?: boolean;
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  id = 'fintech-gcc',
  client = 'AlphaFin Global Technologies',
  industry = 'Fintech & High Frequency Trading',
  headline = 'Scaling an India GCC from 0 to 45 Senior Staff Engineers in 75 Days',
  metrics = [
    { label: 'Hires Closed', value: '45' },
    { label: 'Time-to-Hire', value: '18 Days' },
    { label: 'Retention at 12M', value: '98%' },
  ],
  tags = ['Golang', 'Low-Latency', 'GCC Buildout', 'Executive Search'],
  duration = '75-day SLA Sprint',
  link = `/case-studies/${id}`,
  featured = false,
}) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0, scale: 0.97 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.outQuart }}
      whileHover={{ y: -6, scale: 1.015, boxShadow: featured ? '0 15px 35px rgba(59, 130, 246, 0.25)' : 'var(--shadow-lg)', borderColor: 'rgba(59, 130, 246, 0.5)' }}
      style={{
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--color-surface)',
        border: featured ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--color-border)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: featured ? '0 12px 30px rgba(59, 130, 246, 0.15)' : 'var(--shadow-md)',
      }}
      className="group"
    >
      {featured && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...motionTokens.spring.bouncy, delay: 0.3 }}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '9999px',
            padding: '0.25rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-primary-400)',
          }}
        >
          Featured Story
        </motion.div>
      )}

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-primary-400)',
            }}
          >
            {industry}
          </span>
          <span style={{ color: 'var(--color-text-tertiary)' }}>•</span>
          <span
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <Clock size={12} />
            {duration}
          </span>
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.4,
            marginBottom: '1rem',
          }}
        >
          {headline}
        </h3>

        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          Client: <strong style={{ color: 'var(--color-text)' }}>{client}</strong>
        </div>

        {/* Metrics Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '1.5rem',
          }}
        >
          {metrics.map((m, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + idx * motionTokens.stagger.medium }}
              style={{ textAlign: 'center' }}
            >
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--color-primary-400)',
                  lineHeight: 1.2,
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-tertiary)',
                  marginTop: '0.25rem',
                  lineHeight: 1.2,
                }}
              >
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.5rem' }}>
          {tags.map((tag, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + idx * 0.04 }}
              style={{
                fontSize: '0.6875rem',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--color-text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      <Link
        to={link}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          color: 'var(--color-primary-400)',
          textDecoration: 'none',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <span>Read Full Case Study</span>
        <motion.div
          variants={{
            rest: { x: 0 },
            hover: { x: 4 }
          }}
          initial="rest"
          whileHover="hover"
          transition={motionTokens.spring.snappy}
        >
          <ArrowUpRight size={16} />
        </motion.div>
      </Link>
    </motion.div>
  );
};

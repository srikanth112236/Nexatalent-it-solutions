import React from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface InsightCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  readTime: string;
  date: string;
  featured?: boolean;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  id,
  title,
  excerpt,
  category = 'Engineering Leadership',
  author = {
    name: 'Rohit Mathur',
    role: 'Managing Director, Executive Search',
  },
  readTime = '6 min read',
  date = 'Sep 2026',
  featured = false,
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.standard }}
      whileHover={{ y: -6, scale: 1.015 }}
      style={{
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--color-surface)',
        border: featured ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--color-border)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.25s ease, border-color 0.25s ease',
      }}
      onHoverStart={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.boxShadow = '0 10px 30px -10px rgba(59, 130, 246, 0.3)';
        target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
      }}
      onHoverEnd={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.boxShadow = 'var(--shadow-sm)';
        target.style.borderColor = featured ? 'rgba(59, 130, 246, 0.4)' : 'var(--color-border)';
      }}
    >
      <div>
        {/* Category & Read Time */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', overflow: 'hidden' }}>
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...motionTokens.spring.gentle, delay: 0.1 }}
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-primary-400)',
            }}
          >
            {category}
          </motion.span>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: motionTokens.duration.standard, delay: 0.2 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <Clock size={12} />
            <span>{readTime}</span>
          </motion.div>
        </div>

        {/* Title */}
        <Link to={`/insights/${id}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              lineHeight: 1.35,
              marginBottom: '0.75rem',
            }}
          >
            {title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
          }}
        >
          {excerpt}
        </p>
      </div>

      {/* Author and Date Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              color: 'var(--color-primary-400)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8125rem',
              fontWeight: 700,
            }}
          >
            {author.name[0]}
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)' }}>
              {author.name}
            </div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)' }}>
              {date}
            </div>
          </div>
        </div>

        <Link
          to={`/insights/${id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: 'var(--color-primary-400)',
            textDecoration: 'none',
            overflow: 'hidden',
          }}
          aria-label="Read article"
        >
          <motion.div
            whileHover={{ x: 4, y: -4 }}
            transition={motionTokens.spring.snappy}
          >
            <ArrowUpRight size={18} />
          </motion.div>
        </Link>
      </div>
    </motion.article>
  );
};

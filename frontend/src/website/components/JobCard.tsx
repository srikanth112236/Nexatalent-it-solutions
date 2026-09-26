import React, { useState, useRef } from 'react';
import { MapPin, DollarSign, Briefcase, Bookmark, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  tags: string[];
  postedAt: string;
  featured?: boolean;
  urgent?: boolean;
  onApply?: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  company,
  location,
  type = 'Full-Time · Remote',
  salary = '$140k - $185k + Equity',
  experience = '7+ Years',
  tags = ['Golang', 'Kubernetes', 'Distributed Systems'],
  postedAt = '2 days ago',
  featured = false,
  urgent = false,
  onApply,
}) => {
  const [saved, setSaved] = useState(false);

  // Magnetic Apply Button Logic
  const buttonRef = useRef<HTMLButtonElement>(null);
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
    mouseX.set(x * 0.15);
    mouseY.set(y * 0.15);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: motionTokens.duration.standard }}
      whileHover={{ y: -6, scale: 1.02 }}
      style={{
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--color-surface)',
        border: featured ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid var(--color-border)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: featured ? '0 10px 25px -5px rgba(59, 130, 246, 0.15)' : 'var(--shadow-sm)',
      }}
    >
      <div>
        {/* Header Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {featured && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={motionTokens.spring.bouncy}
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: 'var(--color-primary-400)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}
              >
                Featured
              </motion.span>
            )}
            {urgent && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...motionTokens.spring.bouncy, delay: 0.1 }}
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                Priority SLA
              </motion.span>
            )}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...motionTokens.spring.bouncy, delay: 0.2 }}
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                padding: '0.2rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--color-text-secondary)',
              }}
            >
              Verified Role
            </motion.span>
          </div>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setSaved(!saved)}
            aria-label="Save job"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: saved ? 'var(--color-primary-400)' : 'var(--color-text-tertiary)',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
          </motion.button>
        </div>

        {/* Title and Company */}
        <Link
          to={`/jobs/${id}`}
          style={{ textDecoration: 'none' }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-text)',
              marginBottom: '0.25rem',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h3>
        </Link>
        <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          {company}
        </div>

        {/* Meta details */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="var(--color-text-tertiary)" />
            <span>{location} · {type}</span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'default' }}
          >
            <DollarSign size={14} color="var(--color-success)" />
            <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>{salary}</span>
          </motion.div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Briefcase size={14} color="var(--color-text-tertiary)" />
            <span>{experience}</span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem' }}>
          {tags.map((tag, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--color-text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
          <Clock size={12} />
          <span>{postedAt}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            to={`/jobs/${id}`}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              padding: '0.4rem 0.75rem',
            }}
          >
            Details
          </Link>
          <motion.button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
            style={{ x: magneticX, y: magneticY, display: 'inline-block' }}
            onClick={() => onApply?.(id)}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}>
              <span>Apply</span>
              <ArrowUpRight size={14} />
            </div>
          </motion.button>
        </div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </motion.div>
  );
};

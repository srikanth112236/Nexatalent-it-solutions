import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Filter, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface JobSearchInterfaceProps {
  onSearch?: (criteria: { keyword: string; location: string; department: string }) => void;
  onOpenFilterDrawer?: () => void;
  totalRolesCount?: number;
}

export const JobSearchInterface: React.FC<JobSearchInterfaceProps> = ({
  onSearch,
  onOpenFilterDrawer,
  totalRolesCount = 284,
}) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [department, setDepartment] = useState('All Specializations');
  const [selectedPills, setSelectedPills] = useState<string[]>(['Remote', 'High Comp (>₹60L)']);
  const [isFocused, setIsFocused] = useState(false);

  const popularFilters = [
    'Remote',
    'High Comp (>₹60L)',
    'GCC Leadership',
    'Distributed Systems',
    'Rust / Go',
    'AI / LLM Ops',
  ];

  const togglePill = (pill: string) => {
    setSelectedPills((prev) =>
      prev.includes(pill) ? prev.filter((p) => p !== pill) : [...prev, pill]
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.({ keyword, location, department });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease.standard }}
      style={{
        borderRadius: 'var(--radius-2xl)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '2rem',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <form onSubmit={handleSearchSubmit}>
        {/* Main Search Inputs Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr)) 120px',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1.25rem',
          }}
        >
          {/* Keyword Input */}
          <div style={{ position: 'relative' }}>
            <motion.div 
              animate={isFocused ? { rotate: 90, scale: 1.1, color: 'var(--color-primary-400)' } : { rotate: 0, scale: 1, color: 'var(--color-text-tertiary)' }}
              transition={motionTokens.spring.snappy}
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}
            >
              <Search size={18} />
            </motion.div>
            <motion.input
              whileFocus={{ scale: 1.02, backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'var(--color-primary)' }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              type="text"
              placeholder="Job title, skill, or keyword (e.g. Staff SRE)"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8125rem 1rem 0.8125rem 2.75rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                fontSize: '0.9375rem',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          {/* Location Select */}
          <motion.div whileHover={{ scale: 1.02 }} style={{ position: 'relative' }}>
            <MapPin size={18} color="var(--color-text-tertiary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8125rem 1rem 0.8125rem 2.75rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                fontSize: '0.9375rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="All Locations">All Locations</option>
              <option value="Bangalore, India">Bangalore, India</option>
              <option value="Hyderabad, India">Hyderabad, India</option>
              <option value="Pune, India">Pune, India</option>
              <option value="Remote / Worldwide">Remote / Worldwide</option>
              <option value="London / UK">London / UK</option>
              <option value="San Francisco / US">San Francisco / US</option>
            </select>
          </motion.div>

          {/* Department Select */}
          <motion.div whileHover={{ scale: 1.02 }} style={{ position: 'relative' }}>
            <Briefcase size={18} color="var(--color-text-tertiary)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8125rem 1rem 0.8125rem 2.75rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                fontSize: '0.9375rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="All Specializations">All Specializations</option>
              <option value="Engineering & Architecture">Engineering & Architecture</option>
              <option value="AI & Machine Learning">AI & Machine Learning</option>
              <option value="Cloud, SRE & Platform">Cloud, SRE & Platform</option>
              <option value="Executive & Engineering Leadership">Executive Leadership</option>
              <option value="Product & Technical Program">Product Management</option>
            </select>
          </motion.div>

          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            style={{
              padding: '0.8125rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
            }}
          >
            <span>Search</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* Filter Pills and Total Found */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-tertiary)' }}>
              Quick Filters:
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {popularFilters.map((pill, idx) => {
                const active = selectedPills.includes(pill);
                return (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.05, ...motionTokens.spring.snappy }}
                    type="button"
                    key={pill}
                    onClick={() => togglePill(pill)}
                    style={{
                      position: 'relative',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      border: active ? '1px solid transparent' : '1px solid var(--color-border)',
                      backgroundColor: 'transparent',
                      color: active ? 'var(--color-primary-400)' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {active && (
                      <motion.div
                        layoutId="activePill"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          border: '1px solid var(--color-primary)',
                          borderRadius: '9999px',
                          zIndex: -1
                        }}
                        transition={motionTokens.spring.snappy}
                      />
                    )}
                    {pill}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
          >
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
              <strong style={{ color: 'var(--color-text)' }}>{totalRolesCount}</strong> Mandates Active
            </span>

            {onOpenFilterDrawer && (
              <motion.button
                whileHover={{ scale: 1.05, color: 'var(--color-primary)' }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onOpenFilterDrawer}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8125rem',
                  color: 'var(--color-primary-400)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                <Filter size={14} />
                <span>Filters</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
};

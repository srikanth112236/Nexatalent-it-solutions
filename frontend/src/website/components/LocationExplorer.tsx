import React, { useState, useEffect } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface LocationItem {
  id: string;
  city: string;
  country: string;
  activeRoles: number;
  avgComp: string;
  popularTech: string[];
  description: string;
}

export interface LocationExplorerProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  locations?: LocationItem[];
}

const AnimatedRoleCounter: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = 1500 / end;
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 20);
      if (start > end) start = end;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

export const LocationExplorer: React.FC<LocationExplorerProps> = ({
  badge = 'Global Talent Hubs',
  title = 'Where Elite Engineering Teams Congregate',
  subtitle = 'Deep talent intelligence and localized compensation indexing across premier global engineering centers.',
  locations = [
    {
      id: 'bangalore',
      city: 'Bangalore',
      country: 'India',
      activeRoles: 114,
      avgComp: '₹48L - ₹85L',
      popularTech: ['Distributed Systems', 'Platform Eng', 'Fintech Core', 'AI/ML'],
      description: 'The Silicon Valley of Asia, home to over 400+ Fortune 500 GCCs and top unicorn engineering offices.',
    },
    {
      id: 'hyderabad',
      city: 'Hyderabad',
      country: 'India',
      activeRoles: 78,
      avgComp: '₹42L - ₹75L',
      popularTech: ['Cloud Infrastructure', 'Enterprise SaaS', 'Big Data', 'Security'],
      description: 'Major hyperscaler hub housing Microsoft, Google, AWS, and modern enterprise software headquarters.',
    },
    {
      id: 'pune',
      city: 'Pune',
      country: 'India',
      activeRoles: 42,
      avgComp: '₹38L - ₹65L',
      popularTech: ['Automotive Tech', 'IoT / Embedded', 'Banking', 'Kubernetes'],
      description: 'Premier hub for automotive software, autonomous systems, and tier-1 banking technology centers.',
    },
    {
      id: 'remote-global',
      city: 'Global Remote',
      country: 'Worldwide',
      activeRoles: 50,
      avgComp: '$120k - $210k',
      popularTech: ['Rust', 'Go', 'WebAssembly', 'Async Leadership'],
      description: 'Cross-border engineering roles with US and European entities offering asynchronous flexibility and equity.',
    },
  ],
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: motionTokens.stagger.medium,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: motionTokens.spring.snappy }
  };

  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease.standard }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-primary-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {badge}
          </span>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)', marginTop: '0.5rem' }}>
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0.75rem auto 0 auto' }}>
            {subtitle}
          </p>
        </motion.div>

        {/* Location Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            position: 'relative'
          }}
        >
          {locations.map((loc) => (
            <motion.div
              key={loc.id}
              variants={cardVariants}
              onMouseEnter={() => setHoveredId(loc.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ position: 'relative', zIndex: hoveredId === loc.id ? 10 : 1 }}
            >
              <AnimatePresence>
                {hoveredId === loc.id && (
                  <motion.div
                    layoutId="locationGlow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={motionTokens.spring.snappy}
                    style={{
                      position: 'absolute',
                      inset: '-1px',
                      borderRadius: 'var(--radius-xl)',
                      background: 'linear-gradient(135deg, var(--color-primary), transparent)',
                      zIndex: -1,
                      filter: 'blur(8px)',
                    }}
                  />
                )}
              </AnimatePresence>
              
              <motion.div
                animate={{
                  y: hoveredId === loc.id ? -8 : 0,
                  borderColor: hoveredId === loc.id ? 'var(--color-primary)' : 'var(--color-border)',
                }}
                transition={motionTokens.spring.snappy}
                style={{
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: hoveredId === loc.id ? '0 20px 40px rgba(0,0,0,0.4)' : 'var(--shadow-sm)',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <motion.div
                        animate={{ y: hoveredId === loc.id ? [0, -5, 0] : 0 }}
                        transition={{ duration: 0.5, repeat: hoveredId === loc.id ? Infinity : 0, repeatDelay: 1 }}
                      >
                        <MapPin size={18} color="var(--color-primary-400)" />
                      </motion.div>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
                          {loc.city}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{loc.country}</span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-primary-400)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                      }}
                    >
                      {hoveredId === loc.id ? <AnimatedRoleCounter value={loc.activeRoles} /> : loc.activeRoles} Open Roles
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {loc.description}
                  </p>

                  {/* Avg Compensation Chip */}
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                      Median Senior Comp Band
                    </div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.2rem' }}>
                      {loc.avgComp}
                    </div>
                  </div>

                  {/* Tech Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.5rem' }}>
                    {loc.popularTech.map((tech, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.6875rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/jobs?location=${encodeURIComponent(loc.city)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <motion.div
                    whileHover={{ x: 5 }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--color-primary-400)',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--color-border)',
                      width: '100%',
                    }}
                  >
                    <span>View {loc.city} Mandates</span>
                    <ArrowRight size={14} />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

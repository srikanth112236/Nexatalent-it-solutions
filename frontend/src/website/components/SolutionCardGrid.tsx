import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

const solutions = [
  {
    slug: 'permanent-hiring',
    title: 'Permanent Hiring',
    desc: 'Full-lifecycle technical recruitment for mission-critical core team additions.',
    tag: 'Core Teams',
  },
  {
    slug: 'contract-staffing',
    title: 'Contract Staffing',
    desc: 'Agile specialist deployment for high-priority sprints, migrations, and tech roadmaps.',
    tag: 'Flexible Staffing',
  },
  {
    slug: 'executive-search',
    title: 'Executive Search',
    desc: 'Discrete leadership placement for CTOs, VPs of Engineering, and Heads of Product.',
    tag: 'Executive',
  },
  {
    slug: 'gcc-hiring',
    title: 'GCC & Global Tech Hubs',
    desc: 'Building and scaling dedicated Global Capability Centers with complete governance.',
    tag: 'Enterprise Scale',
  },
  {
    slug: 'volume-hiring',
    title: 'Volume Hiring & Ramp-Ups',
    desc: 'High-throughput cohort recruiting maintaining strict bar-raiser standards.',
    tag: 'Scale',
  },
  {
    slug: 'talent-advisory',
    title: 'Talent Market Advisory',
    desc: 'Compensation calibration, tech stack availability analysis, and competitor benchmarking.',
    tag: 'Intelligence',
  },
];

export const SolutionCardGrid: React.FC = () => {
  return (
    <section style={{ maxWidth: '1280px', margin: '5rem auto', padding: '0 2rem', position: 'relative' }}>
      <motion.div
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: -1,
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: motionTokens.stagger.medium } }
          }}
        >
          <motion.span 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.outQuart }}
            style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Hiring Capabilities
          </motion.span>
          <motion.h2 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.outQuart }}
            style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, marginTop: '0.5rem' }}
          >
            Tailored Solutions for Every Growth Horizon
          </motion.h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: motionTokens.duration.standard }}
        >
          <Link to="/solutions" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>
            Explore All Solutions &rarr;
          </Link>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {solutions.map((sol, idx) => (
          <motion.div
            key={sol.slug}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: idx * motionTokens.stagger.medium, duration: motionTokens.duration.slow, ease: motionTokens.ease.outQuart }}
          >
            <motion.div
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                boxShadow: '0 10px 40px -10px rgba(var(--color-primary-rgb), 0.2)',
                borderColor: 'var(--color-primary)'
              }}
              transition={motionTokens.spring.snappy}
              style={{
                height: '100%',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.3s ease',
              }}
            >
              <Link
                to={`/solutions/${sol.slug}`}
                style={{
                  padding: '2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  height: '100%'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {sol.tag}
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', margin: '0.75rem 0 0.5rem 0' }}>
                    {sol.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                    {sol.desc}
                  </p>
                </div>
                <div style={{ marginTop: '2rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>View Engagement Model</span>
                  <span>&rarr;</span>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface IndustryVertical {
  id: string;
  name: string;
  iconName: string;
  description: string;
  activeMandates: number;
  avgClosureDays: number;
  highlightRoles: string[];
}

export interface IndustryExplorerProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  industries?: IndustryVertical[];
}

const AnimatedCounter: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number;
    const duration = 1500;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(ease * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, inView]);

  return <span ref={nodeRef}>{count}</span>;
};

export const IndustryExplorer: React.FC<IndustryExplorerProps> = ({
  badge = 'Domain Specialization Practices',
  title = 'Engineered for High-Complexity Verticals',
  subtitle = 'We do not run generalist recruiting. Each practice is headed by recruiters with technical roots in these domains.',
  industries = [
    {
      id: 'fintech-crypto',
      name: 'FinTech, HFT & Payments',
      iconName: 'Cpu',
      description: 'Ultra-low latency exchange gateways, core banking platforms, risk engines, and blockchain protocols.',
      activeMandates: 64,
      avgClosureDays: 19,
      highlightRoles: ['Low-Latency C++ Architect', 'Financial Quantitative Dev', 'Staff Core Banking Lead'],
    },
    {
      id: 'ai-machine-learning',
      name: 'AI, LLMs & Foundation Models',
      iconName: 'Cpu',
      description: 'Training infrastructure, inference optimization, vector DB engines, and enterprise generative AI solutions.',
      activeMandates: 82,
      avgClosureDays: 16,
      highlightRoles: ['LLMOps Platform Lead', 'CUDA Optimization Specialist', 'Founding ML Scientist'],
    },
    {
      id: 'cloud-infrastructure',
      name: 'Cloud Native & SRE Platforms',
      iconName: 'Cloud',
      description: 'Distributed Kubernetes systems, mesh networking, multi-cloud governance, and zero-downtime architectures.',
      activeMandates: 55,
      avgClosureDays: 22,
      highlightRoles: ['Staff Kubernetes Operator Dev', 'Principal Reliability Architect', 'Cloud Security Director'],
    },
    {
      id: 'gcc-india',
      name: 'Global Capability Centers (GCCs)',
      iconName: 'Building',
      description: 'Turnkey leadership hiring and rapid engineering squad incubation for US and European enterprise parents.',
      activeMandates: 91,
      avgClosureDays: 25,
      highlightRoles: ['GCC Site Managing Director', 'Head of India Engineering', 'Founding Staff Team Leads'],
    },
    {
      id: 'health-biotech',
      name: 'HealthTech & Bio-Informatics',
      iconName: 'HeartPulse',
      description: 'HIPAA-compliant distributed medical records, genomic data pipelines, and telemedicine infrastructure.',
      activeMandates: 38,
      avgClosureDays: 24,
      highlightRoles: ['Staff Health Data Architect', 'VP Healthcare Security', 'Lead Clinical Systems Eng'],
    },
    {
      id: 'mobility-automotive',
      name: 'Automotive & Autonomous Systems',
      iconName: 'Car',
      description: 'AUTOSAR, connected vehicle telemetry, edge inference, and electric powertrain embedded software.',
      activeMandates: 29,
      avgClosureDays: 28,
      highlightRoles: ['Lead AUTOSAR Developer', 'Embedded Linux Architect', 'Telematics Platform Engineer'],
    },
  ],
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: motionTokens.stagger.medium },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: motionTokens.duration.slow, ease: motionTokens.ease.standard } 
    },
  };

  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <motion.div 
        style={{ maxWidth: '1200px', margin: '0 auto' }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div style={{ textAlign: 'center', marginBottom: '3.5rem' }} variants={itemVariants}>
          <motion.span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              color: 'var(--color-primary-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {badge}
          </motion.span>
          <motion.h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--color-text)', marginTop: '0.5rem' }}>
            {title}
          </motion.h2>
          <motion.p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0.75rem auto 0 auto' }}>
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Matrix Grid */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem',
          }}
          variants={containerVariants}
        >
          <AnimatePresence>
            {industries.map((ind) => (
              <motion.div
                key={ind.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredId(ind.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ y: -8, scale: 1.02, transition: motionTokens.spring.snappy }}
                style={{
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {hoveredId === ind.id && (
                  <motion.div
                    layoutId="industry-hover"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={motionTokens.spring.snappy}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'var(--radius-xl)',
                      backgroundColor: 'rgba(59, 130, 246, 0.05)',
                      zIndex: -1,
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  />
                )}
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 }}>
                      {ind.name}
                    </h3>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      transition={motionTokens.spring.snappy}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--color-primary-400)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        gap: '0.25rem'
                      }}
                    >
                      <AnimatedCounter value={ind.activeMandates} /> Mandates
                    </motion.span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {ind.description}
                  </p>

                  {/* Key Roles */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Frequent Placements
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {ind.highlightRoles.map((role, rIdx) => (
                        <div key={rIdx} style={{ fontSize: '0.8125rem', color: 'var(--color-text)' }}>
                          • {role}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600, display: 'flex', gap: '0.25rem' }}>
                    Avg <AnimatedCounter value={ind.avgClosureDays} />-Day SLA
                  </span>
                  <Link
                    to={`/industries/${ind.id}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--color-primary-400)',
                      textDecoration: 'none',
                    }}
                  >
                    <span>Practice Overview</span>
                    <motion.div whileHover={{ x: 3, y: -3 }} transition={motionTokens.spring.snappy}>
                      <ArrowUpRight size={14} />
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </section>
  );
};

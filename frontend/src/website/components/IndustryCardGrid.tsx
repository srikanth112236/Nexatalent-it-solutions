import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

const industries = [
  { slug: 'technology', name: 'Cloud & Deep Tech', roles: 'Architects, Distributed Systems, ML Engineers' },
  { slug: 'bfsi', name: 'BFSI & Fintech', roles: 'Trading Systems, Risk Engineers, Core Banking' },
  { slug: 'healthcare', name: 'HealthTech & Bio', roles: 'Bioinformatics, HIPAA Compliance, Devices' },
  { slug: 'gcc', name: 'Global Capability Centers', roles: 'Offshore Engineering Hubs, Site Reliability' },
  { slug: 'manufacturing', name: 'Smart Manufacturing', roles: 'IoT, Supply Chain Engineering, Industrial Automation' },
  { slug: 'retail', name: 'E-Commerce & Retail', roles: 'High-Throughput Platforms, Payment Gateways' },
];

const TiltCard = ({ children, to }: { children: React.ReactNode; to: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      style={{ perspective: 1000, height: '100%' }}
    >
      <motion.div
        animate={{ rotateX, rotateY }}
        transition={motionTokens.spring.snappy}
        style={{ height: '100%' }}
      >
        <Link
          ref={ref}
          to={to}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            padding: '2rem',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
            display: 'block',
            height: '100%',
            transformStyle: 'preserve-3d'
          }}
        >
          {children}
        </Link>
      </motion.div>
    </motion.div>
  );
};

export const IndustryCardGrid: React.FC = () => {
  return (
    <section style={{ maxWidth: '1280px', margin: '5rem auto', padding: '0 2rem', overflow: 'hidden' }}>
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: motionTokens.stagger.medium } }
        }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <motion.span 
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
          style={{ display: 'inline-block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          Sector Specialization
        </motion.span>
        <motion.h2 
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.outQuart }}
          style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, margin: '0.5rem 0 1rem 0' }}
        >
          Deep Domain Expertise Across Key Verticals
        </motion.h2>
        <motion.p 
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.outQuart }}
          style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}
        >
          Our specialist recruiters speak your technology stack and understand your industry's specific compliance constraints.
        </motion.p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {industries.map((ind, idx) => (
          <motion.div
            key={ind.slug}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: idx * motionTokens.stagger.small, duration: motionTokens.duration.slow, ease: motionTokens.ease.outQuart }}
            style={{ height: '100%' }}
          >
            <TiltCard to={`/industries/${ind.slug}`}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ...motionTokens.spring.bouncy, delay: 0.2 + (idx * motionTokens.stagger.small) }}
                style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(var(--color-accent-rgb), 0.1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ width: '20px', height: '20px', backgroundColor: 'var(--color-accent)', borderRadius: '4px' }} />
              </motion.div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', transform: 'translateZ(20px)' }}>
                {ind.name}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.5, transform: 'translateZ(10px)' }}>
                Key Mandates: <span style={{ color: 'var(--color-text)' }}>{ind.roles}</span>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

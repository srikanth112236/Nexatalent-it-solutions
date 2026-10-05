import React, { useState } from 'react';
import { Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export const MegaFooter: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.standard, ease: motionTokens.ease.standard } }
  };

  return (
    <footer
      style={{
        backgroundColor: '#090d16',
        borderTop: '1px solid var(--color-border)',
        padding: '5rem 2rem 3rem 2rem',
        position: 'relative',
        color: 'var(--color-text-secondary)',
        overflow: 'hidden'
      }}
    >
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        {/* Top Newsletter & Dispatch Bar */}
        <motion.div
          variants={itemVariants}
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-2xl)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            marginBottom: '4.5rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.4rem' }}>
              Subscribe to the Engineering Talent Index
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: '500px' }}>
              Bi-weekly technical compensation benchmarks, GCC scaling analysis, and hiring velocity reports read by 14,000+ engineering leaders.
            </p>
          </div>

          {subscribed ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={motionTokens.spring.snappy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--color-success)',
                fontWeight: 600,
                fontSize: '0.9375rem',
              }}
            >
              <CheckCircle2 size={20} />
              <span>Subscription Confirmed. Welcome to the Index.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <motion.input
                whileFocus={{ scale: 1.02, borderColor: 'var(--color-primary-400)' }}
                type="email"
                required
                placeholder="engineering.leader@company.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  fontSize: '0.875rem',
                  minWidth: '280px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <span>Subscribe</span>
                <Send size={14} />
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* 5-Column Mega Navigation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2.5rem',
            marginBottom: '4rem',
          }}
        >
          {/* Col 1: Solutions */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Solutions
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              {[
                { to: '/solutions', label: 'Solutions Overview' },
                { to: '/solutions/permanent-hiring', label: 'Permanent Recruitment' },
                { to: '/solutions/contract-staffing', label: 'Contract Staffing' },
                { to: '/solutions/gcc-hiring', label: 'GCC Turnkey Pods' },
                { to: '/solutions/executive-search', label: 'Executive CXO Search' },
                { to: '/solutions/volume-hiring', label: 'Volume Hiring Drives' }
              ].map((item, i) => (
                <motion.li key={i} whileHover={{ x: 5, color: 'var(--color-primary-400)' }} transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}>
                  <Link to={item.to} style={{ color: 'inherit', textDecoration: 'none' }}>{item.label}</Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Col 2: Verticals */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Practices
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              {[
                { to: '/industries', label: 'Industries Overview' },
                { to: '/industries/technology', label: 'Technology & SaaS' },
                { to: '/industries/bfsi', label: 'BFSI & FinTech' },
                { to: '/industries/healthcare', label: 'Healthcare & Life Sciences' },
                { to: '/industries/manufacturing', label: 'Manufacturing & IoT' },
                { to: '/industries/gcc', label: 'Global Capability Centers' }
              ].map((item, i) => (
                <motion.li key={i} whileHover={{ x: 5, color: 'var(--color-primary-400)' }} transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}>
                  <Link to={item.to} style={{ color: 'inherit', textDecoration: 'none' }}>{item.label}</Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Col 3: Hub Locations */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Locations
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              {[
                { to: '/contact', label: 'Bengaluru (HQ)' },
                { to: '/contact', label: 'Hyderabad Tech Pod' },
                { to: '/contact', label: 'Pune Enterprise Hub' },
                { to: '/contact', label: 'Mumbai Financial Center' },
                { to: '/contact', label: 'Contact Global Hubs' }
              ].map((item, i) => (
                <motion.li key={i} whileHover={{ x: 5, color: 'var(--color-primary-400)' }} transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}>
                  <Link to={item.to} style={{ color: 'inherit', textDecoration: 'none' }}>{item.label}</Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Col 4: Platform & Portals */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Platform Portals
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              {[
                { to: '/employers', label: 'For Employers' },
                { to: '/candidates', label: 'For Candidates' },
                { to: '/partners', label: 'Recruitment Partners' },
                { to: '/jobs', label: 'Job Board & Open Mandates' },
                { to: '/login', label: 'Unified Sign In' }
              ].map((item, i) => (
                <motion.li key={i} whileHover={{ x: 5, color: 'var(--color-primary-400)' }} transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}>
                  <Link to={item.to} style={{ color: 'inherit', textDecoration: 'none' }}>{item.label}</Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Col 5: Company & Compliance */}
          <motion.div variants={itemVariants}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
              Trust & Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              {[
                { to: '/case-studies', label: 'Client Case Studies' },
                { to: '/why-nexatalent', label: 'Why NexaTalent IT Solutions' },
                { to: '/insights', label: 'Market Insights & Salary Reports' },
                { to: '/privacy-policy', label: 'Privacy Policy (DPDP Act)' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/data-protection', label: 'IP & Non-Solicitation' },
                { to: '/contact', label: 'Contact & Office SLA' }
              ].map((item, i) => (
                <motion.li key={i} whileHover={{ x: 5, color: 'var(--color-primary-400)' }} transition={{ type: 'tween', ease: 'easeOut', duration: 0.2 }}>
                  <Link to={item.to} style={{ color: 'inherit', textDecoration: 'none' }}>{item.label}</Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            fontSize: '0.8125rem',
            color: 'var(--color-text-tertiary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-text)' }}>
              NexaTalent IT Solutions Operating System
            </span>
            <span>© {new Date().getFullYear()} NexaTalent IT Solutions Inc. All rights reserved.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-success)' }}>
              <motion.div 
                animate={{ opacity: [1, 0.4, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)' }} 
              />
              <span>SLA Core Systems Operational (99.98%)</span>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={14} color="var(--color-primary-400)" />
              ISO 27001 Certified
            </span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

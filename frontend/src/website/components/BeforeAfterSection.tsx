import React from 'react';
import { XCircle, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface BeforeAfterSectionProps {
  badge?: string;
  title?: string;
  subtitle?: string;
}

export const BeforeAfterSection: React.FC<BeforeAfterSectionProps> = ({
  badge = 'The NexaTalent Paradigm Shift',
  title = 'Legacy Agencies vs. The NexaTalent Operating System',
  subtitle = 'Why forward-thinking technology leaders abandon traditional headhunters for our data-driven talent infrastructure.',
}) => {
  const comparisonItems = [
    {
      factor: 'Candidate Sourcing',
      legacy: 'Keyword matching, automated mass spamming on LinkedIn, uncalibrated resumes.',
      nexatalent: 'Semantic AI matching + deep passive talent network with 68% direct response rate.',
    },
    {
      factor: 'Technical Calibration',
      legacy: 'Non-technical recruiters reading buzzwords from a script; client engineers waste hours filtering.',
      nexatalent: 'Screening led by ex-architects with code reviews, concurrency tests, and deep rubrics.',
    },
    {
      factor: 'Speed to Shortlist',
      legacy: '3 to 6 weeks of radio silence, followed by a sudden dump of loosely matched profiles.',
      nexatalent: 'Guaranteed 48 to 72-hour delivery of 3-5 pre-calibrated, interview-ready contenders.',
    },
    {
      factor: 'Offer Acceptance Rate',
      legacy: 'High drop-offs (50-60%) due to unvetted notice periods and unmanaged counter-offers.',
      nexatalent: '94% offer-to-joining conversion with continuous proactive counter-offer defense.',
    },
    {
      factor: 'Replacement Warranty',
      legacy: '30-day restrictive credit notes that force you to re-engage the same slow recruiters.',
      nexatalent: 'Unconditional 90-day replacement guarantee backed by dedicated priority escalation.',
    },
  ];

  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <motion.div 
        style={{ maxWidth: '1100px', margin: '0 auto' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: motionTokens.stagger.medium }
          }
        }}
      >
        <motion.div 
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: motionTokens.duration.slow, ease: motionTokens.ease.standard } }
          }}
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

        {/* Comparison Table / Split Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            position: 'relative',
          }}
        >
          {/* Background Divider that grows from center */}
          <motion.div 
            style={{
              position: 'absolute',
              left: '50%',
              top: '5%',
              bottom: '5%',
              width: '1px',
              backgroundColor: 'var(--color-border)',
              display: 'none', // Hidden on mobile, could be shown on md+
              transformOrigin: 'top center',
            }}
            variants={{
              hidden: { scaleY: 0, opacity: 0 },
              visible: { scaleY: 1, opacity: 0.5, transition: { duration: motionTokens.duration.deliberate, ease: motionTokens.ease.standard } }
            }}
          />

          {/* Legacy Side */}
          <motion.div
            style={{
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '2.5rem 2rem',
            }}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0, transition: { duration: motionTokens.duration.slow, ease: motionTokens.ease.standard } }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <motion.div 
                style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
                Conventional Agencies
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {comparisonItems.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  style={{ paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: motionTokens.duration.standard } }
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {item.factor}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.5 }}>
                    <XCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item.legacy}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* NexaTalent Side (Glowing Aceternity card) */}
          <motion.div
            style={{
              borderRadius: 'var(--radius-xl)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-primary)',
              padding: '2.5rem 2rem',
              boxShadow: '0 0 35px rgba(59, 130, 246, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: motionTokens.duration.slow, ease: motionTokens.ease.standard } }
            }}
            whileHover={{ y: -5, boxShadow: '0 0 45px rgba(59, 130, 246, 0.3)' }}
            transition={motionTokens.spring.snappy}
          >
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '0.35rem 1rem',
                borderBottomLeftRadius: 'var(--radius-md)',
              }}
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, ...motionTokens.spring.bouncy }}
            >
              Proven Standard
            </motion.div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Zap size={18} color="var(--color-primary-400)" />
              </motion.div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)' }}>
                NexaTalent Platform
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {comparisonItems.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  style={{ paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0, transition: { duration: motionTokens.duration.standard } }
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-400)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {item.factor}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--color-text)', fontSize: '0.875rem', lineHeight: 1.5, fontWeight: 500 }}>
                    <motion.div
                      whileInView={{ scale: [0, 1.2, 1] }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + idx * motionTokens.stagger.small, ...motionTokens.spring.snappy }}
                    >
                      <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    </motion.div>
                    <span>{item.nexatalent}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

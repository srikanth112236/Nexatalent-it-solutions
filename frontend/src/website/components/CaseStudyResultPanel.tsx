import React from 'react';
import { CheckCircle2, Award, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { motionTokens } from '../../shared/motion/motionTokens';

export interface CaseStudyResultPanelProps {
  clientName?: string;
  clientLogo?: string;
  clientIndustry?: string;
  challengeTitle?: string;
  challengeDescription?: string;
  solutionTitle?: string;
  solutionHighlights?: string[];
  metrics?: Array<{ label: string; value: string; detail: string }>;
  quote?: {
    text: string;
    author: string;
    role: string;
    company: string;
  };
}

export const CaseStudyResultPanel: React.FC<CaseStudyResultPanelProps> = ({
  clientName = 'HyperScale Cloud Platform',
  clientIndustry = 'Enterprise Infrastructure & Cloud Native',
  challengeTitle = 'The Critical Bottleneck',
  challengeDescription = 'The client needed to hire 18 Lead SRE and Distributed Systems Engineers within 60 days to meet critical SOC-2 Type II audit commitments for their multi-tenant Kubernetes platform.',
  solutionTitle = 'NexaTalent IT Solutions Rapid GCC Squad Architecture',
  solutionHighlights = [
    'Deployed dedicated 3-member technical recruiter pod with deep Golang/K8s domain mastery',
    'Pre-calibrated 140 candidate profiles via real-time distributed systems screening',
    'Conducted zero-dropoff scheduling coordination across 3 global time zones (IST, GMT, PST)',
    '100% offer-to-joining conversion achieved via proactive counter-offer defense protocols',
  ],
  metrics = [
    { label: 'Total Hires Made', value: '18 / 18', detail: 'Completed 12 days ahead of deadline' },
    { label: 'Time-to-Offer', value: '14.2 Days', detail: 'Versus 45-day industry average' },
    { label: 'First-Year Retention', value: '100%', detail: 'Zero churn recorded in 12 months' },
    { label: 'Cost Savings', value: '38%', detail: 'Compared to conventional headhunter retainers' },
  ],
  quote = {
    text: 'NexaTalent IT Solutions outperformed every other recruitment firm we tested by an order of magnitude. Their candidates were already vetted for production scale.',
    author: 'Siddharth Rao',
    role: 'VP of Platform Engineering',
    company: 'HyperScale Cloud Platform',
  },
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: motionTokens.duration.slow, ease: motionTokens.ease.outQuart }}
      style={{
        borderRadius: 'var(--radius-xl)',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e5e5',
        padding: '3rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid #e5e5e5',
          paddingBottom: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#000000',
            }}
          >
            Verified Case Outcome · {clientIndustry}
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#000000', marginTop: '0.25rem' }}>
            {clientName}
          </h2>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ ...motionTokens.spring.bouncy, delay: 0.2 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            backgroundColor: '#000000',
            border: '1px solid #000000',
            color: '#ffffff',
            fontSize: '0.8125rem',
            fontWeight: 600,
          }}
        >
          <Award size={16} />
          SLA Target: 100% Met
        </motion.div>
      </div>

      {/* Metrics Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        {metrics.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + idx * motionTokens.stagger.medium, duration: motionTokens.duration.standard }}
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: '#ffffff',
              border: '1px solid #000000',
            }}
          >
            <div
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#000000',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}
            >
              {m.value}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#000000', marginBottom: '0.25rem' }}>
              {m.label}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#000000', lineHeight: 1.4 }}>
              {m.detail}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Challenge vs Solution Two-Column */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.standard, delay: 0.3 }}
        >
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#000000' }} />
            {challengeTitle}
          </h3>
          <p style={{ color: '#000000', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            {challengeDescription}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.standard, delay: 0.3 }}
        >
          <h3
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#000000',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#000000' }} />
            {solutionTitle}
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {solutionHighlights.map((hl, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + idx * motionTokens.stagger.small }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.625rem',
                  fontSize: '0.875rem',
                  color: '#000000',
                  lineHeight: 1.5,
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ ...motionTokens.spring.snappy, delay: 0.5 + idx * motionTokens.stagger.small + 0.1 }}
                >
                  <CheckCircle2 size={16} color="#000000" style={{ flexShrink: 0, marginTop: '2px' }} />
                </motion.div>
                <span>{hl}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Testimonial Quote Quote Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: motionTokens.duration.standard, delay: 0.6 }}
        style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: '#ffffff',
          border: '1px solid #000000',
          display: 'flex',
          gap: '1.25rem',
          alignItems: 'flex-start',
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ ...motionTokens.spring.bouncy, delay: 0.8 }}
        >
          <Quote size={28} color="#000000" style={{ flexShrink: 0 }} />
        </motion.div>
        <div>
          <p
            style={{
              fontSize: '1rem',
              fontStyle: 'italic',
              color: '#000000',
              lineHeight: 1.6,
              marginBottom: '0.75rem',
            }}
          >
            "{quote.text}"
          </p>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#000000' }}>
            {quote.author} · <span style={{ color: '#000000', fontWeight: 400 }}>{quote.role}, {quote.company}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

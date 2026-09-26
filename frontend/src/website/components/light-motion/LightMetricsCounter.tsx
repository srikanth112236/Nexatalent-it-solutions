import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, Award, Users } from 'lucide-react';

interface MetricItem {
  id: string;
  target: number;
  suffix: string;
  prefix?: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  accent: string;
}

const metrics: MetricItem[] = [
  { id: 'm1', target: 48, suffix: 'h', label: 'Shortlist Delivery SLA', sublabel: 'Contractually guaranteed or 25% credit', icon: Zap, accent: '#2563eb' },
  { id: 'm2', target: 94, suffix: '.8%', label: 'Offer-to-Join Ratio', sublabel: 'Proactive counter-offer defense', icon: Users, accent: '#059669' },
  { id: 'm3', target: 90, suffix: ' Days', label: 'Unconditional Warranty', sublabel: '100% escrow-backed replacement', icon: ShieldCheck, accent: '#7c3aed' },
  { id: 'm4', target: 120, prefix: '', suffix: '+', label: 'Tier-1 Tech Partners', sublabel: 'Unicorns, GCCs & HFT funds', icon: Award, accent: '#ea580c' },
];

export const LightMetricsCounter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (!isInView) return;

    const start = performance.now();
    const duration = 1600;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      setCounts(metrics.map((m) => Math.round(m.target * easeProgress)));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      className="theme-light"
      style={{
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '5rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            fontSize: '0.8125rem',
            fontWeight: 800,
            color: '#2563eb',
            marginBottom: '1rem',
          }}
        >
          <Sparkles size={14} />
          <span>03 / 40 · VERIFIED PERFORMANCE METRICS</span>
        </div>

        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '0.75rem' }}>
          Numbers That Guarantee Accountability
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.0625rem', maxWidth: '640px', margin: '0 auto 3.5rem auto', lineHeight: 1.6 }}>
          We replace agency guesswork with strict, contractually enforced engineering milestones.
        </p>

        {/* 4 Metrics Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.75rem' }}>
          {metrics.map((m, idx) => {
            const IconComp = m.icon;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  padding: '2.5rem 2rem',
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: `${m.accent}12`,
                    color: m.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}
                >
                  <IconComp size={22} color={m.accent} />
                </div>

                <div
                  style={{
                    fontSize: 'clamp(2.5rem, 4vw, 3.25rem)',
                    fontWeight: 900,
                    color: '#0f172a',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1.1,
                    marginBottom: '0.5rem',
                  }}
                >
                  {m.prefix}
                  {counts[idx]}
                  {m.suffix}
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 800, color: m.accent, marginBottom: '0.35rem' }}>
                  {m.label}
                </div>

                <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  {m.sublabel}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

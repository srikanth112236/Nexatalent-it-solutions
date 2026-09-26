import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar?: string;
  rating?: number;
  highlightStat?: string;
  quote: string;
  verified?: boolean;
}

export interface TestimonialProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  testimonials?: TestimonialItem[];
}

export const Testimonial: React.FC<TestimonialProps> = ({
  badge = 'Client & Candidate Voices',
  title = 'Trusted by Engineering Founders and Leaders Worldwide',
  subtitle = 'Discover how top engineering organizations scale with unmatched speed, transparency, and caliber.',
  testimonials = [
    {
      id: 't-1',
      name: 'Vikramaditya Sharma',
      role: 'Chief Technology Officer',
      company: 'QuantMatrix Technologies',
      rating: 5,
      highlightStat: '14 Core Hires in 42 Days',
      quote:
        'NexaTalent eliminated 80% of our interview fatigue. Every candidate presented was already technically qualified at our high standard. The best recruitment partnership we have had.',
      verified: true,
    },
    {
      id: 't-2',
      name: 'Elena Rostova',
      role: 'VP of Global Talent',
      company: 'CloudScale Infrastructure',
      rating: 5,
      highlightStat: '100% SLA Fulfillment',
      quote:
        'Building our India development center was a high-stakes initiative. NexaTalent’s calibrated shortlists and market intelligence gave our board absolute confidence.',
      verified: true,
    },
    {
      id: 't-3',
      name: 'Arjun Nambiar',
      role: 'Principal Distributed Systems Engineer',
      company: 'Placed via NexaTalent at Tier-1 FinTech',
      rating: 5,
      highlightStat: '+65% Comp Growth',
      quote:
        'The recruiters at NexaTalent actually understand technical depth. No generic spam, full transparency on company culture, and seamless negotiation throughout.',
      verified: true,
    },
  ],
}) => {
  return (
    <section style={{ padding: '5rem 2rem', position: 'relative' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-primary-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            {badge}
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--color-text)',
              marginTop: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            {title}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
            {subtitle}
          </p>
        </div>

        {/* Testimonials Grid (Aceternity style glass cards with glow hover) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              style={{
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div>
                {/* Rating Stars & Stat Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', color: '#fbbf24' }}>
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>

                  {t.highlightStat && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        color: 'var(--color-primary-400)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      {t.highlightStat}
                    </span>
                  )}
                </div>

                {/* Quote Text */}
                <p
                  style={{
                    color: 'var(--color-text)',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    marginBottom: '1.75rem',
                  }}
                >
                  "{t.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-400)',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: '0.9375rem' }}>
                      {t.name}
                    </span>
                    {t.verified && (
                      <ShieldCheck size={15} color="var(--color-success)" />
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

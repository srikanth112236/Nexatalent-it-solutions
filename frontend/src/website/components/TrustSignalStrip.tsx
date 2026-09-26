import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface TrustSignalItem {
  iconName?: string;
  headline: string;
  subtext: string;
}

export interface TrustSignalStripProps {
  signals?: TrustSignalItem[];
}

export const TrustSignalStrip: React.FC<TrustSignalStripProps> = ({
  signals = [
    {
      headline: 'SOC-2 Type II & ISO 27001',
      subtext: 'Enterprise-grade data encryption and candidate confidentiality compliance',
    },
    {
      headline: '90-Day Warranty Protected',
      subtext: '100% unconditional candidate replacement guarantee on all placements',
    },
    {
      headline: 'Strict 48-Hour Shortlist SLA',
      subtext: 'Guaranteed 3 to 5 pre-screened senior profiles within 2 business days',
    },
    {
      headline: 'Zero Unsolicited Outreach',
      subtext: 'Targeted technical pitches with verified candidate consent protocols',
    },
  ],
}) => {
  return (
    <section
      style={{
        padding: '2.5rem 2rem',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {signals.map((sig, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: 'var(--color-primary-400)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.2rem' }}>
                  {sig.headline}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {sig.subtext}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

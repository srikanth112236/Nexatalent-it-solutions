import React from 'react';

export const MetricsCounter: React.FC = () => {
  const stats = [
    { value: '45k+', label: 'Vetted Specialists', detail: 'Pre-screened tech talent' },
    { value: '94%', label: 'Offer Acceptance', detail: 'Calibrated compensation' },
    { value: '4.2d', label: 'Average Time-to-Shortlist', detail: 'From mandate kick-off' },
    { value: '98.6%', label: '90-Day Retention', detail: 'On permanent placements' },
  ];

  return (
    <section style={{ maxWidth: '1280px', margin: '4rem auto', padding: '0 2rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          padding: '3rem 2.5rem',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-2xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {stats.map((s, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginTop: '0.75rem', marginBottom: '0.25rem' }}>
              {s.label}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {s.detail}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

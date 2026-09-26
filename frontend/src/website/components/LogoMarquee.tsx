import React from 'react';

const partners = [
  'DATADOG', 'STRIPE', 'SNOWFLAKE', 'MONGODB', 'CLOUDFLARE', 'AMAZON AWS', 'MICROSOFT AZURE', 'SCALE AI', 'HASHICORP',
];

export const LogoMarquee: React.FC = () => {
  return (
    <div
      style={{
        padding: '3rem 0',
        backgroundColor: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Trusted by Engineering Teams & GCC Hubs Globally
      </div>

      <div
        style={{
          display: 'flex',
          gap: '4rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: '4rem', animation: 'marquee 25s linear infinite' }}>
          {[...partners, ...partners].map((name, i) => (
            <div
              key={i}
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--color-text-subtle)',
                letterSpacing: '0.05em',
                opacity: 0.7,
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

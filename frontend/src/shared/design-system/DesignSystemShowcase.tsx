import { Link } from 'react-router-dom';

const colorSwatches = [
  { name: '--color-bg', label: 'Background Canvas', bg: 'var(--color-bg)', border: 'var(--color-border)' },
  { name: '--color-surface', label: 'Card Surface', bg: 'var(--color-surface)', border: 'var(--color-border)' },
  { name: '--color-surface-raised', label: 'Raised Surface', bg: 'var(--color-surface-raised)', border: 'var(--color-border)' },
  { name: '--color-surface-hover', label: 'Hover Surface', bg: 'var(--color-surface-hover)', border: 'var(--color-border)' },
  { name: '--color-primary', label: 'Primary Brand', bg: 'var(--color-primary)' },
  { name: '--color-primary-hover', label: 'Primary Hover', bg: 'var(--color-primary-hover)' },
  { name: '--color-accent', label: 'Accent Cyan', bg: 'var(--color-accent)' },
  { name: '--color-success', label: 'Success Feedback', bg: 'var(--color-success)' },
  { name: '--color-warning', label: 'Warning Feedback', bg: 'var(--color-warning)' },
  { name: '--color-danger', label: 'Danger Feedback', bg: 'var(--color-danger)' },
  { name: '--color-info', label: 'Info Feedback', bg: 'var(--color-info)' },
];

const typographyItems = [
  { level: 'Display', className: 'text-display', sample: 'NexaTalent Scale', size: '42px - 88px fluid' },
  { level: 'H1 Heading', className: 'text-h1', sample: 'Precision Recruitment Engine', size: '36px - 64px fluid' },
  { level: 'H2 Heading', className: 'text-h2', sample: 'Human + Intelligent Systems', size: '28px - 48px fluid' },
  { level: 'H3 Heading', className: 'text-h3', sample: 'Enterprise Talent Sourcing Architecture', size: '22px - 32px fluid' },
  { level: 'H4 Heading', className: 'text-h4', sample: 'Verified Technical Competencies & Benchmarks', size: '18px - 24px fluid' },
  { level: 'Body Large', className: 'text-body-lg', sample: 'Connecting people, businesses, and opportunity through structured workflows.', size: '18px - 20px fluid' },
  { level: 'Body Regular', className: 'text-body', sample: 'Standard body reading size optimized for clarity and high information density.', size: '15px - 17px fluid' },
  { level: 'Body Small / Caption', className: 'text-body-sm', sample: 'Auxiliary metadata, timestamps, badges, and secondary labels.', size: '14px fixed' },
];

const spacingScale = [
  { token: '--space-1', value: '4px', width: '4px' },
  { token: '--space-2', value: '8px', width: '8px' },
  { token: '--space-3', value: '12px', width: '12px' },
  { token: '--space-4', value: '16px', width: '16px' },
  { token: '--space-6', value: '24px', width: '24px' },
  { token: '--space-8', value: '32px', width: '32px' },
  { token: '--space-12', value: '48px', width: '48px' },
  { token: '--space-16', value: '64px', width: '64px' },
  { token: '--space-24', value: '96px', width: '96px' },
];

const radiiScale = [
  { token: '--radius-xs', label: 'Micro (4px)', radius: 'var(--radius-xs)' },
  { token: '--radius-sm', label: 'Control (6px)', radius: 'var(--radius-sm)' },
  { token: '--radius-md', label: 'Card (8px)', radius: 'var(--radius-md)' },
  { token: '--radius-lg', label: 'Feature (12px)', radius: 'var(--radius-lg)' },
  { token: '--radius-xl', label: 'Modal (16px)', radius: 'var(--radius-xl)' },
  { token: '--radius-pill', label: 'Pill (9999px)', radius: 'var(--radius-pill)' },
];

export function DesignSystemShowcase() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Phase 2 Living Specification
          </span>
          <Link to="/" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>&larr; Return to Website</Link>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Global Design System</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
          Centralized Manrope typography tokens, semantic dark-mode palette, spacing scales, restrained geometry, and WCAG 2.2 AA accessibility standards.
        </p>
      </header>

      {/* 1. Color Palette */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🎨</span> 1. Semantic Color Tokens
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {colorSwatches.map((color) => (
            <div
              key={color.name}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
              }}
            >
              <div style={{ height: '70px', backgroundColor: color.bg, borderBottom: color.border ? `1px solid ${color.border}` : 'none' }} />
              <div style={{ padding: '1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{color.label}</div>
                <code style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                  {color.name}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Hierarchy */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🔤</span> 2. Fluid Typography (Manrope)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {typographyItems.map((item) => (
            <div
              key={item.level}
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{item.level}</span>
                <span>{item.size}</span>
              </div>
              <div className={item.className}>{item.sample}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Spacing Scale */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📐</span> 3. Predictable Spacing Scale
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {spacingScale.map((space) => (
            <div
              key={space.token}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div style={{ width: space.width, height: '24px', backgroundColor: 'var(--color-primary)', borderRadius: '2px' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{space.value}</div>
                <code style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{space.token}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Radii Scale */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚪</span> 4. Restrained Radii Scale
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {radiiScale.map((r) => (
            <div
              key={r.token}
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--color-surface)',
                borderRadius: r.radius,
                border: '2px solid var(--color-primary)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{r.label}</div>
              <code style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{r.token}</code>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Accessibility & Focus State */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>♿</span> 5. WCAG 2.2 AA Focus & Touch Targets
        </h2>
        <div style={{ padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Test keyboard navigation by pressing <kbd style={{ padding: '0.2rem 0.5rem', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>Tab</kbd> to observe universal visible focus rings.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 'var(--touch-target-min)',
              }}
            >
              Focusable Button (44px min touch target)
            </button>
            <input
              type="text"
              placeholder="Focusable Input Field..."
              style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: '#ffffff',
                minHeight: 'var(--touch-target-min)',
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface FloatingCTAProps {
  headline?: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryText?: string;
  secondaryLink?: string;
}

export const FloatingCTA: React.FC<FloatingCTAProps> = ({
  badge = 'Active SLA Guaranteed',
  headline = 'Need senior engineers in under 72 hours?',
  ctaText = 'Submit Mandate',
  ctaLink = '/employers',
  secondaryText = 'Browse Open Roles',
  secondaryLink = '/jobs',
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside
      aria-label="Quick Actions"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        width: 'calc(100% - 2rem)',
        maxWidth: '860px',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(59, 130, 246, 0.2)',
        padding: '0.875rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Left Message */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success)',
            boxShadow: '0 0 10px var(--color-success)',
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-400)', textTransform: 'uppercase' }}>
              {badge}
            </span>
          </div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
            {headline}
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link
          to={secondaryLink}
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none',
            fontWeight: 600,
            padding: '0.4rem 0.75rem',
          }}
        >
          {secondaryText}
        </Link>

        <Link
          to={ctaLink}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          }}
        >
          <span>{ctaText}</span>
          <ArrowRight size={14} />
        </Link>

        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss banner"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-tertiary)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
};

import React from 'react';
import { Download, FileText, ArrowUpRight, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ResourceCardProps {
  id: string;
  title: string;
  type: string; // 'Salary Report' | 'Whitepaper' | 'GCC Playbook'
  description: string;
  pages?: number;
  format?: string;
  downloadsCount?: string;
  isGated?: boolean;
  downloadUrl?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  title,
  type = 'Salary Benchmark Guide',
  description,
  pages = 42,
  format = 'PDF',
  downloadsCount = '3,200+ Downloads',
  isGated = true,
  downloadUrl = `/resources/${id}`,
}) => {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        boxShadow: 'var(--shadow-sm)',
        transition: 'border-color 0.2s ease, transform 0.2s ease',
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-primary-400)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              padding: '0.25rem 0.625rem',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {type}
          </span>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              color: 'var(--color-text-tertiary)',
            }}
          >
            <FileText size={14} />
            <span>{pages} Pages · {format}</span>
          </div>
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text)',
            lineHeight: 1.4,
            marginBottom: '0.75rem',
          }}
        >
          {title}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
          }}
        >
          {description}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
          {downloadsCount}
        </span>

        <Link
          to={downloadUrl}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: 'var(--color-primary-400)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            fontSize: '0.8125rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {isGated ? <Lock size={13} /> : <Download size={13} />}
          <span>Download Guide</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
};

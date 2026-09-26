import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  icon,
  subtitle,
}) => {
  return (
    <Card variant="elevated" padding="md">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </span>
        {icon && (
          <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
            {icon}
          </span>
        )}
      </div>

      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.15, marginBottom: '0.5rem' }}>
        {value}
      </div>

      {(change || subtitle) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
          {change && (
            <span
              style={{
                color: isPositive ? 'var(--color-success)' : 'var(--color-danger)',
                fontWeight: 600,
              }}
            >
              {isPositive ? '↑' : '↓'} {change}
            </span>
          )}
          {subtitle && (
            <span style={{ color: 'var(--color-text-subtle)' }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

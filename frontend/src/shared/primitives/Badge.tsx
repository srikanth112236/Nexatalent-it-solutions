import React, { HTMLAttributes } from 'react';
import { cn } from '../utils';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'accent';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  pill?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  pill = true,
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
    default: {
      backgroundColor: 'var(--color-surface-raised)',
      color: 'var(--color-text-muted)',
      border: '1px solid var(--color-border)',
    },
    primary: {
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      color: 'var(--color-primary)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
    },
    success: {
      backgroundColor: 'var(--color-success-bg)',
      color: 'var(--color-success)',
      border: '1px solid var(--color-success-border)',
    },
    warning: {
      backgroundColor: 'var(--color-warning-bg)',
      color: 'var(--color-warning)',
      border: '1px solid var(--color-warning-border)',
    },
    danger: {
      backgroundColor: 'var(--color-danger-bg)',
      color: 'var(--color-danger)',
      border: '1px solid var(--color-danger-border)',
    },
    accent: {
      backgroundColor: 'rgba(6, 182, 212, 0.15)',
      color: 'var(--color-accent)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
    },
  };

  const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
    sm: {
      padding: '0.15rem 0.5rem',
      fontSize: '0.75rem',
      fontWeight: 600,
    },
    md: {
      padding: '0.25rem 0.75rem',
      fontSize: '0.8125rem',
      fontWeight: 600,
    },
  };

  return (
    <span
      className={cn('inline-flex items-center justify-center select-none', className)}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-xs)',
        lineHeight: 1.2,
      }}
      {...props}
    >
      {children}
    </span>
  );
};

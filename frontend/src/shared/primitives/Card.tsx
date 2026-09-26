import React, { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils';

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'interactive';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  style,
  ...props
}) => {
  const variantStyles: Record<CardVariant, React.CSSProperties> = {
    default: {
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
    },
    elevated: {
      backgroundColor: 'var(--color-surface-raised)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-md)',
    },
    bordered: {
      backgroundColor: 'transparent',
      border: '1px solid var(--color-border-strong)',
    },
    interactive: {
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
    },
  };

  const paddingStyles: Record<CardPadding, string> = {
    none: '0',
    sm: 'var(--space-3)',
    md: 'var(--space-6)',
    lg: 'var(--space-8)',
  };

  return (
    <div
      className={cn('rounded-lg overflow-hidden', className)}
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: paddingStyles[padding],
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

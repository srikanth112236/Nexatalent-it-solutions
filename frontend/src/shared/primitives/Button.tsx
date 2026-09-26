import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none relative';

    // Variant mapping
    const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
      primary: {
        backgroundColor: 'var(--color-primary)',
        color: '#ffffff',
        border: '1px solid transparent',
        boxShadow: 'var(--shadow-sm)',
      },
      secondary: {
        backgroundColor: 'var(--color-surface-raised)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
      },
      outline: {
        backgroundColor: 'transparent',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border-strong)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-text)',
        border: '1px solid transparent',
      },
      danger: {
        backgroundColor: 'var(--color-danger)',
        color: '#ffffff',
        border: '1px solid transparent',
      },
      link: {
        backgroundColor: 'transparent',
        color: 'var(--color-primary)',
        border: '1px solid transparent',
        padding: 0,
        height: 'auto',
      },
    };

    // Size mapping
    const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
      sm: {
        padding: '0.4rem 0.75rem',
        fontSize: '0.8125rem',
        borderRadius: 'var(--radius-sm)',
        minHeight: '34px',
        gap: '0.375rem',
      },
      md: {
        padding: '0.625rem 1.25rem',
        fontSize: '0.9rem',
        borderRadius: 'var(--radius-md)',
        minHeight: 'var(--touch-target-min, 44px)',
        gap: '0.5rem',
      },
      lg: {
        padding: '0.875rem 1.75rem',
        fontSize: '1rem',
        borderRadius: 'var(--radius-md)',
        minHeight: '52px',
        gap: '0.625rem',
      },
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, className)}
        style={{
          ...variantStyles[variant],
          ...(variant !== 'link' ? sizeStyles[size] : { gap: '0.375rem' }),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-family-sans)',
        }}
        {...props}
      >
        {isLoading && (
          <svg
            style={{
              width: '1em',
              height: '1em',
              marginRight: children ? '0.5rem' : 0,
              animation: 'spin 1s linear infinite',
            }}
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span>{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, errorMessage, label, id, leftIcon, rightIcon, disabled, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id || `in-${autoId}`;
    const errId = errorMessage ? `${inputId}-err` : undefined;
    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label htmlFor={inputId} style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {label}
          </label>
        )}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {leftIcon && (
          <span
            style={{
              position: 'absolute',
              left: '0.875rem',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={errId}
          className={cn('w-full transition-all duration-200 outline-none', className)}
          style={{
            width: '100%',
            padding: '0.6875rem 1rem',
            paddingLeft: leftIcon ? '2.5rem' : '1rem',
            paddingRight: rightIcon ? '2.5rem' : '1rem',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            minHeight: 'var(--touch-target-min, 44px)',
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            boxSizing: 'border-box',
          }}
          {...props}
        />

        {rightIcon && (
          <span
            style={{
              position: 'absolute',
              right: '0.875rem',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {rightIcon}
          </span>
        )}
      </div>
      {errorMessage && (
        <p id={errId} role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.25rem' }}>
          {errorMessage}
        </p>
      )}
      </div>
    );
  }
);

Input.displayName = 'Input';

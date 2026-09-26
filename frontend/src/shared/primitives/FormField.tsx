import React, { ReactNode } from 'react';
import { cn } from '../utils';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  helperText,
  required,
  children,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1.5 w-full', className)} style={{ marginBottom: '1rem' }}>
      {label && (
        <label
          htmlFor={htmlFor}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginBottom: '0.375rem',
          }}
        >
          <span>{label}</span>
          {required && <span style={{ color: 'var(--color-danger)' }}>*</span>}
        </label>
      )}

      {children}

      {error ? (
        <span
          role="alert"
          style={{
            fontSize: '0.8125rem',
            color: 'var(--color-danger)',
            marginTop: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <span>⚠️</span> {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-subtle)', marginTop: '0.25rem' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

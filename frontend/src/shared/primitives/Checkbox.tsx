import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, disabled, id, ...props }, ref) => {
    const inputId = id || (label ? `chk-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <input
          ref={ref}
          type="checkbox"
          id={inputId}
          disabled={disabled}
          className={cn('cursor-pointer', className)}
          style={{
            width: '18px',
            height: '18px',
            marginTop: '2px',
            accentColor: 'var(--color-primary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
          {...props}
        />
        {(label || helperText) && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {label && (
              <label
                htmlFor={inputId}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: disabled ? 'var(--color-text-subtle)' : 'var(--color-text)',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  userSelect: 'none',
                }}
              >
                {label}
              </label>
            )}
            {helperText && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.125rem' }}>
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

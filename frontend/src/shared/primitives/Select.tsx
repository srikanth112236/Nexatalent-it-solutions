import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options = [], error, children, disabled, ...props }, ref) => {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <select
          ref={ref}
          disabled={disabled}
          className={cn('w-full appearance-none transition-all duration-200 outline-none', className)}
          style={{
            width: '100%',
            padding: '0.6875rem 2.5rem 0.6875rem 1rem',
            backgroundColor: 'var(--color-bg)',
            color: 'var(--color-text)',
            border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
            minHeight: 'var(--touch-target-min, 44px)',
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            boxSizing: 'border-box',
          }}
          {...props}
        >
          {children ||
            options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
        </select>
        <span
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--color-text-muted)',
            fontSize: '0.75rem',
          }}
        >
          ▼
        </span>
      </div>
    );
  }
);

Select.displayName = 'Select';

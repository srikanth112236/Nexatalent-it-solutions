import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, disabled, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={cn('w-full transition-all duration-200 outline-none', className)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text)',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.9rem',
          lineHeight: 1.5,
          fontFamily: 'var(--font-family-sans)',
          resize: 'vertical',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
          boxSizing: 'border-box',
        }}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

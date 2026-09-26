import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  id,
}) => {
  const switchId = id || (label ? `sw-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      <button
        type="button"
        role="switch"
        id={switchId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: 'var(--radius-pill)',
          backgroundColor: checked ? 'var(--color-primary)' : 'var(--color-surface-hover)',
          border: '1px solid var(--color-border-strong)',
          padding: '2px',
          transition: 'background-color 0.2s',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          display: 'flex',
          alignItems: 'center',
          outline: 'none',
        }}
      >
        <span
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform 0.2s',
            boxShadow: 'var(--shadow-sm)',
          }}
        />
      </button>
      {label && (
        <label
          htmlFor={switchId}
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
    </div>
  );
};

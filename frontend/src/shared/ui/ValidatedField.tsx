/* ============================================================================
   NexaTalent — ValidatedInput / ValidatedField
   Drop-in replacement for <input> / <textarea> / <select> that adds real-time
   validation with plain-English, user-friendly error messages. No technical
   jargon or raw data ever reaches the user.
   ============================================================================ */

import { useState, useCallback, useEffect, type FocusEvent } from 'react';
import { required, email, phone, minLength, number, min, max, url, type Rule } from '../validation';

export interface ValidatedFieldProps {
  label?: string;
  rules?: Rule[];
  value: string | number | boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  errorClassName?: string;
  multiline?: boolean;
  rows?: number;
  requiredMessage?: string;
  disabled?: boolean;
  id?: string;
  autoComplete?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
  maxLengthAttr?: number;
}

/* Simple uncontrolled-ish wrapper: parent owns value, we own validation state */
export function ValidatedField({
  label,
  rules = [],
  value,
  onChange,
  onBlur,
  type = 'text',
  placeholder = '',
  className = '',
  inputClassName = '',
  errorClassName = 'text-xs text-red-600 font-bold mt-1',
  multiline = false,
  rows,
  requiredMessage,
  disabled = false,
  id,
  autoComplete,
  inputMode,
  maxLengthAttr,
}: ValidatedFieldProps) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const validate = useCallback((v: string | number | boolean) => {
    const allValues: Record<string, any> = {};
    for (const rule of rules) {
      const msg = rule(v, allValues);
      if (msg) return msg;
    }
    return undefined;
  }, [rules]);

  useEffect(() => {
    /* Real-time validation on every change once the field has been touched */
    if (touched) {
      const msg = validate(value);
      setError(msg);
    }
  }, [value, touched, validate]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleBlur = useCallback((_e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched(true);
    const msg = validate(value);
    setError(msg);
    onBlur?.();
  }, [value, validate, onBlur]);

  const errorText = touched ? error : undefined;

  const baseCls = 'w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold text-xs focus:bg-white focus:border-black outline-none';
  const errCls = errorText ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : '';

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
          {label} {requiredMessage ? '' : ''}
        </label>
      )}
      {multiline ? (
        <textarea
          id={id}
          value={String(value ?? '')}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={rows || 3}
          disabled={disabled}
          className={`${baseCls} ${inputClassName} ${errCls}`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={String(value ?? '')}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLengthAttr}
          className={`${baseCls} ${inputClassName} ${errCls}`}
        />
      )}
      {errorText && <span className={errorClassName}>{errorText}</span>}
    </div>
  );
}

/* Convenience: common preset rule sets */
export const fieldRules = {
  required: (label = 'This field') => [required(label)] as Rule[],
  email: (label = 'Email address') => [required(label), email()] as Rule[],
  phone: (label = 'Phone number') => [required(label), phone()] as Rule[],
  password: (minLen = 10) => [required('Password'), minLength(minLen, 'Password')] as Rule[],
  name: (label = 'Name') => [required(label), minLength(2, label)] as Rule[],
  url: (label = 'Website address') => [url(label)] as Rule[],
  numberRange: (label = 'This field', minVal?: number, maxVal?: number) =>
    [number(label), ...(minVal !== undefined ? [min(minVal, label)] : []), ...(maxVal !== undefined ? [max(maxVal, label)] : [])] as Rule[],
};

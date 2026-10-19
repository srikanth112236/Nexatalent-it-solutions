/* ============================================================================
   NexaTalent — PasswordInput
   Drop-in password field with a show/hide toggle (eye icon) and consistent styling.
   ============================================================================ */
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  error?: boolean;
  autoComplete?: string;
  id?: string;
  disabled?: boolean;
  name?: string;
}

export function PasswordInput({
  value,
  onChange,
  onBlur,
  placeholder = '••••••••••••',
  className = '',
  inputClassName = '',
  error = false,
  autoComplete = 'current-password',
  id,
  disabled = false,
  name,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 pr-10 text-slate-900 font-semibold text-xs focus:bg-white focus:border-black outline-none ${error ? 'border-red-400 focus:border-red-400' : ''} ${inputClassName}`}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
        onClick={() => setShow((s) => !s)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

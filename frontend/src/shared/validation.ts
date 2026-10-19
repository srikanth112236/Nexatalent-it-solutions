/* ============================================================================
   NexaTalent — Shared real-time form validation
   All messages are written in plain, layman English. No technical jargon,
   no raw data, no stack traces ever reach the user.
   ============================================================================ */

export type Rule = (value: any, allValues: Record<string, any>) => string | undefined;

export interface FieldState {
  value: any;
  error: string | undefined;
  touched: boolean;
  valid: boolean;
}

export interface FormState {
  fields: Record<string, FieldState>;
  errors: string[];
  isValid: boolean;
  touchedAny: boolean;
}

/* ---------- individual rules (each returns a plain-English message or undefined) ---------- */

export function required(label = 'This field'): Rule {
  return (value) => {
    if (value === undefined || value === null) return `${label} is required.`;
    if (typeof value === 'string' && value.trim() === '') return `${label} is required.`;
    if (Array.isArray(value) && value.length === 0) return `${label} is required.`;
    return undefined;
  };
}

export function email(_label = 'Email address'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined; // let `required` handle emptiness
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
      return 'Please enter a valid email address.';
    }
    return undefined;
  };
}

export function phone(_label = 'Phone number'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    const digits = String(value).replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      return 'Please enter a valid phone number.';
    }
    return undefined;
  };
}

export function gstin(_label = 'GSTIN number'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    const v = String(value).trim().toUpperCase();
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v)) {
      return 'Please enter a valid 15-character GSTIN (e.g. 29AABCT1011A1Z5).';
    }
    return undefined;
  };
}

export function pan(_label = 'PAN number'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    const v = String(value).trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v)) {
      return 'Please enter a valid 10-character PAN (e.g. ABCDE1234F).';
    }
    return undefined;
  };
}

export function aadhaar(_label = 'Aadhaar number'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    const digits = String(value).replace(/\D/g, '');
    if (digits.length !== 12) {
      return 'Please enter a valid 12-digit Aadhaar number.';
    }
    return undefined;
  };
}

export function name(_label = 'Name'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    const v = String(value).trim();
    if (v.length < 2) return `${_label} needs at least 2 characters.`;
    if (v.length > 40) return `${_label} can be at most 40 characters.`;
    if (!/^[A-Za-z][A-Za-z\s.'-]*$/.test(v)) {
      return `${_label} should contain letters only.`;
    }
    return undefined;
  };
}

export function numbersOnly(_label = 'This field'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    if (!/^[0-9]+$/.test(String(value).trim())) {
      return `${_label} should contain numbers only.`;
    }
    return undefined;
  };
}

export function website(_label = 'Website address'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    const v = String(value).trim();
    // Accept with or without scheme; validate host part.
    const candidate = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    try {
      const u = new URL(candidate);
      if (!u.hostname || !u.hostname.includes('.')) {
        return 'Please enter a valid website address.';
      }
      return undefined;
    } catch {
      return 'Please enter a valid website address.';
    }
  };
}
export function minLength(n: number, label = 'This field'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    if (String(value).trim().length < n) {
      return `${label} needs at least ${n} characters.`;
    }
    return undefined;
  };
}

export function maxLength(n: number, label = 'This field'): Rule {
  return (value) => {
    if (value === undefined || value === null) return undefined;
    if (String(value).length > n) {
      return `${label} is too long (maximum ${n} characters).`;
    }
    return undefined;
  };
}

export function number(_label = 'This field'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    if (Number.isNaN(Number(value))) return 'Please enter a valid number.';
    return undefined;
  };
}

export function minValue(min: number, label = 'This field'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    const v = Number(value);
    if (Number.isNaN(v)) return undefined;
    if (v < min) return `${label} must be at least ${min}.`;
    return undefined;
  };
}

export function maxValue(max: number, label = 'This field'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    const v = Number(value);
    if (Number.isNaN(v)) return undefined;
    if (v > max) return `${label} must be no more than ${max}.`;
    return undefined;
  };
}

export function min(min: number, label = 'This field'): Rule {
  return minValue(min, label);
}
export function max(max: number, label = 'This field'): Rule {
  return maxValue(max, label);
}

export function url(_label = 'Website address'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    try {
      new URL(String(value));
      return undefined;
    } catch {
      return 'Please enter a valid website address.';
    }
  };
}

export function match(otherField: string, label = 'This field', otherLabel = 'Matching field'): Rule {
  return (value, allValues) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    if (String(value) !== String(allValues[otherField])) {
      return `${label} does not match ${otherLabel}.`;
    }
    return undefined;
  };
}

export function date(_label = 'Date'): Rule {
  return (value) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    const parsed = Date.parse(String(value));
    if (Number.isNaN(parsed)) return 'Please enter a valid date.';
    return undefined;
  };
}

export function after(otherField: string, label = 'This date', otherLabel = 'Start date'): Rule {
  return (value, allValues) => {
    if (value === undefined || value === null || String(value).trim() === '') return undefined;
    const other = String(allValues[otherField] || '');
    if (other === '') return undefined;
    if (Date.parse(String(value)) <= Date.parse(other)) {
      return `${label} must be after ${otherLabel}.`;
    }
    return undefined;
  };
}

export function acceptFile(acceptedTypes: string[], label = 'File'): Rule {
  return (value) => {
    if (!value || !(value instanceof FileList || Array.isArray(value))) return undefined;
    const files = value instanceof FileList ? Array.from(value) : value;
    for (const f of files) {
      const ext = (f.name || '').split('.').pop()?.toLowerCase() || '';
      const ok = acceptedTypes.some((t) => f.type.includes(t) || ext === t.replace('.', ''));
      if (!ok) return `Please upload a ${acceptedTypes.join(' or ')} file for ${label}.`;
    }
    return undefined;
  };
}

/* combine multiple rules into one */
export function combine(...rules: Rule[]): Rule {
  return (value, allValues) => {
    for (const rule of rules) {
      const msg = rule(value, allValues);
      if (msg) return msg;
    }
    return undefined;
  };
}

/* ---------- form engine ---------- */

export function createForm<T extends Record<string, any>>(
  initialValues: T,
  rules: Record<string, Rule[]>
) {
  const fields: Record<string, FieldState> = {};
  for (const key of Object.keys(initialValues)) {
    fields[key] = { value: initialValues[key], error: undefined, touched: false, valid: true };
  }

  function validateField(key: string, value: any, allValues: Record<string, any>): string | undefined {
    const fieldRules = rules[key];
    if (!fieldRules) return undefined;
    for (const rule of fieldRules) {
      const msg = rule(value, allValues);
      if (msg) return msg;
    }
    return undefined;
  }

  function validateAll(values: Record<string, any>): { errors: Record<string, string>; messages: string[]; isValid: boolean } {
    const errors: Record<string, string> = {};
    const messages: string[] = [];
    let isValid = true;
    for (const key of Object.keys(rules)) {
      const msg = validateField(key, values[key], values);
      if (msg) {
        errors[key] = msg;
        messages.push(msg);
        isValid = false;
      }
    }
    return { errors, messages, isValid };
  }

  return {
    fields,
    validateField,
    validateAll,
  };
}

/* ---------- React hook for real-time validation ---------- */

import { useState, useCallback, useMemo } from 'react';

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: Record<string, Rule[]>,
  options?: { validateOnChange?: boolean; validateOnBlur?: boolean }
) {
  const validateOnChange = options?.validateOnChange ?? true;
  const validateOnBlur = options?.validateOnBlur ?? true;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>(undefined);

  const validationResult = useMemo(() => {
    const errs: Record<string, string> = {};
    let valid = true;
    const messages: string[] = [];
    for (const key of Object.keys(rules)) {
      const msg = (() => {
        const fieldRules = rules[key];
        if (!fieldRules) return undefined;
        for (const rule of fieldRules) {
          const m = rule(values[key], values);
          if (m) return m;
        }
        return undefined;
      })();
      if (msg) {
        errs[key] = msg;
        messages.push(msg);
        valid = false;
      }
    }
    return { errors: errs, validationMessages: messages, isValid: valid };
  }, [values, rules]);

  const setField = useCallback((key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (validateOnChange && touched[key]) {
      setErrors((prev) => {
        const fieldRules = rules[key];
        if (!fieldRules) return prev;
        for (const rule of fieldRules) {
          const m = rule(value, values);
          if (m) return { ...prev, [key]: m };
        }
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }, [values, rules, validateOnChange]);

  const setTouchedField = useCallback((key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    if (validateOnBlur) {
      setErrors((prev) => {
        const fieldRules = rules[key];
        if (!fieldRules) return prev;
        for (const rule of fieldRules) {
          const m = rule(values[key], values);
          if (m) return { ...prev, [key]: m };
        }
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }, [values, rules, validateOnBlur]);

  const validateForm = useCallback((): { errors: Record<string, string>; validationMessages: string[]; isValid: boolean } => {
    const errs: Record<string, string> = {};
    const messages: string[] = [];
    let valid = true;
    for (const key of Object.keys(rules)) {
      const fieldRules = rules[key];
      if (!fieldRules) continue;
      for (const rule of fieldRules) {
        const m = rule(values[key], values);
        if (m) {
          errs[key] = m;
          messages.push(m);
          valid = false;
          break;
        }
      }
    }
    setTouched((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(rules)) next[key] = true;
      return next;
    });
    setErrors(errs);
    return { errors: errs, validationMessages: messages, isValid: valid };
  }, [values, rules]);

  const handleSubmit = useCallback(
    (onValid: (values: T) => void | Promise<void>) =>
      async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(undefined);
        const { isValid, validationMessages } = validateForm();
        if (!isValid) {
          setSubmitError(validationMessages.length ? validationMessages[0] : 'Please fix the fields marked above.');
          return;
        }
        setIsSubmitting(true);
        try {
          await onValid(values as T);
        } catch (err) {
          setSubmitError('Something went wrong. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      },
    [values, rules, validateForm]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError(undefined);
    setIsSubmitting(false);
  }, [initialValues]);

  const errorFor = useCallback(
    (key: string) => (touched[key] ? errors[key] : undefined),
    [touched, errors]
  );

  return {
    values,
    setValues,
    setField,
    errors,
    touched,
    setTouchedField,
    errorFor,
    isValid: validationResult.isValid,
    validationMessages: validationResult.validationMessages,
    isSubmitting,
    submitError,
    setSubmitError,
    validateForm,
    handleSubmit,
    reset,
  };
}

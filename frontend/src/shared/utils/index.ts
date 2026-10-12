import clsx, { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatDate(date: string | Date | number, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  // P3: user locale (was hardcoded en-US while portals used en-IN).
  const locale = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-IN';
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  }).format(d);
}

export function formatCurrency(amount: number, currency?: string): string {
  // P3: default INR (app bills in INR; was USD) + user locale.
  const locale = typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-IN';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(date: string | Date | number): string {
  return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// P5: lightweight HTML sanitizer (no new dep) — strips scripts, frames,
// objects, event handlers, and javascript:/data: URLs. Use at every
// dangerouslySetInnerHTML sink.
export function sanitizeHtml(html: string): string {
  let s = String(html || '');
  s = s.replace(/<script[\s\S]*?<\/script\s*>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style\s*>/gi, '');
  s = s.replace(/<\/?(iframe|object|embed|link|meta|base|form|input|button|textarea|select|option)\b[^>]*>/gi, '');
  s = s.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  s = s.replace(/(href|src|xlink:href)\s*=\s*"(javascript|data|vbscript):[^"]*"/gi, '$1="#"');
  s = s.replace(/(href|src|xlink:href)\s*=\s*'(javascript|data|vbscript):[^']*'/gi, "$1='#'");
  s = s.replace(/(href|src|xlink:href)\s*=\s*(javascript|data|vbscript):[^\s>]+/gi, '$1=#');
  return s;
}

export function escHtml(s: string): string {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// P6: meeting-link guard — only https joins, blocks javascript:/data:.
export function safeMeetLink(url: string): string | null {
  const s = String(url || '').trim();
  if (!/^https:\/\//i.test(s)) return null;
  if (/[<>"\s]/.test(s)) return null;
  if (s.length > 500) return null;
  return s;
}

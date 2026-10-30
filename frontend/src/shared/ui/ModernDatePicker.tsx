import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, Clock, Check } from 'lucide-react';

export interface ModernDatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mode?: 'month-year' | 'date' | 'year';
  format?: 'MMM YYYY' | 'YYYY-MM' | 'YYYY-MM-DD';
  allowPresent?: boolean;
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
  className?: string;
  error?: boolean;
  id?: string;
}

const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MONTHS_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_SHORT = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function ModernDatePicker({
  value = '',
  onChange,
  placeholder = 'Select date...',
  mode = 'month-year',
  format,
  allowPresent = false,
  minYear = 1970,
  maxYear = new Date().getFullYear() + 10,
  disabled = false,
  className = '',
  error = false,
  id,
}: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default format depending on mode
  const resolvedFormat = format || (mode === 'date' ? 'YYYY-MM-DD' : mode === 'year' ? 'YYYY' : 'MMM YYYY');

  // Parse incoming value into year, month (0-11), and day (1-31)
  const parsed = useMemo(() => {
    if (!value || value.toLowerCase() === 'present') {
      const today = new Date();
      return {
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate(),
        isPresent: value.toLowerCase() === 'present',
        hasValue: Boolean(value),
      };
    }

    // Try ISO YYYY-MM-DD or YYYY-MM
    const isoMatch = value.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/);
    if (isoMatch) {
      return {
        year: parseInt(isoMatch[1], 10),
        month: parseInt(isoMatch[2], 10) - 1,
        day: isoMatch[3] ? parseInt(isoMatch[3], 10) : 1,
        isPresent: false,
        hasValue: true,
      };
    }

    // Try 'MMM YYYY' or 'Month YYYY' (e.g. 'Jun 2021', 'June 2021')
    const words = value.trim().split(/[\s,]+/);
    if (words.length >= 2) {
      const mStr = words[0].toLowerCase();
      const yVal = parseInt(words[1], 10);
      const mIdx = MONTHS_SHORT.findIndex((m) => m.toLowerCase() === mStr.slice(0, 3));
      if (mIdx !== -1 && !isNaN(yVal)) {
        return {
          year: yVal,
          month: mIdx,
          day: 1,
          isPresent: false,
          hasValue: true,
        };
      }
    }

    // Try 4 digit year only (e.g. '2024')
    const yOnly = value.match(/^(\d{4})$/);
    if (yOnly) {
      return {
        year: parseInt(yOnly[1], 10),
        month: 0,
        day: 1,
        isPresent: false,
        hasValue: true,
      };
    }

    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
      isPresent: false,
      hasValue: false,
    };
  }, [value]);

  const [viewYear, setViewYear] = useState(parsed.year);
  const [viewMonth, setViewMonth] = useState(parsed.month);

  // Keep view aligned with value when value changes externally
  useEffect(() => {
    if (parsed.hasValue && !parsed.isPresent) {
      setViewYear(parsed.year);
      setViewMonth(parsed.month);
    }
  }, [parsed]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Format output
  const formatOutput = (year: number, month: number, day?: number): string => {
    if (mode === 'year') {
      return String(year);
    }
    if (resolvedFormat === 'YYYY-MM') {
      const mPad = String(month + 1).padStart(2, '0');
      return `${year}-${mPad}`;
    }
    if (resolvedFormat === 'YYYY-MM-DD') {
      const mPad = String(month + 1).padStart(2, '0');
      const dPad = String(day || 1).padStart(2, '0');
      return `${year}-${mPad}-${dPad}`;
    }
    // Default 'MMM YYYY'
    return `${MONTHS_SHORT[month]} ${year}`;
  };

  const handleSelectMonth = (mIdx: number) => {
    const out = formatOutput(viewYear, mIdx);
    onChange(out);
    setIsOpen(false);
  };

  const handleSelectDay = (day: number) => {
    const out = formatOutput(viewYear, viewMonth, day);
    onChange(out);
    setIsOpen(false);
  };

  const handleSelectYear = (yr: number) => {
    if (mode === 'year') {
      onChange(String(yr));
      setIsOpen(false);
    } else {
      setViewYear(yr);
    }
  };

  const handleSelectPresent = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('Present');
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  // Generate days in month for 'date' mode
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  // Year options list for quick dropdown
  const yearOptions = useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [minYear, maxYear]);

  // Display text in input
  const displayText = useMemo(() => {
    if (!value) return '';
    if (value.toLowerCase() === 'present') return 'Present';
    return value;
  }, [value]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Input */}
      <div
        id={id}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={`w-full px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition select-none ${
          disabled
            ? 'bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed'
            : error
            ? 'bg-red-50/20 border-red-300 text-slate-800 cursor-pointer focus:ring-2 focus:ring-red-400/20 focus:border-red-500'
            : isOpen
            ? 'bg-white border-[#087BFF] ring-2 ring-[#087BFF]/20 text-slate-900 cursor-pointer shadow-sm'
            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 cursor-pointer shadow-xs'
        } ${className}`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <Calendar
            size={14}
            className={disabled ? 'text-slate-300' : isOpen ? 'text-[#087BFF]' : 'text-slate-400'}
          />
          {displayText ? (
            <span
              className={`font-semibold ${
                displayText === 'Present' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]' : 'text-slate-900'
              }`}
            >
              {displayText}
            </span>
          ) : (
            <span className="text-slate-400 font-medium">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {displayText && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              title="Clear date"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Floating Popover Picker */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 p-3.5 w-72 sm:w-80 animate-in fade-in zoom-in-95 duration-100">
          {/* Header with Month/Year Navigation */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => {
                if (mode === 'date') {
                  if (viewMonth === 0) {
                    setViewMonth(11);
                    setViewYear((y) => Math.max(minYear, y - 1));
                  } else {
                    setViewMonth((m) => m - 1);
                  }
                } else {
                  setViewYear((y) => Math.max(minYear, y - 1));
                }
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Previous"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1.5">
              {mode === 'date' && (
                <span className="font-bold text-xs text-slate-900">
                  {MONTHS_FULL[viewMonth]}
                </span>
              )}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                className="font-extrabold text-xs text-slate-900 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                if (mode === 'date') {
                  if (viewMonth === 11) {
                    setViewMonth(0);
                    setViewYear((y) => Math.min(maxYear, y + 1));
                  } else {
                    setViewMonth((m) => m + 1);
                  }
                } else {
                  setViewYear((y) => Math.min(maxYear, y + 1));
                }
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* MODE: Year Grid */}
          {mode === 'year' && (
            <div className="grid grid-cols-3 gap-2 my-1 max-h-48 overflow-y-auto pr-1">
              {yearOptions.map((yr) => {
                const isSelected = parsed.hasValue && parsed.year === yr;
                const isCurrentYear = new Date().getFullYear() === yr;

                return (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => handleSelectYear(yr)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition flex items-center justify-center relative ${
                      isSelected
                        ? 'bg-[#087BFF] text-white shadow-sm shadow-blue-500/30'
                        : isCurrentYear
                        ? 'bg-blue-50 text-[#087BFF] border border-blue-200 hover:bg-blue-100'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{yr}</span>
                    {isSelected && <Check size={12} className="ml-1 text-white" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* MODE: Month & Year Grid */}
          {mode === 'month-year' && (
            <div className="grid grid-cols-3 gap-2 my-1">
              {MONTHS_SHORT.map((m, idx) => {
                const isSelected =
                  parsed.hasValue &&
                  !parsed.isPresent &&
                  parsed.year === viewYear &&
                  parsed.month === idx;
                const isCurrentMonth =
                  new Date().getFullYear() === viewYear && new Date().getMonth() === idx;

                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelectMonth(idx)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition flex items-center justify-center relative ${
                      isSelected
                        ? 'bg-[#087BFF] text-white shadow-sm shadow-blue-500/30'
                        : isCurrentMonth
                        ? 'bg-blue-50 text-[#087BFF] border border-blue-200 hover:bg-blue-100'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{m}</span>
                    {isSelected && <Check size={12} className="ml-1 text-white" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* MODE: Full Date (Calendar Grid) */}
          {mode === 'date' && (
            <div>
              <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {DAYS_SHORT.map((d) => (
                  <span key={d} className="text-[10px] font-bold text-slate-400 py-1">
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-7 w-7" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected =
                    parsed.hasValue &&
                    !parsed.isPresent &&
                    parsed.year === viewYear &&
                    parsed.month === viewMonth &&
                    parsed.day === day;
                  const isToday =
                    new Date().getFullYear() === viewYear &&
                    new Date().getMonth() === viewMonth &&
                    new Date().getDate() === day;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`h-7 w-7 mx-auto rounded-lg text-xs font-bold flex items-center justify-center transition ${
                        isSelected
                          ? 'bg-[#087BFF] text-white'
                          : isToday
                          ? 'bg-blue-50 text-[#087BFF] border border-blue-200'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Action Footer */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setViewYear(now.getFullYear());
                setViewMonth(now.getMonth());
                if (mode === 'month-year') {
                  handleSelectMonth(now.getMonth());
                } else if (mode === 'date') {
                  handleSelectDay(now.getDate());
                }
              }}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Clock size={11} />
              <span>Current</span>
            </button>

            {allowPresent && (
              <button
                type="button"
                onClick={handleSelectPresent}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                  parsed.isPresent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>Present / Ongoing</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

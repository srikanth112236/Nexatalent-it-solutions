import React, { createContext, useContext, useEffect } from 'react';

export type Theme = 'light';

interface ThemeContextValue {
  theme: 'light';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

/**
 * Standard Light Theme Provider — locks application permanently to light theme,
 * enforcing accessible color contrast and brand-aligned palette.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    document.documentElement.dataset.theme = 'light';
    try {
      window.localStorage.removeItem('nexatalent-theme');
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

/** Theme toggle permanently disabled and hidden per brand requirements */
export const ThemeToggle: React.FC<{ className?: string }> = () => null;

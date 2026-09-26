/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      fontSize: {
        'section-title': ['var(--section-title-size, clamp(1.5rem, 0.88rem + 2.65vw, 2.5rem))', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        'section-subtitle': ['var(--section-subtitle-size, clamp(0.875rem, 0.82rem + 0.25vw, 1.05rem))', { lineHeight: '1.6' }],
      }
    },
  },
  plugins: [],
}

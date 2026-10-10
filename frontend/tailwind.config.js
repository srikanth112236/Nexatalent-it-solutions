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
        /* Enterprise spec §5.1 tokens (exact). */
        spec: {
          navy: '#071B3A',
          midnight: '#0B2548',
          electric: '#087BFF',
          azure: '#35A7FF',
          pale: '#F4F7FB',
          charcoal: '#172338',
          slate: '#627086',
          border: '#DCE5F0',
        },
        nexa: {
          950: '#060F2B',
          900: '#0A1E4E',
          800: '#102C6B',
          700: '#0F42B0',
          600: '#0B63E5',
          500: '#1A86FF',
          400: '#3FA9FF',
          300: '#8ACBFF',
          100: '#D8EBFF',
          50: '#EFF5FF',
        },
        brand: {
          50: '#EFF5FF',
          100: '#D8EBFF',
          200: '#B3D7FF',
          300: '#8ACBFF',
          400: '#3FA9FF',
          500: '#1A86FF',
          600: '#0B63E5',
          700: '#0F42B0',
          800: '#102C6B',
          900: '#0A1E4E',
          950: '#060F2B',
        }
      },
      fontFamily: {
        manrope: ['"Manrope"', '"Inter"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Manrope"', '"Inter"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['"Manrope"', '"Inter"', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'section-title': ['var(--section-title-size, clamp(1.35rem, 0.8rem + 2.1vw, 2.25rem))', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        'section-subtitle': ['var(--section-subtitle-size, clamp(0.85rem, 0.8rem + 0.2vw, 1rem))', { lineHeight: '1.6' }],
      }
    },
  },
  plugins: [],
}

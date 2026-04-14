import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — Teal
        brand: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Sidebar — dark warm grey (silver rust family)
        rust: {
          50:  '#f9f6f5',
          100: '#f0ecea',
          200: '#e2d9d6',
          300: '#c3b9b7',
          400: '#a09690',
          500: '#7d726c',
          600: '#5c5148',
          700: '#3d3530',
          800: '#2a2422',
          900: '#1c1714',
          950: '#0e0c0a',
        },
        // Canvas — warm off-white
        canvas: '#FAFAF9',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'xs':      '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'sm':      '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card':    '0 0 0 1px rgb(0 0 0 / 0.06), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
        'card-hover': '0 0 0 1px rgb(0 0 0 / 0.08), 0 4px 12px 0 rgb(0 0 0 / 0.08)',
        'popover': '0 0 0 1px rgb(0 0 0 / 0.08), 0 8px 24px 0 rgb(0 0 0 / 0.12)',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        DEFAULT: '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      animation: {
        'fade-in':   'fadeIn 0.15s ease-out',
        'slide-up':  'slideUp 0.2s ease-out',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
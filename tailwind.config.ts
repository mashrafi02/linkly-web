import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#effefb',
          100: '#c9fef4',
          200: '#93fcea',
          300: '#55f3dc',
          400: '#22dfca',
          500: '#09c3b1',
          600: '#049d92',
          700: '#087d76',
          800: '#0c6360',
          900: '#0f524f',
          950: '#013133',
        },
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft':   '0 2px 8px -2px rgba(0, 0, 0, 0.08)',
        'lifted': '0 4px 20px -4px rgba(0, 0, 0, 0.08)',
        'glow':   '0 0 24px -6px rgba(8, 125, 118, 0.2)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'slide-up':   'slideUp 0.5s ease-out forwards',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
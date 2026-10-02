import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f9f6',
          100: '#e1f2ec',
          200: '#c5e4d9',
          300: '#9bcfbf',
          400: '#6bb39f',
          500: '#469681',
          600: '#347867',
          700: '#2a6154',
          800: '#0F4C3A', // Deep green primary
          900: '#0B3B2D',
          950: '#05221a',
        },
        gold: {
          50: '#fdfbe8',
          100: '#fbf5c4',
          200: '#f8e98b',
          300: '#f4d748',
          400: '#eebe18',
          500: '#D4AF37', // Gold accent
          600: '#b78b12',
          700: '#926410',
          800: '#784d14',
          900: '#673e16',
        },
        burgundy: {
          50: '#fdf2f4',
          100: '#fbe6e8',
          200: '#f6cfd5',
          300: '#eeab9e',
          400: '#e37788',
          500: '#d34861',
          600: '#be2e4b',
          700: '#9B111E', // Burgundy red accent
          800: '#831221',
          900: '#701421',
        },
        surface: {
          50: '#FAFCFB',
          100: '#F1F5F3',
          200: '#E2E8F0',
          800: '#1F2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 76, 58, 0.08)',
        'card': '0 4px 20px -2px rgba(15, 76, 58, 0.05)',
        'card-hover': '0 20px 30px -10px rgba(15, 76, 58, 0.12)',
        'header': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
};

export default config;

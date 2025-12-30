/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Linear-inspired color palette
        primary: {
          50: '#F0F4FF',
          100: '#E0E9FF',
          200: '#C7D7FE',
          300: '#A5BBFC',
          400: '#8098F9',
          500: '#5B75F5', // Primary Linear purple/blue
          600: '#4C5FE8',
          700: '#3D4AD4',
          800: '#3139AB',
          900: '#2C3187',
        },
        accent: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9', // Accent blue
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'marching-ants': 'marching-ants 0.5s linear infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'marching-ants': {
          '0%': { 'stroke-dashoffset': '0' },
          '100%': { 'stroke-dashoffset': '10' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '60': '15rem',
        '72': '18rem',
        '80': '20rem',
        '88': '22rem',
        '120': '30rem',
        '144': '36rem',
        '100': '25rem',
        '112': '28rem',
      },
    },
  },
  plugins: [],
};
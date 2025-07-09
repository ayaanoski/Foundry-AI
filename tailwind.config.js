/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'card-bg': '#1a1a1a',
        'card-border': '#2a2a2a',
        'hover-bg': '#404040',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0A1F44',
        gold: '#D4A829',
        cred: '#C41E3A',
        cgreen: '#2E8B57',
        cream: '#F5F5F0',
        primary: { DEFAULT: '#0A1F44', light: '#1a365d', dark: '#061430' },
        industrie: '#2E8B57',
        commerce: '#C41E3A',
        accent: { DEFAULT: '#D4A829', dark: '#b8921d' },
        hausse: '#2E8B57',
        baisse: '#C41E3A',
        stable: '#D4A829',
      },
      fontFamily: {
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

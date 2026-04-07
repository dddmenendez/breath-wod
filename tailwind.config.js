/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0f172a',
          surface: '#1e293b',
          elevated: '#334155',
        },
        primary: {
          DEFAULT: '#84cc16',
          dark: '#65a30d',
          light: '#a3e635',
        },
        accent: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
        },
        text: {
          DEFAULT: '#f1f5f9',
          muted: '#94a3b8',
          dim: '#64748b',
        },
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
}

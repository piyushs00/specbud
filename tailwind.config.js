/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'pastel-blue': '#E3F2FD',
        'pastel-lilac': '#F3E5F5',
        'pastel-mint': '#E8F5E8',
        'pastel-peach': '#FFF3E0',
        'soft-blue': '#BBDEFB',
        'soft-lilac': '#E1BEE7',
        'soft-mint': '#C8E6C9',
        'soft-peach': '#FFCCBC',
        'dark-blue': '#1a1a2e',
        'dark-purple': '#16213e',
        'dark-green': '#0f3460',
        'accent-blue': '#3b82f6',
        'accent-green': '#10b981',
        'accent-purple': '#8b5cf6',
        'accent-orange': '#f59e0b',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
};

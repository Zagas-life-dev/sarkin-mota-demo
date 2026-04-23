const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Semantic colors used across the project */
        background: '#050816', // deep navy / charcoal
        foreground: '#f9fafb', // soft white
        border: 'rgba(148,163,184,0.5)',
        accent: '#b8860b', // dark gold accent
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
} 
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0b0e11',
        panel: '#14181b',
        accent: '#7dd3fc'
      },
      boxShadow: {
        glow: '0 0 15px rgba(125, 211, 252, 0.4)'
      }
    }
  },
  plugins: []
}

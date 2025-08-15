/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#000000',
        panel: '#171717',
        accent: '#3b82f6'
      },
      boxShadow: {
        glow: '0 0 15px rgba(59, 130, 246, 0.4)'
      }
    }
  },
  plugins: []
}

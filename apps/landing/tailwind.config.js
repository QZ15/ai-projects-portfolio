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
        panel: '#14181b',
        accent: '#ffffff'
      },
      boxShadow: {
        glow: '0 0 15px rgba(255, 255, 255, 0.2)'
      }
    }
  },
  plugins: []
}

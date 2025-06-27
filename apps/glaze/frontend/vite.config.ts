import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/glaze/',
  build: {
    outDir: "../../../public/glaze", // or relative to your monorepo root
  },
  plugins: [react(), tailwindcss()]
});
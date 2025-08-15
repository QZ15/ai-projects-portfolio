import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Load env variables from repository root so the app can share the monorepo .env
export default defineConfig({
  envDir: resolve(__dirname, '../..'),
  plugins: [react()],
})

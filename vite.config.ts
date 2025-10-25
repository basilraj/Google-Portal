import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Correct Vercel configuration for static Vite deployment
export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ this ensures assets load correctly in production
})

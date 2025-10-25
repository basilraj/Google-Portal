import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Correct config for Vercel static deployment
export default defineConfig({
  plugins: [react()],
  base: '/', // ensures correct absolute asset paths
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})

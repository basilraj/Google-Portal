import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// Fix: Import fileURLToPath for ESM __dirname equivalent
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      // Fix: Use import.meta.url and path.dirname to define __dirname in an ESM context
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './'),
    },
  },
})
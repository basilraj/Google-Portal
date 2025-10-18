
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Replace REPO_NAME with the name of your GitHub repository.
  // For example, if your repository URL is https://github.com/your-user/my-job-portal,
  // set base to '/my-job-portal/'
  base: '/Google-Portal/',
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/careercraft/',
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3002', changeOrigin: true }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcsv from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcsv(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
      '/accounts': 'http://localhost:8000',
      '/csrf': 'http://localhost:8000',
    }
  }
})

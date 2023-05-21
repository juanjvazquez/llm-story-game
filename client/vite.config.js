import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    optimizeDeps: false,
  },
  server: {
    port: 3000,
    host: 'localhost'
  }
})

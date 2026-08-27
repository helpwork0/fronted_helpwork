import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Alias "@" -> /src  (evita imports tipo ../../../)
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    open: true,
    // Cuando conectes el backend, descomenta:
    // proxy: { '/api': { target: 'http://localhost:4000', changeOrigin: true } },
  },
})

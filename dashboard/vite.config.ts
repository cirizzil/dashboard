import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://testing.asets.io/convert',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/api/, '/v1'),
      },
    },
  },
})

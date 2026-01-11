import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@dashboard': fileURLToPath(new URL('./src/features/dashboard', import.meta.url)),
      '@invoices': fileURLToPath(new URL('./src/features/invoices', import.meta.url)),
      '@products': fileURLToPath(new URL('./src/features/products', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/core/assets', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/core/components', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    target: 'esnext',
  },
})

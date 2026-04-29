/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue') || id.includes('node_modules/pinia') || id.includes('node_modules/@vueuse')) {
            return 'vendor-vue'
          }
          if (id.includes('node_modules/markdown-it') || id.includes('node_modules/highlight.js') || id.includes('node_modules/katex') || id.includes('node_modules/dompurify')) {
            return 'vendor-md'
          }
        }
      }
    }
  }
})

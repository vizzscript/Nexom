import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit slightly to avoid noise
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react-router-dom/')) {
            return 'vendor'
          }

          if (id.includes('/node_modules/framer-motion/') ||
            id.includes('/node_modules/lucide-react/')) {
            return 'ui'
          }
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
            return 'vendor'
          }
          if (id.includes('framer-motion') || id.includes('lucide-react')) {
            return 'ui'
          }
          // other node_modules go to their own chunk
          return undefined
        },
      },
    },
  },
})

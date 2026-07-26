import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Optimize bundle size and improve performance
  build: {
    rollupOptions: {
      external: ['react-dom/client'],
    },
    // Code splitting for better performance
    modulePreload: {
      polyfill: false,
    },
  },
  // Vite dev server configuration
  server: {
    port: 5173,
    host: true,
    strictPort: true,
  },
  // CSS processing
  css: {
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },
})
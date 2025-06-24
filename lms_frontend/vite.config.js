import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    historyApiFallback: true,
  },
  build: {
    outDir: '../lms_backend/frontend_build',  // ✅ ensure this matches Django setup
    emptyOutDir: true,
  },
  base: '/', // ✅ this is critical for correct asset path resolution
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Important: ensure this is set correctly
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: replace 'midnight-and-light' with your exact repo name
  base: '/midnight-and-light/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})

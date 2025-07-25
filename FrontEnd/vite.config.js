import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["jwt-decode"], // Ensure Vite optimizes this dependency
  },
  resolve: {
    alias: {
      "@": "/src", // Shorter imports for better readability
    },
  },
  server: {
    port: 5173, // Default port for development
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Replace with your backend API
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

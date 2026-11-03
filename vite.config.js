import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// This file tells Vite which plugins to use and where to send API requests.
export default defineConfig({
  plugins: [
    react(),        // makes React work
    tailwindcss(),  // makes Tailwind work
  ],
  server: {
    proxy: {
      // Any request that starts with /api goes to our Express server on port 5000
      '/api': 'http://localhost:5000',
    },
  },
})
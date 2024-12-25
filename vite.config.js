import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  worker: {
    format: "es", // Use ES modules
  },
  optimizeDeps: {
    include: ['worker.js'], // Include the worker in dependency optimization
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"] 
  },
  server: {
    fs: {
      allow: ['..'], // Allow access to files outside of the project root
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
  }
  },
  build: {
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
})

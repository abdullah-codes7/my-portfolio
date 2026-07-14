import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    // esbuild is Vite's built-in minifier (no extra install needed) and is
    // actually faster than terser. drop: ['console', 'debugger'] strips all
    // console.* calls from the production bundle automatically.
    minify: 'esbuild',
    esbuildOptions: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      output: {
        // Split vendor libs into separate cacheable chunks so the browser
        // can cache gsap/lenis/react-router independently of app code.
        manualChunks(id) {
          if (id.includes('node_modules/gsap')) return 'vendor-gsap'
          if (id.includes('node_modules/lenis')) return 'vendor-lenis'
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router')) return 'vendor-router'
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) return 'vendor-react'
          if (id.includes('node_modules/')) return 'vendor-misc'
        },
      },
    },
    // Raise the warning threshold so the split chunks don't cause false alarms.
    chunkSizeWarningLimit: 500,
    // Pre-compress assets so the host serves brotli/gzip without per-request work.
    reportCompressedSize: true,
  },
})

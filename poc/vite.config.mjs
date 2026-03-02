import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    // Bind explicitly to localhost to avoid network binding issues
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    watch: {
      // Ignore large or external folders to prevent unnecessary restarts.
      // Use both workspace-relative globs and an absolute pattern to be robust.
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        // workspace-level agents folder (relative)
        '../agents/**',
        // workspace-level agents folder (absolute)
        path.resolve(__dirname, '..', 'agents') + '/**/*'
      ]
    },
    hmr: {
      // keep default overlay but ensure host is consistent for HMR websocket
      host: '127.0.0.1'
    }
  }
})

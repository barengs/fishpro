import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('zod')) {
              return 'vendor-zod';
            }
          }
          if (
            id.includes('/src/components/ui/') ||
            id.includes('/src/components/DataTable') ||
            id.includes('/src/components/DetailModal') ||
            id.includes('/src/components/StatusChip') ||
            id.includes('/src/components/ProgressBar') ||
            id.includes('/src/components/FormField') ||
            id.includes('/src/components/CrudModal') ||
            id.includes('/src/components/ConfirmDeleteModal') ||
            id.includes('/src/components/useCrudModal') ||
            id.includes('/src/components/useDetailModal') ||
            id.includes('/src/components/useConfirmDelete') ||
            id.includes('/src/components/NotificationBell')
          ) {
            return 'shared-ui';
          }
          if (
            id.includes('/src/utils/') ||
            id.includes('/src/services/') ||
            id.includes('/src/config/api')
          ) {
            return 'shared-core';
          }
        },
      },
    },
  },
})

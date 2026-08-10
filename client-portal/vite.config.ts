import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // envDir: 'env',
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: true,
    proxy: process.env.VITE_DEV_API_PROXY_TARGET ? {
      '/api': {
        target: process.env.VITE_DEV_API_PROXY_TARGET,
        changeOrigin: true,
        ws: true,
      },
    } : undefined,
  }
});

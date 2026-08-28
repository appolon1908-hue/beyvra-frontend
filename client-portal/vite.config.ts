import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // envDir: 'env',
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react") || id.includes("@reduxjs/toolkit")) return "vendor-react";
          if (id.includes("antd") || id.includes("@ant-design")) return "vendor-antd";
          if (id.includes("echarts") || id.includes("lightweight-charts")) return "vendor-charts";
          return "vendor";
        },
      },
    },
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

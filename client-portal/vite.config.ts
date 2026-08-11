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
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/.test(id)) return "vendor-react";
          if (/[\\/]node_modules[\\/](@ant-design|antd|rc-)/.test(id)) return "vendor-antd";
          if (/[\\/]node_modules[\\/](echarts|zrender|lightweight-charts)[\\/]/.test(id)) return "vendor-charts";
          if (/[\\/]node_modules[\\/](@tanstack|axios)[\\/]/.test(id)) return "vendor-data";
          return "vendor-misc";
        },
      },
    },
  },
});

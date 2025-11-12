import { defineConfig, createLogger } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      clientPort: parseInt(process.env.WEBSOCKET_PORT!),
    },
  },
  plugins: [react()],
  customLogger: createLogger('info', { prefix: '[coderpad]' }),
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/styles/_index.scss";
        `,
      },
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      components: path.resolve(__dirname, './src/components'),
      routes: path.resolve(__dirname, './src/routes'),
      store: path.resolve(__dirname, './src/store'),
      styles: path.resolve(__dirname, './src/styles'),
      utils: path.resolve(__dirname, './src/utils'),
      views: path.resolve(__dirname, './src/views'),
      repositories: path.resolve(__dirname, './src/repositories'),
    },
  },
});

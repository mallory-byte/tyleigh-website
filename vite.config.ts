import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // The export imports its backend calls from `zite-endpoints-sdk`.
      // We alias that to a local client that talks to our /api serverless functions,
      // so every component import stays byte-for-byte identical to the export.
      'zite-endpoints-sdk': path.resolve(__dirname, './src/lib/sdk.ts'),
    },
  },
  server: { port: 3000 },
});

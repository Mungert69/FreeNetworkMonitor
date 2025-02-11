import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8443,  // You can change this to your desired port
    https: {
      key: fs.readFileSync(path.resolve('/home/mahadeva/code/securefiles/mail/server-freenetworkmonitor.key')), // Absolute path
      cert: fs.readFileSync(path.resolve('/home/mahadeva/code/securefiles/mail/server-freenetworkmonitor.crt')), // Absolute path
    },
    host: '127.0.0.1',
    cors: true,  // Enable CORS if needed
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.VITE_DEBUG === 'true',  // Enable source maps only in debug mode
    minify: process.env.VITE_DEBUG === 'true' ? 'esbuild' : 'terser',  // Use minification only in production
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // Correct alias resolution
    },
  },
  base: '/',  // Ensures React Router works in Vite
  define: {
    'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),  // Define environment for debugging
  },
});


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
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // Correct alias resolution
    },
  },
  base: '/',  // Ensures React Router works in Vite
});


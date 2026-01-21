import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const isVitest = Boolean(process.env.VITEST);
const certificateKeyPath = '/home/mahadeva/code/securefiles/dev/readyforquantum.key';
const certificatePath = '/home/mahadeva/code/securefiles/dev/readyforquantum.crt';

const httpsConfig = (() => {
  if (isVitest) {
    return undefined;
  }

  const keyExists = fs.existsSync(certificateKeyPath);
  const certExists = fs.existsSync(certificatePath);

  if (keyExists && certExists) {
    return {
      key: fs.readFileSync(path.resolve(certificateKeyPath)),
      cert: fs.readFileSync(path.resolve(certificatePath)),
    };
  }

  return undefined;
})();

export default defineConfig({
  plugins: [react()],
  ...(isVitest
    ? {}
    : {
        server: {
          port: 8443, // You can change this to your desired port
          host: 'devwww.readyforquantum.com',
          allowedHosts: ['devwww.readyforquantum.com'],
          cors: true, // Enable CORS if needed
          ...(httpsConfig ? { https: httpsConfig } : {}),
        },
      }),
  build: {
    outDir: 'dist',
    sourcemap: process.env.VITE_DEBUG === 'true',  // Enable source maps only in debug mode
    minify: process.env.VITE_DEBUG === 'true' ? 'esbuild' : 'terser',  // Use minification only in production
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // Correct alias resolution
      ...(isVitest
        ? {
            '@mui/x-data-grid/esm/index.css': path.resolve(
              __dirname,
              'src/test-utils/mocks/emptyCss.js',
            ),
          }
        : {}),
    },
  },
  base: '/',  // Ensures React Router works in Vite
  define: {
    'import.meta.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),  // Define environment for debugging
  },
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.js',
    css: true,
    globals: true,
    restoreMocks: true,
    deps: {
      inline: ['@mui/x-data-grid'],
    },
  },
});

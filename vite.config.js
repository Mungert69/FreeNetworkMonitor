import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const isVitest = Boolean(process.env.VITEST);
const certificateKeyPath = '/home/mahadeva/code/securefiles/dev/readyforquantum.key';
const certificatePath = '/home/mahadeva/code/securefiles/dev/readyforquantum.crt';
const devHost = process.env.VITE_DEV_HOST || 'devwww.readyforquantum.com';
const devPort = Number(process.env.VITE_DEV_PORT || 8443);
const devClientPort = Number(process.env.VITE_DEV_CLIENT_PORT || 443);
const devHmrProtocol = process.env.VITE_DEV_HMR_PROTOCOL || 'wss';

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

const versionsEnvPath = '/home/mahadeva/code/NetworkMonitor/versions.env';
const dockerfilePath = '/home/mahadeva/code/NetworkMonitorProcessorAgent/Dockerfile.trixie';

const parseVersionsEnv = (filePath) => {
  const defaults = {
    OPENSSL_VERSION: 'unknown',
    LIBOQS_VERSION: 'unknown',
    OQS_PROVIDER_VERSION: 'unknown',
  };

  if (!fs.existsSync(filePath)) {
    return defaults;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const values = { ...defaults };

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const match = line.match(/^([A-Z0-9_]+)\s*=\s*"?\$\{[A-Z0-9_]+:-([^"}]+)\}"?$/);
    if (!match) {
      continue;
    }

    const key = match[1];
    const value = match[2];
    if (key in values) {
      values[key] = value;
    }
  }

  return values;
};

const buildVersions = parseVersionsEnv(versionsEnvPath);

const parseDockerBaseImage = (filePath) => {
  const defaults = {
    baseImage: 'unknown',
    osName: 'unknown',
    osVersion: 'unknown',
  };

  if (!fs.existsSync(filePath)) {
    return defaults;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const fromLine = content
    .split('\n')
    .map((line) => line.trim())
    .find((line) => /^FROM\s+/i.test(line));

  if (!fromLine) {
    return defaults;
  }

  const imageRef = fromLine.replace(/^FROM\s+/i, '').trim().split(/\s+/)[0];
  const [repoPart, tagPart] = imageRef.split(':');
  const repoName = repoPart.split('/')[0] || 'unknown';
  const osName = repoName || 'unknown';
  const osVersion = tagPart || 'latest';

  return {
    baseImage: imageRef || 'unknown',
    osName,
    osVersion,
  };
};

const dockerBase = parseDockerBaseImage(dockerfilePath);

export default defineConfig({
  plugins: [react()],
  ...(isVitest
    ? {}
    : {
        server: {
          port: devPort,
          host: '0.0.0.0',
          allowedHosts: [devHost],
          cors: true, // Enable CORS if needed
          hmr: {
            host: devHost,
            protocol: devHmrProtocol,
            port: devPort,
            clientPort: devClientPort,
          },
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
    'import.meta.env.VITE_AGENT_OPENSSL_VERSION': JSON.stringify(buildVersions.OPENSSL_VERSION),
    'import.meta.env.VITE_AGENT_LIBOQS_VERSION': JSON.stringify(buildVersions.LIBOQS_VERSION),
    'import.meta.env.VITE_AGENT_OQS_PROVIDER_VERSION': JSON.stringify(buildVersions.OQS_PROVIDER_VERSION),
    'import.meta.env.VITE_AGENT_DOCKER_BASE_IMAGE': JSON.stringify(dockerBase.baseImage),
    'import.meta.env.VITE_AGENT_DOCKER_OS_NAME': JSON.stringify(dockerBase.osName),
    'import.meta.env.VITE_AGENT_DOCKER_OS_VERSION': JSON.stringify(dockerBase.osVersion),
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

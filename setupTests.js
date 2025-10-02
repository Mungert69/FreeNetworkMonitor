import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './src/test-utils/msw/server';

vi.mock('@mui/x-data-grid/esm/index.css', () => ({}), { virtual: true });

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  cleanup();
});

afterAll(() => {
  server.close();
});

if (!window.serverLabel) {
  window.serverLabel = { serverLabel: 'dev' };
}

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => {},
  });
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!window.gtag) {
  window.gtag = vi.fn();
}

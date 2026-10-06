import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { vi, test, expect, afterEach } from 'vitest';
import DeferredArticle from '../DeferredArticle';

vi.mock('../BlogArticle', () => ({ default: () => <article>Full quantum article</article> }));
afterEach(() => vi.unstubAllGlobals());

test('waits until the article approaches the viewport and disconnects its observer', async () => {
  let callback;
  const disconnect = vi.fn();
  vi.stubGlobal('IntersectionObserver', class {
    constructor(fn) { callback = fn; }
    observe() {}
    disconnect = disconnect;
  });
  const { unmount } = render(<DeferredArticle />);
  expect(screen.queryByText('Full quantum article')).toBeNull();
  await act(async () => callback([{ isIntersecting: true }]));
  expect(await screen.findByText('Full quantum article')).toBeInTheDocument();
  expect(disconnect).toHaveBeenCalled();
  unmount();
});

test('renders the article when IntersectionObserver is unavailable', async () => {
  const original = window.IntersectionObserver;
  delete window.IntersectionObserver;
  try {
    render(<DeferredArticle />);
    expect(await screen.findByText('Full quantum article')).toBeInTheDocument();
  } finally {
    if (original) window.IntersectionObserver = original;
  }
});

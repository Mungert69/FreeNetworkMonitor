import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, act, waitFor, screen, fireEvent } from '@testing-library/react';

vi.mock('../../dashboard/styleObject', () => ({
  __esModule: true,
  default: () => ({
    root: {},
    content: {},
    container: {},
    paper: {},
    appBarSpacer: {},
    chatContainer: 'chatContainer',
    chatHidden: 'chatHidden',
  }),
}));

vi.mock('../../dashboard/useClasses', () => ({
  __esModule: true,
  default: () => ({
    root: 'root',
    content: 'content',
    container: 'container',
    paper: 'paper',
    appBarSpacer: 'appBarSpacer',
    chatContainer: 'chatContainer',
    chatHidden: 'chatHidden',
  }),
}));

vi.mock('../../dashboard/ServiceAPI', () => ({
  getStartSiteId: vi.fn(),
  fetchFirstLoadServer: vi.fn().mockResolvedValue('https://example.com'),
  getSiteIdfromUrl: vi.fn().mockResolvedValue(42),
  getBaseDomain: vi.fn().mockReturnValue('example.com'),
}));

vi.mock('../../dashboard/DashboardAppBar', () => ({
  __esModule: true,
  default: ({ toggleChatView }) => (
    <button type="button" onClick={toggleChatView} data-testid="appbar-toggle">
      Toggle Chat
    </button>
  ),
}));

vi.mock('../../dashboard/DashboardDrawer', () => ({
  __esModule: true,
  default: () => <div data-testid="drawer" />,
}));

vi.mock('../Seo', () => ({
  __esModule: true,
  default: () => <div data-testid="seo" />,
}));

vi.mock('./Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));

vi.mock('./BlogArticle', () => ({
  __esModule: true,
  default: () => <div data-testid="blog-article" />,
}));

vi.mock('./Blog', () => ({
  __esModule: true,
  default: () => <div data-testid="blog" />,
}));

vi.mock('../../dashboard/Chat/Chat', () => ({
  __esModule: true,
  default: () => <div data-testid="chat-component" />,
}));

vi.mock('/ping.svg', () => ({
  __esModule: true,
  default: 'ping.svg',
}));

import ProductDetail from '../ProductDetail';

const theme = createTheme();

const renderProductDetail = () =>
  render(
    <ThemeProvider theme={theme}>
      <ProductDetail />
    </ThemeProvider>,
  );

describe('ProductDetail assistant auto prompt behaviour', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('auto prompts after delay when first visit and chat is empty', async () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    try {
      renderProductDetail();

      await act(async () => {
        await Promise.resolve();
      });

      expect(dispatchSpy).not.toHaveBeenCalled();

      await act(async () => {
        vi.advanceTimersByTime(30000);
      });

      const autopCall = dispatchSpy.mock.calls.find(
        ([event]) => event.type === 'send-chat-prompt',
      );
      expect(autopCall).toBeTruthy();
      const [eventArg] = autopCall;
      expect(eventArg.type).toBe('send-chat-prompt');
      expect(eventArg.detail).toContain('What types of network monitoring');
      expect(localStorage.getItem('chatHasContent')).toBe('true');
    } finally {
      dispatchSpy.mockRestore();
    }
  });

  it('does not auto prompt when chat already has stored content', async () => {
    localStorage.setItem('chatHasContent', 'true');
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    try {
      renderProductDetail();

      await act(async () => {
        await Promise.resolve();
      });

      await act(async () => {
        vi.advanceTimersByTime(60000);
      });

      expect(dispatchSpy).not.toHaveBeenCalled();
    } finally {
      dispatchSpy.mockRestore();
    }
  });

  it('marks chat as having content when assistant link is clicked', async () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    try {
      renderProductDetail();

      await act(async () => {
        await Promise.resolve();
      });

      const assistantLink = screen.getByText(/Chat with the AI Assistant/i);
      expect(localStorage.getItem('chatHasContent')).not.toBe('true');

      await act(async () => {
        fireEvent.click(assistantLink);
      });

      expect(localStorage.getItem('chatHasContent')).toBe('true');
      const manualCall = dispatchSpy.mock.calls.find(
        ([event]) => event.type === 'send-chat-prompt',
      );
      expect(manualCall).toBeTruthy();
    } finally {
      dispatchSpy.mockRestore();
    }
  });
});

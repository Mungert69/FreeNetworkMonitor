import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    Popper: ({ open, children }) => (open ? <div data-testid="popper">{children}</div> : null),
  };
});

vi.mock('../MarkdownRenderer', () => ({
  default: ({ content }) => <div data-testid="markdown-output">{content}</div>,
}));

vi.mock('../MessageLine', () => ({
  default: ({ line, lineType }) => (
    <div data-testid="message-line">{lineType}:{line}</div>
  ),
}));

vi.mock('../Chat/HistoryList', () => ({
  default: ({ histories }) => (
    <div data-testid="history-list">{histories.length} history rows</div>
  ),
}));

vi.mock('../Message', () => ({
  default: ({ message }) => <div data-testid="message-banner">{message}</div>,
}));

vi.mock('../useClasses', () => ({
  default: () => ({}),
}));

vi.mock('../styleObject', () => ({
  default: () => ({}),
}));

import ChatContent from '../Chat/ChatContent.jsx';

const toggleDrawerSpy = vi.fn();

const createDefaultProps = () => {
  const sendMessage = vi.fn().mockResolvedValue();

  return {
    loadWarning: 'High demand warning',
    llmRunnerType: 'TurboLLM',
    isReady: true,
    isToggleDisabled: false,
    isDrawerOpen: false,
    toggleDrawer: (open) => () => toggleDrawerSpy(open),
    setIsChatOpen: vi.fn(),
    isExpanded: false,
    toggleExpand: vi.fn(),
    resetSessionId: vi.fn(),
    isMuted: false,
    toggleAudio: vi.fn(),
    outputContainerRef: { current: document.createElement('div') },
    isProcessing: false,
    isLLMBusy: false,
    thinkingDots: '',
    isCallingFunction: false,
    callingFunctionMessage: '',
    showHelpMessage: false,
    isDashboard: true,
    helpMessage: '',
    histories: [{ id: 'h-1', label: 'Session One' }],
    handleSelectSession: vi.fn(),
    handleDeleteSession: vi.fn(),
    currentMessage: '',
    isRecording: false,
    handleStartRecording: vi.fn(),
    handleStopRecording: vi.fn(),
    stopLLM: vi.fn(),
    message: '',
    linkData: [],
    saveFeedback: vi.fn(),
    toggleLlmRunnerType: vi.fn(),
    llmFeedback: 'Hello there!',
    closeExpand: vi.fn(),
    onHostLinkClick: vi.fn(),
    sendMessage,
    sessionId: 'session-123',
    setIsHoveringMessages: vi.fn(),
    setIsInputFocused: vi.fn(),
  };
};

const theme = createTheme();

const renderChatContent = (overrideProps = {}) => {
  const props = { ...createDefaultProps(), ...overrideProps };

  const Wrapper = () => {
    const [message, setMessage] = React.useState(props.currentMessage ?? '');

    return (
      <ThemeProvider theme={theme}>
        <ChatContent
          {...props}
          currentMessage={message}
          setCurrentMessage={(value) => {
            setMessage(value);
            props.setIsInputFocused?.(false);
          }}
        />
      </ThemeProvider>
    );
  };

  return {
    ...render(<Wrapper />),
    props,
  };
};

describe('ChatContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.innerWidth = 1280;
  });

  it('renders the assistant header, warning banner, and feedback content', () => {
    renderChatContent();

    expect(
      screen.getByText(/Network Monitor Assistant\s*\(TurboLLM\)/i)
    ).toBeInTheDocument();
    expect(screen.getByText('High demand warning')).toBeInTheDocument();
    expect(screen.getByTestId('markdown-output')).toHaveTextContent('Hello there!');
  });

  it('sends a message when Enter is pressed in the input', async () => {
    const { props } = renderChatContent();

    const input = screen.getByLabelText('Type a message...');

    fireEvent.change(input, { target: { value: 'Ping network' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(props.sendMessage).toHaveBeenCalledTimes(1);
    });
  });

  it('opens the history popover when the history button is clicked', async () => {
    renderChatContent();

    const historyButton = screen.getAllByLabelText(/history/i)[0];
    fireEvent.click(historyButton);

    expect(await screen.findByTestId('popper')).toBeInTheDocument();
    expect(await screen.findByTestId('history-list')).toBeInTheDocument();
  });

  it('invokes sendMessage when the send button is clicked', async () => {
    const { props } = renderChatContent();

    const input = screen.getByLabelText('Type a message...');
    fireEvent.change(input, { target: { value: 'Run diagnostics' } });

    fireEvent.click(screen.getByLabelText('send message'));

    await waitFor(() => {
      expect(props.sendMessage).toHaveBeenCalledTimes(1);
    });
  });
});

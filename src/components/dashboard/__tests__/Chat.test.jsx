import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

let latestChatState = null;

const useMockChatState = () => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [arePopupsEnabled, setArePopupsEnabled] = React.useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = React.useState(true);
  const [isAtBottom, setIsAtBottom] = React.useState(true);

  const [isReady, setIsReady] = React.useState(true);
  const [loadCount, setLoadCount] = React.useState(0);
  const [loadWarning, setLoadWarning] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isCallingFunction, setIsCallingFunction] = React.useState(false);
  const [isLLMBusy, setIsLLMBusy] = React.useState(false);
  const [isToggleDisabled, setIsToggleDisabled] = React.useState(false);

  const [thinkingDots, setThinkingDots] = React.useState('');
  const [callingFunctionMessage, setCallingFunctionMessage] = React.useState('');
  const [showHelpMessage, setShowHelpMessage] = React.useState(false);
  const [helpMessage, setHelpMessage] = React.useState('');
  const [currentMessage, setCurrentMessage] = React.useState('');
  const [llmFeedback, setLlmFeedback] = React.useState('');
  const [message, setMessage] = React.useState({ text: '', persist: false });

  const [histories, setHistories] = React.useState([]);
  const [linkData, setLinkData] = React.useState([]);
  const [llmRunnerType, setLlmRunnerType] = React.useState('TurboLLM');

  const [sessionId, setSessionId] = React.useState('session-1');
  const getSessionId = React.useCallback(() => sessionId, [sessionId]);

  const [isHoveringMessages, setIsHoveringMessages] = React.useState(false);
  const [isInputFocused, setIsInputFocused] = React.useState(false);

  const llmRunnerTypeRef = React.useRef('TurboLLM');
  const openMessage = React.useRef(null);
  const autoClickedRef = React.useRef(false);

  return {
    isMuted,
    setIsMuted,
    isExpanded,
    setIsExpanded,
    isDrawerOpen,
    setIsDrawerOpen,
    arePopupsEnabled,
    setArePopupsEnabled,
    autoScrollEnabled,
    setAutoScrollEnabled,
    isAtBottom,
    setIsAtBottom,
    isReady,
    setIsReady,
    loadCount,
    setLoadCount,
    loadWarning,
    setLoadWarning,
    isProcessing,
    setIsProcessing,
    isCallingFunction,
    setIsCallingFunction,
    isLLMBusy,
    setIsLLMBusy,
    isToggleDisabled,
    setIsToggleDisabled,
    thinkingDots,
    setThinkingDots,
    callingFunctionMessage,
    setCallingFunctionMessage,
    showHelpMessage,
    setShowHelpMessage,
    helpMessage,
    setHelpMessage,
    currentMessage,
    setCurrentMessage,
    llmFeedback,
    setLlmFeedback,
    message,
    setMessage,
    histories,
    setHistories,
    linkData,
    setLinkData,
    llmRunnerType,
    setLlmRunnerType,
    sessionId,
    setSessionId,
    getSessionId,
    isHoveringMessages,
    setIsHoveringMessages,
    isInputFocused,
    setIsInputFocused,
    llmRunnerTypeRef,
    openMessage,
    autoClickedRef,
  };
};

vi.mock('../Chat/useChatState', () => ({
  useChatState: () => {
    latestChatState = useMockChatState();
    return latestChatState;
  },
}));

vi.mock('../AudioPlayer', () => ({
  default: () => () => ({
    playAudioSequentially: vi.fn(),
    clearQueue: vi.fn(),
    pauseAudio: vi.fn(),
  }),
}));

vi.mock('../useAudioRecorder', () => ({
  default: () => ({
    isRecording: false,
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
  }),
}));

vi.mock('../ServiceAPI', () => ({
  getLLMServerUrl: () => 'wss://example.com',
  convertDate: vi.fn(),
  transcribeAudioApi: vi.fn(),
  getLlmTypes: () => ['TurboLLM'],
}));

vi.mock('../Chat/useWebSocket', () => ({
  useWebSocket: () => ({
    stopLLM: vi.fn(),
    resetSessionId: vi.fn(),
    webSocketRef: { current: { readyState: 1, send: vi.fn(), close: vi.fn() } },
  }),
}));

import Chat from '../Chat/Chat';

const theme = createTheme();

const defaultProps = {
  onHostLinkClick: vi.fn(),
  isDashboard: true,
  initRunnerType: 'TurboLLM',
  setIsChatOpen: vi.fn(),
  siteId: 'site-1',
  isChartDialogOpen: false,
  closeChartDialog: vi.fn(),
};

const renderChat = (props = {}) => {
  const mergedProps = { ...defaultProps, ...props };
  return render(
    <ThemeProvider theme={theme}>
      <Chat {...mergedProps} />
    </ThemeProvider>,
  );
};

describe('Chat popup behaviour', () => {
  beforeEach(() => {
    latestChatState = null;
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    latestChatState = null;
  });

  it('automatically triggers host link when a single host arrives and popups are enabled', async () => {
    const onHostLinkClick = vi.fn();
    renderChat({ onHostLinkClick });
    expect(latestChatState).toBeTruthy();

    const hostPayload = { Address: 'auto-host', isHostData: true };

    await act(async () => {
      latestChatState.setLinkData([hostPayload]);
    });

    await waitFor(() => {
      expect(onHostLinkClick).toHaveBeenCalledTimes(1);
      expect(onHostLinkClick).toHaveBeenCalledWith(hostPayload);
    });
  });

  it('does not trigger when popups are disabled, and resumes once re-enabled', async () => {
    const onHostLinkClick = vi.fn();
    renderChat({ onHostLinkClick });

    await act(async () => {
      latestChatState.setArePopupsEnabled(false);
    });

    const blockedHost = { Address: 'blocked-host', isHostData: true };
    await act(async () => {
      latestChatState.setLinkData([blockedHost]);
    });

    await waitFor(() => {
      expect(onHostLinkClick).not.toHaveBeenCalled();
    });

    await act(async () => {
      latestChatState.setLinkData([]);
      latestChatState.setArePopupsEnabled(true);
    });

    const allowedHost = { Address: 'allowed-host', isHostData: true };
    await act(async () => {
      latestChatState.setLinkData([allowedHost]);
    });

    await waitFor(() => {
      expect(onHostLinkClick).toHaveBeenCalledTimes(1);
      expect(onHostLinkClick).toHaveBeenCalledWith(allowedHost);
    });
  });

  it('auto-clicks again after the chart dialog has been closed', async () => {
    const onHostLinkClick = vi.fn();
    const props = { ...defaultProps, onHostLinkClick };
    const { rerender } = renderChat(props);

    const firstHost = { Address: 'first-host', isHostData: true };
    await act(async () => {
      latestChatState.setLinkData([firstHost]);
    });

    await waitFor(() => {
      expect(onHostLinkClick).toHaveBeenCalledWith(firstHost);
    });

    onHostLinkClick.mockClear();

    rerender(
      <ThemeProvider theme={theme}>
        <Chat {...{ ...props, isChartDialogOpen: true }} />
      </ThemeProvider>,
    );

    rerender(
      <ThemeProvider theme={theme}>
        <Chat {...{ ...props, isChartDialogOpen: false }} />
      </ThemeProvider>,
    );

    const secondHost = { Address: 'second-host', isHostData: true };
    await act(async () => {
      latestChatState.setLinkData([secondHost]);
    });

    await waitFor(() => {
      expect(onHostLinkClick).toHaveBeenCalledTimes(1);
      expect(onHostLinkClick).toHaveBeenCalledWith(secondHost);
    });
  });

  it('keeps the first-open initial prompt in the input state', async () => {
    renderChat({ initialPrompt: 'How do I use the AI Assistant?' });

    await waitFor(() => {
      expect(latestChatState.currentMessage).toBe('How do I use the AI Assistant?');
    });
  });
});

describe('Chat auto-scroll handling', () => {
  let elementScrollSpy;
  let originalScrollTo;

  beforeEach(() => {
    originalScrollTo = HTMLElement.prototype.scrollTo;
    if (!HTMLElement.prototype.scrollTo) {
      HTMLElement.prototype.scrollTo = function () {};
    }
    elementScrollSpy = vi
      .spyOn(HTMLElement.prototype, 'scrollTo')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    if (elementScrollSpy) {
      elementScrollSpy.mockRestore();
    }
    if (!originalScrollTo) {
      delete HTMLElement.prototype.scrollTo;
    } else {
      HTMLElement.prototype.scrollTo = originalScrollTo;
    }
  });

  it('does not auto-scroll when the user has scrolled away', async () => {
    renderChat();

    await act(async () => {
      latestChatState.setAutoScrollEnabled(false);
      latestChatState.setIsAtBottom(false);
    });

    const initialCalls = elementScrollSpy.mock.calls.length;

    await act(async () => {
      latestChatState.setLlmFeedback('New update');
    });

    expect(elementScrollSpy.mock.calls.length).toBe(initialCalls);
  });

  it('resumes auto-scroll after it is re-enabled', async () => {
    renderChat();

    await act(async () => {
      latestChatState.setAutoScrollEnabled(false);
      latestChatState.setIsAtBottom(false);
    });

    const baselineCalls = elementScrollSpy.mock.calls.length;

    await act(async () => {
      latestChatState.setAutoScrollEnabled(true);
      latestChatState.setIsAtBottom(true);
    });

    await act(async () => {
      latestChatState.setLlmFeedback('Another update');
    });

    expect(elementScrollSpy.mock.calls.length).toBeGreaterThan(baselineCalls);
  });
});

describe('Chat content persistence flag', () => {
  beforeEach(() => {
    localStorage.clear();
    latestChatState = null;
  });

  it('sets chatHasContent to true when feedback arrives', async () => {
    renderChat();

    await waitFor(() => {
      expect(localStorage.getItem('chatHasContent')).toBe('false');
    });

    await act(async () => {
      latestChatState.setLlmFeedback('Assistant reply');
    });

    await waitFor(() => {
      expect(localStorage.getItem('chatHasContent')).toBe('true');
    });
  });

  it('reflects history presence and absence', async () => {
    renderChat();

    await waitFor(() => {
      expect(localStorage.getItem('chatHasContent')).toBe('false');
    });

    const historyEntry = { sessionId: 'session-123', title: 'First session' };

    await act(async () => {
      latestChatState.setHistories([historyEntry]);
    });

    await waitFor(() => {
      expect(localStorage.getItem('chatHasContent')).toBe('true');
    });

    await act(async () => {
      latestChatState.setLlmFeedback('');
      latestChatState.setHistories([]);
    });

    await waitFor(() => {
      expect(localStorage.getItem('chatHasContent')).toBe('false');
    });
  });
});

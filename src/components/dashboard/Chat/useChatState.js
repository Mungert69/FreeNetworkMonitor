import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useChatState = ({userId}) => {
  // Audio and UI state
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  // Processing and loading states
  const [isReady, setIsReady] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [loadWarning, setLoadWarning] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallingFunction, setIsCallingFunction] = useState(false);
  const [isLLMBusy, setIsLLMBusy] = useState(false);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false);

  // Message and feedback states
  const [thinkingDots, setThinkingDots] = useState('');
  const [callingFunctionMessage, setCallingFunctionMessage] = useState('Calling function...');
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [llmFeedback, setLlmFeedback] = useState('');
  const [message, setMessage] = useState({ 
    info: 'init', 
    success: false, 
    text: "Internal Error" 
  });

  // Data states
  const [histories, setHistories] = useState([]);
  const [linkData, setLinkData] = useState([]);
  const [llmRunnerType, setLlmRunnerType] = useState('TurboLLM');

  // Session management
  const getSessionId = () => {
    if (histories && Array.isArray(histories) && histories.length > 0 && histories[0]?.sessionId) {
      return histories[0].sessionId;
    }

    const storedSessionId = localStorage.getItem('sessionId');
    const storedTimestamp = localStorage.getItem('sessionTimestamp');
    const oneDayInMilliseconds = 86400000;

    if (storedSessionId && storedTimestamp) {
      const currentTime = new Date().getTime();
      if (currentTime - parseInt(storedTimestamp) > oneDayInMilliseconds) {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('sessionTimestamp');
      } else {
        return storedSessionId;
      }
    }

    const newSessionId = uuidv4();
    localStorage.setItem('sessionId', newSessionId);
    localStorage.setItem('sessionTimestamp', new Date().getTime().toString());
    return newSessionId;
  };

  const [sessionId, setSessionId] = useState(getSessionId());

  // Important refs
  const llmRunnerTypeRef = useRef('TurboLLM');
  const openMessage = useRef(null);
  const autoClickedRef = useRef(false);

  return {
    // Audio and UI state
    isMuted,
    setIsMuted,
    isExpanded,
    setIsExpanded,
    isDrawerOpen,
    setIsDrawerOpen,
    autoScrollEnabled,
    setAutoScrollEnabled,

    // Processing and loading states
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

    // Message and feedback states
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

    // Data states
    histories,
    setHistories,
    linkData,
    setLinkData,
    llmRunnerType,
    setLlmRunnerType,

    // Session management
    sessionId,
    setSessionId,
    getSessionId,
    userId,

    // Refs
    llmRunnerTypeRef,
    openMessage,
    autoClickedRef
  };
};
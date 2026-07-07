
import { getLLMServerUrl, convertDate, transcribeAudioApi, getLlmTypes } from '../ServiceAPI';
import AudioPlayer from '../AudioPlayer'; // Import the new AudioPlayer component
import useAudioRecorder from '../useAudioRecorder'; // Import the custom hook
import ChatContent from './ChatContent';
import React, { useEffect, useRef, useState } from 'react';
import { useChatState } from './useChatState';
import { useWebSocket } from './useWebSocket';

const VOICE_MODE = {
  PUSH_TO_TALK: 'push_to_talk',
  CONTINUOUS: 'continuous',
};
const VOICE_DEBUG = true;
const BASE_START_THRESHOLD = 0.0085;
const BASE_STOP_THRESHOLD = 0.0025;
// Keep this low to reduce clipped first syllables ("hello" -> "oh").
const MIN_SPEECH_MS = 40;
const SILENCE_MS = 1200;
const MAX_RECORDING_MS = 15000;
const START_MARGIN_ABOVE_NOISE = 0.0025;

function Chat({ onHostLinkClick, onHostListUpdated, isDashboard, initRunnerType, setIsChatOpen, siteId, isChartDialogOpen = false, closeChartDialog }) {
  const chatState = useChatState();
  const {
    // Audio and UI state
    isMuted, setIsMuted, isExpanded, setIsExpanded, isDrawerOpen, setIsDrawerOpen, arePopupsEnabled, setArePopupsEnabled,
    autoScrollEnabled, setAutoScrollEnabled, isAtBottom, setIsAtBottom,

    // Processing and loading states
    isReady, setIsReady, loadCount, setLoadCount, loadWarning, setLoadWarning,
    isProcessing, setIsProcessing, isCallingFunction, setIsCallingFunction,
    isLLMBusy, setIsLLMBusy, isToggleDisabled, setIsToggleDisabled,

    // Message and feedback states
    thinkingDots, setThinkingDots, callingFunctionMessage, setCallingFunctionMessage,
    showHelpMessage, setShowHelpMessage, helpMessage, setHelpMessage,
    currentMessage, setCurrentMessage, llmFeedback, setLlmFeedback,
    message, setMessage,

    // Data states
    histories, setHistories, linkData, setLinkData, llmRunnerType, setLlmRunnerType,

    // Session management
    sessionId, setSessionId, getSessionId,

    // Chat scroll states
    isHoveringMessages, setIsHoveringMessages,
    isInputFocused, setIsInputFocused,

    // Refs
    llmRunnerTypeRef, openMessage, autoClickedRef
  } = chatState;


  const audioPlayerRef = useRef(AudioPlayer());
  const outputContainerRef = useRef(null);
  const [voiceMode, setVoiceMode] = useState(VOICE_MODE.PUSH_TO_TALK);
  const [isContinuousActive, setIsContinuousActive] = useState(false);

  const isContinuousActiveRef = useRef(false);
  const isRecordingRef = useRef(false);
  const continuousStreamRef = useRef(null);
  const continuousAudioContextRef = useRef(null);
  const continuousAnalyserRef = useRef(null);
  const continuousSourceRef = useRef(null);
  const continuousFrameRef = useRef(null);
  const analyserBufferRef = useRef(null);
  const speechStartRef = useRef(null);
  const silenceStartRef = useRef(null);
  const silenceAccumulatedMsRef = useRef(0);
  const lastVadTimestampRef = useRef(0);
  const segmentActiveRef = useRef(false);
  const noiseFloorRef = useRef(0.0035);
  const recordingStartedAtRef = useRef(null);
  const lastVadLogAtRef = useRef(0);
  const canAutoTriggerRef = useRef(true);

  const voiceDebug = React.useCallback((event, payload = {}) => {
    if (!VOICE_DEBUG) return;
    try {
      console.log(`[voice][${event}]`, payload);
    } catch (error) {
      // no-op
    }
  }, []);

  const scrollToBottom = React.useCallback(
    (behavior = 'auto') => {
      const outputContainer = outputContainerRef.current;
      if (!outputContainer) return;
      const scrollBehavior = typeof behavior === 'string' ? behavior : 'auto';
      if (typeof outputContainer.scrollTo === 'function') {
        try {
          outputContainer.scrollTo({
            top: outputContainer.scrollHeight,
            behavior: scrollBehavior,
          });
        } catch (error) {
          outputContainer.scrollTop = outputContainer.scrollHeight;
        }
      } else {
        outputContainer.scrollTop = outputContainer.scrollHeight;
      }
      setIsAtBottom(true);
    },
    [setIsAtBottom],
  );

  const { stopLLM, resetSessionId, webSocketRef } = useWebSocket({
    siteId,
    isDashboard,
    chatState,
    audioPlayerRef,
    onHostListUpdated,
  });

  const processAudioBlob = async (audioBlob) => {
    try {
      setIsProcessing(true); // Show loading indicator

      const data = await transcribeAudioApi(audioBlob);

      if (data?.transcription) {
        console.log('Transcription:', data.transcription);
        sendTranscription(data.transcription);
      } else {
        alert('Failed to transcribe audio.');
      }
    } catch (error) {
      console.error('Error processing audio blob:', error);
      alert('Error processing audio.');
    } finally {
      setIsProcessing(false); // Hide loading indicator
    }
  };

  const { isRecording, startRecording, stopRecording } = useAudioRecorder(processAudioBlob);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    if (isToggleDisabled) {
      const timer = setTimeout(() => setIsToggleDisabled(false), 5000);
      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [isToggleDisabled]);

  useEffect(() => {
    const handleAudioToggle = async () => {
      try {
        await waitForWebSocket(webSocketRef.current); // Wait for WebSocket to be ready
        if (isMuted) {
          console.log('Sending <|STOP_AUDIO|>');
          webSocketRef.current.send('<|STOP_AUDIO|>'); // Notify backend to stop audio
        } else {
          console.log('Sending <|START_AUDIO|>');
          webSocketRef.current.send('<|START_AUDIO|>'); // Notify backend to resume audio
        }
      } catch (error) {
        console.error('Error while handling audio toggle:', error);
      }
    };

    handleAudioToggle(); // Call the async function
  }, [isMuted]);

  useEffect(() => {
    if (!arePopupsEnabled) {
      return;
    }
    if (linkData.length === 1 && !autoClickedRef.current) {
      onHostLinkClick(linkData[0]);
      autoClickedRef.current = true;  // Mark as clicked
    } else if (linkData.length !== 1) {
      autoClickedRef.current = false;  // Reset if the number of links changes
    }
  }, [linkData, onHostLinkClick, arePopupsEnabled]);

  useEffect(() => {
    if (!isChartDialogOpen) {
      autoClickedRef.current = false;
    }
  }, [isChartDialogOpen]);

  useEffect(() => {
    let intervalId;
    if (isProcessing && !isLLMBusy) {
      intervalId = setInterval(() => {
        setThinkingDots((dots) => (dots.length < 5 ? dots + '.' : ''));
      }, 1000); // Change dot animation speed if necessary
    }
    return () => clearInterval(intervalId);
  }, [isProcessing, isLLMBusy]);

  const handleScroll = () => {
    const outputContainer = outputContainerRef.current;
    if (!outputContainer) return;
    const isNearBottom = Math.abs(
      outputContainer.scrollHeight - outputContainer.scrollTop - outputContainer.clientHeight
    ) < 10;

    setIsAtBottom(isNearBottom);
    setAutoScrollEnabled(isNearBottom);
  };
  useEffect(() => {
    if (autoScrollEnabled && isAtBottom) {
      scrollToBottom('auto');
    }
  }, [llmFeedback, autoScrollEnabled, isAtBottom, scrollToBottom]);

  useEffect(() => {
    if (isReady && openMessage.current !== null) {
      if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
        webSocketRef.current.send(openMessage.current);
        console.log("Sent queued message: " + openMessage.current);
        openMessage.current = null; // Clear the message after sending
      }
    }
  }, [isReady]);

  useEffect(() => {
    openMessage.current = "<|REPLAY_HISTORY|>";
    sendMessageCheck('');
    console.log('Initial page load web socket Ping ');
    // connectWebSocket();
    const pingInterval = setInterval(() => {
      if (webSocketRef.current.readyState === WebSocket.OPEN) {
        sendMessageCheck('');
        //console.log('Sent web socket Ping ');
      }
    }, 5000);

    const outputContainer = outputContainerRef.current;
    if (!outputContainer) return;

   
    outputContainer.addEventListener('scroll', handleScroll);

    return () => {
      outputContainer.removeEventListener('scroll', handleScroll);
      clearInterval(pingInterval);
    };
  }, [scrollToBottom]);

  useEffect(() => {
    if (loadCount > 1) {
      setLoadWarning(
        <>
          Warning: {llmRunnerType} load is high {loadCount} message in queue. Consider trying again later, using TurboLLM or Quantum Network Monitor GPT at{' '}
          <a
            href="https://chatgpt.com/g/g-g0XMzU1nM-free-network-monitor"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'secondary', textDecoration: 'underline' }}
          >
            this link
          </a>.
        </>
      );
    } else {
      setLoadWarning('');
    }
  }, [loadCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasFeedback = typeof llmFeedback === 'string' && llmFeedback.trim().length > 0;
    const hasHistories = Array.isArray(histories) && histories.length > 0;
    const hasContent = hasFeedback || hasHistories;

    try {
      window.localStorage.setItem('chatHasContent', hasContent ? 'true' : 'false');
    } catch (error) {
      console.warn('Unable to persist chat content flag', error);
    }
  }, [llmFeedback, histories]);

  useEffect(() => {
    resetLLM();
  }, [sessionId, llmRunnerType]);


  const sendTranscription = async (transcription) => {
    if (audioPlayerRef.current && typeof audioPlayerRef.current.clearQueue === 'function') {
      audioPlayerRef.current.clearQueue(); // Clear audio queue
    } else {
      console.warn('AudioPlayer instance is not available or clearQueue is not a function.');
    }

    setIsProcessing(true); // Show processing indicator
    await sendMessageCheck(transcription); // Send the transcribed message
    setCurrentMessage(''); // Clear current input
  };

  const handleStartRecording = () => {
    voiceDebug('ptt_start_requested', { isRecording: isRecordingRef.current });
    if (audioPlayerRef.current && typeof audioPlayerRef.current.pauseAudio === 'function') {
      audioPlayerRef.current.pauseAudio(); // Pause audio playback
    }
    startRecording(); // Start recording
  };

  const handleStopRecording = async () => {
    voiceDebug('ptt_stop_requested', { isRecording: isRecordingRef.current });
    stopRecording(); // Stop recording
  };

  const cleanupContinuousResources = React.useCallback(async () => {
    voiceDebug('continuous_cleanup_begin', { isRecording: isRecordingRef.current, isContinuousActive: isContinuousActiveRef.current });
    if (continuousFrameRef.current) {
      cancelAnimationFrame(continuousFrameRef.current);
      continuousFrameRef.current = null;
    }
    try {
      continuousSourceRef.current?.disconnect();
    } catch (error) {
      // no-op
    }
    continuousSourceRef.current = null;
    continuousAnalyserRef.current = null;
    analyserBufferRef.current = null;
    if (continuousAudioContextRef.current) {
      try {
        await continuousAudioContextRef.current.close();
      } catch (error) {
        // no-op
      }
      continuousAudioContextRef.current = null;
    }
    if (continuousStreamRef.current) {
      continuousStreamRef.current.getTracks().forEach((track) => track.stop());
      continuousStreamRef.current = null;
    }
    speechStartRef.current = null;
    silenceStartRef.current = null;
    silenceAccumulatedMsRef.current = 0;
    lastVadTimestampRef.current = 0;
    segmentActiveRef.current = false;
    noiseFloorRef.current = 0.0035;
    recordingStartedAtRef.current = null;
    canAutoTriggerRef.current = true;
    voiceDebug('continuous_cleanup_end');
  }, [voiceDebug]);

  const stopContinuousMode = React.useCallback(async () => {
    voiceDebug('continuous_stop_requested', { isRecording: isRecordingRef.current, segmentActive: segmentActiveRef.current });
    isContinuousActiveRef.current = false;
    setIsContinuousActive(false);
    await cleanupContinuousResources();
    if (isRecordingRef.current) {
      handleStopRecording();
    }
    voiceDebug('continuous_stopped');
  }, [cleanupContinuousResources, voiceDebug]);

  const monitorContinuousSpeech = React.useCallback(() => {
    if (!isContinuousActiveRef.current || !continuousAnalyserRef.current || !analyserBufferRef.current) {
      return;
    }

    continuousAnalyserRef.current.getByteTimeDomainData(analyserBufferRef.current);
    let sumSquares = 0;
    for (let i = 0; i < analyserBufferRef.current.length; i += 1) {
      const centered = (analyserBufferRef.current[i] - 128) / 128;
      sumSquares += centered * centered;
    }

    const rms = Math.sqrt(sumSquares / analyserBufferRef.current.length);
    const now = Date.now();
    const deltaMs = lastVadTimestampRef.current > 0 ? now - lastVadTimestampRef.current : 0;
    lastVadTimestampRef.current = now;
    const adaptiveStartThreshold = Math.max(
      BASE_START_THRESHOLD,
      noiseFloorRef.current + START_MARGIN_ABOVE_NOISE,
      noiseFloorRef.current * 1.55,
    );
    const adaptiveStopThreshold = Math.max(BASE_STOP_THRESHOLD, noiseFloorRef.current * 0.95);
    const stopGate = adaptiveStopThreshold;

    if (!segmentActiveRef.current) {
      // Track ambient noise when idle, but clamp spikes so brief speech doesn't explode the floor.
      const floorSampleCap = Math.max(noiseFloorRef.current * 1.4, BASE_START_THRESHOLD * 0.85);
      const floorSample = Math.min(rms, floorSampleCap);
      noiseFloorRef.current = (noiseFloorRef.current * 0.97) + (floorSample * 0.03);
    }

    const nowForLog = Date.now();
    if (VOICE_DEBUG && nowForLog - lastVadLogAtRef.current >= 700) {
      lastVadLogAtRef.current = nowForLog;
      voiceDebug('vad_sample', {
        rms: Number(rms.toFixed(5)),
        noiseFloor: Number(noiseFloorRef.current.toFixed(5)),
        startThreshold: Number(adaptiveStartThreshold.toFixed(5)),
        stopThreshold: Number(adaptiveStopThreshold.toFixed(5)),
        stopGate: Number(stopGate.toFixed(5)),
        silenceAccumulatedMs: Math.round(silenceAccumulatedMsRef.current),
        canAutoTrigger: canAutoTriggerRef.current,
        segmentActive: segmentActiveRef.current,
        isRecording: isRecordingRef.current,
        isProcessing,
      });
    }

    if (rms > adaptiveStartThreshold) {
      if (!speechStartRef.current) {
        speechStartRef.current = now;
      }
      silenceStartRef.current = null;

      if (
        canAutoTriggerRef.current &&
        !segmentActiveRef.current &&
        !isRecordingRef.current &&
        !isProcessing &&
        !isLLMBusy &&
        now - speechStartRef.current >= MIN_SPEECH_MS
      ) {
        segmentActiveRef.current = true;
        recordingStartedAtRef.current = now;
        silenceAccumulatedMsRef.current = 0;
        voiceDebug('vad_trigger_start', {
          rms: Number(rms.toFixed(5)),
          startThreshold: Number(adaptiveStartThreshold.toFixed(5)),
          noiseFloor: Number(noiseFloorRef.current.toFixed(5)),
        });
        handleStartRecording();
      }
    } else if (rms < stopGate) {
      speechStartRef.current = null;
      if (segmentActiveRef.current || isRecordingRef.current) {
        silenceAccumulatedMsRef.current += deltaMs;
        if (!silenceStartRef.current || silenceAccumulatedMsRef.current < 80) {
          silenceStartRef.current = silenceStartRef.current || now;
          voiceDebug('vad_silence_started', {
            rms: Number(rms.toFixed(5)),
            stopThreshold: Number(adaptiveStopThreshold.toFixed(5)),
            stopGate: Number(stopGate.toFixed(5)),
          });
        } else if (silenceAccumulatedMsRef.current >= SILENCE_MS) {
          silenceStartRef.current = null;
          silenceAccumulatedMsRef.current = 0;
          segmentActiveRef.current = false;
          voiceDebug('vad_trigger_stop', {
            rms: Number(rms.toFixed(5)),
            stopThreshold: Number(adaptiveStopThreshold.toFixed(5)),
            stopGate: Number(stopGate.toFixed(5)),
          });
          if (isRecordingRef.current) {
            canAutoTriggerRef.current = false;
            handleStopRecording();
          }
          recordingStartedAtRef.current = null;
        }
      }
    } else {
      // In the middle band: do not reset silence entirely, just decay lightly.
      silenceStartRef.current = null;
      silenceAccumulatedMsRef.current = Math.max(0, silenceAccumulatedMsRef.current - (deltaMs * 0.25));
    }

    if (isRecordingRef.current && recordingStartedAtRef.current && now - recordingStartedAtRef.current >= MAX_RECORDING_MS) {
      voiceDebug('vad_force_stop_max_duration', {
        elapsedMs: now - recordingStartedAtRef.current,
      });
      segmentActiveRef.current = false;
      silenceStartRef.current = null;
      silenceAccumulatedMsRef.current = 0;
      recordingStartedAtRef.current = null;
      handleStopRecording();
    }

    continuousFrameRef.current = requestAnimationFrame(monitorContinuousSpeech);
  }, [isLLMBusy, isProcessing, voiceDebug]);

  const startContinuousMode = React.useCallback(async () => {
    if (isContinuousActiveRef.current) return;
    voiceDebug('continuous_start_requested', { voiceMode });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    continuousStreamRef.current = stream;

    const audioContext = new AudioContext();
    continuousAudioContextRef.current = audioContext;
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    continuousSourceRef.current = source;
    continuousAnalyserRef.current = analyser;
    analyserBufferRef.current = new Uint8Array(analyser.fftSize);
    speechStartRef.current = null;
    silenceStartRef.current = null;
    silenceAccumulatedMsRef.current = 0;
    lastVadTimestampRef.current = Date.now();
    segmentActiveRef.current = false;
    noiseFloorRef.current = 0.0035;
    canAutoTriggerRef.current = !isProcessing && !isLLMBusy;

    isContinuousActiveRef.current = true;
    setIsContinuousActive(true);
    voiceDebug('continuous_started');
    continuousFrameRef.current = requestAnimationFrame(monitorContinuousSpeech);
  }, [monitorContinuousSpeech, voiceDebug, voiceMode]);

  useEffect(() => {
    isContinuousActiveRef.current = isContinuousActive;
  }, [isContinuousActive]);

  useEffect(() => {
    if (voiceMode !== VOICE_MODE.CONTINUOUS) return;
    if (!isContinuousActiveRef.current) return;

    if (!isProcessing && !isLLMBusy && !isRecordingRef.current) {
      if (!canAutoTriggerRef.current) {
        canAutoTriggerRef.current = true;
        voiceDebug('continuous_retrigger_unlocked');
      }
    } else if (canAutoTriggerRef.current && (isProcessing || isLLMBusy)) {
      // Keep lock engaged while previous voice message is being processed by STT/backend.
      canAutoTriggerRef.current = false;
      voiceDebug('continuous_retrigger_locked', { isProcessing, isLLMBusy });
    }
  }, [isLLMBusy, isProcessing, voiceMode, voiceDebug]);

  useEffect(() => () => {
    stopContinuousMode();
  }, [stopContinuousMode]);

  const toggleVoiceMode = () => {
    voiceDebug('voice_mode_toggle_clicked', { currentMode: voiceMode });
    setVoiceMode((prev) => (
      prev === VOICE_MODE.PUSH_TO_TALK ? VOICE_MODE.CONTINUOUS : VOICE_MODE.PUSH_TO_TALK
    ));
  };

  useEffect(() => {
    voiceDebug('voice_mode_changed', { voiceMode });
    if (voiceMode === VOICE_MODE.CONTINUOUS) {
      if (!isContinuousActiveRef.current) {
        startContinuousMode().catch((error) => {
          console.error('Failed to auto-start continuous mode:', error);
          voiceDebug('continuous_start_failed', { error: String(error) });
          setMessage({
            warning: '',
            text: 'Unable to start continuous mode. Check microphone permissions.',
          });
          setVoiceMode(VOICE_MODE.PUSH_TO_TALK);
        });
      }
      return;
    }

    if (isContinuousActiveRef.current) {
      stopContinuousMode();
    }
  }, [voiceMode, startContinuousMode, stopContinuousMode, setMessage, voiceDebug]);

  const handleVoiceButton = () => {
    voiceDebug('voice_button_clicked', {
      voiceMode,
      isRecording,
      isContinuousActive,
    });
    if (voiceMode === VOICE_MODE.PUSH_TO_TALK) {
      if (isRecording) {
        handleStopRecording();
      } else {
        handleStartRecording();
      }
      return;
    }

    if (isContinuousActive) {
      stopContinuousMode();
    } else {
      startContinuousMode().catch((error) => {
        console.error('Failed to start continuous mode:', error);
        setMessage({
          warning: '',
          text: 'Unable to start continuous mode. Check microphone permissions.',
        });
      });
    }
  };

  const closeExpand = () => {
    setIsExpanded(false);
  };

  const toggleAudio = () => {
    if (isMuted) {
      // Unmute: Allow new audio playback
      console.log('Unmuting audio...');
      setIsMuted(false); // Update state
    } else {
      // Mute: Clear the audio queue
      console.log('Muting audio...');
      if (audioPlayerRef.current && typeof audioPlayerRef.current.clearQueue === 'function') {
        audioPlayerRef.current.clearQueue();
      } else {
        console.warn('AudioPlayer instance is not available or clearQueue is not a function.');
      }
      setIsMuted(true); // Update state
    }
  };

  const handleSelectSession = (selectedSessionId) => {
    setSessionId(selectedSessionId);
    openMessage.current = "<|REPLAY_HISTORY|>";
    resetLLM(); // Reset the LLM session with the new session ID
  };
  const handleDeleteSession = async (fullSessionId) => {
    var message = "<|REMOVE_SAVED_SESSION|>" + fullSessionId;
    await sendMessageCheck(message);

  };



  const toggleLlmRunnerType = () => {
    if (isToggleDisabled) return;
    openMessage.current = "<|REPLAY_HISTORY|>";
    setIsToggleDisabled(true);

    // Define the type sequence
    const types = getLlmTypes();

    // Update the ref
    const currentRefIndex = types.indexOf(llmRunnerTypeRef.current);
    const nextRefIndex = (currentRefIndex + 1) % types.length;
    llmRunnerTypeRef.current = types[nextRefIndex];

    // Update the state
    setLlmRunnerType(prevType => {
      const currentStateIndex = types.indexOf(prevType);
      const nextStateIndex = (currentStateIndex + 1) % types.length;
      return types[nextStateIndex];
    });
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDrawer = (open) => (event) => {
    if (!arePopupsEnabled) {
      setIsDrawerOpen(false);
      return;
    }
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const togglePopupsEnabled = () => {
    setArePopupsEnabled((prev) => {
      const next = !prev;
      if (!next) {
        setIsDrawerOpen(false);
        if (typeof closeChartDialog === 'function') {
          closeChartDialog();
        }
      }
      autoClickedRef.current = false;
      return next;
    });
  };

  const saveFeedback = () => {
    // Create a Blob from the llmFeedback state
    const blob = new Blob([llmFeedback], { type: 'text/plain;charset=utf-8' });
    // Create an object URL for the blob
    const url = window.URL.createObjectURL(blob);
    // Create a new anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AssistantOutput.txt'; // Set the file name for the download
    document.body.appendChild(a); // Append the anchor to the body
    a.click(); // Simulate a click on the anchor to trigger the download
    document.body.removeChild(a); // Clean up by removing the anchor
    window.URL.revokeObjectURL(url); // Release the object URL
  };

  const sendMessage = async () => {
    if (audioPlayerRef.current && typeof audioPlayerRef.current.clearQueue === 'function') {
      audioPlayerRef.current.clearQueue(); // Clear the audio queue safely
    } else {
      console.warn('AudioPlayer instance is not available or clearQueue is not a function.');
    }
    setIsProcessing(true); // Start loading indicator

    try {
      await sendMessageCheck(currentMessage); // Await the sendMessageCheck function
    } catch (error) {
      console.error('Error sending message:', error); // Handle any errors
    }

    setCurrentMessage('');
  };

  const waitForWebSocket = async (webSocket) => {
    while (webSocket.readyState !== WebSocket.OPEN) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 100ms
    }
  };

  async function sendMessageCheck(message) {
    await waitForWebSocket(webSocketRef.current);
    //console.log("Sending message =>" + message + "<=");
    webSocketRef.current.send(message);
  }

  const resetLLM = () => {
    // Close the existing WebSocket connection if open
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.close();
    }

    // Reset state variables
    setIsReady(false);
    setIsMuted(true);
    setThinkingDots('');
    setCallingFunctionMessage('Processing function...');
    setShowHelpMessage(false);
    setHelpMessage('');
    setCurrentMessage('');
    setLlmFeedback('');
    setIsProcessing(false);
    setIsLLMBusy(false);
    setIsCallingFunction(false);
  };

  return (
    <ChatContent
      {...chatState} // Spread all state variables from chatState
      sendMessage={sendMessage}
      toggleExpand={toggleExpand}
      toggleAudio={toggleAudio}
      toggleDrawer={toggleDrawer}
      togglePopupsEnabled={togglePopupsEnabled}
      handleSelectSession={handleSelectSession}
      handleDeleteSession={handleDeleteSession}
      handleStopRecording={handleStopRecording}
      handleStartRecording={handleStartRecording}
      handleVoiceButton={handleVoiceButton}
      saveFeedback={saveFeedback}
      toggleLlmRunnerType={toggleLlmRunnerType}
      toggleVoiceMode={toggleVoiceMode}
      closeExpand={closeExpand}
      onHostLinkClick={onHostLinkClick}
      setIsChatOpen={setIsChatOpen}
      resetSessionId={resetSessionId}
      stopLLM={stopLLM}
      outputContainerRef={outputContainerRef}
      scrollToBottom={scrollToBottom}
      isRecording={isRecording}
      voiceMode={voiceMode}
      isContinuousActive={isContinuousActive}
      isAtBottom={isAtBottom}
      setAutoScrollEnabled={setAutoScrollEnabled}
      isChartDialogOpen={isChartDialogOpen}
    />
  );

}

export default Chat;


import { getLLMServerUrl, convertDate, transcribeAudioApi } from '../ServiceAPI';
import AudioPlayer from '../AudioPlayer'; // Import the new AudioPlayer component
import useAudioRecorder from '../useAudioRecorder'; // Import the custom hook
import ChatContent from './ChatContent';
import React, { useEffect, useRef, useState } from 'react';
import { useChatState } from './useChatState';
import { useWebSocket } from './useWebSocket';

function Chat({ onHostLinkClick, isDashboard, initRunnerType, setIsChatOpen, siteId}) {
  const chatState=useChatState();
  const {
    // Audio and UI state
    isMuted, setIsMuted, isExpanded, setIsExpanded, isDrawerOpen, setIsDrawerOpen,
    autoScrollEnabled, setAutoScrollEnabled,
  
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
  
    // Refs
    llmRunnerTypeRef, openMessage, autoClickedRef
  } = chatState;
  

  const audioPlayerRef = useRef(AudioPlayer());
  const outputContainerRef = useRef(null);
  
  const {stopLLM, resetSessionId, webSocketRef } = useWebSocket({
    siteId,
    isDashboard,
    chatState,
    audioPlayerRef
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
    if (linkData.length === 1 && !autoClickedRef.current) {
      onHostLinkClick(linkData[0]);
      autoClickedRef.current = true;  // Mark as clicked
    } else if (linkData.length !== 1) {
      autoClickedRef.current = false;  // Reset if the number of links changes
    }
  }, [linkData, onHostLinkClick]);

  useEffect(() => {
    let intervalId;
    if (isProcessing && !isLLMBusy) {
      intervalId = setInterval(() => {
        setThinkingDots((dots) => (dots.length < 5 ? dots + '.' : ''));
      }, 1000); // Change dot animation speed if necessary
    }
    return () => clearInterval(intervalId);
  }, [isProcessing, isLLMBusy]);

  useEffect(() => {
    const outputContainer = outputContainerRef.current;
    if (!outputContainer) return;

    if (autoScrollEnabled) {
      outputContainer.scrollTop = outputContainer.scrollHeight;
    }
  }, [llmFeedback, autoScrollEnabled]);  
  
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

    const handleScroll = () => {
      // Check if user is at (or near) bottom
      const isAtBottom = Math.abs(
        outputContainer.scrollHeight - outputContainer.scrollTop - outputContainer.clientHeight
      ) < 10; // 10px threshold, can adjust as needed

      if (isAtBottom) {
        // If user scrolled back down to bottom, re-enable auto-scrolling
        setAutoScrollEnabled(true);
      } else {
        // If user scrolled up, disable auto-scrolling
        setAutoScrollEnabled(false);
      }
    };

    outputContainer.addEventListener('scroll', handleScroll);

    return () => {
      outputContainer.removeEventListener('scroll', handleScroll);
      clearInterval(pingInterval);
    };
  }, []);

  useEffect(() => {
    if (loadCount > 1) {
      setLoadWarning(
        <>
          Warning: {llmRunnerType} load is high {loadCount} message in queue. Consider trying again later, using TurboLLM or Free Network Monitor GPT at{' '}
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
    if (audioPlayerRef.current && typeof audioPlayerRef.current.pauseAudio === 'function') {
      audioPlayerRef.current.pauseAudio(); // Pause audio playback
    }
    startRecording(); // Start recording
  };

  const handleStopRecording = async () => {
    stopRecording(); // Stop recording
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
    var message="<|REMOVE_SAVED_SESSION|>"+fullSessionId;
    await sendMessageCheck(message);
    
  };

 

  const toggleLlmRunnerType = () => {
    if (isToggleDisabled) return;
    openMessage.current = "<|REPLAY_HISTORY|>";
    setIsToggleDisabled(true);

    // Define the type sequence
    const types = ['FreeLLM', 'TurboLLM', 'HugLLM'];

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
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
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
    console.log("Sending message =>" + message + "<=");
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
      handleSelectSession={handleSelectSession}
      handleDeleteSession={handleDeleteSession}
      handleStopRecording={handleStopRecording}
      handleStartRecording={handleStartRecording}
      saveFeedback={saveFeedback}
      toggleLlmRunnerType={toggleLlmRunnerType}
      closeExpand={closeExpand}
      onHostLinkClick={onHostLinkClick}
      setIsChatOpen={setIsChatOpen}
      resetSessionId={resetSessionId}
      stopLLM={stopLLM}
      outputContainerRef={outputContainerRef}
      isRecording={isRecording}
    />
  );
  
}

export default Chat;
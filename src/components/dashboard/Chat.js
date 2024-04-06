import './chat.css';
import SaveIcon from '@mui/icons-material/Save';
import { getLLMServerUrl } from './ServiceAPI';

import React, { useState, useEffect, useRef } from 'react';

function Chat() {
  const [isReady, setIsReady] = useState(false);
  const [thinkingDots, setThinkingDots] = useState('');
  const [callingFunctionMessage, setCallingFunctionMessage] = useState('Calling function...');
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');
  const [helpMessageIndex, setHelpMessageIndex] = useState(0);
  const [firstMessageShown, setFirstMessageShown] = useState(false);


  const outputContainerRef = useRef(null);

  const [currentMessage, setCurrentMessage] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [functionCall, setFunctionCall] = useState('');
  const [functionResponse, setFunctionResponse] = useState('');
  const [llmFeedback, setLlmFeedback] = useState('');

  const [currentLine, setCurrentLine] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallingFunction, setIsCallingFunction] = useState(false);

  const webSocketRef = useRef(null);

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

  useEffect(() => {
    if (isCallingFunction) {
      const messages = ["Please wait...", "Function call...", "Running..."];
      let messageIndex = 0;
      const intervalId = setInterval(() => {
        setCallingFunctionMessage(messages[messageIndex++ % messages.length]);
      }, 3000); // Rotate messages every 2 seconds
      return () => clearInterval(intervalId);
    }
  }, [isCallingFunction]);

  useEffect(() => {
    let intervalId;
    if (isProcessing && !isCallingFunction) {
      intervalId = setInterval(() => {
        setThinkingDots((dots) => (dots.length < 5 ? dots + '.' : ''));
      }, 1000); // Change dot animation speed if necessary
    }
    return () => clearInterval(intervalId);
  }, [isProcessing, isCallingFunction]);

  useEffect(() => {
    let helpMessageTimeout;

    const showHelpMessage = () => {
      setShowHelpMessage(true);
      const helpMessages = [
        "Having trouble?",
        "Click Login",
        "Manage your hosts",
        "Using the Dashboard"
      ];
      setHelpMessage(helpMessages[helpMessageIndex]);
      setHelpMessageIndex((prevIndex) => (prevIndex + 1) % helpMessages.length);
      setFirstMessageShown(true); // Mark the first message as shown
    };

    if (isProcessing || isCallingFunction) {
      // Set a longer delay for showing the first help message
      const initialDelay = firstMessageShown ? 5000 : 30000; // 15 seconds for the first, then 5 seconds for subsequent messages
      helpMessageTimeout = setTimeout(showHelpMessage, initialDelay);
    } else {
      // Reset state when not processing or calling a function
      setShowHelpMessage(false);
      setFirstMessageShown(false); // Reset for the next processing/calling function phase
    }

    return () => clearTimeout(helpMessageTimeout);
  }, [isProcessing, isCallingFunction, helpMessageIndex, firstMessageShown]);

  useEffect(() => {
    const outputContainer = outputContainerRef.current;
    if (outputContainer) {
      outputContainer.scrollTop = outputContainer.scrollHeight;
    }
  }, [displayText, userInput, functionCall, functionResponse, llmFeedback]);

  useEffect(() => {


    const socket = new WebSocket(getLLMServerUrl());

    socket.onopen = () => {
      console.log('WebSocket connection established to ' + getLLMServerUrl());
    };

    socket.onmessage = (event) => {
      const newWord = event.data;

      if (newWord === '</llm-ready>') {
        setIsReady(true);
      }
      else if (newWord === '</functioncall>') {
        setIsCallingFunction(true);
      }
      else if (newWord === '</functioncall-complete>') {
        setIsCallingFunction(false);
      }
      else if (newWord === '<end-of-line>') {
        //setLlmFeedback((prevFeedback) => prevFeedback );
        setIsProcessing(false);
      } else {
        setLlmFeedback((prevFeedback) => prevFeedback + newWord);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Optionally, display an error message to the user or attempt to reconnect
    };

    webSocketRef.current = socket;
    const pingInterval = setInterval(() => {
      if (webSocketRef.current.readyState === WebSocket.OPEN) {
        webSocketRef.current.send('');
      }
    }, 30000);
    return () => {
      clearInterval(pingInterval);
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (currentMessage && webSocketRef.current.readyState === WebSocket.OPEN) {
      setIsProcessing(true); // Start loading indicator
      webSocketRef.current.send(currentMessage);
      // setUserInput('User: ' + currentMessage);
      setLlmFeedback(currentStr => currentStr + '\n' + 'User: ');
      setCurrentMessage('');
      //resetProcessingFlags();
    }
  };


  return (
    <div className="chat-container">
      <div className="chat-window">

        <div className="chat-header">
          <span className="header-title">Free Network Monitor Assistant</span>
          <button className="save-button" onClick={saveFeedback} title="Save">
    <SaveIcon style={{ color: 'white' }} />
  </button>
        </div>

        <div className="chat-body" ref={outputContainerRef}>
          <pre className="llm-feedback">{llmFeedback}</pre>
          {isProcessing && !isCallingFunction && <div className="status-message">Thinking{thinkingDots}</div>}
          {isCallingFunction && <div className="status-message">{callingFunctionMessage}</div>}
          {showHelpMessage && <div className="help-message">{helpMessage}</div>}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          {isReady ? <button className="send-button" onClick={sendMessage}>Send</button> : null}

        </div>
      </div>
    </div>
  );
}

export default Chat;
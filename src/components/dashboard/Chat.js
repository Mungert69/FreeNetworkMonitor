import './chat.css';
import React, { useState, useEffect, useRef } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [lastToken, setLastToken] = useState('');
  const lastTokenRef = useRef('');
  const outputContainerRef = useRef(null);

  const [currentMessage, setCurrentMessage] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [userInput, setUserInput] = useState('User:');
  const [functionCall, setFunctionCall] = useState('');
  const [functionResponse, setFunctionResponse] = useState('');
  const [llmFeedback, setLlmFeedback] = useState('Assistant:');

  const [currentLine, setCurrentLine] = useState('');
  const isProcessingFunctionCallRef = useRef(false);
  const isProcessingFunctionResponseRef = useRef(false);
  const isProcessingUserInputRef = useRef(true);
  const isProcessingLLMOutputRef = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallingFunction, setIsCallingFunction] = useState(false);

  const webSocketRef = useRef(null);
  const resetProcessingFlags = () => {
    isProcessingFunctionCallRef.current = false;
    isProcessingFunctionResponseRef.current = false;
    isProcessingUserInputRef.current = false;
    isProcessingLLMOutputRef.current = false;
  };

  useEffect(() => {
    const outputContainer = outputContainerRef.current;
    if (outputContainer) {
      outputContainer.scrollTop = outputContainer.scrollHeight;
    }
  }, [displayText, userInput, functionCall, functionResponse, llmFeedback]);

  useEffect(() => {


    const socket = new WebSocket('wss://devloadserver.freenetworkmonitor.click/LLM/llm-stream');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const newWord = event.data;
    
      if (newWord === '</functioncall>') {
        setIsCallingFunction(true);
      } 
      else if (newWord === '</functioncall-complete>') {
         setIsCallingFunction(false);
      } 
      else if (newWord === '<end-of-line>') {
        setLlmFeedback((prevFeedback) => prevFeedback + '\n');
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
      setUserInput('User:' + currentMessage);
      setLlmFeedback('Assistant:');
      setCurrentMessage('');
      //resetProcessingFlags();
    }
  };


  return (
    <div className="chat-container">
      <div className="chat-window">
        <div className="chat-header">Chat</div>
        <div className="chat-body" ref={outputContainerRef}>
          <div className="user-input">{userInput}</div>
          <pre className="llm-feedback">{llmFeedback}</pre>
          {isProcessing && !isCallingFunction && <div className="status-message">Thinking...</div>}
          {isCallingFunction && <div className="status-message">Calling function...</div>}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            className="chat-input"
            placeholder="Type a message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
          />
          <button className="send-button" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
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
      if (newWord === '<end-of-line>') {
        lastTokenRef.current = newWord;
        setLlmFeedback((prevFeedback) => prevFeedback + '\n');

      } else {
        if (lastTokenRef.current === '<end-of-line>') {
          if (newWord.startsWith('{')) {
            isProcessingFunctionCallRef.current = true;
            isProcessingFunctionResponseRef.current = false;
            isProcessingLLMOutputRef.current = false;
            lastTokenRef.current = "token";
            setFunctionCall('Function Call:');
          } else if (newWord.startsWith("FUNCTION")) {
            isProcessingFunctionCallRef.current = false;
            isProcessingFunctionResponseRef.current = true;
            isProcessingLLMOutputRef.current = false;
            lastTokenRef.current = "token";
            setFunctionResponse('Function Response:');
          } else{
            isProcessingFunctionCallRef.current = false;
            isProcessingFunctionResponseRef.current = false;
            isProcessingLLMOutputRef.current = true;
            lastTokenRef.current = "token";
           // setLlmFeedback('Assistant:'); 
          } 
        }

        if (isProcessingFunctionCallRef.current) {
          setFunctionCall((prevCall) => prevCall + newWord);
          //setCurrentLine((prevLine) => prevLine + newWord);
        } else if (isProcessingFunctionResponseRef.current) {
          setFunctionResponse((prevResponse) => prevResponse + newWord);
          //setCurrentLine((prevLine) => prevLine + newWord);
        }  else  {
          setLlmFeedback((prevFeedback) => prevFeedback + newWord);
          //setCurrentLine((prevLine) => prevLine + newWord);
        }


      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
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
      webSocketRef.current.send(currentMessage);
      setUserInput('User:'+currentMessage);
      setLlmFeedback('Assistant:');
      setCurrentMessage('');
      //resetProcessingFlags();
    }
  };

  return (
    <div className="Chat">
      <div className="chat-output-container" ref={outputContainerRef}>
        <div className="chat-output">
          <pre className="user-input">{userInput}</pre>
          <pre className="function-call">{functionCall}</pre>
          <pre className="function-response">{functionResponse}</pre>
          <div className="llm-feedback">{llmFeedback}</div>
        </div>
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
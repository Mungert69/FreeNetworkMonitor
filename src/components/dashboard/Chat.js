import './chat.css';

import React, { useState, useEffect, useRef } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [lastToken, setLastToken] = useState(''); // Store the most recent token
  const lastTokenRef = useRef(''); // Initialize with an empty string

  const [currentMessage, setCurrentMessage] = useState('');
  const [displayText, setDisplayText] = useState(''); // Add this line
  const [extractedOutput, setExtractedOutput] = useState({
    userInput: '',
    functionCall: '',
    functionResponse: '',
    llmFeedback: '',
    isProcessingUserInput: true, // Start with userInput
    isProcessingFunctionCall: false,
    isProcessingFunctionResponse: false,
    isProcessingLLMFeedback: false
  });
  const [currentLine, setCurrentLine] = useState(''); // Store the current line

  const webSocketRef = useRef(null);

  useEffect(() => {
    // Extract sections from the completed line
    let {
      isProcessingUserInput,
      isProcessingFunctionCall,
      isProcessingFunctionResponse,
      isProcessingLLMFeedback
    } = extractedOutput;

    const line = displayText; // Access the completed line
    //console.log('Completed Line:', line);

    if (isProcessingUserInput) setExtractedOutput(prevState => ({ ...prevState, userInput: line }));
    if (isProcessingFunctionCall) setExtractedOutput(prevState => ({ ...prevState, functionCall: line }));
    if (isProcessingFunctionResponse) setExtractedOutput(prevState => ({ ...prevState, functionResponse: line }));
    if (isProcessingLLMFeedback) setExtractedOutput(prevState => ({ ...prevState, llmFeedback: line }));

    if (lastTokenRef.current==='<end-of-line>') setDisplayText(''); 
  }, [displayText]);


  useEffect(() => {
    const socket = new WebSocket('wss://devloadserver.freenetworkmonitor.click/LLM/llm-stream');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };



    socket.onmessage = (event) => {
      const newWord = event.data;
      if (newWord === '<end-of-line>') {
        lastTokenRef.current = newWord;
       //setDisplayText(''); // Add newline 

      } else {
        console.log("lastTokenRef is " + lastTokenRef.current);
        var test = '';
        if (lastTokenRef.current === '<end-of-line>') { // We have a previous token
          console.log("lastToken found ");
          setExtractedOutput(prevState => ({
            ...prevState,
            isProcessingUserInput: newWord.startsWith(">") && !newWord.startsWith("> FUNCTION RESPONSE"),
            isProcessingFunctionCall: newWord.startsWith("{"),
            isProcessingFunctionResponse: newWord.startsWith("> FUNCTION RESPONSE"),
            isProcessingLLMFeedback: !newWord.startsWith(">") && !newWord.startsWith("{")
          }));
        }
        setDisplayText((prevText) => prevText + newWord + ' '); // Append word and space
        lastTokenRef.current = newWord;
        //console.log('setLastToken '+newWord);

      }
    };



    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    webSocketRef.current = socket;
    const pingInterval = setInterval(() => {
      if (webSocketRef.current.readyState === WebSocket.OPEN) {
        webSocketRef.current.send(''); // Send an empty message
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
      setCurrentMessage('');
    }
  };

  return (
    <div className="Chat">
      
      <pre className="user-input">{extractedOutput.userInput}</pre>
      <pre className="function-call">{extractedOutput.functionCall}</pre>
      <pre className="function-response">{extractedOutput.functionResponse}</pre>
      <div className="llm-feedback">{extractedOutput.llmFeedback}</div>
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

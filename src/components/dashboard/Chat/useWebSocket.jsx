import { useEffect, useRef, useState } from 'react';
import { getLLMServerUrl } from '../ServiceAPI';
import { v4 as uuidv4 } from 'uuid';

export const useWebSocket = ({
  siteId,
  isDashboard,
  chatState,
  audioPlayerRef,
}) => {
  const webSocketRef = useRef(null);
  const [reconnect, setReconnect] = useState(false);
  

  const filterLlmOutput = (text) => {

    const replacements = {
      '<\\|from\\|> user.*\\n<\\|recipient\\|> all.*\\n<\\|content\\|>': '<User:> ',
      //'<\\|im_start\\|>user\\n': '<User:> ',
      //'<\\|start_header_id\\|>user\\n<\\|end_header_id\\|>': '<User:> ',

      '<\\|from\\|> assistant\\n<\\|recipient\\|> (?!all).*<\\|content\\|>': '<Function Call:>',
      '<Assistant:><\\|reserved_special_token_249\\|>': '<Function Call:>',
      '<Assistant:><tool_call>': '<Function Call:>',
      //'<Assistant:><\\|tool_call\\|>': '<Function Call:>',

      '<\\|from\\|> assistant\\n<\\|recipient\\|> all\\n<\\|content\\|>': '<Assistant:>',
      '<\\|start_header_id\\|>assistant<\\|end_header_id\\|>\\n\\n>>>all\\n': '<Assistant:>',
      '<\\|start_header_id\\|>assistant<\\|end_header_id\\|>\\n\\n': '<Assistant:>',
      '<start_of_turn>model\\n': '<Assistant:>',
      '<\\|im_start\\|>assistant\\n': '<Assistant:>',
      '<\\|im_start\\|>assistant<\\|im_sep\\|>\\n': '<Assistant:>',
      '<\\|assistant\\|>\\n': '<Assistant:>',

      '<\\|from\\|> (?!user|assistant).*<\\|recipient\\|> all.*\\n<\\|content\\|>': '<Function Response:> ',

      //'<\\|start_header_id\\|>tool<\\|end_header_id\\|>': '<Function Response:> ',

      '<\\|stop\\|>': '\n',
      '<\\|eot_id\\|>': '\n',
      '<\\|eom_id\\|>': '\n',
      '<\\|im_end\\|>': '\n',
      '<end_of_turn>': '\n',
      '<end_of_sentence>': '\n',
      '<\\|end\\|>': '\n'
    };

    let filteredText = text;
    Object.entries(replacements).forEach(([forbidden, alternative]) => {
      // Use a RegExp constructor for dynamic patterns, including escaping for special characters
      const regex = new RegExp(forbidden, 'gis');  // 's' flag allows '.' to match newline characters
      filteredText = filteredText.replace(regex, alternative);
    });
    return filteredText;
  };




  const processFunctionData = (functionData) => {
    if (!isDashboard) return null;

    //autoClickedRef.current = false;

    let jsonData;
    try {
      jsonData = JSON.parse(functionData);
    } catch (error) {
      console.error("Failed to parse function data JSON:", error);
      return null; // Handle gracefully in case of JSON parsing error
    }

    if (!jsonData || !jsonData.name || !jsonData.dataJson) {
      console.error("Malformed function data received:", jsonData);
      return null; // Handle missing fields gracefully
    }

    switch (jsonData.name) {
      case "get_host_list":
        return jsonData.dataJson.map((host) => {
          let newHost = { ...host };
          if (host.UserID !== "default") {
            newHost.isHostList = true;
          }
          newHost.dataSetID = 0;
          return newHost;
        });

      case "get_host_data":
        return jsonData.dataJson.map((host) => {
          let newHost = { ...host };
          newHost.isHostData = true;
          return newHost;
        });

      case "add_host":
      case "edit_host":
        return jsonData.dataJson.map((host) => {
          let newHost = { ...host };
          if (host.UserID !== "default") {
            newHost.isHostList = true;
          }
          return newHost;
        });

      default:
        //console.warn("Unsupported function type received:", jsonData.name);
        return null; // Handle unsupported function types gracefully
    }
  };
  const processHistoryDisplayData = (historyDisplayData) => {
    try {
      console.log("Got history data:", historyDisplayData);
       
      const parsedData = JSON.parse(historyDisplayData);
      if (Array.isArray(parsedData)) {
        chatState.setHistories(parsedData);
      } else {
        console.error("Invalid history data format:", parsedData);
      }
    } catch (error) {
      console.error("Error parsing history display data:", error);
    }
  };

  const waitForWebSocket = async (webSocket) => {
    while (webSocket.readyState !== WebSocket.OPEN) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const sendMessage = async (message) => {
    await waitForWebSocket(webSocketRef.current);
    //console.log("Sending message =>" + message + "<=");
    webSocketRef.current.send(message);
  };

  const stopLLM = async () => {
    await waitForWebSocket(webSocketRef.current);
    webSocketRef.current.send('<|STOP_LLM|>');
    console.log('Message sent: <|STOP_LLM|>');
  };

  const resetSessionId = async () => {
    await waitForWebSocket(webSocketRef.current);
    webSocketRef.current.send('<|REMOVE_SESSION|>');
    console.log('Message sent: <|REMOVE_SESSION|>');

    localStorage.removeItem('sessionId');
    localStorage.removeItem('sessionTimestamp');

    const newSessionId = uuidv4();
    localStorage.setItem('sessionId', newSessionId);
    localStorage.setItem('sessionTimestamp', new Date().getTime().toString());
    chatState.setSessionId(newSessionId);
  };

  useEffect(() => {
    webSocketRef.current = new WebSocket(getLLMServerUrl(siteId));
    console.log('WebSocket connection established to ' + getLLMServerUrl(siteId));

    webSocketRef.current.onopen = () => {
      const sendStr = `${Intl.DateTimeFormat().resolvedOptions().timeZone},${chatState.llmRunnerTypeRef.current},${chatState.sessionId}`;
      webSocketRef.current.send(sendStr);
      console.log(' Sent opening message to websocket : ' + sendStr);
    };

    webSocketRef.current.onmessage = (event) => {
      let newWord = event.data;
      
      // Handle audio data
      if (newWord.includes('</audio>')) {
        const [textPart, audioFile] = newWord.split('</audio>');
        newWord = textPart?.trim() || '';
        
        if (audioFile?.trim()) {
          audioPlayerRef.current.playAudioSequentially(audioFile.trim());
        }
      }

      // Handle function data
      if (newWord.startsWith('<function-data>') && newWord.endsWith('</function-data>')) {
        const functionData = newWord.slice('<function-data>'.length, -'</function-data>'.length);
        const generatedLinkData = processFunctionData(functionData);
        
        if (generatedLinkData !== null) {
          chatState.setLinkData(generatedLinkData);
          if (chatState.arePopupsEnabled && generatedLinkData.length > 1) {
            chatState.setIsDrawerOpen(true);
          } else if (!chatState.arePopupsEnabled) {
            chatState.setIsDrawerOpen(false);
          }
        }
      }
      // Handle history display data
      else if (newWord.startsWith('<history-display-name>') && newWord.endsWith('</history-display-name>')) {
        const historyData = newWord.slice('<history-display-name>'.length, -'</history-display-name>'.length);
        processHistoryDisplayData(historyData);
      }
      // Handle various message types
      else if (newWord.startsWith('</llm-error>')) {
        chatState.setMessage({
          persist: true,
          text: newWord.substring('</llm-error>'.length),
          success: false
        });
      }
      else if (newWord.startsWith('</llm-info>')) {
        chatState.setMessage({
          info: '',
          text: newWord.substring('</llm-info>'.length)
        });
      }
      else if (newWord.startsWith('</llm-warning>')) {
        chatState.setMessage({
          warning: '',
          text: newWord.substring('</llm-warning>'.length)
        });
      }
      else if (newWord.startsWith('</llm-success>')) {
        chatState.setMessage({
          success: true,
          text: newWord.substring('</llm-success>'.length)
        });
      }
      // Handle other control messages
      else if (newWord === '</llm-ready>') chatState.setIsReady(true);
      else if (newWord === '</functioncall>') chatState.setIsCallingFunction(true);
      else if (newWord === '</functioncall-complete>') chatState.setIsCallingFunction(false);
      else if (newWord === '</llm-busy>') chatState.setIsLLMBusy(true);
      else if (newWord === '</llm-listening>') chatState.setIsLLMBusy(false);
      else if (newWord === '<end-of-line>') chatState.setIsProcessing(false);
      else {
        chatState.setLlmFeedback(prevFeedback => filterLlmOutput(prevFeedback + newWord));
      }
    };

    webSocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      setReconnect(!reconnect);
    };

    webSocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Send initial ping
    sendMessage('');
    const pingInterval = setInterval(() => {
      if (webSocketRef.current?.readyState === WebSocket.OPEN) {
        sendMessage('');
        console.log('Sent web socket Ping');
      }
    }, 5000);

    return () => {
      clearInterval(pingInterval);
      if (webSocketRef.current) {
        webSocketRef.current.onmessage = null;
        webSocketRef.current.onclose = null;
        webSocketRef.current.onerror = null;
        webSocketRef.current.close();
      }
    };
  }, [reconnect]);

  return {
    stopLLM,
    resetSessionId,
    webSocketRef
  };
};

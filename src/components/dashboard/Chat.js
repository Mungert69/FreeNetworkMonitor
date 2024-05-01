import './chat.css';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Badge, Tooltip, Zoom, SwipeableDrawer, Grid, Card, CardContent, TextField, Button, IconButton, Typography, CircularProgress, List, ListItem, Box } from '@mui/material';
import styleObject from './styleObject';
import useClasses from "./useClasses";
import useTheme from '@mui/material/styles/useTheme';
import { v4 as uuidv4 } from 'uuid';
import { getLLMServerUrl } from './ServiceAPI';

import React, { useState, useEffect, useRef } from 'react';

function Chat({ onHostLinkClick, isDashboard, initRunnerType }) {
  const theme = useTheme();
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
  const [speechText, setSpeechText] = useState('');
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const [currentLine, setCurrentLine] = useState('');
  const [linkData, setLinkData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallingFunction, setIsCallingFunction] = useState(false);
  const classes = useClasses(styleObject(theme, null));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 
  const [llmRunnerType, setLlmRunnerType] = useState(initRunnerType);
  const getSessionId = () => {
    const storedSessionId = localStorage.getItem('sessionId');
    if (storedSessionId) {
      return storedSessionId;
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem('sessionId', newSessionId);
      return newSessionId;
    }
  };

  const [sessionId, setSessionId] = useState(getSessionId()); // Use the getSessionId function during initial state setup

  const toggleLlmRunnerType = () => {
    setLlmRunnerType(prevType => prevType === 'FreeLLM' ? 'TurboLLM' : 'FreeLLM');
  };
  const autoClickedRef = useRef(false);

  useEffect(() => {
    if (linkData.length === 1 && !autoClickedRef.current) {
      onHostLinkClick(linkData[0]);
      autoClickedRef.current = true;  // Mark as clicked
    } else if (linkData.length !== 1) {
      autoClickedRef.current = false;  // Reset if the number of links changes
    }
  }, [linkData, onHostLinkClick]);
  
  
 
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };
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
      const messages = ["Please wait...", "Function call...", "Evaluating..."];
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
        "Running to slow?",
        "Need results now!",
        "Switch to TurboLLM",
        "Click Toggle LLM Type",
        "Then Reload Assistant"
      ];
      setHelpMessage(helpMessages[helpMessageIndex]);
      setHelpMessageIndex((prevIndex) => (prevIndex + 1) % helpMessages.length);
      setFirstMessageShown(true); // Mark the first message as shown
    };

    if (isProcessing || isCallingFunction) {
      // Set a longer delay for showing the first help message
      const initialDelay = firstMessageShown ? 5000 : 30000; // 60 seconds for the first, then 5 seconds for subsequent messages
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
    connectWebSocket();
    const pingInterval = setInterval(() => {
      if (webSocketRef.current.readyState === WebSocket.OPEN) {
        webSocketRef.current.send('');
      }
    }, 30000);
    return () => {
      clearInterval(pingInterval);
      if (webSocketRef.current.socket !== undefined) webSocketRef.current.socket.close();
    };

  }, []);

  const processFunctionData = (functionData) => {
    if (!isDashboard) return null
    autoClickedRef.current = false;
    const jsonData = JSON.parse(functionData);

    if (jsonData.name === "get_host_list") {
      return jsonData.dataJson.map((host) => {
        // Create a new object based on the host
        let newHost = { ...host };

        // Conditionally add the isHostData property
        if (host.UserID !== 'default') {
          newHost.isHostList = true;
        }
        newHost.dataSetID = 0;
        return newHost;
      });

    }
    else if (jsonData.name === "get_host_data") {
      return jsonData.dataJson.map((host) => {
        // Create a new object based on the host
        let newHost = { ...host };
        newHost.isHostData = true;
        return newHost;
      });
    }
    else if (jsonData.name === "add_host") {
      return jsonData.dataJson.map((host) => {
        // Create a new object based on the host
        let newHost = { ...host };

        // Conditionally add the isHostData property
        if (host.UserID !== 'default') {
          newHost.isHostList = true;
        }

        return newHost;
      });
    }
    else if (jsonData.name === "edit_host") {
      return jsonData.dataJson.map((host) => {
        // Create a new object based on the host
        let newHost = { ...host };

        // Conditionally add the isHostData property
        if (host.userID !== 'default') {
          newHost.isHostList = true;
        }

        return newHost;
      });
    }
    else {
      // Handle other function types or throw an error for unsupported types
      throw new Error("Unsupported function type");
    }
  }
  const connectWebSocket = () => {
    const socket = new WebSocket(getLLMServerUrl());

    socket.onopen = () => {
      console.log('WebSocket connection established to ' + getLLMServerUrl());

      socket.send(Intl.DateTimeFormat().resolvedOptions().timeZone+','+llmRunnerType+','+sessionId);

    };

    socket.onmessage = (event) => {
      const newWord = event.data;
      //TODO implement this if condition looking to match newWord is <function-data>SOME TEXT</function-data>
      if (newWord.startsWith('<function-data>') && newWord.endsWith('</function-data>')) {
        // Extract the function data
        const functionData = newWord.slice(15, -16); // Remove the tags
        console.log('Found function data :' + functionData);
        const generatedLinkData = processFunctionData(functionData);
        if (generatedLinkData !== null) {
          setLinkData(generatedLinkData);
          setIsDrawerOpen(true);
        }

      }
      else if (newWord === '</llm-ready>') {
        setIsReady(true);
        setLlmFeedback('');
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
        setSpeechText((prev) => prev + newWord);
        setLlmFeedback((prevFeedback) => {
          // Combine the new word with previous feedback before filtering
          const combinedFeedback = prevFeedback + newWord;
          // Now apply the filter on the combined feedback

          return filterLlmOutput(combinedFeedback);
        });


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

  }

  useEffect(() => {
    //if (!shouldSpeak) speakText(speechText);
    setSpeechText('');
  }, [shouldSpeak]);

  const speakText = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };
  const filterLlmOutput = (text) => {

    const messageStart = '<|from|> assistant\n<|recipient|> all\n<|content|>';
    const messageEnd = '<|stop|>';

    if (text.includes(messageStart)) {
      setShouldSpeak(true);
    }
    if (text.includes(messageEnd)) {
      setShouldSpeak(false);
    }


    const replacements = {
      // Adjusted regex pattern to match the structure without spaces around the pipes
      '<\\|from\\|>user<\\|content\\|>': 'User: ',
      '<\\|from\\|> assistant\\n<\\|recipient\\|> all\\n<\\|content\\|>': 'Assistant:',
      '<\\|stop\\|>': '\n'
    };

    let filteredText = text;
    Object.entries(replacements).forEach(([forbidden, alternative]) => {
      // Use a RegExp constructor for dynamic patterns, including escaping for special characters
      const regex = new RegExp(forbidden, 'gi');
      filteredText = filteredText.replace(regex, alternative);

    });

    return filteredText;
  };

  const sendMessage = () => {
    if (currentMessage && webSocketRef.current.readyState === WebSocket.OPEN) {
      setIsProcessing(true); // Start loading indicator
      webSocketRef.current.send(currentMessage);
      // setUserInput('User: ' + currentMessage);
      //setLlmFeedback(currentStr => currentStr + '\n' + 'User: ');
      setCurrentMessage('');
      //resetProcessingFlags();
    }
  };
  const resetLLM = () => {
    // Close the existing WebSocket connection if open
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.close();
    }

    // Reset state variables
    setIsReady(false);
    setThinkingDots('');
    setCallingFunctionMessage('Processing function...');
    setShowHelpMessage(false);
    setHelpMessage('');
    setHelpMessageIndex(0);
    setFirstMessageShown(false);
    setCurrentMessage('');
    setLlmFeedback('');
    setIsProcessing(false);
    setIsCallingFunction(false);
    // Add any other state resets or logic for stopping the LLM here

    // Re-establish the WebSocket connection
    connectWebSocket();
  };

  const renderLinks = () => (
    <List>
      {linkData.map((linkItem) => (
        <ListItem key={linkItem.link}>
          <Button onClick={() => onHostLinkClick(linkItem)} sx={{
            width: '100%', // Full width button
            justifyContent: 'flex-start',
            textTransform: 'none',
            color: theme.palette.primary.main, // Main theme color for text
            '&:hover': {
              backgroundColor: theme.palette.action.hover, // Hover background color
            }
          }}>
           {linkItem.DateStarted ? `${linkItem.Address} : ${linkItem.DateStarted}` : linkItem.Address}

          </Button>
        </ListItem>
      ))}
    </List>
  );


  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, width: 320, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardContent>
          <Grid container alignItems="center">
            <Grid item xs={12} sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              padding: theme.spacing(1),
              borderRadius: theme.shape.borderRadius / 3
            }} >
              <Typography variant="h7" >Network Monitor Assistant ({ llmRunnerType})</Typography>
            </Grid>
            <Grid item xs={12} alignItems="right" >
              <IconButton onClick={saveFeedback} color="primary" disabled={!isReady} >
                <Badge color="secondary">
                  <Tooltip title="Save"
                    TransitionComponent={Zoom}>
                    <SaveIcon />
                  </Tooltip>
                </Badge>

              </IconButton>
              <IconButton onClick={toggleLlmRunnerType} color="primary" >
                <Badge color="secondary">
                  <Tooltip title="Toggle LLM Type" TransitionComponent={Zoom}>
                    <SwapHorizIcon />
                  </Tooltip>
                </Badge>
              </IconButton>
              {isDrawerOpen ? null : (
                <IconButton
                  onClick={toggleDrawer(true)}
                  color="primary"
                  disabled={!isReady}

                >
                  <Badge color="secondary">
                    <Tooltip title="Open Links"
                      TransitionComponent={Zoom}>
                      <KeyboardArrowUpIcon />
                    </Tooltip>
                  </Badge>
                </IconButton>
              )}
              <IconButton onClick={resetLLM} color="secondary" disabled={!isReady} >
                <Badge color="secondary">
                  <Tooltip title={!isReady ? "Assitant not ready" : "Reload Assitant"}
                    TransitionComponent={Zoom}>
                    <RestartAltIcon />
                  </Tooltip>
                </Badge>
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
        <CardContent ref={outputContainerRef} sx={{ flexGrow: 1, overflow: 'auto' }}>
          {!isReady ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <pre style={{ fontFamily: 'Monospace', whiteSpace: 'pre-wrap' }}>
              {llmFeedback.split(/(```[\s\S]*?```)/).map((part, index) => {
                if (part.startsWith('```') && part.endsWith('```')) {
                  const codeContent = part.substring(3, part.length - 3).trim();
                  return <Box key={index} sx={{ my: 2, p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>{codeContent}</Box>;
                } else {
                  return <Typography key={index} component="span">{part}</Typography>;
                }
              })}
            </pre>
          )}
          {isProcessing && !isCallingFunction && (
            <Typography color="primary" sx={{ mt: 2, fontStyle: 'italic' }}>{`Thinking${thinkingDots}`}</Typography>
          )}
          {isCallingFunction && (
            <Typography color="secondary" sx={{ mt: 2, fontWeight: 'bold' }}>{callingFunctionMessage}</Typography>
          )}
          {(showHelpMessage && !isDashboard) && (
            <Typography sx={{ mt: 2, bgcolor: 'action.selected' }}>{helpMessage}</Typography>
          )}
        </CardContent>
        <SwipeableDrawer
          anchor="bottom"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: theme.palette.background.paper, // Use theme color
              color: theme.palette.text.primary, // Use theme color for text
              padding: theme.spacing(2), // Use theme spacing
              borderTopLeftRadius: '16px', // Rounded corners at the top
              borderTopRightRadius: '16px',
            }
          }}
        >
          {renderLinks()}
        </SwipeableDrawer>
        <CardContent sx={{ pt: 1, pb: 1 }}>

          <Grid container
            direction="row"
          >
            <Grid item xs={10}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="Type a message..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton
                color="primary"
                onClick={sendMessage}
                disabled={isProcessing || isCallingFunction || !isReady}
                aria-label="send message"
              >
                <SendIcon /> {/* Using SendIcon as the paper airplane icon */}
              </IconButton>
            </Grid>

          </Grid>
        </CardContent>
      </Card>

    </Box>
  );

}

export default Chat;
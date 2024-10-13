import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import './chat.css';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CodeIcon from '@mui/icons-material/Code';
import ReplyIcon from '@mui/icons-material/Reply';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { Badge, Tooltip, Zoom, SwipeableDrawer, Grid, Card, CardContent, TextField, Button, IconButton, Typography, CircularProgress, List, ListItem, Box } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import useTheme from '@mui/material/styles/useTheme';
import styleObject from './styleObject';
import useClasses from "./useClasses";
import { v4 as uuidv4 } from 'uuid';
import Message from './Message';
import { getLLMServerUrl } from './ServiceAPI';
import MessageLine from './MessageLine';

import React, { useState, useEffect, useRef } from 'react';

function Chat({ onHostLinkClick, isDashboard, initRunnerType, setIsChatOpen, siteId }) {
  const theme = useTheme();
  const [expandedFunction, setExpandedFunction] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedFunction(isExpanded ? panel : null);
  };
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [thinkingDots, setThinkingDots] = useState('');
  const [callingFunctionMessage, setCallingFunctionMessage] = useState('Calling function...');
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');
  const [helpMessageIndex, setHelpMessageIndex] = useState(0);
  const [firstMessageShown, setFirstMessageShown] = useState(false);


  const webSocketRef = useRef(null);
  const outputContainerRef = useRef(null);
  const llmRunnerTypeRef = useRef('TurboLLM');
  const openMessage = useRef(null);
  const [isPaused, setPause] = useState(false);
  const [reconnect, setReconnect] = useState(false);
  const [llmRunnerType, setLlmRunnerType] = useState('TurboLLM'); // Initial state


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
  const [message, setMessage] = React.useState({ info: 'init', success: false, text: "Interal Error" });
  const [reconnectDelay, setReconnectDelay] = useState(1000); // Start with 1 second
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const chatStyles = {
    position: 'fixed',
    transition: 'all 0.5s ease-in-out',
    transformOrigin: 'right', 
    ...(isExpanded
      ? {
        top: '70px', // Adjust based on your AppBar height
        left: '64px',
        right: '20px',
        bottom: '20px',
        width: 'calc(100% - 84px)',
        height: 'calc(100% - 90px)', // Adjust based on your AppBar height
        maxHeight: 'none'
      }
      : {
        bottom: '20px',
        right: '20px',
        width: '320px',
        height: 'calc(100% - 90px)',
        maxHeight: 'none',
      }),
  };
  
  const getSessionId = () => {
    const storedSessionId = localStorage.getItem('sessionId');
    const storedTimestamp = localStorage.getItem('sessionTimestamp');
    const oneDayInMilliseconds = 86400000; // 1 day in milliseconds

    if (storedSessionId && storedTimestamp) {
      const currentTime = new Date().getTime();
      if (currentTime - parseInt(storedTimestamp) > oneDayInMilliseconds) {
        // Session expired, remove stored data
        localStorage.removeItem('sessionId');
        localStorage.removeItem('sessionTimestamp');
      } else {
        // Session still valid, return stored session ID
        return storedSessionId;
      }
    }

    // Generate new session ID and store timestamp
    const newSessionId = uuidv4();
    localStorage.setItem('sessionId', newSessionId);
    localStorage.setItem('sessionTimestamp', new Date().getTime().toString());
    return newSessionId;
  };

  const resetSessionId = () => {
    const storedSessionId = localStorage.getItem('sessionId');
    const storedTimestamp = localStorage.getItem('sessionTimestamp');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('sessionTimestamp');


    // Generate new session ID and store timestamp
    const newSessionId = uuidv4();
    localStorage.setItem('sessionId', newSessionId);
    localStorage.setItem('sessionTimestamp', new Date().getTime().toString());
    setSessionId(newSessionId);
  };


  const [sessionId, setSessionId] = useState(getSessionId()); // Use the getSessionId function during initial state setup

  const toggleLlmRunnerType = () => {
    llmRunnerTypeRef.current = llmRunnerTypeRef.current === 'FreeLLM' ? 'TurboLLM' : 'FreeLLM';
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
      }, 3000); // Rotate messages every 3 seconds
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
  }, [llmFeedback]);



  const processFunctionData = (functionData) => {
    if (!isDashboard) return null;
  
    autoClickedRef.current = false;
  
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
  
  function sendMessageCheck(message) {
    if (webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(message);
    } else {
      console.log(' Web socket not in OPEN state ' + webSocketRef.current.readyState);
      openMessage.current = message;
      setReconnect(!reconnect);
    }
  }
  useEffect(() => {
    webSocketRef.current = new WebSocket(getLLMServerUrl(siteId));
    console.log('WebSocket connection established to ' + getLLMServerUrl(siteId));

    webSocketRef.current.onopen = () => {
      const sendStr = Intl.DateTimeFormat().resolvedOptions().timeZone + ',' + llmRunnerTypeRef.current + ',' + sessionId
      webSocketRef.current.send(sendStr);
      console.log(' Sent opening message to websocket : ' + sendStr);
      if (openMessage.current == null) {

      } else {
        webSocketRef.current.send(openMessage.current);
        console.log(" Sent queued message " + openMessage.current);
        openMessage.current = null
      }
    };

    webSocketRef.current.onmessage = (event) => {
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
      else if (newWord.startsWith('</llm-error>')) {
        // Pass only the part of newWord after '</llm-error>'
        var message = {
          persist: true,
          text: newWord.substring('</llm-error>'.length),
          success: false
        };
        setMessage(message);
      }
      else if (newWord.startsWith('</llm-info>')) {
        // Pass only the part of newWord after '</llm-error>'
        var message = {
          info: '',
          text: newWord.substring('</llm-info>'.length),
        };
        setMessage(message);
      }
      else if (newWord.startsWith('</llm-warning>')) {
        // Pass only the part of newWord after '</llm-error>'
        var message = {
          warning: '',
          text: newWord.substring('</llm-warning>'.length),
        };
        setMessage(message);
      }
      else if (newWord.startsWith('</llm-success>')) {
        // Pass only the part of newWord after '</llm-error>'
        var message = {
          success: true,
          text: newWord.substring('</llm-success>'.length),
        };
        setMessage(message);
      }
      else if (newWord === '</llm-ready>') {
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
        setSpeechText((prev) => prev + newWord);
        setLlmFeedback((prevFeedback) => {
          // Combine the new word with previous feedback before filtering
          const combinedFeedback = prevFeedback + newWord;
          // Now apply the filter on the combined feedback

          return filterLlmOutput(combinedFeedback);
        });


      }
    };

    webSocketRef.current.onclose = () => {
      console.log('WebSocket connection closed');
      setReconnect(!reconnect);
    };
    webSocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Optionally, display an error message to the user or attempt to reconnect
    };


    const wsCurrent = webSocketRef.current;

    return () => {
      wsCurrent.close();
    }
  }, [reconnect]);

  useEffect(() => {
    if (!webSocketRef.current) return;

    webSocketRef.current.onmessage = message => {
      if (isPaused) return;

      try {
        console.log(message);
      } catch (f) {
        console.log(f);
      }
    };

  }, [isPaused]);


  useEffect(() => {
    sendMessageCheck('');
    console.log('Initial page load web socket Ping ');
    // connectWebSocket();
    const pingInterval = setInterval(() => {
      if (webSocketRef.current.readyState === WebSocket.OPEN) {
        sendMessageCheck('');
        console.log('Sent web socket Ping ');

      }
    }, 5000);
    return () => {
      clearInterval(pingInterval);
      /*if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
        webSocketRef.current.close();
      }*/
    };

  }, []);


  useEffect(() => {
    //if (!shouldSpeak) speakText(speechText);
    setSpeechText('');
  }, [shouldSpeak]);

  useEffect(() => {
    resetLLM();
  }, [sessionId]);

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
      // Match "user" followed by any characters, a newline, then any recipient, and "<|content|>"
      '<\\|from\\|> user.*\\n<\\|recipient\\|> all.*\\n<\\|content\\|>': '<User:> ',
      // Match "assistant" followed by any recipient except "all", then "<|content|>"
      '<\\|from\\|> assistant\\n<\\|recipient\\|> (?!all).*<\\|content\\|>': '<Function Call:>',
      // Match "assistant" with recipient "all", followed by "<|content|>"
      '<\\|from\\|> assistant\\n<\\|recipient\\|> all\\n<\\|content\\|>': '<Assistant:>',
      // Match function call responses with any "from" except "user" or "assistant"
      '<\\|from\\|> (?!user|assistant).*<\\|recipient\\|> all.*\\n<\\|content\\|>': '<Function Response:> ',
      // Match the stop pattern
      '<\\|stop\\|>': '\n'
    };

    let filteredText = text;
    Object.entries(replacements).forEach(([forbidden, alternative]) => {
      // Use a RegExp constructor for dynamic patterns, including escaping for special characters
      const regex = new RegExp(forbidden, 'gis');  // 's' flag allows '.' to match newline characters
      filteredText = filteredText.replace(regex, alternative);
    });
    return filteredText;
  };

  const sendMessage = () => {
    if (currentMessage && webSocketRef.current.readyState === WebSocket.OPEN) {
      setIsProcessing(true); // Start loading indicator
      sendMessageCheck(currentMessage);
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

  };

  const renderLinks = () => {
    if (!linkData || linkData.length === 0) return;
    return (
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
      </List>);
  };

  const renderContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('<User:>')) {
        return <MessageLine key={index} line={line.replace('<User:>', '')} lineType="User" />;
      } else if (line.startsWith('<Assistant:>')) {
        return <MessageLine key={index} line={line.replace('<Assistant:>', '')} lineType="Assistant" />;
      } else if (line.startsWith('<Function Call:>')) {
        return <MessageLine key={index} line={line.replace('<Function Call:>', '')} lineType="FunctionCall" />;
      } else if (line.startsWith('<Function Response:>')) {
        return <MessageLine key={index} line={line.replace('<Function Response:>', '')} lineType="FunctionResponse" />;
      } else {
        return <MessageLine key={index} line={line} />;
      }
    });
  };
  return (
    <Box sx={chatStyles}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>

          <Grid container alignItems="center">
            <Grid item xs={12} sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.getContrastText(theme.palette.primary.main),
              padding: theme.spacing(1),
              borderRadius: theme.shape.borderRadius / 3
            }} >
              <Typography variant="h7" >Network Monitor Assistant ({llmRunnerType})</Typography>
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
              <IconButton onClick={resetLLM} color="secondary" >
                <Badge color="secondary">
                  <Tooltip title={!isReady ? "Assitant not ready" : "Reload Assitant"}
                    TransitionComponent={Zoom}>
                    <RestartAltIcon />
                  </Tooltip>
                </Badge>
              </IconButton>
              <IconButton onClick={() => setIsChatOpen(false)} color="secondary" >
                <Badge color="secondary">
                  <Tooltip title={"Hide Assistant"}
                    TransitionComponent={Zoom}>
                    <CloseIcon />
                  </Tooltip>
                </Badge>
              </IconButton>
              <IconButton onClick={toggleExpand} color="primary">
                <Badge color="secondary">
                  <Tooltip title={isExpanded ? "Contract" : "Expand"} TransitionComponent={Zoom}>
                    {isExpanded ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </Tooltip>
                </Badge>
              </IconButton>
              <IconButton
                onClick={() => resetSessionId()}
                color="error"  // Changed from "primary" to "error"
                sx={{
                  '&:hover': {
                    backgroundColor: 'error.light',  // Lighter shade of error color on hover
                  }
                }}
              >
                <Badge color="warning">
                  <Tooltip title="Reset Session" TransitionComponent={Zoom}>
                    <RefreshIcon />
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
            <Box>
            {renderContent(llmFeedback)}
          </Box>
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
                onClick={() => sendMessage()}
                disabled={isProcessing || isCallingFunction || !isReady}
                aria-label="send message"
              >
                <SendIcon /> {/* Using SendIcon as the paper airplane icon */}
              </IconButton>
            </Grid>

          </Grid>
        </CardContent>
      </Card>
      <Message message={message} />
    </Box>
  );

}

export default Chat;
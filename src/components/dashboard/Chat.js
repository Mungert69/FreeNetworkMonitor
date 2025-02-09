import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import './chat.css';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CodeIcon from '@mui/icons-material/Code';
import ReplyIcon from '@mui/icons-material/Reply';
import SaveIcon from '@mui/icons-material/Save';
import StopIcon from '@mui/icons-material/Stop';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VolumeOffIcon from '@mui/icons-material/VolumeOff'; // Mute icon
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import MarkdownRenderer from './MarkdownRenderer';

import { Badge, Tooltip, Zoom, SwipeableDrawer, Grid, Card, CardContent, TextField, Button, IconButton, Typography, CircularProgress, List, ListItem, Box, useScrollTrigger } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import useTheme from '@mui/material/styles/useTheme';
import styleObject from './styleObject';
import useClasses from "./useClasses";
import { v4 as uuidv4 } from 'uuid';
import Message from './Message';
import { getLLMServerUrl, convertDate, transcribeAudioApi } from './ServiceAPI';
import MessageLine from './MessageLine';
import AudioPlayer from './AudioPlayer'; // Import the new AudioPlayer component
import useAudioRecorder from './useAudioRecorder'; // Import the custom hook
import HistoryList from "./HistoryList";

import React, { useState, useEffect, useRef } from 'react';

function Chat({ onHostLinkClick, isDashboard, initRunnerType, setIsChatOpen, siteId }) {
  const theme = useTheme();
  const [expandedFunction, setExpandedFunction] = useState(null);
  const audioPlayerRef = useRef(AudioPlayer());

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedFunction(isExpanded ? panel : null);
  };
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const [loadWarning, setLoadWarning] = useState('');
  const [thinkingDots, setThinkingDots] = useState('');
  const [callingFunctionMessage, setCallingFunctionMessage] = useState('Calling function...');
  const [showHelpMessage, setShowHelpMessage] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');
  const [helpMessageIndex, setHelpMessageIndex] = useState(0);
  const [firstMessageShown, setFirstMessageShown] = useState(false);
  const [histories, setHistories] = useState([]);



  const webSocketRef = useRef(null);
  const outputContainerRef = useRef(null);
  const llmRunnerTypeRef = useRef('TurboLLM');
  const openMessage = useRef(null);
  const [reconnect, setReconnect] = useState(false);
  const [llmRunnerType, setLlmRunnerType] = useState('TurboLLM'); // Initial state
  const [currentMessage, setCurrentMessage] = useState('');
  const [llmFeedback, setLlmFeedback] = useState('');
  const [shouldSpeak, setShouldSpeak] = useState(false);
  const [currentLine, setCurrentLine] = useState('');
  const [linkData, setLinkData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCallingFunction, setIsCallingFunction] = useState(false);
  const [isLLMBusy, setIsLLMBusy] = useState(false);
  const classes = useClasses(styleObject(theme, null));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [message, setMessage] = React.useState({ info: 'init', success: false, text: "Interal Error" });
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isToggleDisabled, setIsToggleDisabled] = useState(false); // Add state for disabling the toggle button


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
  const handleSelectSession = (selectedSessionId) => {
    setSessionId(selectedSessionId);
    resetLLM(); // Reset the LLM session with the new session ID
  };

  const getSessionId = () => {
    // Check if there are any histories available
    if (histories && Array.isArray(histories) && histories.length > 0 && histories[0] && histories[0].sessionId) {
      // Use the session ID from the most recent history
      return histories[0].sessionId;
    }

    // Fall back to local storage if no histories are available
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
  const stopLLM = async () => {
    await waitForWebSocket(webSocketRef.current); // Wait for WebSocket to be ready

    webSocketRef.current.send('<|STOP_LLM|>');
    console.log('Message sent: <|STOP_LLM|>');

  }
  const resetSessionId = async () => {

    await waitForWebSocket(webSocketRef.current); // Wait for WebSocket to be ready

    webSocketRef.current.send('<|REMOVE_SESSION|>');
    console.log('Message sent: <|REMOVE_SESSION|>');

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

  const processHistoryDisplayData = (historyDisplayData) => {
    try {
      // Parse JSON from WebSocket message
      const parsedData = JSON.parse(historyDisplayData);

      if (Array.isArray(parsedData)) {
        setHistories(parsedData);
      } else {
        console.error("Invalid history data format:", parsedData);
      }
    } catch (error) {
      console.error("Error parsing history display data:", error);
    }
  };

  useEffect(() => {
    webSocketRef.current = new WebSocket(getLLMServerUrl(siteId));
    console.log('WebSocket connection established to ' + getLLMServerUrl(siteId));

    webSocketRef.current.onopen = () => {
      const sendStr = Intl.DateTimeFormat().resolvedOptions().timeZone + ',' + llmRunnerTypeRef.current + ',' + sessionId
      webSocketRef.current.send(sendStr);
      console.log(' Sent opening message to websocket : ' + sendStr);
    };

    webSocketRef.current.onmessage = (event) => {
      var newWord = event.data;
      if (newWord.includes('</audio>')) {
        console.log(`Received chucnk: ${newWord}`);
        const [textPart, audioFile] = newWord.split('</audio>');
        if (textPart) {
          console.log(`Received text: ${textPart.trim()}`);
          newWord = textPart.trim(); // Reassign only the text part
        } else {
          newWord = ''; // Clear newWord if there's no text part
        }

        if (audioFile) {
          console.log(`Attempting to play audio: ${audioFile.trim()}`);
          // Process the audio part
          audioPlayerRef.current.playAudioSequentially(audioFile.trim());
        }

      }


      if (newWord.startsWith('<function-data>') && newWord.endsWith('</function-data>')) {
        // Extract the function data using dynamic substring slicing
        const startIndex = '<function-data>'.length; // Start index after the opening tag
        const endIndex = newWord.length - '</function-data>'.length; // End index before the closing tag

        const functionData = newWord.slice(startIndex, endIndex); // Extract the string inside the tags
        console.log('Found function data: ', functionData);

        try {
          // Process the function data
          const generatedLinkData = processFunctionData(functionData);

          if (generatedLinkData !== null) {
            setLinkData(generatedLinkData);
            if (generatedLinkData.length > 1) setIsDrawerOpen(true);
          }
        } catch (error) {
          console.error('Error processing function data:', error);
        }
      }
     
      else if (newWord.startsWith('<history-display-name>') && newWord.endsWith('</history-display-name>')) {
        // Extract the function data using dynamic substring slicing
        const startIndex = '<history-display-name>'.length; // Start index after the opening tag
        const endIndex = newWord.length - '</history-display-name>'.length; // End index before the closing tag

        const historyDisplayData = newWord.slice(startIndex, endIndex); // Extract the JSON string inside the tags
        console.log('Found history display data: ', historyDisplayData);

        try {
          // Ensure the extracted data is valid JSON
          const parsedData = JSON.parse(historyDisplayData);
          processHistoryDisplayData(parsedData);
        } catch (error) {
          console.error('Error parsing history display data:', error);
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
      else if (newWord.startsWith('<load-count>') && newWord.endsWith('</load-count>')) {
        console.log('<load-count> found');

        // Calculate the tag length dynamically
        const startIndex = '<load-count>'.length; // Start index after the opening tag
        const endIndex = newWord.length - '</load-count>'.length; // End index before the closing tag

        const loadCountString = newWord.slice(startIndex, endIndex); // Extract the string inside the tags
        const loadCount = parseInt(loadCountString, 10); // Convert to integer

        if (!isNaN(loadCount)) { // Check if it's a valid number
          setLoadCount(loadCount);
        } else {
          console.error('Invalid load count received:', loadCountString);
        }
      }

      else if (newWord === '</functioncall>') {
        setIsCallingFunction(true);
      }
      else if (newWord === '</functioncall-complete>') {
        setIsCallingFunction(false);
      }
      else if (newWord === '</llm-busy>') {
        console.log('Set </llm-busy>');
        setIsLLMBusy(true);
      }
      else if (newWord === '</llm-listening>') {
        console.log('Set </llm-listening>');
        setIsLLMBusy(false);
      }
      else if (newWord === '<end-of-line>') {
        //setLlmFeedback((prevFeedback) => prevFeedback );

        setIsProcessing(false);
      } else {
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



    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.onmessage = null;
        webSocketRef.current.onclose = null;
        webSocketRef.current.onerror = null;
        webSocketRef.current.close();
      }
    };
  }, [reconnect]);

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
    sendMessageCheck('');
    console.log('Initial page load web socket Ping ');
    // connectWebSocket();
    const pingInterval = setInterval(() => {
      if (webSocketRef.current.readyState === WebSocket.OPEN) {
        sendMessageCheck('');
        console.log('Sent web socket Ping ');

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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const filterLlmOutput = (text) => {

    const replacements = {
      '<\\|from\\|> user.*\\n<\\|recipient\\|> all.*\\n<\\|content\\|>': '<User:> ',
      //'<\\|im_start\\|>user\\n': '<User:> ',
      //'<\\|start_header_id\\|>user\\n<\\|end_header_id\\|>': '<User:> ',

      '<\\|from\\|> assistant\\n<\\|recipient\\|> (?!all).*<\\|content\\|>': '<Function Call:>',
      '<Assistant:><\\|reserved_special_token_249\\|>': '<Function Call:>',
      '<Assistant:><tool_call>': '<Function Call:>',

      '<\\|from\\|> assistant\\n<\\|recipient\\|> all\\n<\\|content\\|>': '<Assistant:>',
      '<\\|start_header_id\\|>assistant<\\|end_header_id\\|>\\n\\n>>>all\\n': '<Assistant:>',
      '<\\|start_header_id\\|>assistant<\\|end_header_id\\|>\\n\\n': '<Assistant:>',
      '<\\|im_start\\|>assistant\\n': '<Assistant:>',
      '<\\|im_start\\|>assistant<\\|im_sep\\|>\\n': '<Assistant:>',

      '<\\|from\\|> (?!user|assistant).*<\\|recipient\\|> all.*\\n<\\|content\\|>': '<Function Response:> ',

      //'<\\|start_header_id\\|>tool<\\|end_header_id\\|>': '<Function Response:> ',

      '<\\|stop\\|>': '\n',
      '<\\|eot_id\\|>': '\n',
      '<\\|eom_id\\|>': '\n',
      '<\\|im_end\\|>': '\n'
    };

    let filteredText = text;
    Object.entries(replacements).forEach(([forbidden, alternative]) => {
      // Use a RegExp constructor for dynamic patterns, including escaping for special characters
      const regex = new RegExp(forbidden, 'gis');  // 's' flag allows '.' to match newline characters
      filteredText = filteredText.replace(regex, alternative);
    });
    return filteredText;
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
    setHelpMessageIndex(0);
    setFirstMessageShown(false);
    setCurrentMessage('');
    setLlmFeedback('');
    setIsProcessing(false);
    setIsLLMBusy(false);
    setIsCallingFunction(false);

  };

  const renderLinks = () => {
    if (!linkData || linkData.length == 0) return;
    return (
      <List>
        {linkData.map((linkItem) => (
          <ListItem key={linkItem.link}>
            <Button onClick={() => { closeExpand(); onHostLinkClick(linkItem); }} sx={{
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
    // Split content while preserving message markers
    const messageBlocks = [];
    const markers = ['<User:>', '<Assistant:>', '<Function Call:>', '<Function Response:>'];
    let currentBlock = { type: 'text', content: '' };

    const parts = content.split(new RegExp(`(${markers.join('|')})`, 'g'));

    parts.forEach(part => {
      if (markers.includes(part)) {
        if (currentBlock.content.trim() || currentBlock.content.includes('\n')) {
          messageBlocks.push(currentBlock);
        }
        currentBlock = {
          type: part.replace(/[<>:]/g, '').replace(' ', ''),
          content: ''
        };
      } else if (part) {
        // Preserve all newlines and whitespace
        currentBlock.content += part;
      }
    });

    if (currentBlock.content.trim() || currentBlock.content.includes('\n')) {
      messageBlocks.push(currentBlock);
    }

    return messageBlocks.map((block, index) => {
      if (block.type === 'text') {
        return <MarkdownRenderer key={index} content={block.content} />;
      }

      return (
        <MessageLine
          key={index}
          line={block.content.replace(/\\`/g, '`')} // Unescape backticks
          lineType={block.type}
        />
      );
    });
  };


  return (
    <Box sx={chatStyles}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {loadWarning && (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="body1" color="black">
                {loadWarning}
              </Typography>
            </Box>
          )}

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
              <IconButton onClick={toggleLlmRunnerType} color="primary" disabled={isToggleDisabled}>
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
              <IconButton
                onClick={toggleAudio}
                color="primary"
                aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
              >
                <Badge color="secondary">
                  <Tooltip title={isMuted ? "Unmute Audio" : "Mute Audio"} TransitionComponent={Zoom}>
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
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
          {isProcessing && !isLLMBusy && (
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
          <HistoryList histories={histories} onSelectSession={handleSelectSession} />

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

                    // Call sendMessage and handle any errors
                    (async () => {
                      try {
                        await sendMessage(); // Await the async sendMessage function
                      } catch (error) {
                        console.error('Error while sending message:', error);
                      }
                    })();
                  }
                }}
                inputProps={{ maxLength: 10000 }}
              />

            </Grid>
            <Grid item xs={1}>
              <IconButton
                color="primary"
                onClick={async () => {
                  try {
                    await sendMessage(); // Await the async sendMessage function
                  } catch (error) {
                    console.error('Error while sending message:', error); // Handle errors
                  }
                }}
                disabled={isLLMBusy || !isReady}
                aria-label="send message"
              >
                <Badge color="primary">
                  <Tooltip title="Send Message" TransitionComponent={Zoom}>
                    <SendIcon />
                  </Tooltip>
                </Badge>
              </IconButton>
              {/* Record Audio Button */}

              <IconButton
                color="secondary"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={isProcessing} // Disable recording while processing
              >
                <Badge color="secondary">
                  <Tooltip title={isRecording ? 'Stop Recording' : 'Start Recording'}>
                    {isRecording ? <MicOffIcon /> : <MicIcon />}
                  </Tooltip>
                </Badge>
              </IconButton>

            </Grid>
            <Grid item xs={1}>
              <IconButton
                onClick={() => stopLLM()}
                color="warning"
                disabled={!isLLMBusy || !isReady}
                sx={{
                  '&:hover': {
                    backgroundColor: 'warning.light',  // Lighter shade of error color on hover
                  }
                }}
              >
                <Badge color="warning">
                  <Tooltip title="Halt Assistant" TransitionComponent={Zoom}>
                    <StopIcon />
                  </Tooltip>
                </Badge>
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

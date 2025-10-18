import React, { useState, useRef, useEffect } from 'react';

import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CodeIcon from '@mui/icons-material/Code';
import ReplyIcon from '@mui/icons-material/Reply';
import HistoryIcon from '@mui/icons-material/History';

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
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Drawer, Paper, Popper, Badge, Tooltip, Zoom, SwipeableDrawer, Grid, Card, CardContent, TextField, Button, IconButton, Typography, CircularProgress, List, ListItem, Box, useScrollTrigger } from '@mui/material';
import Message from '../Message';
import HistoryList from "./HistoryList";
import MarkdownRenderer from '../MarkdownRenderer';
import MessageLine from '../MessageLine';
import { useTheme } from '@mui/material/styles';
import styleObject from '../styleObject';
import useClasses from "../useClasses";
import './chat.css';


const ChatContent = ({
  loadWarning, llmRunnerType, isReady, isToggleDisabled, isDrawerOpen, toggleDrawer, setIsChatOpen,
  isExpanded, toggleExpand, resetSessionId, isMuted, toggleAudio, outputContainerRef, isProcessing,
  isLLMBusy, thinkingDots, isCallingFunction, callingFunctionMessage, showHelpMessage, isDashboard,
  helpMessage, histories, handleSelectSession, handleDeleteSession, currentMessage, setCurrentMessage,
  isRecording, handleStartRecording, handleStopRecording, stopLLM, message, linkData, saveFeedback,
  toggleLlmRunnerType, llmFeedback, closeExpand, onHostLinkClick, sendMessage, sessionId, setIsHoveringMessages,
  setIsInputFocused,
}) => {
  // Responsive: use full width if screen is small (drawer hidden)
  const theme = useTheme();
  const isSmallScreen = window.innerWidth < 900; // or use theme.breakpoints.down('md') with useMediaQuery
  const chatStyles = {
    position: 'fixed',
    transition: 'all 0.5s ease-in-out',
    transformOrigin: 'right',
    zIndex: theme.zIndex.modal + 1,
    ...(isExpanded
      ? isSmallScreen
        ? {
            top: '70px',
            left: 0,
            right: 0,
            bottom: '20px',
            width: '100%',
            height: 'calc(100% - 90px)',
            maxHeight: 'none'
          }
        : {
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

  const classes = useClasses(styleObject(theme, null));
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const historyButtonRef = useRef(null);

  const toggleHistory = () => {
    setIsHistoryOpen((prev) => !prev);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setIsHistoryOpen(false);
  }
  // Inside your ChatContent component, add:
  useEffect(() => {
    const handlePrompt = (e) => {
      setCurrentMessage(e.detail); // Auto-fill the input
      // Optional: Auto-send the message
      setTimeout(() => {
        const sendBtn = document.querySelector('[aria-label="send message"]');
        if (sendBtn) sendBtn.click();
      }, 100);
    };

    window.addEventListener('send-chat-prompt', handlePrompt);
    return () => window.removeEventListener('send-chat-prompt', handlePrompt);
  }, []);

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


  // Ref for the chat input
  const chatInputRef = useRef(null);

  // Scroll to bottom handler
  const handleInputMouseEnter = () => {
    if (outputContainerRef && outputContainerRef.current) {
      outputContainerRef.current.scrollTop = outputContainerRef.current.scrollHeight;
    }
  };

  return (
    <Box sx={chatStyles}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          {loadWarning && (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="body1" color="black">
                {loadWarning}
              </Typography>
            </Box>
          )}

          {/* Header Section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Box
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                padding: theme.spacing(1),
                borderRadius: theme.shape.borderRadius / 3,
                display: 'flex',
                alignItems: 'center', // Ensure vertical alignment
                gap: 1, // Slightly more space between text and icons
                flexWrap: { xs: 'wrap', md: 'nowrap' },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  flexGrow: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center', // Vertically center text with icons
                }}
              >
                Network Monitor Assistant ({llmRunnerType})
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1, // Slightly more space between icons
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end' ,
                  width: { xs: '100%', md: 'auto' },
                  minHeight: 0,
                }}
              >
                <IconButton onClick={saveFeedback} color="inherit" disabled={!isReady} size="small" sx={{ p: 0.5 }}>
                  <Badge color="secondary">
                    <Tooltip title="Save" TransitionComponent={Zoom}>
                      <SaveIcon />
                    </Tooltip>
                  </Badge>
                </IconButton>
                <IconButton onClick={toggleLlmRunnerType} color="inherit" disabled={isToggleDisabled} size="small" sx={{ p: 0.5 }}>
                  <Badge color="secondary">
                    <Tooltip title="Toggle LLM Type" TransitionComponent={Zoom}>
                      <SwapHorizIcon />
                    </Tooltip>
                  </Badge>
                </IconButton>
                {isDrawerOpen ? null : (
                  <IconButton
                    onClick={toggleDrawer(true)}
                    color="inherit"
                    disabled={!isReady}
                    size="small"
                    sx={{ p: 0.5 }}
                  >
                    <Badge color="secondary">
                      <Tooltip title="Open Links" TransitionComponent={Zoom}>
                        <KeyboardArrowUpIcon />
                      </Tooltip>
                    </Badge>
                  </IconButton>
                )}
                <IconButton onClick={toggleExpand} color="inherit" size="small" sx={{ p: 0.5 }}>
                  <Badge color="secondary">
                    <Tooltip title={isExpanded ? "Contract" : "Expand"} TransitionComponent={Zoom}>
                      {isExpanded ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </Tooltip>
                  </Badge>
                </IconButton>
                <IconButton
                  onClick={() => resetSessionId()}
                  color="inherit"
                  size="small"
                  sx={{
                    p: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.12)',
                    }
                  }}
                >
                  <Badge color="warning">
                    <Tooltip title="Start New Chat" TransitionComponent={Zoom}>
                      <RefreshIcon />
                    </Tooltip>
                  </Badge>
                </IconButton>
                <IconButton
                  onClick={toggleAudio}
                  color="inherit"
                  aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
                  size="small"
                  sx={{ p: 0.5 }}
                >
                  <Badge color="secondary">
                    <Tooltip title={isMuted ? "Unmute Audio" : "Mute Audio"} TransitionComponent={Zoom}>
                      {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </Tooltip>
                  </Badge>
                </IconButton>
                <IconButton
                  ref={historyButtonRef}
                  onClick={toggleHistory}
                  color="inherit"
                  aria-label="History"
                  size="small"
                  sx={{ p: 0.5 }}
                >
                  <Badge color="secondary">
                    <Tooltip title="History" TransitionComponent={Zoom}>
                      <HistoryIcon />
                    </Tooltip>
                  </Badge>
                </IconButton>
                <IconButton onClick={() => closeChat()} color="inherit" size="small" sx={{ p: 0.5 }}>
                  <Badge color="secondary">
                    <Tooltip title="Hide Assistant" TransitionComponent={Zoom}>
                      <CloseIcon />
                    </Tooltip>
                  </Badge>
                </IconButton>
              </Box>
            </Box>
          </Box>
        </CardContent>

        {/* Chat Content */}
        <CardContent
          ref={outputContainerRef}
          sx={{ flexGrow: 1, overflow: 'auto', minHeight: 0 }}
          onMouseEnter={() => setIsHoveringMessages(true)}
          onMouseLeave={() => setIsHoveringMessages(false)}
        >
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

        {/* Links Drawer */}
        <SwipeableDrawer
          anchor="bottom"
          open={isDrawerOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          sx={{
            '& .MuiDrawer-paper': {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              padding: theme.spacing(2),
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
            }
          }}
        >
          {renderLinks()}
        </SwipeableDrawer>


        <Popper
          open={isHistoryOpen}
          anchorEl={historyButtonRef.current}
          placement="bottom-start"
          sx={{
            zIndex: 1200, // Ensure it appears above other elements
            width: '300px', // Adjust width as needed
            maxHeight: '400px', // Adjust max height as needed
            overflow: 'auto',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <Paper sx={{ p: 2 }}>
            <HistoryList histories={histories} onSelectSession={handleSelectSession} onDeleteSession={handleDeleteSession} llmType={llmRunnerType} currentSessionId={sessionId} />
          </Paper>
        </Popper>


        {/* Chat Input */}
        <CardContent sx={{ pt: 1, pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Type a message..."
              value={currentMessage}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  (async () => {
                    try {
                      await sendMessage();
                    } catch (error) {
                      console.error('Error while sending message:', error);
                    }
                  })();
                }
              }}
              inputProps={{ maxLength: 10000 }}
              inputRef={chatInputRef}
              onMouseEnter={handleInputMouseEnter}
              sx={{
                flexGrow: 1,
                minWidth: { xs: '100%', sm: 0 },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexShrink: 0,
              }}
            >
              <IconButton
                color="primary"
                onClick={async () => {
                  try {
                    await sendMessage();
                  } catch (error) {
                    console.error('Error while sending message:', error);
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
              <IconButton
                color="secondary"
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                disabled={isProcessing}
              >
                <Badge color="secondary">
                  <Tooltip title={isRecording ? 'Stop Recording' : 'Start Recording'}>
                    {isRecording ? <MicOffIcon /> : <MicIcon />}
                  </Tooltip>
                </Badge>
              </IconButton>
              <IconButton
                onClick={() => stopLLM()}
                color="warning"
                disabled={!isLLMBusy || !isReady}
                sx={{
                  '&:hover': {
                    backgroundColor: 'warning.light',
                  }
                }}
              >
                <Badge color="warning">
                  <Tooltip title="Halt Assistant" TransitionComponent={Zoom}>
                    <StopIcon />
                  </Tooltip>
                </Badge>
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Message message={message} />
    </Box>
  );
};

export default ChatContent;

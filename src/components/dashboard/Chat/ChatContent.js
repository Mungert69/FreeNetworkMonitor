import React, { useState, useRef } from 'react';

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
import { Paper,Popper,Badge, Tooltip, Zoom, SwipeableDrawer, Grid, Card, CardContent, TextField, Button, IconButton, Typography, CircularProgress, List, ListItem, Box, useScrollTrigger } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Message from '../Message';
import HistoryList from "./HistoryList";
import MarkdownRenderer from '../MarkdownRenderer';
import MessageLine from '../MessageLine';
import useTheme from '@mui/material/styles/useTheme';
import styleObject from '../styleObject';
import useClasses from "../useClasses";
import './chat.css';


const ChatContent = ({
  loadWarning, llmRunnerType, isReady, isToggleDisabled, isDrawerOpen, toggleDrawer, setIsChatOpen,
  isExpanded, toggleExpand, resetSessionId, isMuted, toggleAudio, outputContainerRef, isProcessing,
  isLLMBusy, thinkingDots, isCallingFunction, callingFunctionMessage, showHelpMessage, isDashboard,
  helpMessage, histories, handleSelectSession, currentMessage, setCurrentMessage, sendMessage,
  isRecording, handleStartRecording, handleStopRecording, stopLLM, message, linkData,saveFeedback,
  toggleLlmRunnerType, llmFeedback, closeExpand, onHostLinkClick
}) => {
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
    
    const theme = useTheme();
      const classes = useClasses(styleObject(theme, null));
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const historyButtonRef = useRef(null);

  const toggleHistory = () => {
    setIsHistoryOpen((prev) => !prev);
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
                  <Tooltip title="Save" TransitionComponent={Zoom}>
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
                    <Tooltip title="Open Links" TransitionComponent={Zoom}>
                      <KeyboardArrowUpIcon />
                    </Tooltip>
                  </Badge>
                </IconButton>
              )}
              <IconButton onClick={() => setIsChatOpen(false)} color="secondary" >
                <Badge color="secondary">
                  <Tooltip title={"Hide Assistant"} TransitionComponent={Zoom}>
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
                color="error"
                sx={{
                  '&:hover': {
                    backgroundColor: 'error.light',
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
              <IconButton
                ref={historyButtonRef}
                onClick={toggleHistory}
                color="primary"
                aria-label="History"
              >
                <Badge color="secondary">
                  <Tooltip title="History" TransitionComponent={Zoom}>
                    <HistoryIcon />
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
        <CardContent sx={{ pt: 1, pb: 1 }}>
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
              <HistoryList histories={histories} onSelectSession={handleSelectSession} />
            </Paper>
          </Popper>

          <Grid container direction="row">
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
              />
            </Grid>
            <Grid item xs={1}>
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
            </Grid>
            <Grid item xs={1}>
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
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Message message={message} />
    </Box>
  );
};

export default ChatContent;
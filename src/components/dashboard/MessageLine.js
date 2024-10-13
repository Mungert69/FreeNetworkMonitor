import React from 'react';
import { Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CodeIcon from '@mui/icons-material/Code';
import ReplyIcon from '@mui/icons-material/Reply';
import MarkdownRenderer from './MarkdownRenderer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MessageLine = React.memo(({ line, lineType }) => {
  if (lineType === 'User') {
    return (
      <Typography component="div" sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
        <PersonIcon sx={{ mr: 1 }} />
        <MarkdownRenderer content={line} />
      </Typography>
    );
  } else if (lineType === 'Assistant') {
    return (
      <Typography component="div" sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
        <SmartToyIcon sx={{ mr: 1 }} />
        <MarkdownRenderer content={line} />
      </Typography>
    );
  } else if (lineType === 'FunctionCall' || lineType === 'FunctionResponse') {
    const isCall = lineType === 'FunctionCall';
    return (
      <Accordion sx={{ mt: 1, mb: 1 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography sx={{ display: 'flex', alignItems: 'center' }}>
            {isCall ? <CodeIcon sx={{ mr: 1 }} /> : <ReplyIcon sx={{ mr: 1 }} />}
            {isCall ? 'Function Call' : 'Function Response'}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <MarkdownRenderer content={line} />
        </AccordionDetails>
      </Accordion>
    );
  } else {
    return <MarkdownRenderer content={line} />;
  }
});

export default MessageLine;

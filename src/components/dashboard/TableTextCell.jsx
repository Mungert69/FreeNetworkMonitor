import React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// Keep the complete value available when the column is too narrow to show it.
export default function TableTextCell({ children, text = children }) {
  const title = text === null || text === undefined ? '' : String(text);
  return (
    <Tooltip title={title} enterDelay={350}>
      <Box component="span" sx={{ display: 'block', minWidth: 0, width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {children}
      </Box>
    </Tooltip>
  );
}

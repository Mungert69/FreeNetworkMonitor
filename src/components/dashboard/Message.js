import React from 'react';
import { SnackbarProvider, useSnackbar, closeSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const MessageBar = ({ message }) => {
  const { enqueueSnackbar } = useSnackbar();
  var severity = 'info';
  if (message.info === undefined && message.warning === undefined) {
    if (message.success === false) {
      severity = 'error';
    }
    else {
      severity = 'success';
    }
  }
  else if (message.warning !== undefined) severity = 'warning';

  enqueueSnackbar(message.text, {
    variant: severity,
    persist: message.persist,  // Control if the message should auto-hide
    autoHideDuration: message.persist ? null : 10000,  // Null for persistent messages
    anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
  });
};

export function Message({ message }) {
  if (message === undefined || message.info === 'init') {
    return null;
  }
  console.log('Message=' + JSON.stringify(message));
  return (
    <SnackbarProvider maxSnack={5} 
                      action={(key) => (
                        <IconButton
                          size="small"
                          aria-label="close"
                          color="inherit"
                          onClick={() => closeSnackbar(key)}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                      )}>
      <MessageBar message={message} />
    </SnackbarProvider>
  );
}

export default React.memo(Message);

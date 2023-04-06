import React, { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}
const MessageBar = ({ message}) => {
  const { enqueueSnackbar } = useSnackbar();
  var severity = 'info';
  if (message.info === undefined) {
    if (message.success === false) {
      severity = 'error';
    }
    else {
      severity = 'success';
    }
  }
  enqueueSnackbar(message.text, { variant: severity, autoHideDuration: 5000, anchorOrigin: { vertical: 'bottom', horizontal: 'center' } });
}
export function Message({message}) {
  if (message === undefined || message.info === 'init'  ) {
    return;
   }
  console.log('Message='+message);
  return (
    <SnackbarProvider maxSnack={5} >
      <MessageBar message={message} />
    </SnackbarProvider>
  );
}

export default React.memo(Message);

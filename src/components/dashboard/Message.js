import { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert';

const Message = ({ message, setShow }) => {

  // On componentDidMount set the timer
  useEffect(() => {
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setShow(false)
    }, 3000)

    return () => {
      clearTimeout(timeId)
    }
  }, []);

  var severity = 'info';
  if (message.info==null){
    if(message.success==false){
      severity = 'error';
    }
    else{
      severity = 'success';
    }
  }
    
  return (
      <Alert severity={severity}>{message.text}</Alert> 
  )
}


export default Message;
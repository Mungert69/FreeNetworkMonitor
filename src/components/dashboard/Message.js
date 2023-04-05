import {  useEffect } from 'react'
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Message = ({ message, setShow }) => {

  // On componentDidMount set the timer
  useEffect(() => {
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setShow(false)
    }, 4000)

    return () => {
      clearTimeout(timeId)
    }
  }, []);

  if (message===undefined) {
    message={info : undefined, success : false, text : "Interal Error"}
  }

  var severity = 'info';
  if ( message.info===undefined){
    if(message.success===false){
      severity = 'error';
    }
    else{
      severity = 'success';
    }
  }
    
  return (
    <Snackbar open={true} autoHideDuration={10000} >
  <Alert severity={severity}>{message.text}</Alert> 
</Snackbar>
      
  )
}


export default Message;
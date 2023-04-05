import React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Profile from './Profile'; 
import StripeCheckOut from '../main/StripeCheckout'; 
import Message from './Message';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(5),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));



const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle {...other}>
      {children}
     
    </DialogTitle>
  );
};

export default function ProfileDialog({ setOpen, apiUser, token,siteId, initViewSub, setInitViewSub }) {
  const open = true;
  const [message, setMessage] = React.useState({ info: 'init' });


  const handleSubscription = () => {
    setMessage({ info: 'init' });
    setInitViewSub(!initViewSub);
  };

  const handleClose = () => {
    setMessage({ info: 'init' });
    setOpen(false);
  };

  return (
    <div>
       
      <BootstrapDialog
        onClose={handleClose}
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        </BootstrapDialogTitle>
        <DialogContent >
        <Message  message={message} /> 
          {initViewSub ?
          <StripeCheckOut apiUser={apiUser} token={token} siteId={siteId}/>
          :
           <Profile setMessage={setMessage} apiUser={apiUser} token={token} siteId={siteId}/>
       
          }
        </DialogContent>
        <DialogActions>
         
          <Button  onClick={handleSubscription}>
            {initViewSub ? <span>View Profile</span>:<span>View Subscription</span>}
          </Button>

          <Button autoFocus onClick={handleClose}>
            Close
          </Button>

        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

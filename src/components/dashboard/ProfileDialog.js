import React, {useEffect} from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Profile from './Profile'; 
import StripeCheckOut from '../main/StripeCheckout'; 


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

export  function ProfileDialog({ setOpen, apiUser,siteId, initViewSub, setInitViewSub }) {
  const open = true;
  


  const handleSubscription = () => {

    setInitViewSub(!initViewSub);
  };

  const handleClose = () => {

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

          {initViewSub ?
          <StripeCheckOut apiUser={apiUser}  siteId={siteId}/>
          :
           <Profile  apiUser={apiUser}  siteId={siteId}/>
       
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
export default React.memo(ProfileDialog);
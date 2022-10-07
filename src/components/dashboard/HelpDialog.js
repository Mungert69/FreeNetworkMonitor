import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/Help';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));



const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function HelpDialog({ setOpen }) {
  const open = true;


  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Edit Host List Help
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Click on a field to edit it. When done editing fields click on the save button <SaveIcon />.
          </Typography>
          <Typography gutterBottom>
            Delete a host by first clicking on the host address then clicking on the delete button <DeleteIcon />.
          </Typography>
          <Typography gutterBottom>
            Add a new host by clicking on the add button <AddIcon />.
            It will add a default host address 1.1.1.1 ,
            End Point icmp with enabled set to false.
          </Typography>
          <Typography gutterBottom>
            { }
          </Typography>
          <Typography gutterBottom>
            When finished Editing click on the Edit host list button <EditIcon /> on right of the top bar .
          </Typography>
          <Typography gutterBottom>
            { }
          </Typography>

          <Typography gutterBottom>
            Address : Valid values are ipv4 addresses, http or https urls.
            For example http://www.google.com , https://www.google.com or 8.8.8.8
          </Typography>
          <Typography gutterBottom>
            Endpoint : Valid values are http for website monitoring and icmp for ping monitoring.
          </Typography>
          <Typography gutterBottom>
            Timeout : Valid values are integers. The value is in milliseconds.
            For example 1000 for 1 second.
          </Typography>
          <Typography gutterBottom>
            Enabled : Valid values are true or false. If true, the host will be monitored. If false, the host will be ignored.
          </Typography>
          <Typography gutterBottom>
            { }
          </Typography>

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Back
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

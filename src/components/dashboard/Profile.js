import React, { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {
  Button,
  Card,
  Checkbox,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  TextField,
  FormGroup,
  FormLabel,
  FormHelperText,
  FormControlLabel,
  Typography,
  colors
} from "@mui/material";
import Message from './Message';
import Snackbar from '@mui/material/Snackbar';

import { updateApiUser, resendVerifyEmail, handleDownload } from './ServiceAPI';



const Profile = ({ apiUser, siteId }) => {

  const [state, setState] = React.useState({
    name: apiUser.name, picture: apiUser.picture
  });
  const [disableEmail, setDisableEmail] = React.useState(apiUser.disableEmail);
  const [message, setMessage] = React.useState({ info: 'init' });
  const [downloadLink, setDownloadLink] = useState(null);
  const [open, setOpen] = useState(false);
  const { name, picture } = state;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setState({
      name: apiUser.name,
      picture: apiUser.picture
    });
    setDisableEmail(apiUser.disableEmail);
  }, [apiUser]);
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    const user = apiUser;
    user.name = name;
    user.picture = picture;
    user.disableEmail = disableEmail;
    var message = { text: 'Plesae wait. Saving can take up to one minute..', info: false };
    await setMessage(message);
    message = await updateApiUser(siteId, user);
    await setMessage(message);

  }

  const handleSubmitVerifyEmail = async () => {
    const user = apiUser;
    user.name = name;
    var message = { text: 'Verfication email sent please check you inbox.', info: false };
    await setMessage(message);
    message = await resendVerifyEmail(siteId, user);
    await setMessage(message);

  }

  const handleChangeText = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  const handleChangePicture = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };
  const handleChangeBool = (event) => {
    setDisableEmail(event.target.checked);
  };


  return (
    <>
      <Message message={message} />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Download Ready"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your file is ready to download. Click the link below to start the download.
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button href={downloadLink} target="_blank" rel="noopener noreferrer" color="primary">
              Download File
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <FormLabel component="legend">View and update your profile</FormLabel>

      <Card >

        <CardHeader />
        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={!name ? "Edit your name" : ""}
                label="Name"
                name="name"
                required
                value={name}
                variant="outlined"
                onChange={handleChangeText}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText={!picture ? "Edit your Picture Url" : ""}
                label="Picture Url"
                name="picture"
                value={picture}
                variant="outlined"
                onChange={handleChangePicture}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              {apiUser.email_verified ? <FormControlLabel sx={{ display: 'flex', alignItems: 'center' }}
                align='center'
                control={
                  <Checkbox icon={<NotificationsActiveIcon />}
                    checkedIcon={<NotificationsOffIcon />} checked={disableEmail} onChange={handleChangeBool} />
                }
                label="Send email notifications"

              /> : <Button
                type="submit"
                variant="contained"
                onClick={handleSubmitVerifyEmail}
              >
                Resend verification email
              </Button>}

            </Grid>


            <Grid item md={9} xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                value={apiUser.email}
                variant="outlined"
                disabled={true}
              />
            </Grid>

            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                label="Email Verified"
                value={apiUser.email_verified}
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={9} xs={12}>
              <TextField
                fullWidth
                label="User ID"
                value={apiUser.userID}
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                label=" Account Type"
                value={apiUser.accountType}
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={9} xs={12}>
              <TextField
                fullWidth
                label="Logon Server"
                value={apiUser.logonServer}
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <TextField
                fullWidth
                label="Host Limit"
                value={apiUser.hostLimit}
                variant="outlined"
                disabled={true}
              />
            </Grid>

          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={6}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                type="button"
                variant="contained"
                onClick={() => handleDownload(siteId, setMessage, setDownloadLink, setOpen, setIsLoading)}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Generate Data Download'}
              </Button>
            </Grid>
          </Grid></CardActions>
      </Card>
    </>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
  apiUser: PropTypes.object.isRequired
};

export default React.memo(Profile);

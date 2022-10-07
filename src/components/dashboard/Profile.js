import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
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

import { updateApiUser } from './ServiceAPI';
import Message from './Message';


const Profile = ({ apiUser, token, siteId }) => {

  const [state, setState] = React.useState({
    
    name: apiUser.nickname,
  });
  const [disableEmail, setDisableEmail]=React.useState(apiUser.disableEmail);
  const [showMessage, setShowMessage] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const { name } = state;


  const handleSubmit = async () => {
    const user = apiUser;
    user.nickname = name;
    user.disableEmail = disableEmail;
    var message = { text: 'Plesae wait. Saving can take up to one minute..', info: false };
    await setMessage(message);
    await setShowMessage(true);
    message = await updateApiUser(siteId, user, token);
    await setMessage(message);
    await setShowMessage(true);

  }

  const handleChangeText = (event) => {
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
      {showMessage ? <Message setShow={setShowMessage} message={message} /> : <FormLabel component="legend">View and update your profile</FormLabel>}
    
        <Card >

          <CardHeader  />
          <Divider />
          <CardContent>
            <Grid container spacing={4}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  helperText="Edit your name"
                  label="Name"
                  name="Name"
                  required
                  value={name}
                  variant="outlined"
                  onChange={handleChangeText}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControlLabel sx={{ display: 'flex', alignItems: 'center' }}
                align='center'
                  control={
                    <Checkbox  icon={<NotificationsActiveIcon />}
                    checkedIcon={<NotificationsOffIcon />} checked={disableEmail} onChange={handleChangeBool} />
                  }
                  label="Send email notifications"
                />

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
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </CardActions>
        </Card>
    </>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
  apiUser: PropTypes.object.isRequired
};

export default Profile;

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

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
  FormLabel,
  FormControlLabel,
  Typography,
  IconButton,
  Popover,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment
} from "@mui/material";

import Message from './Message';
import PasskeyManager from './PasskeyManager';
import { updateApiUser, resendVerifyEmail, handleDownload } from './ServiceAPI';

const Profile = ({ apiUser, siteId, getUserInfo }) => {
  const [state, setState] = React.useState({ name: apiUser.name, picture: apiUser.picture });
  const [disableEmail, setDisableEmail] = React.useState(apiUser.disableEmail);
  const [message, setMessage] = React.useState({ info: 'init' });
  const [downloadLink, setDownloadLink] = useState(null);
  const [open, setOpen] = useState(false);
  const { name, picture } = state;
  const [isLoading, setIsLoading] = useState(false);

  // Email Verified popover
  const [anchorEl, setAnchorEl] = useState(null);
  const handleHelpClick = (event) => setAnchorEl(event.currentTarget);
  const handleHelpClose = () => setAnchorEl(null);
  const helpOpen = Boolean(anchorEl);

  useEffect(() => {
    setState({ name: apiUser.name, picture: apiUser.picture });
    setDisableEmail(apiUser.disableEmail);
  }, [apiUser]);

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    const user = { ...apiUser, name, picture, disableEmail };
    let msg = { text: 'Please wait. Saving can take up to one minute…', info: false };
    setMessage(msg);
    msg = await updateApiUser(siteId, user);
    await getUserInfo();
    setMessage(msg);
  };

  const handleSubmitVerifyEmail = async () => {
    const user = { ...apiUser, name };
    let msg = { text: 'Verification email sent. Please check your inbox.', info: false };
    setMessage(msg);
    msg = await resendVerifyEmail(siteId, user);
    setMessage(msg);
  };

  const handleChangeText = (e) => setState({ ...state, [e.target.name]: e.target.value });
  const handleChangePicture = (e) => setState({ ...state, [e.target.name]: e.target.value });
  const handleChangeBool = (e) => setDisableEmail(e.target.checked);

  // Desktop column widths
  const LONG = 8;
  const SHORT = 4;

  // Long fields wrap (no inner scrollbars)
  const longFieldSx = {
    '& .MuiInputBase-input': {
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere',
      wordBreak: 'break-word',
    },
  };

  return (
    <>
      <Message message={message} />

      {/* Download dialog (unchanged) */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Download Ready</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your file is ready to download. Click the link below to start the download.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button href={downloadLink} target="_blank" rel="noopener noreferrer" color="primary">
            Download File
          </Button>
        </DialogActions>
      </Dialog>

      <FormLabel component="legend" sx={{ display: 'block', mb: 1 }}>
        View and update your profile
      </FormLabel>

      {/* Fill parent dialog width */}
      <Card sx={{ width: '100%' }}>
        <CardHeader />
        <Divider />
        <CardContent>
          <Grid
            container
            columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}
            spacing={3}
            alignItems="flex-start"
            sx={{ width: '100%' }}
          >
            {/* Row 1: short + long */}
            <Grid item xs={12} md={SHORT}>
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
            <Grid item xs={12} md={LONG}>
              <TextField
                fullWidth
                helperText={!picture ? "Edit your Picture Url" : ""}
                label="Picture Url"
                name="picture"
                value={picture}
                variant="outlined"
                onChange={handleChangePicture}
                multiline
                minRows={2}
                sx={longFieldSx}
              />
            </Grid>

            {/* Row 2: long + short */}
            <Grid item xs={12} md={LONG}>
              <TextField
                fullWidth
                label="Email Address"
                value={apiUser.email}
                variant="outlined"
                disabled
                multiline
                minRows={2}
                sx={longFieldSx}
              />
            </Grid>
            <Grid item xs={12} md={SHORT}>
              <TextField
                fullWidth
                label="Email Verified"
                value={apiUser.email_verified ? "Yes" : "No"}
                variant="outlined"
                disabled
                error={!apiUser.email_verified}
                InputProps={{
                  endAdornment: !apiUser.email_verified ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Why verify email?"
                        onClick={handleHelpClick}
                        edge="end"
                        size="small"
                      >
                        <HelpOutlineIcon color="error" />
                      </IconButton>
                    </InputAdornment>
                  ) : null
                }}
                sx={(theme) =>
                  !apiUser.email_verified
                    ? {
                        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                          borderColor: theme.palette.error.main,
                        },
                        '& .MuiInputLabel-root': { color: theme.palette.error.main },
                        '& .MuiInputBase-input.Mui-disabled': {
                          WebkitTextFillColor: theme.palette.error.main,
                        },
                      }
                    : {}
                }
              />
              <Popover
                open={helpOpen}
                anchorEl={anchorEl}
                onClose={handleHelpClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Typography sx={{ p: 2, maxWidth: 260 }}>
                  You must verify your email to receive alerts.
                </Typography>
              </Popover>
            </Grid>

            {/* Row 3: long + short */}
            <Grid item xs={12} md={LONG}>
              <TextField
                fullWidth
                label="User ID"
                value={apiUser.userID}
                variant="outlined"
                disabled
                multiline
                minRows={2}
                sx={longFieldSx}
              />
            </Grid>
            <Grid item xs={12} md={SHORT}>
              <TextField
                fullWidth
                label="Account Type"
                value={apiUser.accountType}
                variant="outlined"
                disabled
              />
            </Grid>

            {/* Row 4: long + short (toggle / action) */}
            <Grid item xs={12} md={LONG}>
              <TextField
                fullWidth
                label="Logon Server"
                value={apiUser.logonServer}
                variant="outlined"
                disabled
                multiline
                minRows={2}
                sx={longFieldSx}
              />
            </Grid>
            <Grid item xs={12} md={SHORT} sx={{ display: 'flex', alignItems: 'center' }}>
              {apiUser.email_verified ? (
                <FormControlLabel
                  sx={{ mt: { xs: 0.5, md: 0.5 } }}
                  control={
                    <Checkbox
                      icon={<NotificationsActiveIcon />}
                      checkedIcon={<NotificationsOffIcon />}
                      checked={disableEmail}
                      onChange={handleChangeBool}
                    />
                  }
                  label="Send email notifications"
                />
              ) : (
                <Button
                  type="button"
                  variant="contained"
                  color="warning"
                  onClick={handleSubmitVerifyEmail}
                  fullWidth
                >
                  Resend verification email
                </Button>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />
          <PasskeyManager siteId={siteId} />
        </CardContent>

        <Divider />
        <CardActions>
          <Grid container spacing={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{ width: '100%' }}>
            <Grid item xs={12} md={6}>
              <Button fullWidth type="submit" variant="contained" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
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
          </Grid>
        </CardActions>
      </Card>
    </>
  );
};

Profile.propTypes = {
  className: PropTypes.string,
  apiUser: PropTypes.object.isRequired
};

export default React.memo(Profile);

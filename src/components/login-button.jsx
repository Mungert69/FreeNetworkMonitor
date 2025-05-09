import React from "react";
import Button from "@mui/material/Button";
import LoginIcon from '@mui/icons-material/Login';
import { useFusionAuth } from '@fusionauth/react-sdk';
import ReactGA4 from 'react-ga4';
import FadeWrapper from './dashboard/FadeWrapper';

const LoginButton = ({ loginText, openInNewTab = false }) => {
  const { startLogin } = useFusionAuth();

  const handleLogin = () => {
    if (openInNewTab) {
      window.open('/start-login-proxy', '_blank', 'noopener,noreferrer');
    } else {
      startLogin();
    }

  }
  return (
    <FadeWrapper toggle={true}>
      <Button variant="contained" color="primary" endIcon={<LoginIcon />}
        onClick={() => handleLogin()}
      >{loginText}</Button>
    </FadeWrapper>
  );
};

export default React.memo(LoginButton);
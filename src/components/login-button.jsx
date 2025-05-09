import React from "react";
import Button from "@mui/material/Button";
import LoginIcon from '@mui/icons-material/Login';
import { useFusionAuth } from '@fusionauth/react-sdk';
import FadeWrapper from './dashboard/FadeWrapper';
import { getClientId, getRedirectUri, getServerUrl } from './dashboard/ServiceAPI';

const LoginButton = ({ loginText = "Login", openInNewTab = false, redirectUrl = "" }) => {
  const handleLoginClick = () => {
    let finalRedirectUri;

    if (!redirectUrl) {
      finalRedirectUri = getRedirectUri();
    } else {
      const baseRedirectUri = getRedirectUri();
      // Replace last path segment
      try {
        const url = new URL(baseRedirectUri);
        const parts = url.pathname.split('/');

        // Remove the last path segment
        parts.pop();

        // Append the custom redirectUrl, ensuring no extra '/'
        const newRedirectUri = redirectUrl.startsWith('/') ? redirectUrl.substring(1) : redirectUrl; // Remove leading '/' from redirectUrl if present
        parts.push(newRedirectUri); // Add the custom one

        // Join the path parts correctly
        url.pathname = parts.join('/');
        finalRedirectUri = url.toString();
      } catch (e) {
        console.error("Invalid base redirect URI:", baseRedirectUri, e);
        return;
      }

    }

    const loginUrl = `${getServerUrl()}/oauth2/authorize?client_id=${encodeURIComponent(getClientId())}&redirect_uri=${encodeURIComponent(finalRedirectUri)}&response_type=code&scope=openid offline_access`;

    if (openInNewTab) {
      window.open(loginUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = loginUrl;
    }
  };

  return (
    <FadeWrapper toggle={true}>
      <Button variant="contained" color="primary" endIcon={<LoginIcon />}
        onClick={handleLoginClick}
      >{loginText}</Button>
    </FadeWrapper>
  );
};

export default React.memo(LoginButton);

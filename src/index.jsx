import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import { FusionAuthProvider } from '@fusionauth/react-sdk';
import ApplicationTheme from './theme/ApplicationTheme';
import { getClientId, getServerUrl, getRedirectUri } from './components/dashboard/ServiceAPI';
import { StyledEngineProvider } from '@mui/material/styles';

const root = ReactDOM.createRoot(document.getElementById("root"));
const config = {
  clientId: getClientId(),
  redirectUri: getRedirectUri(),
  serverUrl: getServerUrl(),
  shouldAutoFetchUserInfo: true,
  shouldAutoRefresh: true,
};

root.render(
  <Router>
    <FusionAuthProvider {...config}>
      <StyledEngineProvider injectFirst>
        <ApplicationTheme>
          <App />
        </ApplicationTheme>
      </StyledEngineProvider>
    </FusionAuthProvider>
  </Router>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import { FusionAuthProvider } from '@fusionauth/react-sdk';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getClientId, getServerUrl, getRedirectUri } from './components/dashboard/ServiceAPI';

const theme = createTheme({
  spacing: (factor) => `${0.25 * factor}rem`,
  palette: {
    primary: { main: '#607466' },
    secondary: { main: '#6239AB' },
    error: { main: '#eb5160' },
    warning: { main: '#d4a10d' },
  },
});

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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </FusionAuthProvider>
  </Router>
);


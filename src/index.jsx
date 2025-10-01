import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import { FusionAuthProvider } from '@fusionauth/react-sdk';
import CssBaseline from '@mui/material/CssBaseline';
import { getClientId, getServerUrl, getRedirectUri } from './components/dashboard/ServiceAPI';
import { ThemeProvider, StyledEngineProvider, createTheme, lighten, darken } from '@mui/material/styles';

// brand colors
const PRIMARY_MAIN = '#607466';   // muted green/teal
const SECONDARY_MAIN = '#6239AB'; // purple

const theme = createTheme({
  spacing: (factor) => `${0.25 * factor}rem`,
  palette: {
    primary: {
      main: PRIMARY_MAIN,
      light: lighten(PRIMARY_MAIN, 0.18),
      dark: darken(PRIMARY_MAIN, 0.18),
      contrastText: '#fff',
    },
    secondary: {
      main: SECONDARY_MAIN,
      light: lighten(SECONDARY_MAIN, 0.18),
      dark: darken(SECONDARY_MAIN, 0.18),
      contrastText: '#fff',
    },
    error:   { main: '#eb5160' },
    warning: { main: '#d4a10d' },
  },
  components: {
    MuiGrid: {
      defaultProps: {
        disableEqualOverflow: true,
      },
    },
  },
}); // ← you were missing this closing brace & paren

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

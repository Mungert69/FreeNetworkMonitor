import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import { FusionAuthProvider } from '@fusionauth/react-sdk';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import reportWebVitals from './reportWebVitals';
import { getClientId, getServerUrl, getRedirectUri } from './components/dashboard/ServiceAPI';
import CssBaseline from '@mui/material/CssBaseline';


const theme = createTheme(
  {
    spacing: (factor) => `${0.25 * factor}rem`,
    palette: {
      primary: {
        main: '#607466',
      },
      secondary: {
        main: '#6239AB',
      },
      error: {
        main: '#eb5160',
      },

    },
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

  <Router>
    <FusionAuthProvider
      clientID={getClientId()}
      serverUrl={getServerUrl()}
      redirectUri={getRedirectUri()}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
        <CssBaseline />
          <App />
        </ThemeProvider>
      </StyledEngineProvider>;
    </FusionAuthProvider>

  </Router>
);
reportWebVitals();

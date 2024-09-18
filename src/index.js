import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import { FusionAuthProvider ,FusionAuthProviderConfig} from '@fusionauth/react-sdk';
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
      warning: {
        main: '#d4a10d',
      },

    },
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
const config: FusionAuthProviderConfig = {
  clientId: getClientId(), // Your app's FusionAuth client id
  redirectUri: getRedirectUri(), // The URI that the user is directed to after the login/register/logout action
  serverUrl: getServerUrl(), // The url of the server that performs the token exchange
  shouldAutoFetchUserInfo: true, // Automatically fetch userInfo when logged in. Defaults to false.
  shouldAutoRefresh: true, // Enables automatic token refresh. Defaults to false.
   };
root.render(
  
  <Router>
     <FusionAuthProvider {...config}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
        <CssBaseline />
          <App />
        </ThemeProvider>
      </StyledEngineProvider>;
    </FusionAuthProvider>

  </Router>
);
//reportWebVitals();

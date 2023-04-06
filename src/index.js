import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import Auth0ProviderWithHistory from "./auth/auth0-provider-with-history";
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';


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
    <Auth0ProviderWithHistory>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>      <App /></ThemeProvider>
    </StyledEngineProvider>;

    </Auth0ProviderWithHistory>
  </Router>
);

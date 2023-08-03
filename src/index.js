import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import { FusionAuthProvider } from '@fusionauth/react-sdk';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles';
import reportWebVitals from './reportWebVitals';


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
      clientID="e9fdb985-9173-4e01-9d73-ac2d60d1dc8e"
      serverUrl="http://localhost:9011"
      redirectUri="http://localhost:5173"
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>      <App /></ThemeProvider>
      </StyledEngineProvider>;
    </FusionAuthProvider>

  </Router>
);
reportWebVitals();

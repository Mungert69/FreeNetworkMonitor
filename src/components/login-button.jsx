import React from "react";
import Button from "@mui/material/Button";
import LoginIcon from '@mui/icons-material/Login';
import { FusionAuthLoginButton } from '@fusionauth/react-sdk';
import FadeWrapper from './dashboard/FadeWrapper';
import styled from 'styled-components';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a theme to ensure MUI font is applied globally
const theme = createTheme({
  typography: {
    fontFamily: [
      '"Roboto"',
      '"Helvetica"',
      '"Arial"',
      'sans-serif'
    ].join(','),
  },
});

// Styled wrapper with fixed icon display and proper MUI font
const StyledFusionAuthButton = styled.div`
  && {
    /* Force MUI font */
    font-family: "Roboto", "Helvetica", "Arial", sans-serif !important;
    
    button {
      background-color: #607466 !important;
      color: white !important;
      padding: 6px 16px !important;
      border-radius: 4px !important;
      border: none !important;
      font-size: 0.875rem !important;
      font-weight: 500 !important;
      text-transform: uppercase !important;
      cursor: pointer !important;
      box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 
                  0px 2px 2px 0px rgba(0,0,0,0.14), 
                  0px 1px 5px 0px rgba(0,0,0,0.12) !important;
      transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    button:hover {
      background-color: #4a5c55 !important;
      box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2),
                  0px 4px 5px 0px rgba(0,0,0,0.14),
                  0px 1px 10px 0px rgba(0,0,0,0.12) !important;
    }

    /* Fix for icon display */
    svg {
      display: inline-block !important;
      margin-left: 8px !important;
      width: 1em !important;
      height: 1em !important;
      font-size: 1.25rem !important;
    }
  }
`;

const LoginButton = ({ loginText = "Login" }) => {
  return (
    <ThemeProvider theme={theme}>
      <FadeWrapper toggle={true}>
        <StyledFusionAuthButton>
          <FusionAuthLoginButton/>
           
        </StyledFusionAuthButton>
      </FadeWrapper>
    </ThemeProvider>
  );
};

export default React.memo(LoginButton);
import React from "react";
import Button from "@mui/material/Button";
import LoginIcon from '@mui/icons-material/Login';
import { useAuth0 } from "@auth0/auth0-react";
import ReactGA4 from 'react-ga4';

const LoginButton = ({loginText, fullLength}) => {
  const { loginWithRedirect } = useAuth0();
  const login = async () =>{
    var path=window.location.pathname;

      await loginWithRedirect({
        appState: {
          returnTo: '/Dashboard'
        }
      });
      ReactGA4.event({
        category: 'User',
        action: 'Login Clicked'
      });
      
  }
  return (
    <Button fullLength variant="contained" color="primary" endIcon={ <LoginIcon />}
      onClick={() => login()}
    >{loginText}</Button>
  );
};

export default LoginButton;

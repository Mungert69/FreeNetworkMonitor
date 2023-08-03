import React from "react";
import Button from "@mui/material/Button";
import LoginIcon from '@mui/icons-material/Login';
import {useFusionAuth} from '@fusionauth/react-sdk';
import ReactGA4 from 'react-ga4';
import FadeWrapper from './dashboard/FadeWrapper';

const LoginButton = ({loginText, fullLength, redirectUrl}) => {
  const { login } = useFusionAuth();
 
  return (
    <FadeWrapper toggle={true}>
    <Button  variant="contained" color="primary" endIcon={ <LoginIcon />}
      onClick={() => login()}
    >{loginText}</Button>
    </FadeWrapper>
  );
};

export default React.memo(LoginButton);

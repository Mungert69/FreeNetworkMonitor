import React from "react";

import LoginButton from "./login-button";
import LogoutButton from "./logout-button";

import {useFusionAuth} from '@fusionauth/react-sdk';

const AuthenticationButton = ({setUserId}) => {
  const { isAuthenticated } = useFusionAuth();

  return isAuthenticated ? <LogoutButton  /> : <LoginButton loginText={'Login'} redirectUrl={'/Dashboard'}/>;
};

export default React.memo(AuthenticationButton);

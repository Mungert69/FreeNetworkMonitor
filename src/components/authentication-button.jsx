import React from "react";

import LoginButton from "./login-button";
import LogoutButton from "./logout-button";

import {useFusionAuth} from '@fusionauth/react-sdk';

const AuthenticationButton = ({setUserId, openInNewTab=false}) => {
  const { isLoggedIn } = useFusionAuth();

  return isLoggedIn ? <LogoutButton  /> : <LoginButton loginText={'Login'} redirectUrl={'/Dashboard'} openInNewTab={openInNewTab}/>;
};

export default React.memo(AuthenticationButton);

import React from "react";

import LoginButton from "./login-button";
import LogoutButton from "./logout-button";

import { useAuth0 } from "@auth0/auth0-react";

const AuthenticationButton = ({setUserId}) => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <LogoutButton  /> : <LoginButton loginText={'Login'}/>;
};

export default AuthenticationButton;

import React from "react";
import AuthenticationButton from "./authentication-button";

const AuthNav = ({setUserId}) => (
  <div className="navbar-nav ml-auto">
    <AuthenticationButton  />
  </div>
);

export default AuthNav;

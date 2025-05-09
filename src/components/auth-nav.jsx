import React from "react";
import AuthenticationButton from "./authentication-button";

const AuthNav = ({openInNewTab=false}) => (
  <div className="navbar-nav ml-auto">
    <AuthenticationButton  openInNewTab={openInNewTab}/>
  </div>
);

export default React.memo(AuthNav);

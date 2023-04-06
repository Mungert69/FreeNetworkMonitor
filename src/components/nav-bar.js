import React from "react";

import MainNav from "./main-nav";
import AuthNav from "./auth-nav";

const NavBar = () => {
  return (
    <div >
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <div className="container">
          <div className="navbar-brand logo" />
          <MainNav />
          <AuthNav />
        </div>
      </nav>
    </div>
  );
};

export default React.memo(NavBar);

import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect, Router } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { Loading } from "./components";
import Dashboard from "./components/dashboard/Dashboard";
import Pricing from "./components/main/Pricing";
import Faq from "./components/main/Faq";
import ProductDetail from "./components/main/ProductDetail";
import CookieConsent, { Cookies } from "react-cookie-consent";
import { createBrowserHistory } from 'history'
import ReactGA4 from 'react-ga4';

const TRACKING_ID = "G-QZ49HV7DS2"; // OUR_TRACKING_ID
ReactGA4.initialize(TRACKING_ID, {
  gaOptions: {
    cookieFlags: 'SameSite=None;Secure',
    siteSpeedSampleRate: 50
  }
});
const browserHistory = createBrowserHistory()
browserHistory.listen((location, action) => {
  ReactGA4.send({ hitType: "pageview", page: window.location.pathname });

})



const App = () => {
  const { isLoading } = useAuth0();
  const [apiUser, setRootApiUser] = useState({});
  const [apiUserP, setApiUserP] = useState({});

  /*useEffect(() => {
    ReactGA4.send({ hitType: "pageview", page: window.location.pathname });
  }, []);*/


  const setApiUser =(apiUser) => {
    console.log('App setting root apiUser ');
    setRootApiUser(apiUser);
  }

  if (isLoading) {
    return <Loading small={true} />;
  }



  return (
    <div >
      <div >
        <CookieConsent
          location="bottom"
          buttonText="Agree"
          sameSite='none'
          cookieName="react-cookie-consent"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          expires={1500}
        >
          This website uses cookies to enhance the user experience.{" "}
          <span style={{ fontAweight: 'bold' }}>By clicking agree or continuing to use this site you agree to the use of cookies. For full cookie policy click <a href="https://www.freenetworkmonitor.click/cookiepolicy.html"> Cookie Policy</a>. To view our privacy policy click <a href="https://www.freenetworkmonitor.click/privacypolicy.html">Privacy Policy</a></span>
        </CookieConsent>
        <Switch>
          <Route exact path="/" >
            <ProductDetail />
          </Route>
          <Route exact path="/dashboard"  >
            <Dashboard apiUser={apiUser} setApiUser={setApiUser} />
          </Route>
          <Route exact path="/faq"  >
            <Faq/>
          </Route>
          <Route exact path="/subscription"  >
            <Pricing apiUser={apiUserP} />
          </Route>
          <Redirect to="/" />
        </Switch>
      </div>
    </div>
  );
};

export default  App;

import React, { lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { Loading } from "./components/loading";

import CookieConsent from "react-cookie-consent";
import { createBrowserHistory } from 'history'
import ReactGA4 from 'react-ga4';

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Pricing = lazy(() => import('./components/main/Pricing'));
const Faq = lazy(() => import('./components/main/Faq'));
const ProductDetail = lazy(() => import('./components/main/ProductDetail'));


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



  /*useEffect(() => {
    ReactGA4.send({ hitType: "pageview", page: window.location.pathname });
  }, []);*/



  if (false) {
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
            <Dashboard />
          </Route>
          <Route exact path="/faq"  >
            <Faq/>
          </Route>
          <Route exact path="/subscription"  >
            <Pricing />
          </Route>
          <Redirect to="/" />
        </Switch>
      </div>
    </div>
  );
};

export default  App;

import React, { lazy, Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { LoadingCircle } from "./loading-circle";
import CookieConsent from "react-cookie-consent";
import ReactGA4 from 'react-ga4';
import RouteChangeTracker from './route-change-tracker';

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



const App = () => {
  const renderLoader = () => <LoadingCircle indicatorSize={100} thickness={2} />;

  return (
    <div>
      <div>
        <CookieConsent
          location="bottom"
          buttonText="Agree"
          sameSite='lax'
          cookieName="react-cookie-consent"
          style={{ background: "#2B373B" }}
          buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
          expires={1500}
        >
          This website uses cookies to enhance the user experience.{" "}
          <span style={{ fontWeight: 'bold' }}>
            By clicking agree or continuing to use this site you agree to the use of cookies. 
            For full cookie policy click <a href="https://www.freenetworkmonitor.click/cookiepolicy.html">Cookie Policy</a>. 
            To view our privacy policy click <a href="https://www.freenetworkmonitor.click/privacypolicy.html">Privacy Policy</a>
          </span>
        </CookieConsent>
        <RouteChangeTracker />
       
        <Routes>
          <Route path="/blog" element={<Navigate to="/blog/index.html" replace />} />
          <Route exact path="/" element={
            <Suspense fallback={renderLoader()}>
              <ProductDetail />
            </Suspense>
          } />
          <Route exact path="/dashboard" element={
            <Suspense fallback={renderLoader()}>
              <Dashboard />
            </Suspense>
          } />
          <Route exact path="/faq" element={
            <Suspense fallback={renderLoader()}>
              <Faq />
            </Suspense>
          } />
          <Route exact path="/subscription" element={
            <Suspense fallback={renderLoader()}>
              <Pricing />
            </Suspense>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

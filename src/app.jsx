import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { LoadingCircle } from "./loading-circle";
import RouteChangeTracker from './route-change-tracker';
//import ReactGA4 from 'react-ga4';

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Pricing = lazy(() => import('./components/main/Pricing'));
const Faq = lazy(() => import('./components/main/Faq'));
const ProductDetail = lazy(() => import('./components/main/ProductDetail'));
const Download = lazy(() => import('./components/main/Download'));
const StartLoginProxy = lazy(() => import('./components/start-login-proxy'));

//const TRACKING_ID = "G-XXXXXXXXXX"; // Replace with your GA4 tracking ID
const isDevServerLabel = window?.serverLabel?.serverLabel === "dev";
const CONSENT_COOKIE_NAME = "react-cookie-consent";
const CONSENT_COOKIE_DAYS = 1500;

const getCookieValue = (cookieName) => {
  if (typeof document === 'undefined') return '';
  const escapedName = cookieName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
};

const setCookieValue = (cookieName, value, maxAgeDays) => {
  if (typeof document === 'undefined') return;
  const maxAgeSeconds = Math.max(0, Math.floor(maxAgeDays * 24 * 60 * 60));
  document.cookie = `${cookieName}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=None; Secure`;
};

const App = () => {

  const [consentGiven, setConsentGiven] = useState(() => getCookieValue(CONSENT_COOKIE_NAME) === 'true');

  // 1. Initialize GA4 immediately (but block cookies until consent)
  useEffect(() => {
    if (isDevServerLabel) return;

    /*ReactGA4.initialize(TRACKING_ID, {
      gaOptions: {
        cookieFlags: "SameSite=None;Secure",
        siteSpeedSampleRate: 100,
      },
    });*/

    // Deny cookies until user accepts
    window.gtag?.("consent", "default", {
      analytics_storage: "denied",
    });
  }, []);

  // 2. Handle cookie accept → grant consent and trigger initial pageview
  const handleAccept = () => {
    setCookieValue(CONSENT_COOKIE_NAME, 'true', CONSENT_COOKIE_DAYS);
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
    });

    /*ReactGA4.send({
      hitType: "pageview",
      page: window.location.pathname + window.location.search,
    });*/

    setConsentGiven(true);
  };

  const renderLoader = () => <LoadingCircle indicatorSize={100} thickness={2} />;


  return (
    <div>
      <div>
        {!consentGiven && (
          <div
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1500,
              background: "#2B373B",
              color: "#FFFFFF",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 500 }}>
              This website uses cookies to enhance the user experience.{" "}
              By clicking agree or continuing to use this site you agree to the use of cookies.
              For full cookie policy click{" "}
              <a
                href="/cookiepolicy.html"
                aria-label="Read our Cookie Policy (opens in a new tab)"
                title="Read our Cookie Policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#FFD700",
                  fontWeight: 700,
                  textDecoration: "underline",
                  backgroundColor: "transparent"
                }}
              >
                Cookie Policy
              </a>.
              To view our privacy policy click{" "}
              <a
                href="/privacypolicy.html"
                aria-label="Read our Privacy Policy (opens in a new tab)"
                title="Read our Privacy Policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#FFD700",
                  fontWeight: 700,
                  textDecoration: "underline",
                  backgroundColor: "transparent"
                }}
              >
                Privacy Policy
              </a>.
              To review acceptable use terms click{" "}
              <a
                href="/termofservice.html"
                aria-label="Read our Terms and Acceptable Use Policy (opens in a new tab)"
                title="Read our Terms and Acceptable Use Policy"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#FFD700",
                  fontWeight: 700,
                  textDecoration: "underline",
                  backgroundColor: "transparent"
                }}
              >
                Terms & AUP
              </a>.
            </span>
            <button
              type="button"
              onClick={handleAccept}
              style={{
                background: "#FFD700",
                color: "#2B373B",
                fontSize: "15px",
                fontWeight: 700,
                borderRadius: "4px",
                padding: "8px 22px",
                margin: "0 8px",
                border: "none",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                cursor: "pointer"
              }}
            >
              Agree
            </button>
          </div>
        )}
        {consentGiven && <RouteChangeTracker />}

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
          <Route exact path="/download" element={
            <Suspense fallback={renderLoader()}>
              <Download />
            </Suspense>
          } />
          <Route exact path="/start-login-proxy" element={<StartLoginProxy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

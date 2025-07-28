import React, { lazy, Suspense, useCallback, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { LoadingCircle } from "./loading-circle";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import RouteChangeTracker from './route-change-tracker';

const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Pricing = lazy(() => import('./components/main/Pricing'));
const Faq = lazy(() => import('./components/main/Faq'));
const ProductDetail = lazy(() => import('./components/main/ProductDetail'));
const Download = lazy(() => import('./components/main/Download'));
const StartLoginProxy = lazy(() => import('./components/start-login-proxy'));

const isDevServerLabel = window?.serverLabel?.serverLabel === 'dev';

const TRACKING_ID = "G-QZ49HV7DS2";

const loadGA4 = async () => {
  if (isDevServerLabel) return;

  // Inject GA4 script if not already present
  if (!document.querySelector(`script[src^="https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}"]`)) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);
  }

  // Wait for the script to load before initializing react-ga4
  const waitForScript = () =>
    new Promise((resolve) => {
      if (window.gtag) return resolve();
      const check = setInterval(() => {
        if (window.gtag) {
          clearInterval(check);
          resolve();
        }
      }, 50);
    });

  await waitForScript();

  const { default: ReactGA4 } = await import('react-ga4');
  ReactGA4.initialize(TRACKING_ID, {
    gaOptions: {
      cookieFlags: 'SameSite=None;Secure',
      siteSpeedSampleRate: 50
    }
  });
};

const App = () => {
  const renderLoader = () => <LoadingCircle indicatorSize={100} thickness={2} />;

  // Lazy-load GA4 only after consent
  const handleCookieAccept = useCallback(() => {
    loadGA4();
  }, []);

  // On mount, check if consent cookie is already set
  useEffect(() => {
    if (getCookieConsentValue() === "true") {
      loadGA4();
    }
  }, []);

  return (
    <div>
      <div>
        <CookieConsent
          location="bottom"
          buttonText="Agree"
          sameSite='lax'
          cookieName="react-cookie-consent"
          style={{ background: "#2B373B", color: "#FFFFFF" }}
          buttonStyle={{
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
          linkStyle={{ color: "#FFD700", textDecoration: "underline", fontWeight: 700 }}
          expires={1500}
          onAccept={handleCookieAccept}
        >
          <span style={{ fontWeight: 500 }}>
            This website uses cookies to enhance the user experience.{" "}
            By clicking agree or continuing to use this site you agree to the use of cookies. 
            For full cookie policy click{" "}
            <a
              href="https://readyforquantum.com/cookiepolicy.html"
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
              href="https://readyforquantum.com/privacypolicy.html"
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

// /start-login-proxy.tsx
import { useEffect } from "react";
import { startLogin } from '@fusionauth/react-sdk';

export default function StartLoginProxy() {
  useEffect(() => {
    startLogin();
  }, []);

  return <p>Redirecting to login...</p>;
}

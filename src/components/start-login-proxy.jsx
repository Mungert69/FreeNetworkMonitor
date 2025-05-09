// /start-login-proxy.tsx
import { useEffect } from "react";
import { useFusionAuth } from '@fusionauth/react-sdk';

export default function StartLoginProxy() {

  const { startLogin } = useFusionAuth();
  useEffect(() => {
    startLogin();
  }, []);

  return <p>Redirecting to login...</p>;
}

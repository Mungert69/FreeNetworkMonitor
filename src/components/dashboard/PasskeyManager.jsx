import React, { useState } from 'react';
import { useFusionAuth } from '@fusionauth/react-sdk';
import { getServerUrl, getClientId } from './ServiceAPI';  // <-- adjust import path as needed

function PasskeyManager() {
  const { userInfo } = useFusionAuth();
  const [status, setStatus] = useState("");

  // Helpers for base64url conversions
  const base64urlToArrayBuffer = (base64url) => {
    let padding = '='.repeat((4 - base64url.length % 4) % 4);
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/') + padding;
    let str = atob(base64);
    let bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
    return bytes.buffer;
  };

  const arrayBufferToBase64url = (buffer) => {
    let bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const registerPasskey = async () => {
    if (!userInfo) {
      setStatus("❌ No user logged in.");
      return;
    }

    setStatus("Starting passkey registration...");

    try {
      // FusionAuth API base
      const faUrl = getServerUrl(); // e.g. https://auth.readyforquantum.com:2096

      // Step 1: start registration
      const startResp = await fetch(`${faUrl}/api/webauthn/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // include FusionAuth session cookie
        body: JSON.stringify({
          userId: userInfo.sub,
          applicationId: getClientId(), 
          type: "registration"
        })
      });
      const startData = await startResp.json();

      startData.publicKey.challenge = base64urlToArrayBuffer(startData.publicKey.challenge);
      startData.publicKey.user.id = base64urlToArrayBuffer(startData.publicKey.user.id);

      // Step 2: Browser creates the credential
      const credential = await navigator.credentials.create({ publicKey: startData.publicKey });

      // Step 3: complete registration
      const completeResp = await fetch(`${faUrl}/api/webauthn/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userId: userInfo.sub,
          applicationId: getClientId(), 
          type: "registration",
          credential: {
            id: credential.id,
            rawId: arrayBufferToBase64url(credential.rawId),
            response: {
              attestationObject: arrayBufferToBase64url(credential.response.attestationObject),
              clientDataJSON: arrayBufferToBase64url(credential.response.clientDataJSON),
            },
            type: credential.type
          }
        })
      });

      if (completeResp.ok) {
        setStatus("✅ Passkey registered successfully!");
      } else {
        setStatus("❌ Failed: " + (await completeResp.text()));
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + err.message);
    }
  };

  return (
    <div>
      <h3>Manage Passkeys</h3>
      <button onClick={registerPasskey}>Register a New Passkey</button>
      <p>{status}</p>
    </div>
  );
}

export default PasskeyManager;

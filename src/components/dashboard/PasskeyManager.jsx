// PasskeyManager.jsx
import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useFusionAuth } from '@fusionauth/react-sdk';
import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  Alert,
  Tooltip,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getServerUrlFromSiteId } from './ServiceAPI';

function PasskeyManager({ siteId }) {
  const { userInfo } = useFusionAuth();

  const [status, setStatus] = useState(null); // { severity: 'success'|'error'|'info', message: string }
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(
    userInfo?.name || userInfo?.email || userInfo?.preferred_username || 'My Passkey'
  );

  // Use 0 when siteId is null/undefined
  const effectiveSiteId = useMemo(() => siteId ?? 0, [siteId]);

  const webAuthnSupported = useMemo(() => {
    return typeof window !== 'undefined' &&
           'PublicKeyCredential' in window &&
           typeof navigator?.credentials?.create === 'function';
  }, []);

  // ---- base64url helpers ----
  const base64urlToArrayBuffer = useCallback((base64url) => {
    const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
    const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/');
    const str = atob(base64);
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
    return bytes.buffer;
  }, []);

  const arrayBufferToBase64url = useCallback((buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }, []);

  const registerPasskey = useCallback(async () => {
    if (!userInfo) {
      setStatus({ severity: 'error', message: 'No user is logged in.' });
      return;
    }
    if (!webAuthnSupported) {
      setStatus({
        severity: 'error',
        message: 'WebAuthn is not supported in this browser/device.'
      });
      return;
    }

    setLoading(true);
    setStatus({ severity: 'info', message: 'Starting passkey registration…' });

    try {
      const backendBase = getServerUrlFromSiteId(effectiveSiteId);

      // 1) Start registration
      const startResp = await fetch(`${backendBase}/auth/webauthn/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: userInfo.sub,
          displayName: displayName?.trim() || 'My Passkey'
          // name: "MacBook Pro" // optional
        })
      });

      if (!startResp.ok) {
        const text = await startResp.text();
        throw new Error(`Start failed (${startResp.status}): ${text}`);
      }

      const startData = await startResp.json();
      const publicKey = startData.options || startData.publicKey || startData;
      if (!publicKey) throw new Error('Start response missing publicKey options');

      // Convert challenge/user.id/excludeCredentials[].id to ArrayBuffer
      publicKey.challenge = base64urlToArrayBuffer(publicKey.challenge);
      if (publicKey.user?.id) publicKey.user.id = base64urlToArrayBuffer(publicKey.user.id);
      if (Array.isArray(publicKey.excludeCredentials)) {
        publicKey.excludeCredentials = publicKey.excludeCredentials.map(c => ({
          ...c,
          id: base64urlToArrayBuffer(c.id),
        }));
      }

      // 2) Create passkey
      const credential = await navigator.credentials.create({ publicKey });
      if (!credential) throw new Error('navigator.credentials.create returned null');

      // 3) Complete registration
      const completePayload = {
        userId: userInfo.sub,
        credential: {
          id: credential.id,
          rawId: arrayBufferToBase64url(credential.rawId),
          type: credential.type,
          response: {
            attestationObject: arrayBufferToBase64url(credential.response.attestationObject),
            clientDataJSON:    arrayBufferToBase64url(credential.response.clientDataJSON),
          },
        },
      };

      const completeResp = await fetch(`${backendBase}/auth/webauthn/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(completePayload),
      });

      if (!completeResp.ok) {
        const text = await completeResp.text();
        throw new Error(`Complete failed (${completeResp.status}): ${text}`);
      }

      setStatus({ severity: 'success', message: 'Passkey registered successfully.' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      setStatus({ severity: 'error', message: err.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  }, [
    arrayBufferToBase64url,
    base64urlToArrayBuffer,
    displayName,
    effectiveSiteId,
    userInfo,
    webAuthnSupported
  ]);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SecurityIcon fontSize="small" />
          <Typography variant="h6">Manage your passkeys</Typography>
        </Stack>

        {!webAuthnSupported && (
          <Alert severity="warning" icon={<ErrorOutlineIcon />}>
            This browser/device doesn’t support WebAuthn. Try Chrome, Edge, or Safari on a modern OS.
          </Alert>
        )}

        <TextField
          label="Passkey display name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          fullWidth
          placeholder="e.g. MacBook Pro, iPhone, Work Laptop"
          size="small"
        />

        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title={webAuthnSupported ? '' : 'WebAuthn not supported'}>
            <span>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={18} /> : <AddTaskIcon />}
                onClick={registerPasskey}
                disabled={loading || !webAuthnSupported}
              >
                {loading ? 'Registering…' : 'Register a new passkey'}
              </Button>
            </span>
          </Tooltip>
        </Stack>

        {status && (
          <Alert
            severity={status.severity}
            iconMapping={{
              success: <CheckCircleIcon />,
              error: <ErrorOutlineIcon />,
              info: <SecurityIcon />,
              warning: <ErrorOutlineIcon />
            }}
          >
            {status.message}
          </Alert>
        )}

        <Divider />

        <Box>
          <Typography variant="body2" color="text.secondary">
            Tip: A passkey lets you sign in with your device biometrics (Touch ID, Face ID, Windows Hello)
            for phishing-resistant authentication.
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

PasskeyManager.propTypes = {
  siteId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default PasskeyManager;

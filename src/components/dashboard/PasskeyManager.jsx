// PasskeyManager.jsx
import React, { useCallback, useMemo, useState, useEffect } from 'react';
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
  Paper,
  IconButton
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getServerUrlFromSiteId } from './ServiceAPI';

function PasskeyManager({ siteId }) {
  const { userInfo } = useFusionAuth();

  const [status, setStatus] = useState(null); // { severity, message }
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [displayName, setDisplayName] = useState(
    userInfo?.name || userInfo?.email || userInfo?.preferred_username || 'My Passkey'
  );
  const [credentials, setCredentials] = useState([]); // server returns WebAuthnCredentialDetails[]

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

  const backendBase = useMemo(() => getServerUrlFromSiteId(effectiveSiteId), [effectiveSiteId]);
  const userId = userInfo?.sub;

  // ---- list / delete API calls ----
  const loadPasskeys = useCallback(async () => {
    if (!userId) return;
    setListLoading(true);
    try {
      const resp = await fetch(`${backendBase}/auth/webauthn/list/${userId}`, {
        method: 'GET',
        credentials: 'include'
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`List failed (${resp.status}): ${text}`);
      }
      const data = await resp.json();
      // data is WebAuthnCredentialDetails[] from server
      setCredentials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setStatus({ severity: 'error', message: err.message || 'Failed to load passkeys.' });
    } finally {
      setListLoading(false);
    }
  }, [backendBase, userId]);

  const deletePasskey = useCallback(async (credentialIdGuid) => {
    if (!userId || !credentialIdGuid) return;
    setDeletingId(credentialIdGuid);
    try {
      const resp = await fetch(`${backendBase}/auth/webauthn/delete/${userId}/${credentialIdGuid}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (resp.status === 404) {
        setStatus({ severity: 'warning', message: 'Passkey not found (already deleted?).' });
      } else if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Delete failed (${resp.status}): ${text}`);
      } else {
        setStatus({ severity: 'success', message: 'Passkey deleted.' });
        await loadPasskeys();
      }
    } catch (err) {
      console.error(err);
      setStatus({ severity: 'error', message: err.message || 'Failed to delete passkey.' });
    } finally {
      setDeletingId(null);
    }
  }, [backendBase, userId, loadPasskeys]);

  useEffect(() => {
    loadPasskeys();
  }, [loadPasskeys]);

  // ---- registration flow ----
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
      // 1) Start registration
      const startResp = await fetch(`${backendBase}/auth/webauthn/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: userId,
          displayName: displayName?.trim() || 'My Passkey'
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

      // Optional/Best-effort: extensions & transports
      const clientExtensionResults = credential.getClientExtensionResults?.() || undefined;
      // Try both: new spec has response.getTransports(), some impls have credential.getTransports()
      const transports =
        credential.response?.getTransports?.() ||
        credential.getTransports?.() ||
        undefined;

      // Ensure credProps.rk exists when we send extensions (prevents server null handling)
      if (clientExtensionResults && clientExtensionResults.credProps && typeof clientExtensionResults.credProps.rk !== 'boolean') {
        clientExtensionResults.credProps.rk = false;
      }

      // 3) Complete registration
      const completePayload = {
        userId: userId,
        credential: {
          id: credential.id,
          type: credential.type,
          response: {
            attestationObject: arrayBufferToBase64url(credential.response.attestationObject),
            clientDataJSON:    arrayBufferToBase64url(credential.response.clientDataJSON),
          },
          // Only include if present; backend already defaults extensions if null
          ...(clientExtensionResults ? { clientExtensionResults } : {}),
          ...(Array.isArray(transports) && transports.length ? { transports } : {})
        }
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
      await loadPasskeys();
    } catch (err) {
      console.error(err);
      setStatus({ severity: 'error', message: err.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  }, [
    arrayBufferToBase64url,
    base64urlToArrayBuffer,
    displayName,
    backendBase,
    userId,
    userInfo,
    webAuthnSupported,
    loadPasskeys
  ]);

  const truncate = (s, left = 8, right = 6) => {
    if (!s) return '';
    if (s.length <= left + right + 3) return s;
    return `${s.slice(0, left)}…${s.slice(-right)}`;
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <SecurityIcon fontSize="small" />
          <Typography variant="h6">Manage your passkeys</Typography>
          <Box flex={1} />
          <Tooltip title="Refresh list">
            <span>
              <IconButton onClick={loadPasskeys} disabled={listLoading}>
                {listLoading ? <CircularProgress size={18} /> : <RefreshIcon />}
              </IconButton>
            </span>
          </Tooltip>
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

        {/* List of existing passkeys */}
        <Stack spacing={1}>
          <Typography variant="subtitle1">Your passkeys</Typography>
          {credentials.length === 0 && !listLoading && (
            <Typography variant="body2" color="text.secondary">
              You don’t have any passkeys yet.
            </Typography>
          )}
          {credentials.map((c) => (
            <Paper key={c.id} variant="outlined" sx={{ p: 1.5 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {c.displayName || c.name || 'Unnamed passkey'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    RP: {c.relyingPartyId} • ID: {truncate(c.credentialId)}
                  </Typography>
                </Box>
                <Box flex={1} />
                <Tooltip title="Delete passkey">
                  <span>
                    <Button
                      size="small"
                      variant="text"
                      color="error"
                      startIcon={deletingId === c.id ? <CircularProgress size={16} /> : <DeleteOutlineIcon />}
                      onClick={() => deletePasskey(c.id)}
                      disabled={deletingId === c.id}
                    >
                      Delete
                    </Button>
                  </span>
                </Tooltip>
              </Stack>
            </Paper>
          ))}
        </Stack>

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

import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, CardHeader, Checkbox, FormControlLabel,
    MenuItem, Stack, TextField, Typography } from '@mui/material';
import { fetchUserProcessors, fetchFirmwareImages, requestFirmwareUpdate } from './ServiceAPI';

export default function DeviceFirmware({ siteId }) {
    const [processors, setProcessors] = useState([]);
    const [images, setImages] = useState([]);
    const [appID, setAppID] = useState('');
    const [digest, setDigest] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [reload, setReload] = useState(0);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        let active = true;
        setLoading(true); setAppID(''); setDigest(''); setConfirmed(false); setMessage(null);
        Promise.all([fetchUserProcessors(siteId), fetchFirmwareImages(siteId)])
            .then(([devices, releases]) => { if (active) { setProcessors(devices); setImages(releases); } })
            .catch(() => { if (active) { setProcessors([]); setImages([]); setMessage({ severity: 'error', text: 'Unable to load devices or firmware. Please try again.' }); } })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [siteId, reload]);
    const device = processors.find(p => p.appID === appID);
    const image = images.find(i => i.sha256 === digest);
    const eligible = device?.isEnabled && device?.pType === 'ESP32-S3' && device?.rabbitTopologyVersion === 2;
    const eligibilityMessage = !device?.isEnabled ? 'This processor is disabled.'
        : !device?.pType ? 'This processor has not reported its device type. Update its firmware to report ESP32-S3.'
        : device.pType !== 'ESP32-S3' ? 'These firmware images are only for ESP32-S3 processors.'
        : 'This processor does not use command protocol v2.';
    const install = async () => {
        if (busy || !eligible || !image || !confirmed) return;
        setBusy(true); setMessage(null);
        try {
            const result = await requestFirmwareUpdate(siteId, appID, image);
            setMessage({ severity: 'info', text: `Update requested (${result.requestId}). This confirms the request was queued, not that installation completed.` });
            setConfirmed(false);
        } catch {
            setMessage({ severity: 'error', text: 'The update could not be confirmed. Check device status before retrying; the request may already have been queued.' });
        } finally { setBusy(false); }
    };
    return <Card sx={{ mt: 3 }}>
        <CardHeader title="Device firmware" subheader="Install an ESP32-S3 firmware release on one of your devices" />
        <CardContent><Stack spacing={2}>
            {message && <Alert severity={message.severity}>{message.text}</Alert>}
            <Typography variant="body2">You can select an older or newer release. Keep the device powered and connected during installation. Its current firmware version is not yet available here.</Typography>
            <Typography variant="body2">Downgrades require running firmware 0.1.8 or newer and may remove security fixes or features. After installation, the selected release's update rules apply.</Typography>
            <TextField select fullWidth label="Processor" value={appID} disabled={loading || busy}
                onChange={e => { setAppID(e.target.value); setConfirmed(false); }}>
                {processors.map(p => <MenuItem key={p.appID} value={p.appID}>{p.location || p.appID} — {p.appID}</MenuItem>)}
            </TextField>
            {!loading && !processors.length && <Typography>No processors registered to your account.</Typography>}
            {device && !eligible && <Alert severity="warning">{eligibilityMessage}</Alert>}
            <TextField select fullWidth label="Firmware image" value={digest} disabled={loading || busy}
                onChange={e => { setDigest(e.target.value); setConfirmed(false); }}>
                {images.map(i => <MenuItem key={i.sha256} value={i.sha256}>{i.version} — {(i.sizeBytes / 1048576).toFixed(2)} MB — {i.sha256.slice(0, 12)}</MenuItem>)}
            </TextField>
            {!loading && !images.length && <Typography>No firmware images available.</Typography>}
            {image && <Typography variant="caption" sx={{ overflowWrap: 'anywhere' }}>SHA-256: {image.sha256}</Typography>}
            <FormControlLabel control={<Checkbox checked={confirmed} disabled={loading || busy || !eligible || !image}
                onChange={e => setConfirmed(e.target.checked)} />}
                label={`I confirm this is an ESP32-S3 device and want to install ${image?.version || 'the selected release'}, including if it is a downgrade.`} />
            <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={install} disabled={loading || busy || !eligible || !image || !confirmed}>{busy ? 'Requesting…' : 'Install selected firmware'}</Button>
                <Button onClick={() => setReload(n => n + 1)} disabled={loading || busy}>Refresh</Button>
            </Stack>
        </Stack></CardContent>
    </Card>;
}

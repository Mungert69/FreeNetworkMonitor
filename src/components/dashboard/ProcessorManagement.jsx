import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent,
    DialogTitle, Stack, Typography } from '@mui/material';
import { fetchUserProcessors, deleteUserProcessor } from './ServiceAPI';

export default function ProcessorManagement({ siteId, onRemoved }) {
    const [processors, setProcessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [busy, setBusy] = useState(false);
    const [reload, setReload] = useState(0);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        let active = true;
        setLoading(true);
        fetchUserProcessors(siteId).then(items => { if (active) setProcessors(items); })
            .catch(() => { if (active) setMessage({ severity: 'error', text: 'Unable to load processors. Please refresh.' }); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [siteId, reload]);
    const remove = async () => {
        if (!selected || busy) return;
        setBusy(true);
        try {
            await deleteUserProcessor(siteId, selected.appID);
            setSelected(null);
            setMessage({ severity: 'info', text: 'Removal requested. Refresh shortly to confirm it has disappeared. Monitors and their history are unchanged.' });
            onRemoved?.();
            setReload(n => n + 1);
        } catch {
            setMessage({ severity: 'error', text: 'Removal could not be confirmed. Refresh the list before trying again.' });
        } finally { setBusy(false); }
    };
    return <Card sx={{ mt: 3 }}>
        <CardHeader title="Processor management" subheader="Remove test or unused processor registrations" />
        <CardContent><Stack spacing={2}>
            {message && <Alert severity={message.severity}>{message.text}</Alert>}
            <Typography variant="body2">Removing a processor leaves its monitors, assignments and history unchanged. You can reassign those monitors later. To use the device again, run its re-registration/login procedure.</Typography>
            {loading ? <Typography>Loading processors…</Typography> : processors.length === 0 ? <Typography>No processors registered to your account.</Typography> :
                processors.map(p => <Stack key={p.appID} direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <div><Typography>{p.location || p.appID}</Typography><Typography variant="caption" sx={{ overflowWrap: 'anywhere' }}>{p.appID}</Typography></div>
                    <Button color="error" disabled={busy} onClick={() => setSelected(p)} aria-label={`Remove ${p.location || p.appID}`}>Remove</Button>
                </Stack>)}
            <Button disabled={loading || busy} onClick={() => { setReload(n => n + 1); onRemoved?.(); }}>Refresh processors</Button>
        </Stack></CardContent>
        <Dialog open={Boolean(selected)} onClose={() => { if (!busy) setSelected(null); }}>
            <DialogTitle>Remove processor?</DialogTitle>
            <DialogContent><Typography>{selected?.location} ({selected?.appID})</Typography>
                <Typography>Monitoring through this registration will stop, including for attached monitors. No MonitorIPs or monitoring history will be deleted.</Typography></DialogContent>
            <DialogActions><Button disabled={busy} onClick={() => setSelected(null)}>Cancel</Button>
                <Button color="error" disabled={busy} onClick={remove}>{busy ? 'Requesting…' : 'Confirm removal'}</Button></DialogActions>
        </Dialog>
    </Card>;
}

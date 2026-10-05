import { normalizeThresholds, resetLimitsForChangedMeasurement } from './alertThresholds';
// File: src/components/EditHostDialog.js

import { useTheme } from '@mui/material/styles';
import React, { useEffect, useMemo, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  useMediaQuery,
} from '@mui/material';


const EditHostDialog = ({
  open,
  onClose,
  host,
  endpointTypes,
  processorList,
  onSave,
  onLocationChange,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [editedHost, setEditedHost] = useState({ ...host });
  const [showPassword, setShowPassword] = useState(false);

  const customConnectsByApp = useMemo(() => {
    const map = new Map();
    (processorList ?? []).forEach((processor) => {
      if (processor?.appID !== undefined && processor?.appID !== null) {
        const custom = Array.isArray(processor.customConnects)
          ? processor.customConnects
          : [];
        map.set(
          String(processor.appID),
          custom.map((type) => String(type ?? '').toLowerCase()),
        );
      }
    });
    return map;
  }, [processorList]);

  const globalCustomConnects = useMemo(() => {
    const set = new Set();
    (processorList ?? []).forEach((processor) => {
      (processor.customConnects ?? []).forEach((type) => {
        if (type) {
          set.add(String(type).toLowerCase());
        }
      });
    });
    return set;
  }, [processorList]);

  const filteredEndpointTypes = useMemo(() => {
    const disabled = (processorList ?? [])
      .find((processor) => String(processor.appID) === String(editedHost.appID))
      ?.disabledEndPointTypes ?? [];
    const disabledSet = new Set(
      disabled.map((type) => String(type ?? '').toLowerCase()),
    );
    const allowedCustom = customConnectsByApp.get(String(editedHost.appID ?? '')) ?? [];
    return (endpointTypes ?? []).filter((type) => {
      const internalType = String(type.internalType ?? '').toLowerCase();
      if (disabledSet.has(internalType)) {
        return false;
      }
      if (globalCustomConnects.has(internalType)) {
        return allowedCustom.includes(internalType);
      }
      return true;
    });
  }, [customConnectsByApp, editedHost.appID, endpointTypes, globalCustomConnects, processorList]);


  useEffect(() => {
    if (host) {
      setEditedHost({
        ...host,
        username: host.username ?? '',
        password: host.password ?? '',
        args: host.args ?? '',
        skipCycles: host.skipCycles ?? '',
        lowThreshold: host.lowThreshold ?? '',
        highThreshold: host.highThreshold ?? '',
      });
    }
  }, [host]);

  if (!host) return null;

  const handleChange = (field, value) => {
    setEditedHost((prev) => resetLimitsForChangedMeasurement({ ...prev, [field]: value }, prev));
  };

  let limitsError = '';
  try { normalizeThresholds(editedHost); } catch (error) { limitsError = error.message; }

  const handleSave = () => {
    if (limitsError) return;
    const skipCycles = editedHost.skipCycles === '' || editedHost.skipCycles === null
      ? null
      : Number(editedHost.skipCycles);
    onSave({ ...editedHost, skipCycles, ...normalizeThresholds(editedHost) });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isSmallScreen} aria-labelledby="edit-host-title" PaperProps={{ sx: { borderRadius: isSmallScreen ? 0 : 3 } }}>
        <DialogTitle id="edit-host-title" sx={{ pr: 7, pb: 2 }}>
          <Typography component="span" variant="h6" fontWeight={700}>Edit Host</Typography>
          <Typography component="span" display="block" variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{host.address}</Typography>
          <IconButton aria-label="Close edit host" onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          <Grid container spacing={2}>
            <Grid size={12}><Typography variant="subtitle1" fontWeight={700}>Connection</Typography><Typography variant="body2" color="text.secondary">Choose what to monitor and where the check runs.</Typography></Grid>
            {/* Host Address */}
            <Grid size={12}>
              <TextField
                label="Host Address"
                value={editedHost.address}
                onChange={(e) => handleChange('address', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Enter host address"
                margin="dense"
              />
            </Grid>

            {/* Endpoint Type */}
            <Grid size={12}>
              <TextField
                label="Endpoint Type"
                value={editedHost.endPointType ?? ''}
                onChange={(e) => handleChange('endPointType', e.target.value)}
                fullWidth
                select
                SelectProps={{
                  displayEmpty: true,
                }}
                InputLabelProps={{ shrink: true }}
                margin="dense"
              >
                <MenuItem value="">
                  <em>Select Endpoint Type</em>
                </MenuItem>
                {filteredEndpointTypes.map((type) => (
                  <MenuItem key={type.internalType} value={type.internalType}>
                    {type.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Monitor Location */}
            <Grid size={12}>
              <TextField
                label="Monitor Location"
                value={editedHost.appID ?? ''}
                onChange={(e) => {
                  handleChange('appID', e.target.value);
                  if (onLocationChange) {
                    onLocationChange(e.target.value);
                  }
                }}
                fullWidth
                select
                SelectProps={{
                  displayEmpty: true,
                }}
                InputLabelProps={{ shrink: true }}
                margin="dense"
              >
                <MenuItem value="">
                  <em>Select Monitor Location</em>
                </MenuItem>
                {(processorList ?? [])
                  .filter((row) => {
                    const disabledTypes = (row.disabledEndPointTypes || []).map((type) =>
                      String(type ?? '').toLowerCase(),
                    );
                    const normalizedEndpoint = String(editedHost.endPointType ?? '').toLowerCase();
                    return (
                      !row.isAtMaxLoad &&
                      (disabledTypes.length === 0 || !disabledTypes.includes(normalizedEndpoint))
                    );
                  })
                  .map((row) => (
                    <MenuItem key={row.appID} value={row.appID}>
                      {row.location}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>

            {/* Enabled */}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedHost.enabled}
                    onChange={(e) => handleChange('enabled', e.target.checked)}
                  />
                }
                label="Enabled"
              />
            </Grid>

            <Grid size={12}><Typography variant="subtitle1" fontWeight={700}>Measurement alerts</Typography><Typography variant="body2" color="text.secondary">Optional limits in the measurement’s actual units. Leave blank to disable.</Typography></Grid>
            {['lowThreshold', 'highThreshold'].map((field) => (
              <Grid size={{ xs: 12, sm: 6 }} key={field}>
                <TextField
                  label={field === 'lowThreshold' ? 'Low alert limit' : 'High alert limit'}
                  type="number" value={editedHost[field] ?? ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                  fullWidth margin="dense" inputProps={{ step: 'any' }} error={Boolean(limitsError)}
                  helperText={limitsError || 'Actual measurement units. Leave blank to disable.'}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            ))}

            <Grid size={12}>
              <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px !important', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box><Typography fontWeight={600}>Advanced settings</Typography><Typography variant="body2" color="text.secondary">Timing, port, credentials and arguments</Typography></Box>
                </AccordionSummary>
                <AccordionDetails><Grid container spacing={2}>
            {/* Timeout */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Timeout (ms)"
                type="number"
                value={editedHost.timeout}
                onChange={(e) => handleChange('timeout', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Enter timeout"
                margin="dense"
              />
            </Grid>

            {/* Port */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Port"
                type="number"
                value={editedHost.port}
                onChange={(e) => handleChange('port', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Enter port"
                margin="dense"
              />
            </Grid>

            {/* Skip cycles */}
            <Grid size={12}>
              <TextField
                label="Skip cycles"
                type="number"
                value={editedHost.skipCycles ?? ''}
                onChange={(e) => handleChange('skipCycles', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 0, max: 65535, step: 1 }}
                helperText="Leave blank to use the endpoint default. Zero runs every processor cycle."
                placeholder="Use endpoint default"
                margin="dense"
              />
            </Grid>

            {/* Username */}
            <Grid size={12}>
              <TextField
                label="Username"
                value={editedHost.username}
                onChange={(e) => handleChange('username', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Optional username or identifier"
                margin="dense"
              />
            </Grid>

            {/* Password / Key */}
            <Grid size={12}>
              <TextField
                label="Password / Key"
                type={showPassword ? 'text' : 'password'}
                value={editedHost.password}
                onChange={(e) => handleChange('password', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Optional password or key"
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Args */}
            <Grid size={12}>
              <TextField
                label="Args"
                value={editedHost.args}
                onChange={(e) => handleChange('args', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="Extra command-style arguments"
                margin="dense"
              />
            </Grid>

                </Grid></AccordionDetails>
              </Accordion>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="caption" color="text.secondary" sx={{ width: '100%', mb: 1 }}>Saving also applies any pending edits in the host table.</Typography>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            disabled={Boolean(limitsError)}
            onClick={handleSave}
            color="primary"
            variant="contained"
            startIcon={<SaveIcon />}
          >
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditHostDialog;

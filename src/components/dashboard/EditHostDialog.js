// File: src/components/EditHostDialog.js

import React, { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Tooltip
} from '@mui/material';




const EditHostDialog = ({
  open,
  onClose,
  host,
  endpointTypes,
  processorList,
  onSave,
}) => {

  const [editedHost, setEditedHost] = useState({ ...host });

  useEffect(() => {
    if (host) {
      setEditedHost({ ...host });
    }
  }, [host]);

  if (!host) return null;

  const handleChange = (field, value) => {
    setEditedHost((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    onSave(editedHost);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Host</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Host Address */}
          <Grid item xs={12}>
            <TextField
              label="Host Address"
              value={editedHost.address}
              onChange={(e) => handleChange('address', e.target.value)}
              fullWidth
            />
          </Grid>

          {/* Endpoint Type */}
          <Grid item xs={12}>
            <Select
              label="Endpoint Type"
              value={editedHost.endPointType}
              onChange={(e) => handleChange('endPointType', e.target.value)}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Endpoint Type</em>
              </MenuItem>
              {endpointTypes.map((type) => (
                <MenuItem key={type.internalType} value={type.internalType}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Timeout */}
          <Grid item xs={6}>
            <TextField
              label="Timeout"
              type="number"
              value={editedHost.timeout}
              onChange={(e) => handleChange('timeout', e.target.value)}
              fullWidth
            />
          </Grid>

          {/* Port */}
          <Grid item xs={6}>
            <TextField
              label="Port"
              type="number"
              value={editedHost.port}
              onChange={(e) => handleChange('port', e.target.value)}
              fullWidth
            />
          </Grid>

          {/* Enabled */}
          <Grid item xs={12}>
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

          {/* Monitor Location */}
          <Grid item xs={12}>
            <Select
              label="Monitor Location"
              value={editedHost.appID}
              onChange={(e) => handleChange('appID', e.target.value)}
              fullWidth
              displayEmpty
            >
              <MenuItem value="">
                <em>Select Monitor Location</em>
              </MenuItem>
              {processorList
                .filter(
                  (row) =>
                    !row.isAtMaxLoad &&
                    (!row.disabledEndPointTypes ||
                      !row.disabledEndPointTypes.includes(
                        editedHost.endPointType
                      ))
                )
                .map((row) => (
                  <MenuItem key={row.appID} value={row.appID}>
                    {row.location}
                  </MenuItem>
                ))}
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditHostDialog;

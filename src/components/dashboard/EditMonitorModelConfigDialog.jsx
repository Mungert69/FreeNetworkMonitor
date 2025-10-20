import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

const CONFIG_FIELD_DEFINITIONS = [
  // General detection toggles
  { name: 'changeConfidence', label: 'Change Confidence', type: 'number', group: 'General' },
  { name: 'spikeConfidence', label: 'Spike Confidence', type: 'number', group: 'General' },
  { name: 'changePreTrain', label: 'Change Pre-Train', type: 'number', group: 'General' },
  { name: 'spikePreTrain', label: 'Spike Pre-Train', type: 'number', group: 'General' },
  { name: 'predictWindow', label: 'Predict Window', type: 'number', group: 'General' },
  { name: 'spikeDetectionThreshold', label: 'Spike Detection Threshold', type: 'number', group: 'General' },
  { name: 'runLength', label: 'Run Length', type: 'number', group: 'General' },
  { name: 'kOfNK', label: 'K of N (K)', type: 'number', group: 'General' },
  { name: 'kOfNN', label: 'K of N (N)', type: 'number', group: 'General' },
  { name: 'madAlpha', label: 'MAD Alpha', type: 'number', group: 'General', step: '0.001' },
  { name: 'minBandAbs', label: 'Min Band Abs', type: 'number', group: 'General', step: '0.001' },
  { name: 'minBandRel', label: 'Min Band Rel', type: 'number', group: 'General', step: '0.001' },
  { name: 'rollSigmaWindow', label: 'Roll Sigma Window', type: 'number', group: 'General' },
  { name: 'baselineWindow', label: 'Baseline Window', type: 'number', group: 'General' },
  { name: 'sigmaCooldown', label: 'Sigma Cooldown', type: 'number', group: 'General' },
  { name: 'minRelShift', label: 'Min Relative Shift', type: 'number', group: 'General', step: '0.001' },
  { name: 'sampleRows', label: 'Sample Rows', type: 'number', group: 'General' },
  { name: 'nearMissFraction', label: 'Near Miss Fraction', type: 'number', group: 'General', step: '0.001' },
  { name: 'logJson', label: 'Log JSON', type: 'boolean', group: 'General' },

  // Change detection overrides
  { name: 'changeRunLength', label: 'Change Run Length', type: 'number', group: 'Change Detection' },
  { name: 'changeKOfNK', label: 'Change K of N (K)', type: 'number', group: 'Change Detection' },
  { name: 'changeKOfNN', label: 'Change K of N (N)', type: 'number', group: 'Change Detection' },
  { name: 'changeMadAlpha', label: 'Change MAD Alpha', type: 'number', group: 'Change Detection', step: '0.001' },
  { name: 'changeMinBandAbs', label: 'Change Min Band Abs', type: 'number', group: 'Change Detection', step: '0.001' },
  { name: 'changeMinBandRel', label: 'Change Min Band Rel', type: 'number', group: 'Change Detection', step: '0.001' },
  { name: 'changeRollSigmaWindow', label: 'Change Roll Sigma Window', type: 'number', group: 'Change Detection' },
  { name: 'changeBaselineWindow', label: 'Change Baseline Window', type: 'number', group: 'Change Detection' },
  { name: 'changeSigmaCooldown', label: 'Change Sigma Cooldown', type: 'number', group: 'Change Detection' },
  { name: 'changeMinRelShift', label: 'Change Min Relative Shift', type: 'number', group: 'Change Detection', step: '0.001' },
  { name: 'changeSampleRows', label: 'Change Sample Rows', type: 'number', group: 'Change Detection' },
  { name: 'changeNearMissFraction', label: 'Change Near Miss Fraction', type: 'number', group: 'Change Detection', step: '0.001' },
  { name: 'changeLogJson', label: 'Change Log JSON', type: 'boolean', group: 'Change Detection' },

  // Spike detection overrides
  { name: 'spikeRunLength', label: 'Spike Run Length', type: 'number', group: 'Spike Detection' },
  { name: 'spikeKOfNK', label: 'Spike K of N (K)', type: 'number', group: 'Spike Detection' },
  { name: 'spikeKOfNN', label: 'Spike K of N (N)', type: 'number', group: 'Spike Detection' },
  { name: 'spikeMadAlpha', label: 'Spike MAD Alpha', type: 'number', group: 'Spike Detection', step: '0.001' },
  { name: 'spikeMinBandAbs', label: 'Spike Min Band Abs', type: 'number', group: 'Spike Detection', step: '0.001' },
  { name: 'spikeMinBandRel', label: 'Spike Min Band Rel', type: 'number', group: 'Spike Detection', step: '0.001' },
  { name: 'spikeRollSigmaWindow', label: 'Spike Roll Sigma Window', type: 'number', group: 'Spike Detection' },
  { name: 'spikeBaselineWindow', label: 'Spike Baseline Window', type: 'number', group: 'Spike Detection' },
  { name: 'spikeSigmaCooldown', label: 'Spike Sigma Cooldown', type: 'number', group: 'Spike Detection' },
  { name: 'spikeMinRelShift', label: 'Spike Min Relative Shift', type: 'number', group: 'Spike Detection', step: '0.001' },
  { name: 'spikeSampleRows', label: 'Spike Sample Rows', type: 'number', group: 'Spike Detection' },
  { name: 'spikeNearMissFraction', label: 'Spike Near Miss Fraction', type: 'number', group: 'Spike Detection', step: '0.001' },
  { name: 'spikeLogJson', label: 'Spike Log JSON', type: 'boolean', group: 'Spike Detection' },

  // Meta
  { name: 'notes', label: 'Notes', type: 'multiline', group: 'Meta' },
  { name: 'id', label: 'Config ID', type: 'text', group: 'Meta', readOnly: true, includeInPayload: true },
  { name: 'updatedUtc', label: 'Last Updated (UTC)', type: 'text', group: 'Meta', readOnly: true, includeInPayload: false },
  { name: 'updatedBy', label: 'Updated By', type: 'text', group: 'Meta', readOnly: true, includeInPayload: false },
];

const NUMBER_FIELD_TYPES = new Set(['number']);
const BOOLEAN_FIELD_TYPES = new Set(['boolean']);

const groupDefinitions = CONFIG_FIELD_DEFINITIONS.reduce((acc, def) => {
  if (!acc.includes(def.group)) {
    acc.push(def.group);
  }
  return acc;
}, []);

const normaliseConfigValues = (config) => {
  const values = {};
  CONFIG_FIELD_DEFINITIONS.forEach((def) => {
    const value = config?.[def.name];
    if (BOOLEAN_FIELD_TYPES.has(def.type)) {
      values[def.name] = Boolean(value ?? false);
    } else if (NUMBER_FIELD_TYPES.has(def.type)) {
      if (value === null || value === undefined) {
        values[def.name] = '';
      } else {
        values[def.name] = String(value);
      }
    } else if (def.type === 'multiline') {
      values[def.name] = value ?? '';
    } else {
      values[def.name] = value ?? '';
    }
  });
  return values;
};

const buildPayload = (values) => {
  const payload = {};
  CONFIG_FIELD_DEFINITIONS.forEach((def) => {
    if (def.includeInPayload === false) {
      return;
    }
    const value = values[def.name];
    if (BOOLEAN_FIELD_TYPES.has(def.type)) {
      payload[def.name] = Boolean(value);
      return;
    }
    if (NUMBER_FIELD_TYPES.has(def.type)) {
      if (value === '' || value === null || value === undefined) {
        payload[def.name] = null;
        return;
      }
      const parsed = Number(value);
      payload[def.name] = Number.isNaN(parsed) ? null : parsed;
      return;
    }
    if (def.name === 'id') {
      if (value === '' || value === null || value === undefined) {
        return;
      }
      const parsed = Number(value);
      if (!Number.isNaN(parsed) && parsed > 0) {
        payload[def.name] = parsed;
      }
      return;
    }
    payload[def.name] = value ?? null;
  });
  return payload;
};

const EditMonitorModelConfigDialog = ({ open, host, onClose, onSave }) => {
  const [useOverride, setUseOverride] = useState(Boolean(host?.modelConfig));
  const [values, setValues] = useState(() => normaliseConfigValues(host?.modelConfig));
  const [initialValues, setInitialValues] = useState(() => normaliseConfigValues(host?.modelConfig));

  useEffect(() => {
    const nextValues = normaliseConfigValues(host?.modelConfig);
    setValues(nextValues);
    setInitialValues(nextValues);
    setUseOverride(Boolean(host?.modelConfig));
  }, [host]);

  const handleToggleOverride = (event) => {
    const enabled = event.target.checked;
    setUseOverride(enabled);
    if (!enabled) {
      setValues(normaliseConfigValues(null));
    } else if (!host?.modelConfig) {
      setValues(normaliseConfigValues(null));
    }
  };

  const handleFieldChange = (fieldName) => (event, checked) => {
    setValues((prev) => {
      let nextValue;
      const definition = CONFIG_FIELD_DEFINITIONS.find((def) => def.name === fieldName);
      if (!definition) {
        return prev;
      }
      if (BOOLEAN_FIELD_TYPES.has(definition.type)) {
        nextValue = checked ?? event.target.checked;
      } else {
        nextValue = event.target.value;
      }
      return {
        ...prev,
        [fieldName]: nextValue,
      };
    });
  };

  const handleRestore = () => {
    setValues(initialValues);
    setUseOverride(Boolean(host?.modelConfig));
  };

  const handleClearValues = () => {
    setValues(normaliseConfigValues(null));
  };

  const groupedFields = useMemo(
    () =>
      groupDefinitions.map((group) => ({
        group,
        fields: CONFIG_FIELD_DEFINITIONS.filter((def) => def.group === group),
      })),
    [],
  );

  const handleSubmit = () => {
    const payload = useOverride ? buildPayload(values) : null;
    onSave(payload);
  };

  const hostLabel = host ? `${host.address ?? 'Host'} (${host.endPointType ?? 'endpoint'})` : 'Host';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="edit-monitor-model-config-dialog-title"
    >
      <DialogTitle id="edit-monitor-model-config-dialog-title">
        Monitor Model Config • {hostLabel}
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={useOverride}
                onChange={handleToggleOverride}
              />
            }
            label="Use custom model configuration for this host"
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small" onClick={handleRestore}>
              Restore current
            </Button>
            {useOverride ? (
              <Button variant="outlined" size="small" onClick={handleClearValues}>
                Clear values
              </Button>
            ) : null}
          </Box>
        </Box>

        {!useOverride ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            This host does not override the global monitor model configuration. Enable the switch to customise values.
          </Alert>
        ) : null}

        {useOverride ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {groupedFields.map(({ group, fields }) => (
              <Box key={group} sx={{ border: '1px solid rgba(98, 57, 171, 0.15)', borderRadius: 1.5, p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {group}
                </Typography>
                <Grid container spacing={2}>
                  {fields.map((field) => {
                    if (field.type === 'boolean') {
                      return (
                        <Grid key={field.name} item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                color="primary"
                                checked={Boolean(values[field.name])}
                                onChange={handleFieldChange(field.name)}
                              />
                            }
                            label={field.label}
                          />
                        </Grid>
                      );
                    }

                    if (field.type === 'multiline') {
                      return (
                        <Grid key={field.name} item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label={field.label}
                            value={values[field.name]}
                            onChange={handleFieldChange(field.name)}
                            InputLabelProps={{ shrink: Boolean(values[field.name]) }}
                          />
                        </Grid>
                      );
                    }

                    return (
                      <Grid key={field.name} item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          type={NUMBER_FIELD_TYPES.has(field.type) ? 'number' : 'text'}
                          label={field.label}
                          value={values[field.name]}
                          onChange={handleFieldChange(field.name)}
                          inputProps={
                            field.step ? { step: field.step } : undefined
                          }
                          InputProps={
                            field.readOnly
                              ? {
                                  readOnly: true,
                                }
                              : undefined
                          }
                          InputLabelProps={{ shrink: Boolean(values[field.name]) }}
                          disabled={field.readOnly}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>
            ))}
          </Box>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(EditMonitorModelConfigDialog);

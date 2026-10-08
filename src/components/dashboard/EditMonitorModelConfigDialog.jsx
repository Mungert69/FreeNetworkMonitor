import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  MenuItem,
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

const FIELD_HELP = {
  changeConfidence: 'Confidence percentage. Higher is more conservative in ML.NET. TimesFM selects 20%, 40%, 60% or 80% central bands; 80–100 all use its widest band. Enter 60, not 0.6.',
  spikeConfidence: 'Confidence percentage for spikes. ML.NET uses the percentage; TimesFM selects 20%, 40%, 60% or 80% bands, capped at 80%. Enter 60, not 0.6.',
  changePreTrain: 'Usable observations of change history in ML.NET. In TimesFM, initial context observations are not scored; this does not retrain the model.',
  spikePreTrain: 'Usable observations of spike history in ML.NET. In TimesFM, initial context observations are not scored; this does not retrain the model.',
  predictWindow: 'Historical usable observations requested for evaluation, not a future forecast horizon. Larger windows require more data and processing.',
  spikeDetectionThreshold: 'Minimum flagged observations in the evaluated batch to declare a spike issue. They do not have to be consecutive.',
  runLength: 'TimesFM only: consecutive outside-band observations required. Either this rule OR the K-of-N rule can satisfy persistence.',
  kOfNK: 'TimesFM only: required outside-band observations among the recent N. Must not exceed N. Either this rule OR Run Length can satisfy persistence.',
  kOfNN: 'TimesFM only: number of recent scored observations used by the K-of-N persistence rule.',
  madAlpha: 'TimesFM only: noise multiplier added to each side of the expected band. Larger values tolerate more background variation.',
  minBandAbs: 'TimesFM only: minimum TOTAL expected-band width in raw measurement units (milliseconds for latency). Larger values tolerate more variation.',
  minBandRel: 'TimesFM only: minimum TOTAL band width relative to the forecast. 0.15 means 15%.',
  rollSigmaWindow: 'TimesFM only: previous usable observations used to estimate background noise.',
  baselineWindow: 'TimesFM only: previous usable observations used to calculate the median baseline.',
  sigmaCooldown: 'TimesFM only: observations for which the noise estimate is held after confirmation. This is not a notification cooldown.',
  minRelShift: 'TimesFM only: minimum relative change from the median baseline. 0.20 means 20%; increases and decreases can qualify.',
  sampleRows: 'Developer diagnostics, TimesFM only: maximum sample rows logged per detector and batch, spread across the batch. 0 disables sample rows; the summary remains.',
  nearMissFraction: 'Developer diagnostics, TimesFM only: distance from a band edge divided by total width, used to count near misses. 0.10 means 10%. Does not change anomaly flags.',
  logJson: 'Developer diagnostics, TimesFM only: JSON or text format for sample rows at Information log level. Does not enable detection or change anomaly flags.',
  notes: 'Optional description of why this host uses custom settings. Maximum 512 characters.',
  id: 'Database identifier; does not affect detection.',
  updatedUtc: 'Time this configuration was last saved.',
  updatedBy: 'Account that last saved this configuration.',
};

const baseName = (name) => {
  if (FIELD_HELP[name]) return name;
  const suffix = name.replace(/^(change|spike)/, '');
  return suffix[0].toLowerCase() + suffix.slice(1);
};
const fieldHelp = (field) => FIELD_HELP[baseName(field.name)] +
  (field.group === 'Change Detection' || field.group === 'Spike Detection'
    ? ' Blank/Inherit uses the shared host value, then server defaults.'
    : field.type === 'number' || field.type === 'boolean' ? ' Blank/Inherit uses server defaults.' : '');

export const validateConfigValues = (values) => {
  const errors = {};
  CONFIG_FIELD_DEFINITIONS.forEach((field) => {
    const raw = values[field.name];
    if (field.type !== 'number' || raw === '' || raw == null) return;
    const value = Number(raw);
    const name = baseName(field.name);
    const integer = !field.step && !name.endsWith('Confidence');
    const positive = ['changePreTrain', 'spikePreTrain', 'predictWindow', 'spikeDetectionThreshold', 'runLength', 'kOfNK', 'kOfNN', 'rollSigmaWindow', 'baselineWindow'].includes(name);
    if (!Number.isFinite(value) || (integer && (!Number.isInteger(value) || value > 2147483647)))
      errors[field.name] = integer ? 'Enter a whole number within the supported integer range.' : 'Enter a finite number.';
    else if (name.endsWith('Confidence') && (value < 1 || value > 100))
      errors[field.name] = 'Enter a percentage from 1 to 100 (for example, 60).';
    else if (positive && value < 1) errors[field.name] = 'Must be at least 1.';
    else if (value < 0) errors[field.name] = 'Must be zero or greater.';
    else if (name === 'nearMissFraction' && value > 1) errors[field.name] = 'Enter a fraction from 0 to 1.';
  });
  const number = (name) => values[name] === '' || values[name] == null ? null : Number(values[name]);
  for (const prefix of ['', 'change', 'spike']) {
    const key = (suffix) => prefix ? prefix + suffix : suffix[0].toLowerCase() + suffix.slice(1);
    const k = number(key('KOfNK')) ?? number('kOfNK');
    const n = number(key('KOfNN')) ?? number('kOfNN');
    if (k != null && n != null && k > n) errors[key('KOfNK')] = 'K must not exceed N.';
  }
  const window = number('predictWindow');
  for (const field of ['changePreTrain', 'spikePreTrain']) {
    const history = number(field);
    if (window != null && history != null && history >= window)
      errors[field] = 'History must be smaller than the observation window.';
  }
  if ((values.notes ?? '').length > 512) errors.notes = 'Use no more than 512 characters.';
  return errors;
};

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
      values[def.name] = value == null ? '' : value ? 'true' : 'false';
    } else if (NUMBER_FIELD_TYPES.has(def.type)) {
      if (value === null || value === undefined) {
        values[def.name] = '';
      } else {
        values[def.name] = String(def.name.endsWith('Confidence') && value > 0 && value < 1 ? value * 100 : value);
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
      payload[def.name] = value === '' ? null : value === 'true';
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
        nextValue = event.target.value;
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

  const errors = useMemo(() => useOverride ? validateConfigValues(values) : {}, [values, useOverride]);

  const handleSubmit = () => {
    if (Object.keys(errors).length) return;
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
            <Alert severity="info">
              Blank values inherit defaults. Detector-specific overrides take precedence over shared host values.
              TimesFM-only settings have no effect in an ML.NET-only setup; hybrid setups use them for TimesFM verification.
              Saved values are loaded on the next prediction run. If a predictive alert was already sent, reset it to resume evaluation.
              A final alert requires both primary change and spike detection; hybrid mode also requires TimesFM confirmation.
            </Alert>
            <Alert severity="info">
              Confidence uses percentages. TimesFM supports central bands of 20%, 40%, 60% and 80%; values between them round down,
              and values above 80% use the 80% band. ML.NET uses the entered percentage directly.
              Server defaults depend on the deployment and are not displayed here.
            </Alert>
            {groupedFields.map(({ group, fields }) => (
              <Box key={group} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {group}
                </Typography>
                <Grid container spacing={2}>
                  {fields.map((field) => {
                    if (field.type === 'boolean') {
                      return (
                        <Grid key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                          <TextField
                            select fullWidth label={field.label}
                            value={values[field.name]} onChange={handleFieldChange(field.name)}
                            helperText={fieldHelp(field)}
                          >
                            <MenuItem value="">Inherit</MenuItem>
                            <MenuItem value="true">JSON</MenuItem>
                            <MenuItem value="false">Text</MenuItem>
                          </TextField>
                        </Grid>
                      );
                    }

                    if (field.type === 'multiline') {
                      return (
                        <Grid key={field.name} size={12}>
                          <TextField
                            fullWidth
                            multiline
                            error={Boolean(errors[field.name])}
                            helperText={errors[field.name] ?? fieldHelp(field)}
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
                      <Grid key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                          fullWidth
                          type={NUMBER_FIELD_TYPES.has(field.type) ? 'number' : 'text'}
                          label={field.label}
                          error={Boolean(errors[field.name])}
                          helperText={errors[field.name] ?? fieldHelp(field)}
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
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={Object.keys(errors).length > 0}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(EditMonitorModelConfigDialog);

import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
const localInput = value => {
  const date = value ? new Date(value) : new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
export default function ChartTimeRange({ selection = { mode: 'dataset' }, onSelect }) {
  const [mode, setMode] = useState(selection.mode);
  const [start, setStart] = useState(localInput(selection.start ?? new Date(Date.now() - 86400000)));
  const [end, setEnd] = useState(localInput(selection.end));
  useEffect(() => {
    setMode(selection.mode);
    if (selection.start) setStart(localInput(selection.start));
    if (selection.end) setEnd(localInput(selection.end));
  }, [selection.mode, selection.start, selection.end]);
  if (!onSelect) return null;
  const choose = value => {
    setMode(value);
    if (value === 'custom') return;
    if (value === 'dataset') { onSelect({ mode: value }); return; }
    const hours = { hour: 1, day: 24, week: 168, month: 720 }[value];
    onSelect({ mode: value, hours, start: new Date(Date.now() - hours * 3600000).toISOString(), end: new Date().toISOString() });
  };
  const startDate = new Date(start), endDate = new Date(end);
  const invalid = !start || !end || !Number.isFinite(+startDate) || !Number.isFinite(+endDate) || endDate <= startDate || endDate - startDate > 90 * 86400000 || startDate < new Date('2022-01-01T00:00:00Z');
  return <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
    <TextField select size="small" label="Time range" value={mode} onChange={event => choose(event.target.value)} sx={{ minWidth: 170 }}>
      {[['dataset', 'Selected dataset'], ['hour', 'Last hour'], ['day', 'Last 24 hours'], ['week', 'Last 7 days'], ['month', 'Last 30 days'], ['custom', 'Custom range']].map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}
    </TextField>
    {mode === 'custom' && <>
      <TextField label="From" type="datetime-local" size="small" value={start} onChange={event => setStart(event.target.value)} InputLabelProps={{ shrink: true }} />
      <TextField label="To" type="datetime-local" size="small" value={end} onChange={event => setEnd(event.target.value)} InputLabelProps={{ shrink: true }} />
      <Button variant="outlined" disabled={invalid} onClick={() => onSelect({ mode, start: startDate.toISOString(), end: endDate.toISOString() })}>Apply range</Button>
      <Typography variant="caption" color={invalid ? 'error' : 'text.secondary'}>Local time · maximum 90 days</Typography>
    </>}
  </Box>;
}

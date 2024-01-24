import React, { useState } from 'react';
import { Grid, ListItem, ListItemIcon, ListItemText, Tooltip, TextField, Paper } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export function DataSetsList({ dataSets, handleSetDataSetId, setDateStart, setDateEnd }) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
    setDateStart(newValue);
  };

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
    setDateEnd(newValue);
  };

  return (
    <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <MobileDatePicker
              label="Start Date"
              inputFormat="YYYY-MM-DD"
              value={startDate}
              onChange={handleChangeStartDate}
              renderInput={(params) => <TextField {...params} size="small" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MobileDatePicker
              label="End Date"
              inputFormat="YYYY-MM-DD"
              value={endDate}
              onChange={handleChangeEndDate}
              renderInput={(params) => <TextField {...params} size="small" fullWidth />}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
      <Grid container spacing={1}>
        {dataSets.map((data) => (
          <Grid item xs={12} sm={6} md={4} key={data.id}>
            <ListItem button onClick={() => handleSetDataSetId(data.id, data.date)} sx={{ py: 0.5 }}>
              <Tooltip title={data.id === 0 ? 'Current' : data.date}>
                <ListItemIcon>
                  <AssignmentIcon fontSize='small' />
                </ListItemIcon>
              </Tooltip>
              <Tooltip title="View Data Set">
                <span>
                  {data.id === 0 ? <ListItemText secondary='Current' /> : <ListItemText secondary={data.date} />}
                </span>
              </Tooltip>
            </ListItem>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default React.memo(DataSetsList);

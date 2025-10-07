import React, { useState } from 'react';
import { Grid, ListItem, ListItemIcon, ListItemText, Tooltip, Paper } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { formatDataSetLabel } from './datasetNavigation';

export function DataSetsList({ dataSets, handleSetDataSetId, setDateStart, setDateEnd, onClose }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChangeStartDate = (newValue) => {
    setStartDate(newValue);
    setDateStart(newValue);
  };

  const handleChangeEndDate = (newValue) => {
    setEndDate(newValue);
    setDateEnd(newValue);
  };

  return (
    <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto', position: 'relative' }}>
       <LocalizationProvider dateAdapter={AdapterDayjs}>
         <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <MobileDatePicker
              label="Start Date"
              format="YYYY-MM-DD"
              value={startDate}
              onChange={handleChangeStartDate}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MobileDatePicker
              label="End Date"
              format="YYYY-MM-DD"
              value={endDate}
              onChange={handleChangeEndDate}
              slotProps={{ textField: { size: 'small', fullWidth: true } }}
            />
          </Grid>
        </Grid>
        </LocalizationProvider>
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1000 }}>
        <CloseIcon />
        </IconButton>

      <Grid container spacing={1}>
        {dataSets.map((data) => {
          const label = formatDataSetLabel(data);
          return (
            <Grid item xs={12} sm={6} md={4} key={data.id}>
              <ListItem button onClick={() => handleSetDataSetId(data.id, data.date)} sx={{ py: 0.5 }}>
                <Tooltip title={label}>
                  <ListItemIcon>
                    <AssignmentIcon fontSize='small' />
                  </ListItemIcon>
                </Tooltip>
                <Tooltip title="View Data Set">
                  <span>
                    <ListItemText secondary={label} />
                  </span>
                </Tooltip>
              </ListItem>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}

export default React.memo(DataSetsList);

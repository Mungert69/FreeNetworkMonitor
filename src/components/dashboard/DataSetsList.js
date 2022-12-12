import React, {useState} from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { convertDate } from './ServiceAPI';


export default function DateSetsList({ dataSets, handleSetDataSetId, setDateStart, setDateEnd }) {
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
  //var filteredDataSets=undefined;
  /*if (startDate === undefined || endDate === undefined) {
    filteredDataSets =  dataSets;

  }
  else{
    const startDateConverted=convertDate(startDate, 'YYYY-MM-DD HH:mm');
    const endDateConverted=convertDate(endDate, 'YYYY-MM-DD HH:mm');
    // FilterDataSets for .date >= startDate && .date <= endDate
    filteredDataSets = dataSets.filter(dataSet => {
     
      return dataSet.date >= startDateConverted && dataSet.date <= endDateConverted;
    } );
   }*/
    return (

    <React.Fragment>

       <LocalizationProvider dateAdapter={AdapterMoment}>
       <Stack spacing={3}>
       
       <MobileDatePicker
          label="Start Date"
          inputFormat="YYYY-MM-DD "
          value={startDate}
          onChange={handleChangeStartDate}
          renderInput={(params) => <TextField {...params} />}
        />
          <MobileDatePicker
          label="End Date"
          inputFormat="YYYY-MM-DD "
          value={endDate}
          onChange={handleChangeEndDate}
          renderInput={(params) => <TextField {...params} />}
        />
        </Stack>
       </LocalizationProvider>


    <List >
      { dataSets.map(
        (data) =>
          <ListItem key={data.id} button onClick={() => handleSetDataSetId(data.id, data.date)}>

            <Tooltip title={data.id === 0 ? 'Current' : data.date
            }>
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
      )}
    </List>
</React.Fragment>
  );


}

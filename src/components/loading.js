import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress'
import { usePromiseTracker } from "react-promise-tracker";

const Loading = () => {
  const { promiseInProgress } = usePromiseTracker();
  return ((promiseInProgress === true) ?
    (<Box sx={{ width: '100%' }}>
      <LinearProgress color='secondary' />
    </Box>)
    :
  null);


}

export default React.memo(Loading);

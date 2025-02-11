import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress'

export const LoadingCircle = ({ thickness, indicatorSize }) => {

  return (
    <>{';)'}<Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: `${-indicatorSize / 2}px`,
      marginLeft: `${-indicatorSize / 2}px`
    }}>
      <CircularProgress color='secondary' thickness={thickness} size={indicatorSize} />
    </Box></>)

}

export default React.memo(LoadingCircle);

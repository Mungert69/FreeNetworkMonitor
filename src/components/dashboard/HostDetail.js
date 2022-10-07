import React from 'react';
import Link from '@mui/material/Link';

import Typography from '@mui/material/Typography';
import Title from './Title';
import useClasses from "./useClasses";
import useTheme from "@mui/material/styles/useTheme";

function preventDefault(event) {
  event.preventDefault();
}



const styleObject = (theme) => {
  return {
    depositContext: {
      flex: 3,
      
    },
  }};

export default function HostDetail({hostData}) {
  const classes = useClasses(styleObject(useTheme()))
  if (hostData.address==undefined) return null;
  return (
    <React.Fragment>
      <Typography align="center" color="testPrimary" className={classes.depositContext}  >
      Dataset started at 
      </Typography>
      <Typography  align="center"color="textSecondary" className={classes.depositContext}>
      {hostData.date}  
      </Typography>
      <Typography align="center" color="textSecondary" className={classes.depositContext}>
       Round Trip Max : {hostData.roundTripMaximum}
      </Typography>
      <Typography align="center" color="textSecondary" className={classes.depositContext}>
       Round Trip Min : {hostData.roundTripMinimum}
      </Typography>
      <Typography align="center" color="textSecondary" className={classes.depositContext}>
       Current Status : {hostData.status}
      </Typography>
     </React.Fragment>
  );
}

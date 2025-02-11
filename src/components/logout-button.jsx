import React,{useEffect} from "react";
import Button from "@mui/material/Button";
import {useFusionAuth} from '@fusionauth/react-sdk';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = () => {
  const { startLogout } = useFusionAuth();
  

  return (
    <Button variant="contained" color="primary" endIcon={<LogoutIcon />}
      onClick={startLogout}
    >
      Log Out
    </Button>
  );
};

export default React.memo(LogoutButton);

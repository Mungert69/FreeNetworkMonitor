import React,{useEffect} from "react";
import Button from "@mui/material/Button";
import {useFusionAuth} from '@fusionauth/react-sdk';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = ({ setUserId }) => {
  const { logout } = useFusionAuth();
  

  return (
    <Button variant="contained" color="primary" endIcon={ <LogoutIcon />}
  
      onClick={() => {
        logout({

          returnTo: window.location.origin,
        });
      }}
    >
      Log Out
    </Button>
  );
};

export default React.memo(LogoutButton);

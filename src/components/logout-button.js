import React,{useEffect} from "react";
import Button from "@mui/material/Button";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = ({ setUserId }) => {
  const { logout } = useAuth0();
  

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

export default LogoutButton;

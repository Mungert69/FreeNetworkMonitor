import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FaqIcon from '@mui/icons-material/LiveHelp';
import { useAuth0 } from "@auth0/auth0-react";



export default function MainListItems()  {
  const { isAuthenticated } = useAuth0();
  //var displayVal = isAuthenticated ? 'block' : 'none';
  var displayVal = 'none';
  return (
    <div>
    <Link href="/">
      <ListItem button key="main">
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Main" />
      </ListItem>
    </Link>
    <Link href="/Dashboard">
      <ListItem button key="dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>
    <Link href="/Faq">
      <ListItem button key="faq">
        <ListItemIcon>
          <FaqIcon />
        </ListItemIcon>
        <ListItemText primary="Faq" />
      </ListItem>
    </Link>
    <Link href="/Profile"  	sx={{ display: displayVal }}>
      <ListItem button key="profile">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItem>
    </Link>

  </div>

  );
}
 
  

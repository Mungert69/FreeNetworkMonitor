import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import FaqIcon from '@mui/icons-material/LiveHelp';
import BlogIcon from '@mui/icons-material/Book';

export  function MainListItems()  {

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
    <Link href="/Subscription"  >
      <ListItem button key="subscription">
        <ListItemIcon>
          <LoyaltyIcon />
        </ListItemIcon>
        <ListItemText primary="Subscription" />
      </ListItem>
    </Link>
    <Link href="https://freenetworkmonitor.click/Blog"  >
      <ListItem button key="blog">
        <ListItemIcon>
          <BlogIcon />
        </ListItemIcon>
        <ListItemText primary="Blog" />
      </ListItem>
    </Link>

  </div>

  );
}
 
export default React.memo(MainListItems); 

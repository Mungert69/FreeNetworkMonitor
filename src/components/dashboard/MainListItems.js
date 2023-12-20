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
import DownloadIcon from '@mui/icons-material/GetApp'; 

export  function MainListItems({classes})  {

  return (
    <div>
    <Link className={classes.linkCompact} href="/">
      <ListItem button key="main">
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Main" />
      </ListItem>
    </Link>
    <Link className={classes.linkCompact} href="/Dashboard">
      <ListItem button key="dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </Link>
    <Link className={classes.linkCompact} href="/Faq">
      <ListItem button key="faq">
        <ListItemIcon>
          <FaqIcon />
        </ListItemIcon>
        <ListItemText primary="Faq" />
      </ListItem>
    </Link>
    <Link className={classes.linkCompact} href="/Subscription"  >
      <ListItem button key="subscription">
        <ListItemIcon>
          <LoyaltyIcon />
        </ListItemIcon>
        <ListItemText primary="Subscription" />
      </ListItem>
    </Link>
    <a href="/blog" style={{
    margin: '0rem',
    textDecoration: 'none',
    color: "#6239AB",
    "&:hover": {
        color: "#607466",
        textDecoration: "none"
    }
}}>
      <ListItem button key="blog">
        <ListItemIcon>
          <BlogIcon />
        </ListItemIcon>
        <ListItemText primary="Blog" />
      </ListItem>
    </a>
    <Link className={classes.linkCompact} href="/Download"> {/* Link to the DownloadPage */}
        <ListItem button key="download">
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <ListItemText primary="Download" />
        </ListItem>
      </Link>

  </div>

  );
}
 
export default React.memo(MainListItems); 

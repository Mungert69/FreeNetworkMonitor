import React from 'react';
import clsx from 'clsx';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MainListItems from './MainListItems';

const DashboardDrawer = ({ classes, open, handleDrawerClose, isMediumOrLarger }) => (
  <Drawer
    variant={isMediumOrLarger ? 'permanent' : 'temporary'}
    open={open}
    onClose={handleDrawerClose}
    classes={{
      paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
    }}
  >
    <div className={classes.toolbarIcon}>
      <IconButton onClick={handleDrawerClose} size="large">
        <ChevronLeftIcon />
      </IconButton>
    </div>
    <List disablePadding sx={{ pl: 0, pr: 0 }}>
      <MainListItems classes={classes} />
    </List>
  </Drawer>
);

export default React.memo(DashboardDrawer);


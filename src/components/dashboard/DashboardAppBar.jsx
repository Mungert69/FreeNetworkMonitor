import React from 'react';
import clsx from 'clsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EditIcon from '@mui/icons-material/Edit';
import FadeWrapper from './FadeWrapper';
import LogoLink from '../main/LogoLink';
import AuthNav from '../auth-nav';
import MiniProfile from './MiniProfile';
import Loading from '../../loading';

const DashboardAppBar = ({
  classes,
  open,
  handleDrawerOpen,
  isMediumOrLarger,
  isLoggedIn = false,
  toggleTable = false,
  listDataLength = 0,
  hostListIconText = '',
  editIconClick = () => {},
  toggleChatView = () => {},
  isChatOpen = false,
  openInNewTab = false,
  alertCount = 0,
  apiUser = {},
  siteId,
  initViewSub = false,
  setInitViewSub = () => {},
  getUserInfo = () => {},
  showLoading = true,
  loadingProps = {},
}) => (
  <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
    <Toolbar className={classes.toolbar}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        size="large"
      >
        <MenuIcon />
      </IconButton>
      <LogoLink />
      {isMediumOrLarger && (
        <Typography sx={{ paddingLeft: 4 }} component="h1" color="inherit" noWrap className={classes.title}>
          Network Monitor Dashboard
        </Typography>
      )}
      {isLoggedIn && (
        <FadeWrapper toggle={toggleTable && listDataLength === 0}>
          <IconButton color="inherit">
            <Badge color="secondary">
              <Tooltip title={hostListIconText} TransitionComponent={Zoom}>
                <EditIcon onClick={editIconClick} />
              </Tooltip>
            </Badge>
          </IconButton>
        </FadeWrapper>
      )}
      <Box sx={{ flexGrow: 1 }} />
      <IconButton onClick={toggleChatView} className={clsx(classes.chatToggle, { [classes.chatToggleShift]: isChatOpen })}>
        <ChatIcon />
      </IconButton>
      <Box sx={{ ml: 2, display: 'inline-flex', alignItems: 'center' }}>
        <AuthNav openInNewTab={openInNewTab} />
      </Box>
      <IconButton color="inherit">
        <Badge badgeContent={alertCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      {isLoggedIn && (
        <MiniProfile
          apiUser={apiUser}
          siteId={siteId}
          initViewSub={initViewSub}
          setInitViewSub={setInitViewSub}
          getUserInfo={getUserInfo}
        />
      )}
    </Toolbar>
    {showLoading && <Loading {...loadingProps} />}
  </AppBar>
);

export default React.memo(DashboardAppBar);

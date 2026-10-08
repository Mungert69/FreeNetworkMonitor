import AppearanceMenu from '../../theme/AppearanceMenu';
import React from 'react';
import clsx from 'clsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HeaderBrand from '../main/HeaderBrand';
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
  <AppBar position="absolute" className={clsx(classes.appBar, open && isMediumOrLarger && classes.appBarShift)}>
    <Toolbar className={classes.toolbar}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        size="medium"
      >
        <MenuIcon />
      </IconButton>
      <LogoLink />
      {isMediumOrLarger && (
        <HeaderBrand sx={{ paddingLeft: 4 }} className={classes.title} />
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
      <AppearanceMenu />
      <IconButton onClick={toggleChatView} className={classes.chatToggle} aria-label="Toggle assistant" aria-expanded={isChatOpen}>
        <ChatIcon />
      </IconButton>
      <Box sx={{
        ml: { xs: 0, sm: 2 }, display: 'inline-flex', alignItems: 'center', flexShrink: 0,
        '& .MuiButton-root': {
          height: 40, boxShadow: 'none', bgcolor: 'transparent', color: 'inherit',
          '&:hover': { boxShadow: 'none', bgcolor: 'action.hover' },
          '& .MuiSvgIcon-root': { fontSize: 22 },
          '@media (max-width: 599.95px)': {
            minWidth: 40, width: 40, p: 0, fontSize: 0,
            '& .MuiButton-endIcon': { m: 0 },
          },
        },
        // Keep the accessible button text, with an icon-only presentation on phones.
      }}>
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

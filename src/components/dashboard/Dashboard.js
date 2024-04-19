import React, { useState, useEffect, useRef } from "react";
import clsx from 'clsx';

import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EditIcon from '@mui/icons-material/Edit';
import ListSubheader from '@mui/material/ListSubheader';
import MainListItems from './MainListItems';
import Chart from './Chart';
import HostDetail from './HostDetail';
import HostList from './HostList';
//import HostListEdit from './HostListEdit';
import HostListEdit from './HostListEdit';
import Loading from '../../loading';
import LogoLink from '../main/LogoLink';
import MiniProfile from './MiniProfile';
import { convertDate,getStartSiteId, getServerLabel, fetchChartData, fetchListData, fetchDataSetsByDate, fetchProcessorList, resetAlertApiCall, fetchLoadServer, getSiteIdfromUrl, addUserApi, getUserInfoApi } from './ServiceAPI';
import { useMediaQuery } from '@mui/material';
import AuthNav from '../auth-nav';
import styleObject from './styleObject';
import useClasses from "./useClasses";
import useTheme from '@mui/material/styles/useTheme';
import { Helmet } from 'react-helmet'
import FadeWrapper from './FadeWrapper';
import ReactGA4 from 'react-ga4';
import { useFusionAuth } from '@fusionauth/react-sdk';
import Chat from "./Chat";

export default function Dashboard() {
  const theme = useTheme();
  const { isAuthenticated, user } = useFusionAuth();
  const defaultHost = { 'id': 1 };
  const [apiUser, setApiUser] = useState({});
  const [viewInfo, setViewInfo] = useState(false);
  //const [defaultUser, setDefaultUser] = React.useState(true);
  //const [open, setOpen] = React.useState(false);
  const [chartData, setChartData] = React.useState([]);
  const [listData, setListData] = React.useState([]);
  const [dataSets, setDataSets] = React.useState([]);
  const [hostData, setHostData] = React.useState(defaultHost);
  const [dataSetId, setDataSetId] = React.useState(0);
  const [siteId, setSiteId] = React.useState(getStartSiteId());
  const [selectedDate, setSelectedDate] = React.useState();
  const [alertCount, setAlertCount] = React.useState(0);
  const [toggleTable, setToggleTable] = React.useState(true);
  const [reloadListData, setReloadListData] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [realTime, setRealTime] = React.useState(true);
  const [dateStart, setDateStart] = React.useState();
  const [dateEnd, setDateEnd] = React.useState();
  const [processorList, setProcessorList] = React.useState([]);
  const [initViewSub, setInitViewSub] = React.useState(false);
  const [hostListIconText, setHostListIconText] = React.useState("Add Hosts");
  const reloadListDataRef = useRef(reloadListData);
  reloadListDataRef.current = reloadListData;
  const dataSetIdRef = useRef(dataSetId);
  dataSetIdRef.current = dataSetId;
  const classes = useClasses(styleObject(theme, null));
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightTallPaper = clsx(classes.paper, classes.fixedHeightTall);

  const isMediumOrLarger = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChatView = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleHostLinkClick = (linkData) => {
    if (linkData.isHostData) {
      setDataSetId(linkData.DataSetID);
      const hostData = { 'id' : linkData.ID, 'dataSetID': linkData.DataSetID, 'date': convertDate(linkData.DateStarted, 'YYYY-MM-DD HH:mm'), 'address': linkData.Address, 'monitorStatus': linkData.MonitorStatus, 'packetsLost': linkData.PacketsLost, 'percentageLost': linkData.PacketsLostPercentage, 'packetsSent': linkData.PacketsSent, 'roundTripMaximum': linkData.RoundTripTimeMaximum, 'roundTripMinimum': linkData.RoundTripTimeMinimum, 'status': linkData.Status, 'roundTripAverage': linkData.RoundTripTimeAverage, 'monitorIPID': linkData.MonitorIPID, 'appID': linkData.AppID, 'endPointType': linkData.EndPointType, 'alertFlag': linkData.MonitorStatus.alertFlag, 'userID' : linkData.UserID };    
      if (hostData !== undefined) {
        clickViewChart(hostData);
      }
      setToggleTable(true);
    }
    if (linkData.isHostList) {
      setToggleTable(false);
    }

    // TODO: Implement the logic to display host-specific data
    // You could potentially change component state to show the chart or the details
    console.log("Host Link Clicked with ID:", hostData.ID);
  };

  const getUserInfo = async () => {

    const apiUser = await getUserInfoApi(siteId, user);
    await setApiUser(apiUser);
    console.log(" Current User is " + JSON.stringify(apiUser));
  }
  const handleSetDataSetId = (id, date) => {
    // change the data set id
    setDataSetId(id);
    setSelectedDate(date);
  };
  const resetHostAlert = async (id) => {
    await resetAlertApiCall(id, siteId, setReloadListData, reloadListData, apiUser);
  };
  const setEditMode = async () => {
    setToggleTable(toggleTable => !toggleTable);

  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const editIconClick = async () => {
    setRealTime(realTime => !realTime);
    await setEditMode();
    // Reload ListData if clicking into view mode. Hide view mode if clicking into edit mode.
    if (toggleTable) {
      setViewInfo(false);
      setHostListIconText("View Hosts");
    }
    else {
      setReloadListData(reloadListData => !reloadListData);
      setHostListIconText("Add Hosts");
    }
  }
  const clickViewChart = (hostData) => {
    // Set hostData to the selected host
    setHostData(hostData);
    // Set viewInfo to true to show the chart.
    setViewInfo(true);
  };


  useEffect(() => {

    const getAccess = async () => {
      var siteId = 0;
      try {
        console.log("Calling fetchLoadServer");
        var loadServer = await fetchLoadServer(user);
        console.log("Calling getSiteIdfromUrl");
        siteId = await getSiteIdfromUrl(loadServer);
        console.log("Calling addUserApi");
        await addUserApi(siteId, user);
        console.log("Calling setSiteId");
        await setSiteId(siteId);
        console.log("Calling getUserInfo");
        await getUserInfo();
        // TODO Are we are going to need to get a new token if load server is changed?
      } catch (e) {
        console.log("Error in Dashboard failed to get access error was" + e + " : user was " + user.sub);
      }
    }

    const checkAuth = async () => {

      setIsLoading(true);
      if (isAuthenticated) {
        //await setDefaultUser(false);
        await getAccess();
        console.log("Is Authenticated is true")
        ReactGA4.event({
          category: 'User',
          action: 'User Logged In'
        });
      }
      else {
        //await setDefaultUser(true);
        console.log("Is Authenticated is false")
        await setSiteId(getStartSiteId());
        await setApiUser(undefined);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [isAuthenticated]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('initViewSub')) {
      setInitViewSub(true);
    }
  }, []);
  useEffect(() => {
    let interval;
    if (realTime) {
      interval = setInterval(() => {
        if (dataSetIdRef.current === 0) {
          console.log('Auto reload data');
          setReloadListData(currentVal => !currentVal);
        }
      }, 60000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [realTime]);
  useEffect(() => {
    // Set hostData to monitorIPID  found in listData.
    const item = listData.find(item => item.monitorIPID === hostData.monitorIPID);
    // If item not undefined then set hostData to item.
    if (item !== undefined) {
      setHostData(item);
    }
  }, [listData]);
  useEffect(() => {
    const fetchData = async () => {
      await setIsLoading(true);
      await fetchChartData(hostData, dataSetIdRef.current, siteId, setChartData, user, isAuthenticated);
      await setIsLoading(false);
    };
    fetchData();
    // Fetch chart data when hostData or datasetId changes.
    //setIsLoading(false);
  }, [hostData]);
  useEffect(() => {
    const fetchData = async () => {
      await setIsLoading(true);
      await fetchListData(dataSetId, siteId, setListData, setAlertCount, user, isAuthenticated);
      await setIsLoading(false);
    };
    fetchData();
  }, [reloadListData, dataSetId, siteId, apiUser]);

  useEffect(() => {
    const fetchData = async () => {
      await setIsLoading(true);
      await fetchDataSetsByDate(siteId, setDataSets, dateStart, dateEnd);
      await fetchProcessorList(siteId, setProcessorList, user, isAuthenticated);
      await setIsLoading(false);
    };
    fetchData();
  }, [siteId, dateStart, dateEnd]);
  return (
    <div className={classes.root}>

      <Helmet>
        <title>Dashboard For Free Network Monitor</title>
        <meta name="description" content="This is the dashboard for Free Network Monitor. It provides a free online network monitoring service.
     Providing realtime monitoring, charts and alerts
     for all your websites and network hosts. Setup is easy and simple. It is free to use."></meta>
      </Helmet>
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            size="large">
            <MenuIcon />
          </IconButton>
          <LogoLink />
          <Typography sx={{ display: { xs: 'none', sm: 'block' }, paddingLeft: 4 }} component="h1" color="inherit" noWrap className={classes.title}>
            Network Monitor Dashboard
          </Typography>
          <Typography sx={{ display: { xs: 'block', sm: 'none' } }} component="h1" color="inherit" noWrap className={classes.title}>
            Dashboard
          </Typography>
          {
            !isAuthenticated ? null :
              <FadeWrapper toggle={toggleTable && listData.length === 0}>
                <IconButton color="inherit">
                  <Badge color="secondary">
                    <Tooltip title={hostListIconText}
                      TransitionComponent={Zoom}>

                      <EditIcon onClick={() => editIconClick()} />


                    </Tooltip>
                  </Badge>
                </IconButton>
              </FadeWrapper>
          }
          <IconButton onClick={toggleChatView} className={classes.chatToggle}>
            <ChatIcon />
          </IconButton>

          <AuthNav />
          <IconButton color="inherit" >
            <Badge badgeContent={alertCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {!isAuthenticated ? null : <MiniProfile apiUser={apiUser} siteId={siteId} initViewSub={initViewSub} setInitViewSub={setInitViewSub} getUserInfo={getUserInfo} />}
        </Toolbar>
        <Loading />
      </AppBar>
      <Drawer
        variant={isMediumOrLarger ? "permanent" : "temporary"}
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
        <Divider />
        <List><MainListItems classes={classes} /></List>
        <Divider />

      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container} >
          <div className={classes.chatAndTableContainer}>

            <Grid container spacing={1}>
              {viewInfo &&
                <Grid item xs={12} sm={12} md={10} lg={10}>
                  <Paper className={fixedHeightPaper}>
                    <Chart
                      data={chartData}
                      selectedDate={selectedDate}
                      hostname={hostData.address}
                      dataSetId={dataSetId}
                      dataSets={dataSets}
                      handleSetDataSetId={handleSetDataSetId}
                    />
                  </Paper>
                </Grid>
              }
              {viewInfo &&
                <Grid item xs={12} sm={12} md={2} lg={2} >
                  <Paper className={classes.paper}>
                    <HostDetail hostData={hostData} />
                  </Paper>
                </Grid>
              }

              <Grid item xs={12}>

                <Paper className={classes.paper}>
                  {toggleTable ?
                    <HostList data={listData}
                      clickViewChart={clickViewChart}
                      resetHostAlert={resetHostAlert}
                      processorList={processorList}
                      dataSets={dataSets}
                      handleSetDataSetId={handleSetDataSetId}
                      setDateStart={setDateStart}
                      setDateEnd={setDateEnd} />
                    :
                    <React.Fragment>

                      <HostListEdit siteId={siteId} processorList={processorList} />
                    </React.Fragment>
                  }
                </Paper>

                <div className={isChatOpen ? classes.chatContainer : classes.chatHidden}>
                <Chat onHostLinkClick={handleHostLinkClick} isDashboard={true}/>
            </div>
              </Grid>
            </Grid>
          </div>
        </Container>
      </main>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
import clsx from 'clsx';
import CssBaseline from '@mui/material/CssBaseline';
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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EditIcon from '@mui/icons-material/Edit';
import ListSubheader from '@mui/material/ListSubheader';
import MainListItems from './MainListItems';
import Chart from './Chart';
import HostDetail from './HostDetail';
import HostListPag from './HostListPag';
//import HostListEdit from './HostListEdit';
import HostListEdit from './HostListEdit';
import Loading from '../../loading';
import LogoLink from '../main/LogoLink';
import MiniProfile from './MiniProfile';
import { getStartSiteId, getServerLabel, fetchChartData, fetchListData, fetchDataSetsByDate, fetchProcessorList, resetAlertApiCall, fetchLoadServer, getSiteIdfromUrl, addUserApi } from './ServiceAPI';
import DataSetsList from './DataSetsList';
import AuthNav from '../auth-nav';
import styleObject from './styleObject';
import useClasses from "./useClasses";
import useTheme from '@mui/material/styles/useTheme';
import { Helmet } from 'react-helmet'
import ReactGA4 from 'react-ga4';
import { useAuth0 } from "@auth0/auth0-react";



export default function Dashboard() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const defaultHost = { 'id': 1 };
  const [apiUser , setApiUser] = useState({});
  const [viewInfo, setViewInfo] = useState(false);
  const [defaultUser, setDefaultUser] = React.useState(true);
  const [open, setOpen] = React.useState(true);
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
  const [reloadChart, setReloadChart] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [realTime, setRealTime] = React.useState(true);
  const [token, setToken] = React.useState();
  const [dateStart, setDateStart] = React.useState();
  const [dateEnd, setDateEnd] = React.useState();
  const [processorList, setProcessorList] = React.useState([]);
  const [initViewSub, setInitViewSub] = React.useState(false);
  const reloadListDataRef = useRef(reloadListData);
  reloadListDataRef.current = reloadListData;
  const dataSetIdRef = useRef(dataSetId);
  dataSetIdRef.current = dataSetId;
  const classes = useClasses(styleObject(useTheme(), null));
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightTallPaper = clsx(classes.paper, classes.fixedHeightTall);
  const handleSetDataSetId = (id, date) => {
    // change the data set id
    setDataSetId(id);
    setSelectedDate(date);
  };
  const resetHostAlert = async (id) => {
    await resetAlertApiCall(id, siteId, setReloadListData, reloadListData, apiUser, token);
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
    }
    else {
      setReloadListData(reloadListData => !reloadListData);
    }
  }
  const clickViewChart = (hostData) => {
    // Set hostData to the selected host
    setHostData(hostData);
    // Set viewInfo to true to show the chart.
    setViewInfo(true);
  };
 
  
  useEffect(() => {
    const getAccessToken = async () => {
      var siteId = 0;
      try {
        const token = await getAccessTokenSilently({
        });
        console.log("Got Auth0 token in Dashboard : " + token);
        var loadServer = await fetchLoadServer(user, token);
        siteId = await getSiteIdfromUrl(loadServer);
        const apiUser = await addUserApi(siteId, user, token);
        setSiteId(siteId);
        setToken(token);
        await setApiUser(apiUser);
        // TODO Are we are going to need to get a new token if load server is changed.
      } catch (e) {
        console.log("Error in Dashboard failed to get token error was" + e + " : user was " + user.sub);
      }
    }
    const checkAuth = async () => {
      setIsLoading(true);
      if (isAuthenticated) {
        setDefaultUser(false);
        await getAccessToken();
        ReactGA4.event({
          category: 'User',
          action: 'User Logged In'
        });
      }
      else {
        setDefaultUser(true);
        await setApiUser(undefined);
        setToken(undefined);
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
      setIsLoading(true);
      await fetchChartData(hostData, dataSetIdRef.current, siteId, setChartData, user, token);
      setIsLoading(false);
    };
    fetchData();
    // Fetch chart data when hostData or datasetId changes.
    //setIsLoading(false);
  }, [hostData, reloadChart]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchListData(dataSetId, siteId, setListData, setAlertCount, user, token);
      setIsLoading(false);
    };
    fetchData();
  }, [reloadListData, dataSetId, siteId, token]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchDataSetsByDate(siteId, setDataSets, dateStart, dateEnd);
      await fetchProcessorList(siteId, setProcessorList);
      setIsLoading(false);
    };
    fetchData();
  }, [siteId, dateStart, dateEnd]);
  return (
    <div className={classes.root}>
      <CssBaseline />
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
            defaultUser ? null :
              <IconButton color="inherit">
                <Badge color="secondary">
                  <Tooltip title="Edit Host List"
                    TransitionComponent={Zoom}>
                    <EditIcon onClick={() => editIconClick()} />
                  </Tooltip>
                </Badge>
              </IconButton>
          }
          <AuthNav />
          <IconButton color="inherit" >
            <Badge badgeContent={alertCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {defaultUser ? null : <MiniProfile  apiUser={apiUser} token={token} siteId={siteId} initViewSub={initViewSub} setInitViewSub={setInitViewSub} />}
        </Toolbar>
        <Loading />
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose} size="large">
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List><MainListItems /></List>
        <Divider />
        <ListSubheader>Select a Dataset</ListSubheader>
        <Paper className={fixedHeightTallPaper}>
          <DataSetsList dataSets={dataSets} handleSetDataSetId={handleSetDataSetId} setDateStart={setDateStart} setDateEnd={setDateEnd} />
        </Paper>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container} >
          <Grid container spacing={1}>
            {viewInfo &&
              <Grid item xs={12} sm={12} md={10} lg={10}>
                <Paper className={fixedHeightPaper}>
                  <Chart data={chartData} selectedDate={selectedDate} hostname={hostData.address} />
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
                  <HostListPag data={listData} clickViewChart={clickViewChart} resetHostAlert={resetHostAlert} processorList={processorList} />
                  :
                  <React.Fragment>

                    <HostListEdit siteId={siteId} token={token} processorList={processorList} />
                  </React.Fragment>
                }
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}

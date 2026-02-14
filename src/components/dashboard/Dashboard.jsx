import React, { useState, useEffect, useRef, lazy, useCallback, useMemo } from "react";

import Slide from '@mui/material/Slide';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Loading from '../../loading';
import { resetPredictAlertApiCall, convertDate, getBaseDomain, getSupportEmail, getServerLabel, fetchChartData, fetchListData, fetchDataSetsByDate, fetchProcessorList, resetAlertApiCall, fetchLoadServer, fetchFirstLoadServer, getSiteIdfromUrl, addUserApi, getUserInfoApi } from './ServiceAPI';
import { useMediaQuery } from '@mui/material';
import styleObject from './styleObject';
import useClasses from "./useClasses";
import { useTheme } from '@mui/material/styles';
import Seo from '../Seo';
//import { ga4Event } from '../../ga4';
import { useFusionAuth } from '@fusionauth/react-sdk';
import DashboardAppBar from './DashboardAppBar';
import DashboardDrawer from './DashboardDrawer';
import DashboardMainPanel from './DashboardMainPanel';
import DashboardChartDialog from './DashboardChartDialog';

const Chart = lazy(() => import('./Chart'));
const HostList = lazy(() => import('./HostList'));
const HostListEdit = lazy(() => import('./HostListEdit'));
const Chat = lazy(() => import('./Chat/Chat'));

const FullScreenDialogTransition = React.forwardRef(function FullScreenDialogTransition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Dashboard() {
  const publicUrl = import.meta.env.VITE_PUBLIC_URL;


  const theme = useTheme();
  const { isLoggedIn, userInfo, isFetchingUserInfo } = useFusionAuth();
  const defaultHost = { 'id': 1 };
  const [apiUser, setApiUser] = useState({});
  //const [defaultUser, setDefaultUser] = React.useState(true);
  //const [open, setOpen] = React.useState(false);
  const [chartData, setChartData] = React.useState([]);
  const [listData, setListData] = React.useState([]);
  const [dataSets, setDataSets] = React.useState([]);
  const [hostData, setHostData] = React.useState(defaultHost);
  const [dataSetId, setDataSetId] = React.useState(0);
  const [siteId, setSiteId] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState();
  const [defaultSearchValue, setDefaultSearchValue] = React.useState('');
  const [alertCount, setAlertCount] = React.useState(0);
  const [toggleTable, setToggleTable] = React.useState(true);
  const [reloadListData, setReloadListData] = React.useState(true);
  const [llmHostUpdateToken, setLlmHostUpdateToken] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [realTime, setRealTime] = React.useState(true);
  const [dateStart, setDateStart] = React.useState();
  const [dateEnd, setDateEnd] = React.useState();
  const [processorList, setProcessorList] = React.useState([]);
  const [initViewSub, setInitViewSub] = React.useState(false);
  const [openInNewTab, setOpenInNewTab] = React.useState(false);
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false);
  const [hostListIconText, setHostListIconText] = React.useState("Add Hosts");
  const reloadListDataRef = useRef(reloadListData);
  reloadListDataRef.current = reloadListData;
  const dataSetIdRef = useRef(dataSetId);
  dataSetIdRef.current = dataSetId;
  const classes = useClasses(styleObject(theme, null));
  const isMediumOrLarger = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const [dashboardError, setDashboardError] = useState('');
  const isValidSiteId = Number.isInteger(siteId) && siteId >= 0;
  const supportEmail = getSupportEmail() || 'support@readyforquantum.com';

  const toggleChatView = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const handleSetDataSetId = useCallback((id, date) => {
    setDataSetId(id);
    setSelectedDate(date);
  }, []);

  const closeChartDialog = useCallback(() => {
    setIsChartDialogOpen(false);
  }, []);

  const clickViewChart = useCallback((hostData) => {
    console.log("Passing host data to chart:", JSON.stringify(hostData));
    setHostData(hostData);
    setIsChartDialogOpen(true);
  }, []);

  const resetHostAlert = useCallback(
    async (id) => {
      await resetAlertApiCall(id, siteId, setReloadListData, reloadListData, apiUser);
    },
    [siteId, reloadListData, apiUser],
  );

  const resetPredictAlert = useCallback(
    async (id) => {
      await resetPredictAlertApiCall(id, siteId, setReloadListData, reloadListData, apiUser);
    },
    [siteId, reloadListData, apiUser],
  );

  const handleHostLinkClick = useCallback((linkData) => {
    if (linkData.isHostData) {

      const hostData = { 'id': linkData.ID, 'dataSetID': linkData.DataSetID, 'date': convertDate(linkData.DateStarted, 'YYYY-MM-DD HH:mm'), 'address': linkData.Address, 'monitorStatus': linkData.MonitorStatus, 'packetsLost': linkData.PacketsLost, 'percentageLost': linkData.PacketsLostPercentage, 'packetsSent': linkData.PacketsSent, 'roundTripMaximum': linkData.RoundTripTimeMaximum, 'roundTripMinimum': linkData.RoundTripTimeMinimum, 'status': linkData.Status, 'roundTripAverage': linkData.RoundTripTimeAverage, 'monitorIPID': linkData.MonitorIPID, 'appID': linkData.AppID, 'endPointType': linkData.EndPointType, 'alertFlag': linkData.MonitorStatus.alertFlag, 'userID': linkData.UserID };
      if (hostData !== undefined) {
        setDefaultSearchValue(hostData.address);
        handleSetDataSetId(hostData.dataSetID, hostData.date);
        clickViewChart(hostData);
        setHostListIconText("Add Hosts");

      }
      setToggleTable(true);
    }
    if (linkData.isHostList) {
      setDefaultSearchValue(linkData.Address);
      setToggleTable(false);
      closeChartDialog();
      setHostListIconText("View Hosts");
    }

    // TODO: Implement the logic to display host-specific data
    // You could potentially change component state to show the chart or the details
    //console.log("Host Link Clicked with host data:", JSON.stringify(hostData));
  }, [handleSetDataSetId, clickViewChart, closeChartDialog]);

  const handleHostListUpdated = useCallback(() => {
    console.log('LLM host update detected, refreshing lists');
    setReloadListData((currentVal) => !currentVal);
    setLlmHostUpdateToken((currentVal) => currentVal + 1);
  }, []);


  const hostListProps = useMemo(
    () => ({
      siteId,
      data: listData,
      clickViewChart,
      resetHostAlert,
      resetPredictAlert,
      processorList,
      dataSets,
      dataSetId,
      selectedDate,
      handleSetDataSetId,
      setDateStart,
      setDateEnd,
      defaultSearchValue,
    }),
    [
      siteId,
      listData,
      clickViewChart,
      resetHostAlert,
      resetPredictAlert,
      processorList,
      dataSets,
      dataSetId,
      selectedDate,
      handleSetDataSetId,
      setDateStart,
      setDateEnd,
      defaultSearchValue,
    ],
  );

  const hostListEditProps = useMemo(
    () => ({
      siteId,
      processorList,
      defaultSearchValue,
      llmUpdateToken: llmHostUpdateToken,
    }),
    [siteId, processorList, defaultSearchValue, llmHostUpdateToken],
  );

  const chatProps = useMemo(
    () => ({
      onHostLinkClick: handleHostLinkClick,
      onHostListUpdated: handleHostListUpdated,
      isDashboard: true,
      initRunnerType: "TurboLLM",
      setIsChatOpen,
      siteId,
      isChartDialogOpen,
      closeChartDialog,
    }),
    [handleHostLinkClick, handleHostListUpdated, setIsChatOpen, siteId, isChartDialogOpen, closeChartDialog],
  );

  const chartProps = useMemo(
    () => ({
      data: chartData,
      selectedDate,
      hostname: hostData.address,
      dataSetId,
      dataSets,
      handleSetDataSetId,
      hostDetail: hostData,
      fullScreen: true,
    }),
    [chartData, selectedDate, hostData, dataSetId, dataSets, handleSetDataSetId],
  );

  const getUserInfo = async () => {
    if (!isValidSiteId) {
      return;
    }

    const apiUser = await getUserInfoApi(siteId, userInfo);
    await setApiUser(apiUser);
    console.log(" Current User is " + JSON.stringify(apiUser));
  }
  const setEditMode = async () => {
    setDefaultSearchValue('');
    setToggleTable(toggleTable => !toggleTable);


  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const editIconClick = async () => {
    setIsChatOpen(false); // Hide the assistant when edit is clicked
    setRealTime(realTime => !realTime);
    await setEditMode();
    // Reload ListData if clicking into view mode. Hide view mode if clicking into edit mode.
    if (toggleTable) {
      closeChartDialog();
      setHostListIconText("View Hosts");
    }
    else {
      setReloadListData(reloadListData => !reloadListData);
      setHostListIconText("Add Hosts");
    }
  }


  useEffect(() => {

    const getAccess = async () => {
      let resolvedSiteId = -1;
      try {
        console.log("Calling fetchLoadServer is Authenticated triggered");
        var loadServer = await fetchLoadServer(userInfo);
        console.log("Calling getSiteIdfromUrl");
        resolvedSiteId = await getSiteIdfromUrl(loadServer);
        if (!Number.isInteger(resolvedSiteId) || resolvedSiteId < 0) {
          throw new Error("Load server URL did not map to a configured API base URL");
        }
        console.log("Calling addUserApi");
        var apiUser = await addUserApi(resolvedSiteId, userInfo);
        console.log("Calling setSiteId");
        await setSiteId(resolvedSiteId);
        setDashboardError('');

        await setApiUser(apiUser);
        console.log(" Current User is " + JSON.stringify(apiUser));

        // TODO Are we are going to need to get a new token if load server is changed?
      } catch (e) {
        console.log("Error in Dashboard failed to get access error was" + e + " : user was " + userInfo.sub);
        setDashboardError('Unable to connect to a configured backend server.');
        await setSiteId(null);
        await setApiUser(undefined);
      }
    }



    const checkAuth = async () => {

      setIsLoading(true);
      if (isLoggedIn && !isFetchingUserInfo) {
        //await setDefaultUser(false);

        console.log("isLoggedIn = " + JSON.stringify(isLoggedIn) + " isFetchingUserInfo " + JSON.stringify(isFetchingUserInfo))
        /*ga4Event({
          category: 'User',
          action: 'User Logged In'
        });*/
        await getAccess();
      }
      else {
        //await setDefaultUser(true);
        console.log("Is Authenticated is false")
        await firstLoadSiteId();
        await setApiUser(undefined);
      }
      setChatKey(prevKey => prevKey + 1);
      setIsLoading(false);
    };
    checkAuth();
  }, [isLoggedIn, isFetchingUserInfo]);
  const firstLoadSiteId = async () => {
    let resolvedSiteId = -1;
    try {
      console.log("Calling fetchLoadServer for user default");
      var loadServer = await fetchFirstLoadServer();
      console.log("Calling getSiteIdfromUrl");
      resolvedSiteId = await getSiteIdfromUrl(loadServer);
      if (!Number.isInteger(resolvedSiteId) || resolvedSiteId < 0) {
        throw new Error("Default load server URL did not map to a configured API base URL");
      }
      console.log("Calling setSiteId");
      await setSiteId(resolvedSiteId);
      setDashboardError('');
    } catch (e) {
      console.log("Error in Dashboard failed to get load SiteId for default user: " + e);
      setDashboardError('Unable to connect to a configured backend server.');
      await setSiteId(null);
    }
  }


  useEffect(() => {

  // Parse query string
  const query = new URLSearchParams(window.location.search);

  // Parse hash fragment
  const hash = window.location.hash.slice(1); // Remove the '#'
  const hashParams = new URLSearchParams(hash); // Parse the hash as query-like parameters

  // Check for 'openInNewTab' in either query or hash
  if (query.has('openInNewTab') || hashParams.has('openInNewTab')) {
    setOpenInNewTab(true);
    console.log("Setting openInNewTab");
  }

  // Check for 'assistant' in either query or hash
  if (query.get('assistant') === 'open' || hashParams.get('assistant') === 'open') {
    setIsChatOpen(true);
    console.log("Setting assistant=open");
  }

  // Check for 'initViewSub' in either query or hash
  if (query.has('initViewSub') || hashParams.has('initViewSub')) {
    setInitViewSub(true);
    console.log("Setting initViewSub");
  }

    //firstLoadSiteId();
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
      if (!isValidSiteId) {
        return;
      }
      await setIsLoading(true);
      await fetchChartData(hostData, dataSetIdRef.current, siteId, setChartData, userInfo, isLoggedIn);
      await setIsLoading(false);
    };
    fetchData();
    // Fetch chart data when hostData or datasetId changes.
    //setIsLoading(false);
  }, [hostData, siteId, isLoggedIn, userInfo, isValidSiteId]);
  useEffect(() => {
    const fetchData = async () => {
      if (!isValidSiteId) {
        return;
      }
      await setIsLoading(true);
      await fetchListData(dataSetId, siteId, setListData, setAlertCount, userInfo, isLoggedIn);
      await fetchProcessorList(siteId, setProcessorList, userInfo, isLoggedIn);
      await setIsLoading(false);
    };
    fetchData();
  }, [reloadListData, dataSetId, siteId, apiUser, isLoggedIn, userInfo, isValidSiteId]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isValidSiteId) {
        return;
      }
      await setIsLoading(true);
      await fetchDataSetsByDate(siteId, setDataSets, dateStart, dateEnd);
      await setIsLoading(false);
    };
    fetchData();
  }, [siteId, dateStart, dateEnd, isValidSiteId]);
  return (
    <div className={classes.root}>

      <Seo
        title="Quantum Network Monitor Dashboard - Comprehensive Network Monitoring & Security Management"
        description="Manage your network hosts, conduct security assessments, and run diagnostics with the Quantum Network Monitor Dashboard. Monitor real-time performance, execute custom commands, and ensure network integrity with advanced tools. Start monitoring for free today!"
        openGraph={{
          ogImage: {
            ogImage: `${publicUrl}/ping.svg`, // Add your OpenGraph image
            ogImageAlt: "Quantum Network Monitor Logo", // Add alt text for the image
          },
          ogUrl: `https://${getBaseDomain()}/dashboard`, // Canonical URL
          ogType: "website", // Type of content
          ogSiteName: "Quantum Network Monitor", // Site name
          ogLocale: "en_US", // Language and locale
        }}
      />
      <DashboardAppBar
        classes={classes}
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        isMediumOrLarger={isMediumOrLarger}
        isLoggedIn={isLoggedIn}
        toggleTable={toggleTable}
        listDataLength={listData.length}
        hostListIconText={hostListIconText}
        editIconClick={editIconClick}
        toggleChatView={toggleChatView}
        isChatOpen={isChatOpen}
        openInNewTab={openInNewTab}
        alertCount={alertCount}
        apiUser={apiUser}
        siteId={siteId}
        initViewSub={initViewSub}
        setInitViewSub={setInitViewSub}
        getUserInfo={getUserInfo}
      />
      <DashboardDrawer
        classes={classes}
        open={open}
        handleDrawerClose={handleDrawerClose}
        isMediumOrLarger={isMediumOrLarger}
      />
      {dashboardError && (
        <Alert
          severity="error"
          sx={{ mx: 2, mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          }
        >
          {dashboardError} Refresh the page and try again. If the problem persists, contact support at{' '}
          <Link href={`mailto:${supportEmail}`} color="inherit" underline="always">
            {supportEmail}
          </Link>
          .
        </Alert>
      )}
      <DashboardMainPanel
        classes={classes}
        isMediumOrLarger={isMediumOrLarger}
        toggleTable={toggleTable}
        HostListComponent={HostList}
        hostListProps={hostListProps}
        HostListEditComponent={HostListEdit}
        hostListEditProps={hostListEditProps}
        loadingFallback={<Loading />}
        isChatOpen={isChatOpen}
        chatKey={chatKey}
        siteId={siteId}
        ChatComponent={Chat}
        chatProps={chatProps}
      />
      <DashboardChartDialog
        open={isChartDialogOpen}
        onClose={closeChartDialog}
        TransitionComponent={FullScreenDialogTransition}
        ChartComponent={Chart}
        chartProps={chartProps}
        loadingFallback={<Loading />}
      />
    </div>
  );
}

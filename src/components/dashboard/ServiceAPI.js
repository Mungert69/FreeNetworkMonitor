import axios from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { trackPromise } from 'react-promise-tracker';
import axiosRetry from 'axios-retry';

let defaultUser='default';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);

let appsettings = {};  // Global variable to hold app settings

// Static imports for each possible settings file
import appsettingsDev from '../../appsettings-dev.json';
import appsettingsProd from '../../appsettings.json';
// Add more imports as needed

// Function to load the correct settings file based on the runtime configuration
function loadAppSettings() {
  try {
    // Get the appsettings file name dynamically (e.g., appsettings-dev.json)
    const { appsettingsFile } = window['runConfig'];  // This comes from your runtime config
    
    if (!appsettingsFile) {
      throw new Error("App settings file name not found");
    }

    // Choose the correct settings file based on the provided config
    switch (appsettingsFile) {
      case 'appsettings-dev.json':
        appsettings = appsettingsDev;
        break;
      case 'appsettings.json':
        appsettings = appsettingsProd;
        break;
      // Add other cases for different settings files
      default:
        throw new Error(`Unsupported app settings file: ${appsettingsFile}`);
    }

    console.log('App settings loaded successfully:', appsettings);
  } catch (error) {
    console.error('Error loading app settings:', error);
  }
}

// Call the function to load settings at the start of your app
loadAppSettings();

export const getBaseDomain = () => {
    return appsettings.baseDomain;
}

export const getSupportEmail = () =>{
    return appsettings.supportEmail;
}
export const getLlmTypes = () => {
    return appsettings.llmTypes;
}

// Functions to access app settings values
export const getStartSiteId = () => {
    return appsettings.startSiteId;
}

export const getServerLabel = () => {
    return appsettings.serverLabel;  // Assuming this value exists in appsettings
}

export const getServerUrlFromSiteId = (siteId) => {
    return appsettings.apiBaseUrls[siteId];
}

export const getApiSubscriptionUrl = () => {
    return appsettings.apiSubscriptionUrl;
}

export const getClientId = () => {
    return appsettings.clientId;
}

export const getServerUrl = () => {
    return appsettings.serverUrl;
}

export const getLLMServerUrl = (siteId) => {
    try {
        return appsettings.llmServerUrls[siteId];
    } catch (error) {
        console.log('ServiceAPI.getLLMServerUrl unable to get llmServerUrl: ' + error);
        return;
    }
}

export const getRedirectUri = () => {
    return appsettings.redirectUri;
}

// You can use dayjs and user timezone here as needed
const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const userTimeZone = resolvedTimeZone || dayjs.tz.guess();
console.log('User Timezone:', userTimeZone);


const { serverLabel } = window['serverLabel'];


const prompt = 'web query';

// Assuming appsettings is loaded correctly
const startSiteId = appsettings.startSiteId;
const apiLoadBalancerUrl = appsettings.apiLoadBalancerUrl;
const apiAudioUrl = appsettings.apiAudioUrl;
const apiBaseUrls = appsettings.apiBaseUrls;
const apiSubscriptionUrl = appsettings.apiSubscriptionUrl;
const clientId = appsettings.clientId;
const serverUrl = appsettings.serverUrl;
const redirectUri = appsettings.redirectUri;
const llmServerUrls = appsettings.llmServerUrls;

// Debugging: Log all variables
console.log('startSiteId:', startSiteId);
console.log('apiLoadBalancerUrl:', apiLoadBalancerUrl);
console.log('apiAudioUrl:', apiAudioUrl);
console.log('apiBaseUrls:', apiBaseUrls);
console.log('apiSubscriptionUrl:', apiSubscriptionUrl);
console.log('clientId:', clientId);
console.log('serverUrl:', serverUrl);
console.log('redirectUri:', redirectUri);
console.log('llmServerUrls:', llmServerUrls);

// Additional checks for arrays (like apiBaseUrls and llmServerUrls)
if (Array.isArray(apiBaseUrls)) {
  console.log('First API Base URL:', apiBaseUrls[0]);
} else {
  console.error('apiBaseUrls is not an array or is undefined');
}

if (Array.isArray(llmServerUrls)) {
  console.log('First LLM Server URL:', llmServerUrls[0]);
} else {
  console.error('llmServerUrls is not an array or is undefined');
}





const DATE_INPUT_FORMATS = [
  'YYYY-MM-DD HH:mm:ss',
  'YYYY-MM-DD HH:mm',
  'YYYY-MM-DDTHH:mm:ss',
  'YYYY-MM-DDTHH:mm:ss.SSS',
];

const toDayjsUtc = (value) => {
  if (value === undefined || value === null || value === '') {
    return dayjs.invalid();
  }

  if (dayjs.isDayjs(value)) {
    return typeof value.isUTC === 'function' && value.isUTC() ? value : value.utc();
  }

  if (value instanceof Date || typeof value === 'number') {
    return dayjs(value).utc();
  }

  if (typeof value === 'string') {
    let parsed = dayjs.utc(value);
    if (!parsed.isValid()) {
      for (const format of DATE_INPUT_FORMATS) {
        parsed = dayjs.utc(value, format, true);
        if (parsed.isValid()) {
          break;
        }
      }
    }

    if (parsed.isValid()) {
      return parsed;
    }

    const fallback = dayjs(value);
    return fallback.isValid() ? fallback.utc() : dayjs.invalid();
  }

  const fallback = dayjs(value);
  return fallback.isValid() ? fallback.utc() : dayjs.invalid();
};

export const convertDate = (date, format) => {
  const targetZone = userTimeZone || dayjs.tz.guess();
  const utcDate = toDayjsUtc(date);

  if (!utcDate.isValid()) {
    return '';
  }

  return utcDate.tz(targetZone).format(format);
};
export const getSiteIdfromUrl = (url) => {
    var siteId;

    try {
        siteId = apiBaseUrls.indexOf(url);
        console.log('ServiceAPI.getSiteIdfromUrl got SiteID = ' + siteId);
    } catch (e) {
        console.log('ServiceAPI.getSiteIdfromUrl failed to get SiteID. Error was : ' + e);
    }

    return siteId;
}


export const fetchLoadServer = async (user) => {
    var extUrlStr = 'Auth';
    var sentData = { User: user, Prompt: prompt };
    var data = undefined;

    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiLoadBalancerUrl + '/Load/GetLoadServer' + extUrlStr,
            data: sentData,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.fetchLoadServer Axios Error was : ' + error);
        return;
    }));
    try {
        data = result.data.data;
        console.log('ServiceAPI.fetchLoadServer got load server : ' + data);
        return data;

    }
    catch (error) {
        console.log('ServiceAPI.fetchLoadServer unable to set load server : ' + error);
        if (result != undefined && result.data.message !== undefined)
            console.log('Api Result.Message was ' + result.data.message);
        return;
    }
}

export const fetchFirstLoadServer = async () => {
    axiosRetry(axios, { retries: 3 });
    var data;
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiLoadBalancerUrl + '/Load/GetFirstLoadServer' ,
        }
    ).catch(function (error) {
        console.log('ServiceAPI.fetchFirstLoadServer Axios Error was : ' + error);
        return;
    }));
    try {
        data = result.data.data;
        console.log('ServiceAPI.fetchFirstLoadServer got load server : ' + data);
        return data;

    }
    catch (error) {
        console.log('ServiceAPI.fetchFirstLoadServer unable to set load server : ' + error);
        if (result != undefined && result.data.message !== undefined)
            console.log('Api Result.Message was ' + result.data.message);
        return;
    }
}


// Assuming handleDownload is defined inside the Profile component or receives setMessage as a parameter
export const handleDownload = async (baseUrlId, setMessage, setDownloadLink, setOpen, setIsLoading) => {
    setIsLoading(true);  // Set loading to true when download starts
    
    axiosRetry(axios, { retries: 3 });
    const result = await axios({
        method: 'post',
        url: apiBaseUrls[baseUrlId] + '/UserConfig/GetUserPingInfoTar',
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json'
        },
    }).catch(function (error) {
        console.log('ServiceAPI.handleDownload Axios Error was : ' + error);
        setMessage({ info: false, text: 'Failed to generate download link: ' + error.message });
    });

    if (result && result.data && result.data.success) {
        console.log('Setting message:', { info: true, text: 'Download ready. Click below to start the download.' });
        setOpen(true); 
        setDownloadLink(result.data.data);
        setMessage({ info: true, text: 'Download ready. Click the link below to start the download.' });
    } else if (result && result.data) {
        console.log('Error:', { info: true, text: 'Error: ' + result.data.message });

        setMessage({ info: false, text: 'Error: ' + result.data.message });
    }
    setIsLoading(false);
};


export const fetchEndpointTypes = async (baseUrlId, agentLocation = '') => {
    var data = [];
    axiosRetry(axios, { retries: 3 });
    const trimmedLocation = agentLocation ? String(agentLocation).trim() : '';
    const queryString = trimmedLocation
        ? `?agent_location=${encodeURIComponent(trimmedLocation)}`
        : '';
    console.log('ServiceAPI.fetchEndpointTypes request', {
        baseUrlId,
        agentLocation: trimmedLocation,
    });
    const result = await trackPromise(axios(
        {
            method: 'get',
            url: apiBaseUrls[baseUrlId] + '/HostConfig/GetAvailableEndpointTypes' + queryString, 
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.fetchEndpointTypes Axios Error was : ' + error);
        return;
    }));
    
    try {
        result.data.data.map((row) => {
            console.log('Found EndPointType '+JSON.stringify(row));
            data.push(row);
        });
    }
    catch (error) {
        console.log('ServiceAPI.fetchEndpointTypes Mapping Data Error was : ' + error);
        if (result !== undefined && result.data.message !== undefined)
            console.log('Api Result.Message was ' + result.data.message);
        return undefined;
    }

    console.log('ServiceAPI.fetchEndpointTypes fetched ' + data.length + ' endpoint types');
    return data;
}

export const fetchEndpointTypesForLocations = async (baseUrlId, agentLocations = []) => {
    var data = {};
    axiosRetry(axios, { retries: 3 });
    const locations = Array.isArray(agentLocations)
        ? agentLocations.filter((location) => location && String(location).trim() !== '')
        : [];
    console.log('ServiceAPI.fetchEndpointTypesForLocations request', {
        baseUrlId,
        locations,
    });
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/HostConfig/GetAvailableEndpointTypesForAgents',
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                agentLocations: locations,
            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.fetchEndpointTypesForLocations Axios Error was : ' + error);
        return;
    }));

    try {
        const responseData = result?.data?.data;
        if (responseData && typeof responseData === 'object' && !Array.isArray(responseData)) {
            data = Object.entries(responseData).reduce((acc, [location, list]) => {
                if (Array.isArray(list)) {
                    acc[location] = list;
                }
                return acc;
            }, {});
        } else {
            console.log('ServiceAPI.fetchEndpointTypesForLocations received invalid data', responseData);
        }
    }
    catch (error) {
        console.log('ServiceAPI.fetchEndpointTypesForLocations Mapping Data Error was : ' + error);
        if (result !== undefined && result.data.message !== undefined)
            console.log('Api Result.Message was ' + result.data.message);
        return undefined;
    }

    console.log('ServiceAPI.fetchEndpointTypesForLocations fetched ' + Object.keys(data).length + ' agent endpoint sets');
    return data;
}
 

export const fetchChartData = async (hostData, dataSetId, baseUrlId, setChartData, user, isLoggedIn) => {
    const monitorPingInfoId = hostData.id;
    if (isLoggedIn) { var extUrlStr = 'Auth'; }
    else {
        user = {};
        user.userID = defaultUser;
        user.sub = defaultUser;
        extUrlStr = 'Default';

    }
    var sentData = { User: user, DataSetId: dataSetId, MonitorPingInfoId: monitorPingInfoId, Prompt: prompt };
    var data = [];

    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/ResponseTime/GetPingInfosByMonitorPingInfoID' + extUrlStr,
            data: sentData,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.fetchChartData Axios Error was : ' + error);
    }));
    try {
        const responseData = result?.data?.data;
        if (!Array.isArray(responseData)) {
            console.log('ServiceAPI.fetchChartData received no data array', {
                monitorPingInfoId,
                responseData,
            });
        } else {
            responseData.map((row) => {
                data.push({ 'time': convertDate(row.dateSent, 'HH:mm:ss'), 'response': row.responseTime, 'status': row.status })
            });
            console.log('ServiceAPI.fetchChartData Got chart data for MonitorPingInfo with ID  : ' + monitorPingInfoId + ' count : ' + data.length);
        }

    }
    catch (error) {
        console.log('ServiceAPI.fetchChartData Mapping Data Error was : ' + error);
        if (result != undefined && result.data?.message !== undefined)
            console.log('Api Result.Message was ' + result.data.message);
        data.push({ 'time': convertDate(dayjs(), 'HH:mm:ss'), 'response': -1, 'status': 'No Data' })

    }
    setChartData(data);
}

export const fetchListData = async (dataSetId, baseUrlId, setListData, setAlertCount, user, isLoggedIn) => {
    var data = [];
    //console.log("Is Authenticated "+isLoggedIn)
    if (isLoggedIn) { var extUrlStr = 'Auth'; }
    else {
        user = {};
        user.userID = defaultUser;
        user.sub = defaultUser;
        extUrlStr = 'Default';
    }

    var sentData = { user, DataSetId: dataSetId, Prompt: prompt };
    var alertCount = 0;
    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/HostData/GetMonitorPingInfosByDataSetID' + extUrlStr,
            data: sentData,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    )
        .catch(function (error) {
            console.log('ServiceAPI.fetchListData Axios Error was : ' + error);
            return;
        }));
    try {
        const responseData = result?.data?.data;
        if (!Array.isArray(responseData)) {
            console.log('ServiceAPI.fetchListData received no data array', {
                dataSetId,
                responseData,
            });
            setListData([]);
            setAlertCount(0);
            return;
        }
        responseData.map((row) => {
            if (row.monitorStatus.alertFlag) { alertCount++ }
            const obj = { 'id': row.id, 'dataSetID' : row.dataSetID, 'date': convertDate(row.dateStarted, 'YYYY-MM-DD HH:mm'), 'address': row.address, 'monitorStatus': row.monitorStatus, 'packetsLost': row.packetsLost, 'percentageLost': row.packetsLostPercentage, 'packetsSent': row.packetsSent, 'roundTripMaximum': row.roundTripTimeMaximum, 'roundTripMinimum': row.roundTripTimeMinimum, 'status': row.status, 'roundTripAverage': row.roundTripTimeAverage, 'monitorIPID': row.monitorIPID, 'appID': row.appID, 'endPointType': row.endPointType, 'alertFlag': row.monitorStatus?.alertFlag, 'predictAlertFlag': row.predictStatus?.alertFlag };
            data.push(obj)
        });
    }
    catch (error) {
        console.log('ServiceAPI.fetchListData Mapping Data Error was : ' + error);
        if (result != undefined && result.data.message !== undefined)
            console.log('Api Result.Message was ' + result.data.message);
        return;
    }

    console.log('ServiceAPI.fetchListData from DataSetID ' + dataSetId + ' Got ' + data.length + ' lines of data for user  : ' + user.name + ' Using siteId : ' + baseUrlId);
    setListData(data);
    setAlertCount(alertCount);
}

export const fetchProcessorList = async (baseUrlId, setProcessorList,user,isLoggedIn) => {
    var data = [];
    if (isLoggedIn) { var extUrlStr = 'Auth'; }
    else {
        user = {};
        user.userID = defaultUser;
        user.sub = defaultUser;
        extUrlStr = 'Default';

    }
    axiosRetry(axios, { retries: 3 });
    const url=apiBaseUrls[baseUrlId] + '/Monitor/GetFilteredProcessorList'+extUrlStr;
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: url,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    )
        .catch(function (error) {
            console.log('ServiceAPI.fetchProcessorList Axios Error was : ' + error);
            return;
        }));
    try {
        result.data.data.map((row) => {
            // const obj = { 'appID': row.appID, 'location': row.location };
            console.log('Processor.AppID= ' + row.appID + ' Location=' + row.location);
            data.push(row)
        });
    }
    catch (error) {
        console.log('ServiceAPI.fetchProcessorList Mapping Data Error was : ' + error);
        if (result != undefined && result.data.message !== undefined)
            console.log('Api Result.Message was ' + result.data.message);
        return;
    }
    setProcessorList(data);
    console.log('ServiceAPI.fetchProcessorlist Got Processor List');
}



// Fetch DataSets between two dates. given 
export const fetchDataSetsByDate = async (baseUrlId, setDataSets, dateStart, dateEnd) => {
    var data = [];
    // No auth for now.
    // Set dateEnd to current date if not set.
    if (dateEnd === undefined) {
        dateEnd = dayjs();
    }
    // Set dateStart to current date minus one month if not set.
    if (dateStart === undefined) {
        dateStart = dayjs().subtract(14, 'day');
    }
    dateEnd = dayjs(dateEnd).endOf('day');
    dateStart = dayjs(dateStart).startOf('day');
    var sentData = { DateStart: dayjs.utc(dateStart).format(), DateEnd: dayjs.utc(dateEnd).format(), Prompt: prompt };
    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/monitor/GetDataSetsByDate',
            data: sentData,
        }
    ).catch(function (error) {
        console.log('ServiceAPI.fetchDataSetsByDate Axios Error was : ' + error);
        return;
    }));
    try {
        result.data.data.map((row) => {
            var dateObj = convertDate(row.dateStarted, 'YYYY-MM-DD HH:mm');

            if (row.dataSetId === 0) { dateObj = undefined };
            const obj = { 'id': row.dataSetId, 'date': dateObj };
            data.push(obj)
        }
        );
    }
    catch (error) {
        console.log('ServiceAPI.fetchDataSetsByDate Mapping Data Error was : ' + error);
        if (result != undefined && result.data.message !== undefined)

            console.log('Api Result.Message was ' + result.data.message);
        return;
    }


    console.log('ServiceAPI.fetchDataSetsByDate Got data sets');
    setDataSets(data);
}


export const fetchDataSets = async (baseUrlId, setDataSets) => {
    var data = [];
    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios.get((apiBaseUrls[baseUrlId] + '/Monitor/GetDataSets')).catch(function (error) {
        console.log('ServiceAPI.fetchDataSets Axios Error was : ' + error);
        return;
    }));
    try {
        result.data.data.map((row) => {
            var dateObj = convertDate(row.dateStarted, 'YYYY-MM-DD HH:mm');

            if (row.dataSetId === 0) { dateObj = undefined };
            const obj = { 'id': row.dataSetId, 'date': dateObj };
            data.push(obj)
        });
    }
    catch (error) {
        console.log('ServiceAPI.fetchDataSets Mapping Data Error was : ' + error);
        if (result != undefined && result.data.message !== undefined)
            console.log('Api Result.Message was ' + result.data.message);
        return;
    }

    console.log('ServiceAPI.fetchDataSets Got data sets');
    setDataSets(data);
};

export const resetAlertApiCall = async (monitorIPID, baseUrlId, setReload, reload, user) => {

    const sentData = { ID: monitorIPID };
    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/Alerts/ResetAlert',
            data: sentData,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.resetAlertApicall Axios Error was : ' + error);
        return;
    }));

    console.log('ServiceAPI.resetAlertApicall reset alert of monitorPingInfoId ' + monitorIPID + " for user " + user.name);

    setReload(!reload);
};

export const resetPredictAlertApiCall = async (monitorIPID, baseUrlId, setReload, reload, user) => {

    const sentData = { ID: monitorIPID };
    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/Alerts/ResetPredictAlert',
            data: sentData,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.resetPredictAlertApicall Axios Error was : ' + error);
        return;
    }));

    console.log('ServiceAPI.resetPredictAlertApicall reset alert of monitorPingInfoId ' + monitorIPID + " for user " + user.name);

    setReload(!reload);
};


export const fetchEditHostData = async (baseUrlId, user) => {

    var data = [];
    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/HostInfo/GetMonitorIPsFromUserID',
            data: user,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.fetchEditHostData Axios Error was : ' + error);
        return;
    }));
    try {
        result.data.data.map((row) => {
            const obj = row;
            data.push(obj)
        });
    }
    catch (error) {
        console.log('ServiceAPI.fetchEditHostData Mapping Data Error was : ' + error);
        if (result !== undefined && result.data.message !== undefined)
            console.log('Api Result.Message was ' + result.data.message);
        return undefined;
    }

    console.log('ServiceAPI.fetchEditHostData Got ' + data.length + ' lines of data for user  : ' + user.name);

    return data;

}


export const getBlogDateFromHash = async (hash) => {
    var data = '';
    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios.get(apiLoadBalancerUrl + '/Blog/BlogDateFromHash/' + hash).catch(function (error) {
        console.log('ServiceAPI.getBlogDateFromHash Axios Error was : ' + error);
        return new Date();
    }));
    try {
        data = result.data.data;
    }
    catch (error) {
        console.log('ServiceAPI.getBlogDateFromHash Mapping Data Error was : ' + error);
        if (result != undefined && result.data.message != undefined)
            console.log('Api Result.Message was ' + result.data.message);
        return new Date();
    }

    console.log('ServiceAPI.getBlogDateFromHash Got date ' + data);
    const dateObject = new Date(data);
    return dateObject;

}

export const fetchBlogs = async (archiveDate) => {
    var data = [];
    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios(
        {
            method: 'post',
            data: archiveDate,
            url: apiLoadBalancerUrl + '/Blog/BlogsForMonth'
        }
    ).catch(function (error) {
        console.log('ServiceAPI.fetchBlogs Axios Error was : ' + error);
        return;
    }));
    try {
        result.data.data.map((row) => {
            const obj = row;
            data.push(obj)
        });
    }
    catch (error) {
        console.log('ServiceAPI.fetchBlogs Mapping Data Error was : ' + error);
        if (result != undefined && result.data.message != undefined)
            console.log('Api Result.Message was ' + result.data.message);
        return undefined;
    }

    console.log('ServiceAPI.fetchBlogs Got ' + data.length + ' lines of blog data ');

    return data;

}

export const getUserInfoApi = async (baseUrlId, user) => {

    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/UserConfig/GetUserInfo',
            data: user,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.getUserInfoApi Axios Error was : ' + error);
        return;
    }));
    var apiUser = result.data.data;
    //if(apiUser.picture) apiUser.picture = user.picture;
    apiUser.logonServer = apiBaseUrls[baseUrlId];
    console.log('ServiceAPI.getUserInfoApi got userInfo ');
    return apiUser;

}


export const addUserApi = async (baseUrlId, user) => {
    console.log("user data from fusion user : "+JSON.stringify(user));
    axiosRetry(axios, { retries: 3 });
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/UserConfig/AddUserApi',
            data: user,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.addUserApi Axios Error was : ' + error);
        return;
    }));
    var apiUser = result.data.data;
    //apiUser.picture = user.picture
    apiUser.logonServer = apiBaseUrls[baseUrlId];
    console.log('ServiceAPI.addUserApi checked apiUser.userID ='+apiUser.userID);
    return apiUser;

}

export const updateApiUser = async (baseUrlId, user) => {
    var message = { text: '', success: false };

    try {
        const result = await axios(
            {
                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/UserConfig/UpdateApiUser',
                data: user,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        ).catch(function (error) {
            console.log('ServiceAPI.updateApiUser Axios Error was : ' + error);
            message.text = 'ServiceAPI.updateApiUser Axios Error was : ' + error;
            console.log(message.text);
            message.success = false;
            return message;

        });
        if (result?.data) {
            message.text = result.data.message;
            message.success = result.data.success;
        } else if (result?.message) {
            message.text = result.message;
            message.success = false;
        } else {
            message.text = 'ServiceAPI.saveHostData returned no response data.';
            message.success = false;
        }
    }
    catch (error) {
        message.text = 'ServiceAPI.updateApiUser Error was : ' + error;
        console.log(message.text);
        message.success = false;
        return message;
    }

    if (message.text !== undefined)
        console.log('ServiceAPI.updateApiUser Updated user message was ' + message.text);
    if (message.success) message.text = 'Success updated user Profile'
    return message;

}



export const resendVerifyEmail = async (baseUrlId, user) => {
    var message = { text: '', success: false };

    try {
        const result = await axios(
            {
                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/email/SendVerifyEmail',
                data: user,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        ).catch(function (error) {
            console.log('ServiceAPI.resendVerifyEmail Axios Error was : ' + error);
            message.text = 'ServiceAPI.resendVerifyEmail Axios Error was : ' + error;
            console.log(message.text);
            message.success = false;
            return message;

        });
        message.text = result.data.message;
        message.success = result.data.success;
    }
    catch (error) {
        message.text = 'ServiceAPI.resendVerifyEmail Error was : ' + error;
        console.log(message.text);
        message.success = false;
        return message;
    }

    if (message.text !== undefined)
        console.log('ServiceAPI.resendVerifyEmail Send Verifcation email message was ' + message.text);
    if (message.success) message.text = 'Success send verification email.'
    return message;

}


export const addHostApi = async (baseUrlId, user, data) => {
    var message = { text: '', success: false };

    try {
        const resultSave = await axios(
            {
                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/HostConfig/SaveHostDataWithUserID',
                data: data,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        ).catch(function (error) {
            message.text = 'ServiceAPI.addHostApi PreSave Axios Error was : ' + error;
            console.log(message.text);
            message.success = false;
            return message;
        });
        const resultAdd = await axios(
            {
                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/HostConfig/AddHostApi',
                data: user,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        ).catch(function (error) {
            message.text = 'ServiceAPI.addHostApi Add host Axios Error was : ' + error;
            console.log(message.text);
            message.success = false;
            return message;
        });
        var saveSuccess = false;
        var addSuccess = false;
        if (resultSave && resultSave.data && resultSave.data.message !== undefined) {
            message.text = "Save result was : " + resultSave.data.message;
            saveSuccess = resultSave.data.success;
        }

        if (resultAdd && resultAdd.data && resultAdd.data.message !== undefined) {
            message.text = "Add result was : " + resultAdd.data.message;
            addSuccess = resultAdd.data.success;
        }

        message.success = saveSuccess && addSuccess;
    }
    catch (error) {
        message.text = 'ServiceAPI.addHostApi Error was : ' + error;
        console.log(message.text);
        message.success = false;
        return message;
    }
    console.log('ServiceAPI.addHostApi Got defaulthost for user  : ' + user.name + " Message from Api : " + message.text);
    if (message.success) message.text += 'Success added host';
    return message;

}

export const subscribeApi = async (baseSubUrlId, user, productName) => {
    var message = { text: '', success: false };

    try {
        const result = await axios(
            {
                method: 'post',
                url: apiSubscriptionUrl + '/CreateCheckoutSession/' + user.sub + '/' + productName + '/'+user.email,
                data: user,

            }
        ).catch(function (error) {
            message.text = 'ServiceAPI.subscribeApi Axios Error was : ' + error;
            console.log(message.text);
            message.success = false;
            return message;
        });
        message.text = "Result was : " + result.data.message;
        message.success = result.data.success;
    }
    catch (error) {
        message.text = 'ServiceAPI.subscribeApi Error was : ' + error;
        console.log(message.text);
        message.success = false;
        return message;
    }
    console.log('ServiceAPI.subscribeApi for user with email : ' + user.email + " Message from Api : " + message.text);
    if (message.success) message.text = 'Success Subsription';
    return message;

}


export const delHostApi = async (baseUrlId, user, index) => {
    var message = { text: '', success: false };

    try {
        var host = user;
        host.index = index;
        const result = await axios(
            {

                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/HostConfig/DelHostApi',
                data: host,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        ).catch(function (error) {
            message.text = 'ServiceAPI.addHostApi Axios Error was : ' + error;
            console.log(message.text);
            message.success = false;
            return message;
        });
        message.text = result.data.message;
        message.success = result.data.success;
    }
    catch (error) {
        message.text = 'ServiceAPI.addHostApi Error was : ' + error;
        console.log(message.text);
        message.success = false;
        return message;
    }
    console.log('ServiceAPI.addHostApi deleted host for user  : Api message : ' + message.text);
    if (message.success) message.text = "Success deleted host. Wait 2 mins for change to go live."
    return message;
}

const monitorModelConfigApiResult = (result) => {
    const payload = result?.data ?? {};
    return {
        success: Boolean(payload.success),
        message: payload.message,
        data: payload.data,
    };
};

export const fetchMonitorModelConfigs = async (baseUrlId) => {
    axiosRetry(axios, { retries: 3 });
    try {
        const result = await trackPromise(axios({
            method: 'get',
            url: apiBaseUrls[baseUrlId] + '/MonitorModelConfig',
            withCredentials: true,
        }));
        const payload = monitorModelConfigApiResult(result);
        if (!payload.success) {
            console.log('ServiceAPI.fetchMonitorModelConfigs Api Error was : ' + payload.message);
        }
        return payload.data ?? [];
    } catch (error) {
        console.log('ServiceAPI.fetchMonitorModelConfigs Error was : ' + error);
        throw error;
    }
};

export const fetchMonitorModelConfig = async (baseUrlId, id) => {
    if (!id && id !== 0) {
        return null;
    }
    axiosRetry(axios, { retries: 3 });
    try {
        const result = await trackPromise(axios({
            method: 'get',
            url: apiBaseUrls[baseUrlId] + '/MonitorModelConfig/' + id,
            withCredentials: true,
        }));
        const payload = monitorModelConfigApiResult(result);
        if (!payload.success) {
            console.log('ServiceAPI.fetchMonitorModelConfig Api Error was : ' + payload.message);
        }
        return payload.data ?? null;
    } catch (error) {
        console.log('ServiceAPI.fetchMonitorModelConfig Error was : ' + error);
        throw error;
    }
};

export const createMonitorModelConfig = async (baseUrlId, config) => {
    axiosRetry(axios, { retries: 3 });
    try {
        const result = await trackPromise(axios({
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/MonitorModelConfig',
            data: config,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }));
        const payload = monitorModelConfigApiResult(result);
        if (!payload.success) {
            throw new Error(payload.message ?? 'Failed to create monitor model config');
        }
        return payload;
    } catch (error) {
        console.log('ServiceAPI.createMonitorModelConfig Error was : ' + error);
        throw error;
    }
};

export const updateMonitorModelConfig = async (baseUrlId, id, config) => {
    axiosRetry(axios, { retries: 3 });
    try {
        const result = await trackPromise(axios({
            method: 'put',
            url: apiBaseUrls[baseUrlId] + '/MonitorModelConfig/' + id,
            data: config,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            },
        }));
        const payload = monitorModelConfigApiResult(result);
        if (!payload.success) {
            throw new Error(payload.message ?? 'Failed to update monitor model config');
        }
        return payload;
    } catch (error) {
        console.log('ServiceAPI.updateMonitorModelConfig Error was : ' + error);
        throw error;
    }
};

export const deleteMonitorModelConfig = async (baseUrlId, id) => {
    axiosRetry(axios, { retries: 3 });
    try {
        const result = await trackPromise(axios({
            method: 'delete',
            url: apiBaseUrls[baseUrlId] + '/MonitorModelConfig/' + id,
            withCredentials: true,
        }));
        const payload = monitorModelConfigApiResult(result);
        if (!payload.success) {
            throw new Error(payload.message ?? 'Failed to delete monitor model config');
        }
        return payload;
    } catch (error) {
        console.log('ServiceAPI.deleteMonitorModelConfig Error was : ' + error);
        throw error;
    }
};


export const saveHostData = async (baseUrlId, data) => {

    var message = { text: '', success: false };

    try {
        const result = await axios(
            {
                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/HostConfig/SaveHostDataWithUserID',
                data: data,
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                },
            }
        ).catch(function (error) {
            message.text = 'ServiceAPI.saveHostData Axios Error was : ' + error;
            console.log(message.text);
            message.success = false;
            return message;
        });
        message.text = result.data.message;
        message.success = result.data.success;
    }
    catch (error) {
        message.text = 'ServiceAPI.saveHostData  Error was : ' + error;
        console.log(message.text);
        message.success = false;
        return message;
    }

    if (message.text !== undefined)
        console.log('ServiceAPI.saveData Saved data api message was ' + message.text);
    if (message.success) message.text = 'Success save host data. Wait 2 mins for change to go live';
    return message;
}

export const transcribeAudioApi = async (audioBlob) => {
    axiosRetry(axios, { retries: 3 }); // Retry logic
    const formData = new FormData();
    formData.append('file', audioBlob, 'recorded_audio.wav');

    try {
        const response = await trackPromise(
            axios({
                method: 'post',
                url: apiAudioUrl+'/transcribe_audio',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure proper headers for file upload
                },
            }).catch((error) => {
                console.error('ServiceAPI.transcribeAudioApi Axios Error:', error);
                return null;
            })
        );

        return response?.data;
    } catch (error) {
        console.error('ServiceAPI.transcribeAudioApi Error:', error);
        return null;
    }
};

  // ServiceAPI.js
export const fetchTiers = async (baseUrlId) => {
  let data = [];
  axiosRetry(axios, { retries: 3 });
  const result = await trackPromise(
    axios({
      method: 'get',
      url: apiBaseUrls[baseUrlId] + '/UserConfig/Tiers',
      withCredentials: true, // keep if your API checks cookies; remove if public
      headers: { 'Content-Type': 'application/json' },
    }).catch((error) => {
      console.log('ServiceAPI.fetchTiers Axios Error was : ' + error);
      return;
    })
  );

  try {
    // API returns { success, message, data } — we want the array in .data
    data = result?.data?.data ?? [];
  } catch (error) {
    console.log('ServiceAPI.fetchTiers Mapping Data Error was : ' + error);
    if (result && result.data?.message) console.log('Api Result.Message was ' + result.data.message);
    return [];
  }

  console.log('ServiceAPI.fetchTiers fetched ' + data.length + ' tiers');
  return data;
};

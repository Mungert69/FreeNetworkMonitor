import axios from 'axios';
import moment from 'moment-timezone';
import { trackPromise } from 'react-promise-tracker';
import axiosRetry from 'axios-retry';

const defaultUser = "default";

export const getStartSiteId = () => { return startSiteId; }
export const getServerLabel = () => {
    return serverLabel;
}
export const getServerUrlFromSiteId = (siteId) => {
    return apiBaseUrls[siteId];
}

export const getApiSubscriptionUrl = () => {
    return apiSubscriptionUrl;
}
export const getClientId = () => {
    return clientId;
}
export const getServerUrl = () => {
    return serverUrl;
}
export const getLLMServerUrl = (siteId) => {
    try {
        return llmServerUrls[siteId];
    }
    catch (error) {
        console.log('ServiceAPI.getLLMServerUrl unable to getllmServerUrl : ' + error);
        return;
    }
   
}
export const getRedirectUri = () => {
    return redirectUri;
}
const { appsettingsFile } = window['runConfig'];
const { serverLabel } = window['serverLabel'];
const appsettings = require('../../' + appsettingsFile);
const prompt = 'web query';

const startSiteId = appsettings.startSiteId;
const apiLoadBalancerUrl = appsettings.apiLoadBalancerUrl;
const apiBaseUrls = appsettings.apiBaseUrls;
const apiSubscriptionUrl = appsettings.apiSubscriptionUrl;
const clientId = appsettings.clientId;
const serverUrl = appsettings.serverUrl;
const redirectUri = appsettings.redirectUri;
const llmServerUrls = appsettings.llmServerUrls;
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;



export const convertDate = (date, format) => {
 
  // Create a Moment.js object from the input UTC date
  const momentObj = moment.utc(date, 'YYYY-MM-DD HH:mm:ss');

  // Convert the Moment.js object to the user's local time zone
  const localMomentObj = momentObj.tz(userTimeZone);

  // Format the Moment.js object with the provided format
  const momentString = localMomentObj.format(format);

  return momentString;
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

// Assuming handleDownload is defined inside the Profile component or receives setMessage as a parameter
export const handleDownload = async (baseUrlId, setMessage, setDownloadLink, setOpen, setIsLoading) => {
    setIsLoading(true);  // Set loading to true when download starts
    
    axiosRetry(axios, { retries: 3 });
    const result = await axios({
        method: 'post',
        url: apiBaseUrls[baseUrlId] + '/UserConfig/GetUserPingInfoTar',
        withCredentials: true,
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


  
export const fetchChartData = async (hostData, dataSetId, baseUrlId, setChartData, user, isAuthenticated) => {
    const monitorPingInfoId = hostData.id;
    if (isAuthenticated) { var extUrlStr = 'Auth'; }
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
        }
    ).catch(function (error) {
        console.log('ServiceAPI.fetchChartData Axios Error was : ' + error);
    }));
    try {
        result.data.data.map((row) => {
            data.push({ 'time': convertDate(row.dateSent, 'HH:mm:ss'), 'response': row.responseTime, 'status': row.status })
        });
        console.log('ServiceAPI.fetchChartData Got chart data for MonitorPingInfo with ID  : ' + monitorPingInfoId);

    }
    catch (error) {
        console.log('ServiceAPI.fetchChartData Mapping Data Error was : ' + error);
        if (result != undefined && result.data.message !== undefined)
            console.log('Api Result.Message was ' + result.data.message);
        data.push({ 'time': convertDate(moment(), 'HH:mm:ss'), 'response': -1, 'status': 'No Data' })

    }
    setChartData(data);
}

export const fetchListData = async (dataSetId, baseUrlId, setListData, setAlertCount, user, isAuthenticated) => {
    var data = [];
    console.log("Is Authenticated "+isAuthenticated)
    if (isAuthenticated) { var extUrlStr = 'Auth'; }
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
        }
    )
        .catch(function (error) {
            console.log('ServiceAPI.fetchListData Axios Error was : ' + error);
            return;
        }));
    try {
        result.data.data.map((row) => {
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

export const fetchProcessorList = async (baseUrlId, setProcessorList,user,isAuthenticated) => {
    var data = [];
    if (isAuthenticated) { var extUrlStr = 'Auth'; }
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
        dateEnd = moment();
    }
    // Set dateStart to current date minus one month if not set.
    if (dateStart === undefined) {
        dateStart = moment().subtract(14, 'days');
    }
    dateEnd = moment(dateEnd).endOf('day');
    dateStart = moment(dateStart).startOf('day');
    var sentData = { DateStart: moment.utc(dateStart).format(), DateEnd: moment.utc(dateEnd).format(), Prompt: prompt };
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
        }
    ).catch(function (error) {
        console.log('ServiceAPI.addUserApi Axios Error was : ' + error);
        return;
    }));
    var apiUser = result.data.data;
    //apiUser.picture = user.picture
    apiUser.logonServer = apiBaseUrls[baseUrlId];
    console.log('ServiceAPI.addUserApi checked ');
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
            }
        ).catch(function (error) {
            console.log('ServiceAPI.updateApiUser Axios Error was : ' + error);
            message.text = 'ServiceAPI.updateApiUser Axios Error was : ' + error;
            console.log(message.text);
            message.success = false;
            return message;

        });
        message.text = result.data.message;
        message.success = result.data.success;
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


export const saveHostData = async (baseUrlId, data) => {

    var message = { text: '', success: false };

    try {
        const result = await axios(
            {
                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/HostConfig/SaveHostDataWithUserID',
                data: data,
                withCredentials: true,
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



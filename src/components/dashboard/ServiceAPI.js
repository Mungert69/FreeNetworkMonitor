import axios from 'axios';
import moment from "moment";
import { trackPromise} from 'react-promise-tracker';

const defaultUser = "default";

export const getStartSiteId = () => { return startSiteId; }
export const getServerLabel = () => {
    return serverLabel;
}

const { appsettingsFile } = window['runConfig'];
const { serverLabel } = window['serverLabel'];
const appsettings = require('../../' + appsettingsFile);


const startSiteId = appsettings.startSiteId;
const apiLoadBalancerUrl = appsettings.apiLoadBalancerUrl;
const apiBaseUrls = appsettings.apiBaseUrls;

export const convertDate = (date, format) => {
    var dateObj = new Date(date);
    var momentObj = moment(dateObj);
    var momentString = momentObj.format(format)
    return momentString;
}

export const getSiteIdfromUrl = (url) => {
    var siteId;

    try {
        siteId = apiBaseUrls.indexOf(url);
    } catch (e) {
        // do nothing
    }

    return siteId;
}


export const fetchLoadServer = async (user, token) => {
    var extUrlStr = 'Auth';
    if (user == null || user == undefined) {
        user = {};
        user.userID = defaultUser;
        user.sub = defaultUser;
        extUrlStr = 'Default';
        token = '';
    } else {
        if (token == null || token == undefined) {
            console.log('ServiceAPI.fetcLoadServer Error missing token for user ' + user.name);
            return;
        }
    }
    var sentData = { User: user };
    var data = null;

    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiLoadBalancerUrl + '/Load/GetLoadServer' + extUrlStr,
            data: sentData,
            headers: {
                Authorization: `Bearer ${token}`,

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
        if (result.data.message != null)
            console.log('Api Result.Message was ' + result.data.message);
        return;
    }
}

export const fetchChartData = async (hostData, dataSetId, baseUrlId, setChartData, user, token) => {
    const monitorPingInfoId = hostData.id;
    var extUrlStr = 'Auth';
    if (user == null || user == undefined) {
        if (token != null) return;
        user = {};
        user.userID = defaultUser;
        user.sub = defaultUser;
        extUrlStr = 'Default';
        token = '';
    } else {
        if (token == null || token == undefined) {
            console.log('ServiceAPI.fetcListData Error missing token for user ' + user.name);
            return;
        }
    }
    var sentData = { User: user, DataSetId: dataSetId, MonitorPingInfoId: monitorPingInfoId };
    var data = [];

    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/Monitor/GetPingInfosByMonitorPingInfoID' + extUrlStr,
            data: sentData,
            headers: {
                Authorization: `Bearer ${token}`,

            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.fetchChartData Axios Error was : ' + error);
    }));
    try {
        result.data.data.map((row) => {
            data.push({ 'time': convertDate(row.dateSent, 'HH:mm:ss'), 'response': row.roundTripTime, 'status': row.status })
        });
        console.log('ServiceAPI.fetchChartData Got chart data for MonitorPingInfo with ID  : ' + monitorPingInfoId);

    }
    catch (error) {
        console.log('ServiceAPI.fetchChartData Mapping Data Error was : ' + error);
        if (result.data.message != null)
            console.log('Api Result.Message was ' + result.data.message);
        data.push({ 'time': convertDate(moment(), 'HH:mm:ss'), 'response': -1, 'status': 'No Data' })

    }
    setChartData(data);
}

export const fetchListData = async (dataSetId, baseUrlId, setListData, setAlertCount, user, token) => {
    var data = [];
    var extUrlStr = 'Auth';
    if (user == null || user == undefined) {
        if (token != null) return;
        user = {};
        user.userID = defaultUser;
        user.sub = defaultUser;
        extUrlStr = 'Default';
        token = '';
    } else {
        if (token == null || token == undefined) {
            console.log('ServiceAPI.fetcListData Error missing token for user ' + user.name);
            return;
        }
    }

    var sentData = { user, DataSetId: dataSetId };
    var alertCount = 0;
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/monitor/GetMonitorPingInfosByDataSetID' + extUrlStr,
            data: sentData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
        .catch(function (error) {
            console.log('ServiceAPI.fetchListData Axios Error was : ' + error);
            return;
        }));
    try {
        result.data.data.map((row) => {
            if (row.monitorStatus.alertFlag) { alertCount++ }
            const obj = { 'id': row.id, 'date': convertDate(row.dateStarted, 'YYYY-MM-DD HH:mm'), 'address': row.address, 'monitorStatus': row.monitorStatus, 'packetsLost': row.packetsLost, 'percentageLost': row.packetsLostPercentage, 'packetsSent': row.packetsSent, 'roundTripMaximum': row.roundTripTimeMaximum, 'roundTripMinimum': row.roundTripTimeMinimum, 'status': row.status, 'roundTripAverage': row.roundTripTimeAverage, 'monitorIPID': row.monitorIPID };
            data.push(obj)
        });
    }
    catch (error) {
        console.log('ServiceAPI.fetchListData Mapping Data Error was : ' + error);
        if (result.data.message != null)
            console.log('Api Result.Message was ' + result.data.message);
        return;
    }

    console.log('ServiceAPI.fetchListData from DataSetID ' + dataSetId + ' Got ' + data.length + ' lines of data for user  : ' + user.name + ' Using siteId : ' + baseUrlId);
    setListData(data);
    setAlertCount(alertCount);
}

// Fetch DataSets between two dates. given 
export const fetchDataSetsByDate = async (baseUrlId, setDataSets, dateStart, dateEnd) => {
    var data = [];
    // No auth for now.
    var token = '';
    // Set dateEnd to current date if not set.
    if (dateEnd == null || dateEnd == undefined) {
        dateEnd = moment();
    }
    // Set dateStart to current date minus one month if not set.
    if (dateStart == null || dateStart == undefined) {
        dateStart = moment().subtract(14, 'days');
    }
    dateEnd = moment(dateEnd).endOf('day');
    dateStart = moment(dateStart).startOf('day');
    var sentData = { DateStart: moment.utc(dateStart).format(), DateEnd: moment.utc(dateEnd).format() };
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/monitor/GetDataSetsByDate',
            data: sentData,
        }
    ).catch(function (error) {
        console.log('ServiceAPI.fetchEditHostData Axios Error was : ' + error);
        return;
    }));
    try {
        result.data.data.map((row) => {
            var dateObj = convertDate(row.dateStarted, 'YYYY-MM-DD HH:mm');

            if (row.dataSetId == 0) { dateObj = null };
            const obj = { 'id': row.dataSetId, 'date': dateObj };
            data.push(obj)
        }
        );
    }
    catch (error) {
        console.log('ServiceAPI.fetchDataSetsByDate Mapping Data Error was : ' + error);
        if (result.data.message != null)

            console.log('Api Result.Message was ' + result.data.message);
        return;
    }


    console.log('ServiceAPI.fetchDataSetsByDate Got data sets');
    setDataSets(data);
}


export const fetchDataSets = async (baseUrlId, setDataSets) => {
    var data = [];
    const result = await trackPromise(axios.get((apiBaseUrls[baseUrlId] + '/Monitor/GetDataSets')).catch(function (error) {
        console.log('ServiceAPI.fetchDataSets Axios Error was : ' + error);
        return;
    }));
    try {
        result.data.data.map((row) => {
            var dateObj = convertDate(row.dateStarted, 'YYYY-MM-DD HH:mm');

            if (row.dataSetId == 0) { dateObj = null };
            const obj = { 'id': row.dataSetId, 'date': dateObj };
            data.push(obj)
        });
    }
    catch (error) {
        console.log('ServiceAPI.fetchDataSets Mapping Data Error was : ' + error);
        if (result.data.message != null)
            console.log('Api Result.Message was ' + result.data.message);
        return;
    }

    console.log('ServiceAPI.fetchDataSets Got data sets');
    setDataSets(data);
};

export const resetAlertApiCall = async (monitorPingInfoId, baseUrlId, setReload, reload, user, token) => {
    if (token == null || token == undefined) {
        console.log('ServiceAPI.resetAlertApiCall Error missing token for user ' + user.name);
        return;
    }
    const sentData = { User: user, MonitorPingInfoId: monitorPingInfoId };
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/Monitor/ResetAlert/',
            data: sentData,
            headers: {
                Authorization: `Bearer ${token}`,

            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.resetAlertApicall Axios Error was : ' + error);
        return;
    }));

    console.log('ServiceAPI.resetAlertApicall reset alert of monitorPingInfoId ' + monitorPingInfoId + " for user " + user.name);

    setReload(!reload);
};

export const fetchEditHostData = async (baseUrlId, user, token) => {
    if (token == null || token == undefined) {
        console.log('ServiceAPI.fetchEditHostData Error missing token for user ' + user.name);
        return;
    }
    var data = [];
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/edit/GetMonitorIPsFromUserID',
            data: user,
            headers: {
                Authorization: `Bearer ${token}`,

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
        if (result.data.message != null)
            console.log('Api Result.Message was ' + result.data.message);
        return null;
    }

    console.log('ServiceAPI.fetchEditHostData Got ' + data.length + ' lines of data for user  : ' + user.name);

    return data;

}

export const addUserApi = async (baseUrlId, user, token) => {
    if (token == null || token == undefined) {
        console.log('ServiceAPI.addUserApi Error missing token for user ' + user.name);
        return;
    }
    const result = await trackPromise(axios(
        {
            method: 'post',
            url: apiBaseUrls[baseUrlId] + '/edit/AddUserApi',
            data: user,
            headers: {
                Authorization: `Bearer ${token}`,

            },
        }
    ).catch(function (error) {
        console.log('ServiceAPI.addHostApi Axios Error was : ' + error);
        return;
    }));
    var apiUser = result.data.data;
    apiUser.picture = user.picture
    apiUser.logonServer=apiBaseUrls[baseUrlId];
    console.log('ServiceAPI.addUserApi checked ' + user.name);
    return apiUser;

}

export const updateApiUser = async (baseUrlId, user, token) => {
    var message = { text: '', success: false };
    if (token == null || token == undefined) {
        console.log('ServiceAPI.updateApiUser Error missing token for user ' + user.name);
        return;
    }
    try {
        const result = await axios(
            {
                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/edit/UpdateApiUser',
                data: user,
                headers: {
                    Authorization: `Bearer ${token}`,

                },
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

    if (message.text != null)
        console.log('ServiceAPI.updateApiUser Updated user message was ' + message.text);
        if (message.success) message.text='Success updated user Profile'
    return message;

}

export const testEditApi = async (baseUrlId, user, token) => {
    if (token == null || token == undefined) {
        console.log('ServiceAPI.updateApiUser Error missing token for user ' + user.name);
        return;
    }
    var message = '';
    try {

        const result = await axios(
            {
                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/edit',
                data: user,
                headers: {
                    Authorization: `Bearer ${token}`,

                },

            }
        ).catch(function (error) {
            console.log('ServiceAPI.testEditApi Axios Error was : ' + error);
            return;
        });
        message.text = result.data.message;
        message.success = result.data.success;

    }
    catch (error) {
        console.log('ServiceAPI.testEditApi Axios Error was : ' + error);
        return;
    }

    console.log('ServiceAPI.testEditApi sent token for ' + user.name + ' token was : ' + token);
    return message;
}

export const addHostApi = async (baseUrlId, user, token,data) => {
    var message = { text: '', success: false };
    if (token == null || token == undefined) {
        console.log('ServiceAPI.addHostApi Error missing token for user ' + user.name);
        return;
    }
    try {
        const resultSave = await axios(
            {
                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/edit/SaveHostDataWithUserID',
                data: data,
                headers: {
                    Authorization: `Bearer ${token}`,

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
                url: apiBaseUrls[baseUrlId] + '/edit/AddHostApi',
                data: user,
                headers: {
                    Authorization: `Bearer ${token}`,

                },
            }
        ).catch(function (error) {
            message.text = 'ServiceAPI.addHostApi Add host Axios Error was : ' + error;
            console.log(message.text);
            message.success = false;
            return message;
        });
        message.text =  "Save result was : "+resultSave.data.message+" Add result was : "+resultAdd.data.message;
        message.success =  resultAdd.data.success;
    }
    catch (error) {
        message.text = 'ServiceAPI.addHostApi Error was : ' + error;
        console.log(message.text);
        message.success = false;
        return message;
    }
    console.log('ServiceAPI.addHostApi Got defaulthost for user  : ' + user.name + " Message from Api : "+message.text);
    if (message.success) message.text='Success added host';
    return message;

}

export const delHostApi = async (baseUrlId, user, index, token) => {
    var message = { text: '', success: false };
    if (token == null || token == undefined) {
        console.log('ServiceAPI.delHostApi Error missing token for user ' + user.name);
        return;
    }
    try {
        var host = user;
        host.index = index;
        const result = await axios(
            {

                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/edit/DelHostApi',
                data: host,
                headers: {
                    Authorization: `Bearer ${token}`,

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
    if (message.success) message.text="Success deleted host. Wait 2 mins for change to go live."
    return message;
}


export const saveHostData = async (baseUrlId, data, token) => {

    var message = { text: '', success: false };
    if (token == null || token == undefined) {
        console.log('ServiceAPI.saveHostData Error missing token ');
        return;
    }
    try {
        const result = await axios(
            {
                method: 'post',
                url: apiBaseUrls[baseUrlId] + '/edit/SaveHostDataWithUserID',
                data: data,
                headers: {
                    Authorization: `Bearer ${token}`,

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
        message.text = 'ServiceAPI.addHostApi Error was : ' + error;
        console.log(message.text);
        message.success = false;
        return message;
    }

    if (message.text != null)
        console.log('ServiceAPI.saveData Saved data api message was ' + message.text);
    if (message.success) message.text='Success save host data. Wait 2 mins for change to go live';
    return message;
}



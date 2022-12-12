import http from 'k6/http';
import { check } from 'k6';
export const options = {
  vus: 10,
  duration: '30s',
ext: {
    loadimpact: {
      projectID: 3596755,
      // Test runs with the same name groups test runs together
      name: "NetworkMonitor Service Host List"
    }
  }
};
export default function () {
    const appsettings = {
        startSiteId: 0,
        apiLoadBalancerUrl: "https://monitorsrv.mahadeva.co.uk:2053",
        apiBaseUrls: [
            "https://monitorsrv.mahadeva.co.uk:2053",
            "https://monitorsrv1.mahadeva.co.uk:2053",
            "https://roundhouse.home:2053"
        ]
    }


    const baseUrlId = appsettings.startSiteId;
    const apiLoadBalancerUrl = appsettings.apiLoad
    const apiBaseUrls = appsettings.apiBaseUrls;

    const defaultUser = "default";
    const dataSetId = 2;
    var user = undefined;
    var token = undefined;

    var extUrlStr = 'Auth';
    if ( user === undefined) {
        user = {};
        user.userID = defaultUser;
        user.sub = defaultUser;
        extUrlStr = 'Default';
        token = '';
    }

    const sentData = { User: user, DataSetId: dataSetId };
    const url = apiBaseUrls[baseUrlId] + '/monitor/GetMonitorPingInfosByDataSetID' + extUrlStr;


    const payload = JSON.stringify(sentData);
    console.log('TestApi.fetcListData testing url ' + url);

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    var res = http.post(url, payload, params);
    check(res, {
        'is status 200': (r) => r.status === 200,
        'body size > 5000 bytes': (r) => r.body.length > 5000,
    });

  
}

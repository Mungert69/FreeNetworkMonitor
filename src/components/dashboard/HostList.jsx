import MUIDataTable from "mui-datatables";
import React, { useRef, useState, useEffect } from 'react'
import {
  Button,
  Tooltip,
  MenuItem,
  Badge,
  IconButton,
  useMediaQuery
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

import HttpIcon from '@mui/icons-material/Http';
import HttpsIcon from '@mui/icons-material/Https';
import LinkIcon from '@mui/icons-material/Link';
import HtmlIcon from '@mui/icons-material/Html';
import LanguageIcon from '@mui/icons-material/Language';
import PingIcon from '@mui/icons-material/Speed';
import DnsIcon from '@mui/icons-material/Dns';
import EmailIcon from '@mui/icons-material/Email';
import QuantumIcon from '@mui/icons-material/Flare'; // Replace with actual Quantum icon
import NmapIcon from '@mui/icons-material/Search'; // Placeholder icon
import NmapVulnIcon from '@mui/icons-material/BugReport'; // Placeholder icon
import CrawlSiteIcon from '@mui/icons-material/Public'; // Placeholder icon
import HugIcon from '@mui/icons-material/AccessAlarm'; // Placeholder icon
import DataSetsList from './DataSetsList';
import BarChartIcon from '@mui/icons-material/BarChart';
import ErrorIcon from '@mui/icons-material/Error';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useTheme } from '@mui/material/styles';
import { fetchEndpointTypes } from './ServiceAPI';

const muiCache = createCache({
  "key": "mui",
  "prepend": true
});
const iconMap = {
  PingIcon: <PingIcon />,
  HttpIcon: <HttpIcon />,
  HttpsIcon: <HttpsIcon />,
  HtmlIcon: <HtmlIcon />,
  LanguageIcon: <LanguageIcon />,
  LinkIcon: <LinkIcon />,
  DnsIcon: <DnsIcon />,
  EmailIcon: <EmailIcon />,
  QuantumIcon: <QuantumIcon />,
  NmapIcon: <NmapIcon />,
  NmapVulnIcon: <NmapVulnIcon />,
  CrawlSiteIcon: <CrawlSiteIcon />,
  HugIcon: <HugIcon />,
  // Add other icons as necessary
  ErrorIcon: <ErrorIcon />
};

export const HostList = ({ siteId,data, clickViewChart, resetHostAlert,resetPredictAlert, processorList,dataSets,handleSetDataSetId,setDateStart,setDateEnd,defaultSearchValue }) => {
  
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const getMuiTheme = () => createTheme({
    components: {
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: '#607466'
          }
        }
      },
      MuiDataTableBodyCell: {
        styleOverrides: {
          root: {
            padding: isSmallScreen ? "0px 2px" : "4px 8px",
            fontSize: isSmallScreen ? "0.55rem" : undefined,
            lineHeight: isSmallScreen ? 1.1 : undefined,
          }
        }
      },
      MuiDataTable: {
        styleOverrides: {
          root: {
          }
        }
      },
      MuiDataTableCell: {
        styleOverrides: {
          root: {
            padding: isSmallScreen ? "0px 2px" : "4px 8px",
            fontSize: isSmallScreen ? "0.55rem" : undefined,
            lineHeight: isSmallScreen ? 1.1 : undefined,
          }
        }
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            fontSize: isSmallScreen ? "0.6rem" : undefined,
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            fontSize: isSmallScreen ? "0.5rem" : undefined,
          }
        }
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            marginBottom: 0
          }
        }
      },

    }
  })
  const [endpointTypes, setEndpointTypes] = useState([]);
  const [endpointTypeMap, setEndpointTypeMap] = useState({});
  const [showDataSetsList, setShowDataSetsList] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [endpointData] = await Promise.all([
          fetchEndpointTypes(siteId) // Fetch endpoint types
        ]);

        if (endpointData) {
          setEndpointTypes(endpointData);
          // Create a map for easy lookup by internalType
          const map = {};
          endpointData.forEach(type => {
            map[type.internalType.toLowerCase()] = type;
          });
          setEndpointTypeMap(map);
        }
 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [siteId]);

  const columns = [
    {
      name: "",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (tableMeta) => {
          //const row = tableMeta.rowIndex;
          //var tempData = data;
          //var rowData=tempData[row];
          var row = data[tableMeta];
          return (
            <>
              <Tooltip title="View Chart">
                <span>
                  <Button onClick={() => clickViewChart(row)} >
                    <BarChartIcon color='action' />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Reset Alert">
                <span>
                  {row.alertFlag ?
                    <Button onClick={() => resetHostAlert(row.monitorIPID)} >
                     <ErrorIcon sx={{ color: theme.palette.error.main }} />
                    </Button>
                    : null}

                </span>
              </Tooltip>
              <Tooltip title="Reset Predict Alert">
                <span>
                  {row.predictAlertFlag ?
                    <Button onClick={() => resetPredictAlert(row.monitorIPID)} >
                     <ErrorIcon sx={{ color: theme.palette.warning.main }} />
                    </Button>
                    : null}

                </span>
              </Tooltip>
            </>
          );
        }
      }
    },
    {
      name: 'address',
      label: 'Host Address',
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const value = data[dataIndex].address;
          return (<>{value} </>);
        }
      }
    },{
      name: 'endPointType',
      label: 'Endpoint Type',
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const internalType = data[dataIndex].endPointType.toLowerCase();
          const endpointType = endpointTypeMap[internalType];

          if (!endpointType) {
            return (
              <Tooltip title="Could not find Endpoint">
                <span>
                  <ErrorIcon />
                </span>
              </Tooltip>
            );
          }

          const { icon, name, description } = endpointType;

          const iconComponent = iconMap[icon] || <ErrorIcon />;


          return (
            <Tooltip title={description || name}>
              <span>
                {iconComponent}
              </span>
            </Tooltip>
          );
        }
      }
    }, {
      name: 'packetsSent',
      label: 'Data Sent',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const value = data[dataIndex].packetsSent;
          return (<>{value}</>);
        }
      }
    },
    {
      name: 'packetsLost',
      label: 'Data Lost',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const value = data[dataIndex].packetsLost;
          return (<>{value}</>);
        }
      }
    }
    , {
      name: 'percentageLost',
      label: '% Lost',
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const value = data[dataIndex].percentageLost;
          return (<>{value}</>);
        }
      }
    },
    {
      name: 'roundTripAverage',
      label: 'Average ms',
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const value = data[dataIndex].roundTripAverage;
          return (<>{value}</>);
        }
      }
    },
    {
      name: 'appID',
      label: 'Monitor Location',
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const value = data[dataIndex].appID;
          return (<>
            {processorList == null ? null : processorList.map(m => {
              if (m.appID == value) return m.location;
            })
            }
          </>
          );
        }
      }
    }

  ];
  const options = {

    filter: true,
    filterType: 'dropdown',
    customToolbar: () => (<HeaderElements />),
    jumpToPage: true,
    selectableRows: false,
  
    searchText: defaultSearchValue, // Populate the search field with default value

    onTableChange: (action, tableState) => {
      // Save the current table state to local storage when the table changes
      if (action === 'filterChange' || action === 'columnSortChange' || action === 'changeRowsPerPage' || action === 'changePage' || action === 'resetFilters') {
        localStorage.setItem('myTableState', JSON.stringify(tableState));
      }
    },
    onTableInit: (action, tableState) => {
      // Load the saved table state from local storage when the table initializes
      const savedState = JSON.parse(localStorage.getItem('myTableState'));
      if (savedState) {
        tableState = { ...tableState, ...savedState };
      }
    }

  };

  const HeaderElements = () => (
    <>
      {/* Existing toolbar elements */}
      <IconButton color="inherit" size="large">
        <Badge color="secondary">
          <Tooltip title="Select Dataset">
            <StorageIcon onClick={() => setShowDataSetsList(!showDataSetsList)}/>
          </Tooltip>
        </Badge>
      </IconButton>
      {/* Rest of the toolbar elements */}
    </>
  );
  
  const onDataSetSelect =  () => {
    // setDisplayDataSets(true);
    // Where to display DataSetList compoment if this is set here?

  }
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (defaultSearchValue) {
      setSearchText(defaultSearchValue);
      // Focus and trigger the search input
      if (searchInputRef.current) {
        searchInputRef.current.value = defaultSearchValue;
        searchInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
        searchInputRef.current.focus();
        searchInputRef.current.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
      }
    }
  }, [defaultSearchValue]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <>
      <CacheProvider value={muiCache}>
        <ThemeProvider theme={getMuiTheme()}>
          {showDataSetsList && (
            <DataSetsList 
              dataSets={dataSets}
              handleSetDataSetId={handleSetDataSetId}
              setDateStart={setDateStart}
              setDateEnd={setDateEnd}
              onClose={() => setShowDataSetsList(!showDataSetsList) }      
            />
          )}
          <div style={{
            width: "100%",
            overflowX: isSmallScreen ? "auto" : "visible"
          }}>
            <MUIDataTable
              title={
                !isSmallScreen ? (
                  <span style={{
                    fontWeight: 600,
                    fontSize: "1.25rem",
                    color: theme.palette.secondary.main,
                    letterSpacing: "-0.5px"
                  }}>
                    Hosts
                  </span>
                ) : null
              }
              data={data}
              columns={columns}
              options={options}
            />
          </div>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}
export default React.memo(HostList);

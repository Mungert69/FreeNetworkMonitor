import MUIDataTable from "mui-datatables";
import React, { useRef, useState, useEffect } from 'react'
import {
  Button,
  Tooltip,
  MenuItem,
  Badge,
  IconButton
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
import QuantumIcon from '@mui/icons-material/Flare'; // Replace this import with an actual icon representing QUANTUM
import DataSetsList from './DataSetsList';
import BarChartIcon from '@mui/icons-material/BarChart';
import ErrorIcon from '@mui/icons-material/Error';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import useTheme from '@mui/material/styles/useTheme';
const muiCache = createCache({
  "key": "mui",
  "prepend": true
});

export const HostList = ({ data, clickViewChart, resetHostAlert,resetPredictAlert, processorList,dataSets,handleSetDataSetId,setDateStart,setDateEnd,defaultSearchValue }) => {
  const theme = useTheme();
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
            padding: "0px",
            paddingLeft: "16px",
            bottomMargin: "0px"
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
            padding: "8px",
            paddingLeft: "32px",
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

  const [showDataSetsList, setShowDataSetsList] = useState(false);
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
                    <BarChartIcon colour='action' />
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
    }, {
      name: 'endPointType',
      label: ' ',
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const value = data[dataIndex].endPointType;
          return (<>
            {getIconForValue(value)}
          </>);
        }
      }
    }, {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        customBodyRenderLite: (dataIndex) => {
          const value = data[dataIndex].status;
          return (
            <>{value}</>);
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

  const endPointIcon = (title, component) => {
    // Write to console for debug
    //console.log(title);
    return (
      <Tooltip title={title}>
        <span>
          {component}
        </span>
      </Tooltip>
    );
  }

  const getIconForValue = (value) => {
    switch (value) {
        case 'rawconnect':
        return endPointIcon('Raw Socket Connection', <LinkIcon />);
      case 'http':
        return endPointIcon('Http (Website) Ping', <HttpIcon />);
        case 'https':
          return endPointIcon('Https (Certificate) SSL', <HttpsIcon />);
      case 'httphtml':
        return endPointIcon('Http Load (Website Html)', <HtmlIcon />);
      case 'httpfull':
        return endPointIcon('Http Full (Website Page)', <LanguageIcon />);
      case 'icmp':
        return endPointIcon('Icmp Ping', <PingIcon />);
      case 'dns':
        return endPointIcon('Dns Lookup', <DnsIcon />);

      case 'smtp':
        return endPointIcon('Smtp (Email) Ping', <EmailIcon />);

      case 'quantum':
        return endPointIcon('Quantum Ready Check', <QuantumIcon />);

      default:
        return endPointIcon('End Point Not Set', <ErrorIcon />);
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
          <MUIDataTable
            title={"View Hosts"}
            data={data}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}
export default React.memo(HostList);

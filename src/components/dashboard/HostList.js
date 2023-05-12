import MUIDataTable from "mui-datatables";
import React, { useRef } from 'react'
import {
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';

import HttpIcon from '@mui/icons-material/Http';
import LanguageIcon from '@mui/icons-material/Language';
import PingIcon from '@mui/icons-material/Speed';
import DnsIcon from '@mui/icons-material/Dns';
import EmailIcon from '@mui/icons-material/Email';
import QuantumIcon from '@mui/icons-material/Flare'; // Replace this import with an actual icon representing QUANTUM

import BarChartIcon from '@mui/icons-material/BarChart';
import ErrorIcon from '@mui/icons-material/Error';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
const muiCache = createCache({
  "key": "mui",
  "prepend": true
});

export const HostList = ({ data,clickViewChart,resetHostAlert,processorList }) => {

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
          var row=data[tableMeta];
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
                      <Button  onClick={() => resetHostAlert(row.monitorIPID)} >
                        <ErrorIcon sx={{ color: '#eb5160' }} />
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
    },  {
      name: 'endPointType',
      label: ' ',
      options: {
        filter: true,
        sort: true,
        customBodyRenderLite: (dataIndex) => {
          const value = data[dataIndex].endPointType;
          return ( <>
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
      label: '% Data Lost',
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
      label: 'Round Trip Average ms',
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
      label: 'Server Location',
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
    jumpToPage: true,
    selectableRows: false,
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
    console.log(title);
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
      case 'http':
        return endPointIcon('Http (Website) Ping',<HttpIcon />);
      case 'httpfull':
        return endPointIcon('Http Full (Website Page)',<LanguageIcon />);
      case 'icmp':
        return endPointIcon('Icmp Ping',<PingIcon />);
      case 'dns':
        return endPointIcon('Dns Lookup',<DnsIcon />);
  
      case 'smtp':
        return endPointIcon('Smtp (Email) Ping',<EmailIcon />);
     
      case 'quantum':
        return endPointIcon('Quantum Ready Check',<QuantumIcon />);
       
      default:
        return endPointIcon('End Point Not Set',<ErrorIcon />);
    }
  };
  

  return (
    <>
      <CacheProvider value={muiCache}>
        <ThemeProvider theme={getMuiTheme()}>
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

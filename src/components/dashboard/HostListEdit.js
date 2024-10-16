import MUIDataTable from "mui-datatables";
import { TablePagination, Grid } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react'
import {
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  Checkbox
} from '@mui/material';
import { fetchEditHostData, saveHostData, addHostApi, delHostApi,fetchEndpointTypes } from './ServiceAPI';
import IconButton from '@mui/material/IconButton';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Badge from '@mui/material/Badge';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/Help';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import FadeWrapper from './FadeWrapper';
import HelpDialog from './HelpDialog';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import Message from './Message';
import { useFusionAuth } from '@fusionauth/react-sdk';
const muiCache = createCache({
  "key": "mui",
  "prepend": true
});

export const HostListEdit = ({ siteId, processorList,defaultSearchValue }) => {
  const { userInfo } = useFusionAuth();
  const [selectedId, setSelectedId] = React.useState();
  const [data, setData] = React.useState([]);
  const [reset, setReset] = React.useState(true);
  const [openHelp, setOpenHelp] = React.useState(false);
  const [displayEdit, setDisplayEdit] = React.useState(true);
  const [message, setMessage] = React.useState({ info: 'init', success: false, text: "Interal Error" });
  const paginationRef = useRef(null);
  const [endpointTypes, setEndpointTypes] = useState([]); // Store endpoint types
  
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
            paddingLeft: "8px",
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
            padding: "4px",
            paddingLeft: "16px",
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
  React.useEffect(() => {
    (async () => {
      const returndata = await fetchEditHostData(siteId, userInfo);
      const endpointData = await fetchEndpointTypes(siteId); // Fetch endpoint types
      if (endpointData !== undefined) {
        setEndpointTypes(endpointData); // Set fetched endpoint types
      }
      if (returndata !== undefined) {
        setData(returndata);
      }
    })();
  }, [reset]);

  const columns = [
    {
      name: 'id',
      options: {
        display: false
      }
    },
    {
      name: 'address',
      label: 'Host Address',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          //updateData(tableMeta, data, setData, value, 'address');
          return (<FormControlLabel
            value={value}
            control={<TextField value={value} style={{ width: '300px' }} />}
            onChange={event => {
              const row = tableMeta.rowIndex;
              var tempData = data;
              tempData[row]["address"] = event.target.value;
              setData(tempData);
              updateValue(event.target.value);
            }
            }
          />);
        }
      }
    }, {
      name: 'endPointType',
      label: 'End Point',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          //updateData(tableMeta, data, setData, value, 'endPointType');
          return (
            <FormControlLabel
              label=""
              value={value}
              control={
                <Select
                  value={value}
                  onChange={event => {
                    const row = tableMeta.rowIndex;
                    var tempData = data;
                    tempData[row]["endPointType"] = event.target.value;
                    setData(tempData);
                    updateValue(event.target.value);
                  }}
                >
                  {endpointTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}

                </Select>
              }
            />
          );
        }
      }
    }, {
      name: 'timeout',
      label: 'Timeout',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          //updateData(tableMeta, data, setData, value, 'timeout');
          return (
            <FormControlLabel
              label=""
              value={value}
              control={<TextField value={value} style={{ width: '80px' }} />}
              onChange={event => {
                const row = tableMeta.rowIndex;
                var tempData = data;
                tempData[row]["timeout"] = event.target.value;
                setData(tempData);
                updateValue(event.target.value);
              }}
            />
          );
        }
      }
    }, {
      name: 'port',
      label: 'Port',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          //updateData(tableMeta, data, setData, value, 'timeout');
          return (
            <FormControlLabel
              label=""
              value={value}
              control={<TextField value={value} style={{ width: '80px' }} />}
              onChange={event => {
                const row = tableMeta.rowIndex;
                var tempData = data;
                tempData[row]["port"] = event.target.value;
                setData(tempData);
                updateValue(event.target.value);
              }}
            />
          );
        }
      }
    }
    , {
      name: 'enabled',
      label: 'Enabled',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          //updateData(tableMeta, data, setData, value, 'enabled');
          return (
            <FormControlLabel
              align='center'
              control={
                <Checkbox checked={value} onChange={event => {
                  const row = tableMeta.rowIndex;
                  var tempData = data;
                  tempData[row]["enabled"] = !tempData[row]["enabled"];
                  setData(tempData);
                  updateValue(tempData[row]["enabled"]);
                }} />
              }
            />);
        }
      }
    },
    {
      name: 'appID',
      label: 'Monitor Location',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          //updateData(tableMeta, data, setData, value, 'endPointType');
          return (
            <FormControlLabel
              label=""
              value={value}
              control={
                <Select
                  value={value}
                  onChange={event => {
                    const row = tableMeta.rowIndex;
                    var tempData = data;
                    tempData[row]["appID"] = event.target.value;
                    setData(tempData);
                    updateValue(event.target.value);
                  }}
                >
                  {
                    processorList
                      .filter(row =>
                        !row.isAtMaxLoad &&
                        (!row.disabledEndPointTypes ||
                          !row.disabledEndPointTypes.includes(data[tableMeta.rowIndex].endPointType))
                      )
                      .map(row => <MenuItem value={row.appID}>{row.location}</MenuItem>)
                  }


                </Select>
              }
            />
          );
        }
      }
    },
    {
      name: "",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (tableMeta) => {
          return (
            <IconButton color="inherit" size="large">
              <Badge color="secondary">
                <Tooltip title="Delete Host">
                  <DeleteIcon onClick={() => {
                    var temp = data;
                    const id = data[tableMeta].id;
                    delHost(id);
                  }} />
                </Tooltip>
              </Badge>
            </IconButton>
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
    textLabels: {
      // Customize the search placeholder text
      body: {
        noMatch: "No matching records found",
        toolTip: "Sort",
        columnHeaderTooltip: column => `Sort for ${column.label}`
      },
      toolbar: {
        search: "Search hosts" // Customize the search placeholder text here
      }
    },
    searchText: defaultSearchValue // Populate the search field with default value
  };




  const HeaderElements = () => (
    <>
      <IconButton color="inherit" size="large">
        <Badge color="secondary">
          <Tooltip title="Save Host List">
            <SaveIcon onClick={() => saveData(data)} />
          </Tooltip>
        </Badge>
      </IconButton>
      <FadeWrapper toggle={data.length === 0}>
        <IconButton color="inherit" size="large" 	>
          <Badge color="secondary" >
            <Tooltip title="Add new Host">
              <AddIcon onClick={() => addHost()} />
            </Tooltip>
          </Badge>
        </IconButton>
      </FadeWrapper>
      <IconButton color="inherit" size="large">
        <Badge color="secondary">
          <Tooltip title="Click for help">
            <HelpIcon onClick={() => setOpenHelp(true)} />
          </Tooltip>
        </Badge>
      </IconButton>
    </>
  );

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

  const saveData = async (data) => {
    setDisplayEdit(false);
    var message = { text: 'Plesae wait. Saving can take up to one minute..', info: false };
    setMessage(message);
    message = await saveHostData(siteId, data);
    setMessage(message);
    setDisplayEdit(true);
  }
  const addHost = async () => {
    if (!displayEdit) {
      var message = { text: 'Please save before adding another host.', success: false };
      setMessage(message);
      return;
    }
    setDisplayEdit(false);
    var message = { text: 'Plesae wait..', info: true };
    await setMessage(message);
    message = await addHostApi(siteId, userInfo, data);
    await setMessage(message);
    setDisplayEdit(true);
    setReset(!reset);
  }
  const delHost = async (selectedId) => {
    if (selectedId === undefined) return;
    setDisplayEdit(false);
    var message = { text: 'Please wait..', info: true };
    await setMessage(message);
    message = await delHostApi(siteId, userInfo, selectedId);
    await setSelectedId(undefined);
    await setMessage(message);
    setDisplayEdit(true);
    setReset(!reset);
  }

  return (
    <>
      {openHelp ? <HelpDialog setOpen={setOpenHelp} /> : null}
      <Message message={message} />
      <CacheProvider value={muiCache}>
        <ThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Edit Hosts"}
            data={data}
            columns={columns}
            options={options}
          />
        </ThemeProvider>
      </CacheProvider>
    </>
  );
}
export default React.memo(HostListEdit);

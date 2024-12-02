import MUIDataTable from "mui-datatables";
import { TablePagination, Grid } from '@mui/material';
import debounce from 'lodash.debounce';

import React, { useRef, useState, useEffect,useCallback  } from 'react'
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
import EditIcon from '@mui/icons-material/Edit';
// Import necessary MUI Icons
import PingIcon from '@mui/icons-material/Speed';
import HttpIcon from '@mui/icons-material/Http';
import HttpsIcon from '@mui/icons-material/Https';
import HtmlIcon from '@mui/icons-material/Html';
import LanguageIcon from '@mui/icons-material/Language';
import LinkIcon from '@mui/icons-material/Link';
import DnsIcon from '@mui/icons-material/Dns';
import EmailIcon from '@mui/icons-material/Email';
import QuantumIcon from '@mui/icons-material/Flare'; // Replace with actual Quantum icon
import NmapIcon from '@mui/icons-material/Search'; // Placeholder icon
import NmapVulnIcon from '@mui/icons-material/BugReport'; // Placeholder icon
import CrawlSiteIcon from '@mui/icons-material/Public'; // Placeholder icon
import ErrorIcon from '@mui/icons-material/Error'; // Error Icon
import EditHostDialog from './EditHostDialog'; // Import the dialog component

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
// Mapping of icon names to actual MUI Icon components
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
  // Add other icons as necessary
  ErrorIcon: <ErrorIcon />
};



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
  const [endpointTypeMap, setEndpointTypeMap] = useState({}); // Map for easy lookup
  const [editingHost, setEditingHost] = useState(null); // Host being edited
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Edit dialog open state
  const [isEdited, setIsEdited] = useState(false);

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [returndata, endpointData] = await Promise.all([
          fetchEditHostData(siteId, userInfo),
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

        if (returndata) {
          setData(returndata);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({ text: 'Failed to fetch data.', success: false, info: false });
      }
    };

    fetchData();
  }, [reset]);

  const debouncedUpdate = useCallback(
    debounce((rowIndex, field, value) => {
      setData(prevData => {
        const updatedData = [...prevData];
        updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
        return updatedData;
      });
      setIsEdited(true);
    }, 300), // 300ms delay
    []
  );
  
  const columns = [
    {
      name: "edit",
      label: "Edit",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex) => {
          const row = data[dataIndex];
          return (
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* Edit Host Button */}
              <Tooltip title="Edit Host">
                <span>
                  <IconButton
                    onClick={() => {
                      setEditingHost(row);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </div>
          );
        }
      }
    },
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
              debouncedUpdate(row, 'address', event.target.value);
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
          const rowIndex = tableMeta.rowIndex;
          return (
            <Select
              value={value}
              onChange={event => {
                const row = tableMeta.rowIndex;
                debouncedUpdate(row, 'endPointType', event.target.value);
                updateValue(event.target.value);
              }}
              style={{ width: '200px' }}
            >
              {endpointTypes.map((type) => (
                <MenuItem key={type.internalType} value={type.internalType}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
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
                debouncedUpdate(row, 'timeout', event.target.value);
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
                debouncedUpdate(row, 'port', event.target.value);
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
                  debouncedUpdate(row, 'enabled', event.target.checked);
                  updateValue(event.target.checked);
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
                    debouncedUpdate(row, 'appID', event.target.value);
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
          return (  <div style={{ display: 'flex', justifyContent: 'center', width: '50px' }}>
      
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
            </div>
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

  const handleEditSave = async (editedHost) => {
    try {
      // Update the data array with the edited host
      const updatedData = data.map(host => 
        host.id === editedHost.id ? { ...host, ...editedHost } : host
      );
      setData(updatedData);  
      // Save the updated data
      await saveData(updatedData);
      
      // Reset the edited state to stop the Save Icon from flashing
      setIsEdited(false);
      
      // Close the dialog
      setIsEditDialogOpen(false);
      setEditingHost(null);
      
      console.log('Host updated and saved:', editedHost);
    } catch (error) {
      console.error('Error saving edited host:', error);
      setMessage({ text: 'Failed to save edited host.', success: false, info: false });
      
      // Optionally, keep the Save Icon flashing to indicate unsaved changes
      setIsEdited(true);
    }
  };
  

// Handle canceling the Edit Dialog
const handleEditCancel = () => {
  setIsEditDialogOpen(false);
  setEditingHost(null);
};


  const HeaderElements = () => (
    <>
       <FadeWrapper toggle={isEdited}>
      <IconButton color="inherit" size="large">
        <Badge color="secondary">
          <Tooltip title="Save Host List">
            <SaveIcon onClick={() => saveData(data)} />
          </Tooltip>
        </Badge>
      </IconButton>
    </FadeWrapper>
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
    setMessage({ text: 'Please wait. Saving can take up to one minute...', info: false });
    
    try {
      const sanitizedData = data.map(({ edit, ...host }) => host);
      const response = await saveHostData(siteId, sanitizedData);
      setMessage(response);
      
      // Reset the edit flag after saving
      if (response.success) {
        setIsEdited(false);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setMessage({ text: 'Failed to save data.', success: false, info: false });
    } finally {
      setDisplayEdit(true);
    }
  };
  
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
            <EditHostDialog
            open={isEditDialogOpen}
            onClose={handleEditCancel}
            host={editingHost}
            endpointTypes={endpointTypes}
            processorList={processorList}
            onSave={handleEditSave}
          />
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

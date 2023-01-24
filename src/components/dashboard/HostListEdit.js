import MUIDataTable from "mui-datatables";
import React, { useState, useEffect } from 'react'
import {
  FormControl,
  FormControlLabel,
  TextField,
  Switch,
  Select,
  MenuItem,
  Checkbox
} from '@mui/material';
import styled from 'styled-components'
import { fetchEditHostData, saveHostData, addUserApi, addHostApi, delHostApi } from './ServiceAPI';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/Help';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { useAuth0 } from '@auth0/auth0-react';
import Message from './Message';
import HelpDialog from './HelpDialog';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
const muiCache = createCache({
	"key": "mui",
	"prepend": true
});
const updateData = (tableMeta, data, setData, value, colName) => {
  if (!Number.isInteger(tableMeta.rowData)) return;
	const id = tableMeta.currentTableData[tableMeta.rowIndex].data[tableMeta.rowData];
	const temp=data.map( row => 
	row.id=id ? {...row , [colName]: value} : {...row} 
	)
  setData(temp);
}
const HostListEdit = ({ siteId, token, processorList }) => {
  const { user } = useAuth0();
  const [selectedId, setSelectedId] = React.useState();
  const [data, setData] = React.useState([]);
  const [reset, setReset] = React.useState(true);
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [openHelp, setOpenHelp] = React.useState(false);
  const [displayEdit, setDisplayEdit] = React.useState(true);
  const getMuiTheme = () => createTheme({
		components: {
			MuiSvgIcon: {
        styleOverrides:{
					root: {
						color: '#607466'
          }
        }
			},
      MuiDataTableBodyCell: {
        styleOverrides:{
          root: {
						padding : "0px",
						paddingLeft: "16px",
						bottomMargin: "0px"
          }
        }
			},
			MuiDataTable: {
        styleOverrides:{
          root: {
          }
        }
			},
			MuiDataTableCell: {
        styleOverrides:{
          root: {
						padding : "8px",
						paddingLeft: "32px",
          }
        }
			},
			MuiFormControlLabel: {
        styleOverrides:{
          root: {
						marginBottom: 0
          }
        }
			},
    }
  })
  React.useEffect(() => {
    (async () => {
      const returndata = await fetchEditHostData(siteId, user, token);
      if (returndata !==undefined) {
        setData(returndata);
      }
    })();
  }, [reset]);
  const columns = [
    {
			name: 'id',
			options: {
				display: false}
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
              const row=tableMeta.rowIndex;
              var tempData=data;           
              tempData[row]["address"]=event.target.value;       
              setData(tempData);
              updateValue(event.target.value);}
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
                const row=tableMeta.rowIndex;
                var tempData=data;           
                tempData[row]["endPointType"]=event.target.value;       
                setData(tempData);
                updateValue(event.target.value);}}
            >
              <MenuItem value={'http'}>Http (website)</MenuItem>
              <MenuItem value={'icmp'}>ICMP (Ping)</MenuItem>
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
                const row=tableMeta.rowIndex;
                var tempData=data;           
                tempData[row]["timeout"]=event.target.value;       
                setData(tempData);
                updateValue(event.target.value);}}
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
                  const row=tableMeta.rowIndex;
                  var tempData=data;           
                  tempData[row]["enabled"]=!tempData[row]["enabled"];       
                  setData(tempData);
                  updateValue(tempData[row]["enabled"]);}} />
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
                const row=tableMeta.rowIndex;
                var tempData=data;           
                tempData[row]["appID"]=event.target.value;       
                setData(tempData);
                updateValue(event.target.value);}}
            >
              {processorList.map(row => 
                <MenuItem value={row.appID}>{row.location}</MenuItem>
              )}
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
    selectableRows: false,
    draggableColumns: true
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
      <IconButton color="inherit" size="large" 	>
        <Badge color="secondary" >
          <Tooltip title="Add new Host">
            <AddIcon onClick={() => addHost()} />
          </Tooltip>
        </Badge>
      </IconButton>
      <IconButton color="inherit" size="large">
        <Badge color="secondary">
          <Tooltip title="Click for help">
            <HelpIcon onClick={() => setOpenHelp(true)} />
          </Tooltip>
        </Badge>
      </IconButton>
    </>
  );
  const saveData = async (data) => {
    var message = { text: 'Plesae wait. Saving can take up to one minute..', info: false };
    await setMessage(message);
    await setShowMessage(true);
    message = await saveHostData(siteId, data, token);
    await setMessage(message);
    await setShowMessage(true);
    await setDisplayEdit(true);
  }
  const addHost = async () => {
    if (!displayEdit) {
      var message = { text: 'Please save before adding another host.', success: false };
      await setMessage(message);
      await setShowMessage(true);
      return;
    }
    var message = { text: 'Plesae wait..', info: true };
    await setMessage(message);
    await setShowMessage(true);
    message = await addHostApi(siteId, user, token, data);
    await setMessage(message);
    await setShowMessage(true);
    setReset(!reset);
  }
  const delHost = async (selectedId) => {
    if ( selectedId===undefined) return;
    var message = { text: 'Please wait..', info: true };
    await setMessage(message);
    await setShowMessage(true);
    message = await delHostApi(siteId, user, selectedId, token);
    await setSelectedId(undefined);
    await setMessage(message);
    await setShowMessage(true);
    setDisplayEdit(true);
    setReset(!reset);
  }
  const resetData = () => setReset(!reset)
  return (
    <>
      {openHelp ? <HelpDialog setOpen={setOpenHelp} /> : null}
      {showMessage ? <Message setShow={setShowMessage} message={message} /> : null}
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
export default HostListEdit;

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
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import Tooltip from '@mui/material/Tooltip';
import { useAuth0 } from '@auth0/auth0-react';
import Message from './Message';
import HelpDialog from './HelpDialog';

const updateData = (tableMeta, data, setData, value, colName) => {
  var temp = data;
  const id = data[tableMeta.rowIndex].id;
  const index = temp.findIndex(object => {
    return object.id === id;
  });
  if (temp[index][colName] != value) {
    temp[index][colName] = value;
    setData(temp);
  }

}


const HostListEdit = ({ siteId, token }) => {
  const { user } = useAuth0();
  const [selectedId, setSelectedId] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [reset, setReset] = React.useState(true);
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [openHelp, setOpenHelp] = React.useState(false);
  const [displayEdit, setDisplayEdit] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      const returndata = await fetchEditHostData(siteId, user, token);
      if (returndata != null) {
        setData(returndata);
      }
    })();
  }, [reset]);

  const columns = [
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
    },
    {
      name: 'address',
      label: 'Address',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          updateData(tableMeta, data, setData, value, 'address');
          return (<FormControlLabel
            value={value}
            control={<TextField value={value} />}
            onChange={event => updateValue(event.target.value)}
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
          updateData(tableMeta, data, setData, value, 'endPointType');
          return (
            <FormControl >
              <Select
                value={value}
                onChange={event => updateValue(event.target.value)}
              >
                <MenuItem value={'http'}>Http (website)</MenuItem>
                <MenuItem value={'icmp'}>ICMP (Ping)</MenuItem>
              </Select>
            </FormControl>);
        }
      }
    }, {
      name: 'timeout',
      label: 'Timeout',
      options: {
        filter: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          updateData(tableMeta, data, setData, value, 'timeout');
          return (
            <FormControlLabel
              label=""
              value={value}
              control={<TextField value={value} />}
              onChange={event => updateValue(event.target.value)}
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
          updateData(tableMeta, data, setData, value, 'enabled');
          return (
            <FormControlLabel
              align='center'
              control={
                <Checkbox checked={value} onChange={event => updateValue(event.target.checked)} />
              }
            />);
        }
      }

    }];



  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'standard',
    customToolbar: () => (<HeaderElements />),
    selectableRows: false
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
    if (selectedId == null) return;
    var message = { text: 'Please wait..', info: true };
    await setMessage(message);
    await setShowMessage(true);
    message = await delHostApi(siteId, user, selectedId, token);
    await setSelectedId(null);
    await setMessage(message);
    await setShowMessage(true);
    setDisplayEdit(true);
    setReset(!reset);
  }


  const resetData = () => setReset(!reset)

  return (
    <>
      {showMessage ? <Message setShow={setShowMessage} message={message} /> : null}
      <MUIDataTable
        title={"Edit Host List"}
        data={data}
        columns={columns}
        options={options}
      />
    </>
  );


}

export default HostListEdit;
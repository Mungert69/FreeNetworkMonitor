import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTable, usePagination } from 'react-table'
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
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';


const Styles = styled.div`

text-align: center;

  }
`
const options = {
  // pageStartIndex: 0,
  sizePerPage: 5,
  hideSizePerPage: true,
  hidePageListOnlyOnePage: true
};
const columns = [
  {
    dataField: 'address',
    text: 'Address',
    sort : true
  }, {
    dataField: 'endPointType',
    text: 'End Point',
    sort : true,
    editor: {
      type: Type.SELECT,
      getOptions: () => {
        return [{
          value: 'http',
          label: 'http'
        }, {
          value: 'icmp',
          label: 'icmp'
        }];
      }
    }
  }, {
    dataField: 'timeout',
    text: 'Timeout',
    sort : true
  }
  , {
    dataField: 'enabled',
    text: 'Enabled',
    sort : true,
    editor: {
      type: Type.SELECT,
      getOptions: () => {
        return [{
          value: 'true',
          label: 'true'
        }, {
          value: 'false',
          label: 'false'
        }];
      }
    }
  }];

function HostListEdit({ siteId, token }) {

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


  const saveData = async () => {
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
    message = await addHostApi(siteId, user, token,data);
    await setMessage(message);
    await setShowMessage(true);
    setReset(!reset);
  }
  const delHost = async () => {
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

    <Styles>
      {openHelp ? <HelpDialog setOpen={setOpenHelp} /> : null}
      {showMessage ? <Message setShow={setShowMessage} message={message} /> : <div>

        <IconButton color="inherit" size="large">
          <Badge color="secondary">
            <Tooltip title="Save Host List">
              <SaveIcon onClick={() => saveData()} />
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
            <Tooltip title="Delete Host">
              <DeleteIcon onClick={() => delHost()} />
            </Tooltip>

          </Badge>
        </IconButton>


        <IconButton color="inherit" size="large">
          <Badge color="secondary">
            <Tooltip title="Reload Host list">
              <RotateLeftIcon onClick={() => resetData()} />
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

      </div>}

      <BootstrapTable
        keyField="id"
        data={data}
        columns={columns}
        pagination={ paginationFactory(options)}
        cellEdit={cellEditFactory({
          mode: 'click',
          blurToSave: true,
          onStartEdit: (row) => {  
            setSelectedId(row.id); }
        })}
      />
    </Styles>
  );
}

export default HostListEdit

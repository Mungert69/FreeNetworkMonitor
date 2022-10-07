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
import BootstrapTable from 'react-bootstrap-table-next';


const columns = [{
  dataField: 'id',
  text: 'ID'
}, {
  dataField: 'address',
  text: 'Address'
}, {
  dataField: 'endPointType',
  text: 'End Point',
  editor: {
    type: Type.SELECT,
    getOptions: (setOptions, { row, column }) => {
      console.log(`current editing row id: ${row.id}`);
      console.log(`current editing column: ${column.dataField}`);
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
  text: 'Timeout'
}
  , {
  dataField: 'enabled',
  text: 'Enabled',
  editor: {
    type: Type.SELECT,
    getOptions: (setOptions) => {
      setTimeout(() => {
        setOptions([{
          value: 'false',
          label: 'false'
        }, {
          value: 'true',
          label: 'true'
        }]);
      }, 2000);
    }
  }
}];




const Styles = styled.div`
display: table-cell;
font-size: 0.875rem;
text-align: center;
font-family: "Roboto", "Helvetica", "Arial", sans-serif;
font-weight: 400;
line-height: 1.43;
border-bottom: 1px solid rgba(224, 224, 224, 1);
letter-spacing: 0.01071em;
vertical-align: inherit;

  table {
    width: 100%;
display: table;
border-spacing: 0;
border-collapse: collapse;

    tr {
      color: inherit;
display: table-row;
outline: 0;
vertical-align: middle;
     
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.75rem;
      border-bottom: 1px solid black;
  

      :last-child {
        border-right: 0;
      }

      input {
        font-size: 1rem;
        padding: 0.1rem;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 1.0rem;
  }
`

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  setSelectedRow
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)


  const onChange = (e) => {
    setValue(e.target.value)

  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
    setSelectedRow(index);
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input value={value} onChange={onChange} onBlur={onBlur} />
}

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
}

// Be sure to pass our updateMyData and the skipPageReset option
function Table({ columns, data, updateMyData, skipPageReset, setSelectedRow }) {
  // For this example, we're using pagination to illustrate how to stop
  // the current page from resetting when our data changes
  // Otherwise, nothing is different here.


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      setSelectedRow
    },
    usePagination
  )

  // Render the UI for your table
  return (
    <>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}


function HostListEdit({ siteId, token }) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Edit Hosts',
        columns: [

          {
            Header: 'Address',
            accessor: 'address',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'End Point',
            accessor: 'endPointType',
          },
          {
            Header: 'Timeout',
            accessor: 'timeout',
          },
          {
            Header: 'Enabled',
            accessor: 'enabled'
          },

        ],
      },
    ],
    []
  )



  const { user } = useAuth0();
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [reset, setReset] = React.useState(true);
  const [skipPageReset, setSkipPageReset] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [openHelp, setOpenHelp] = React.useState(false);
  const [displayEdit, setDisplayEdit] = React.useState(true);



  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          if (row[rowIndex] != value) setDisplayEdit(false);
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )

  }



  React.useEffect(() => {
    (async () => {
      const returndata = await fetchEditHostData(siteId, user, token);
      if (returndata != null) {
        setData(returndata);
      }
    })();
  }, [reset]);

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false)
  }, [data])

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => setReset(!reset)

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
    message = await addHostApi(siteId, user, token);
    await setMessage(message);
    await setShowMessage(true);
    setReset(!reset);
  }
  const delHost = async () => {
    if (selectedRow == null) return;
    var message = { text: 'Plesae wait..', info: true };
    await setMessage(message);
    await setShowMessage(true);
    message = await delHostApi(siteId, user, data[selectedRow].id, token);
    await setMessage(message);
    await setShowMessage(true);
    setDisplayEdit(true);
    setReset(!reset);
  }


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


      {data != null ? <Table
        columns={columns}
        data={data}
        updateMyData={updateMyData}
        skipPageReset={skipPageReset}
        setSelectedRow={setSelectedRow}
      /> : null}

      <BootstrapTable
        keyField="id"
        data={data}
        columns={columns}
        cellEdit={cellEditFactory({ mode: 'click', blurToSave: true })}
      />
    </Styles>
  );
}

export default HostListEdit

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/Help';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import PingIcon from '@mui/icons-material/Speed';
import HttpIcon from '@mui/icons-material/Http';
import HttpsIcon from '@mui/icons-material/Https';
import HtmlIcon from '@mui/icons-material/Html';
import LanguageIcon from '@mui/icons-material/Language';
import LinkIcon from '@mui/icons-material/Link';
import DnsIcon from '@mui/icons-material/Dns';
import EmailIcon from '@mui/icons-material/Email';
import QuantumIcon from '@mui/icons-material/Flare';
import NmapIcon from '@mui/icons-material/Search';
import NmapVulnIcon from '@mui/icons-material/BugReport';
import CrawlSiteIcon from '@mui/icons-material/Public';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import FadeWrapper from './FadeWrapper';
import HelpDialog from './HelpDialog';
import Message from './Message';
import EditHostDialog from './EditHostDialog';
import { useFusionAuth } from '@fusionauth/react-sdk';
import {
  fetchEditHostData,
  saveHostData,
  addHostApi,
  delHostApi,
  fetchEndpointTypes,
} from './ServiceAPI';

const iconComponentMap = {
  PingIcon,
  HttpIcon,
  HttpsIcon,
  HtmlIcon,
  LanguageIcon,
  LinkIcon,
  DnsIcon,
  EmailIcon,
  QuantumIcon,
  NmapIcon,
  NmapVulnIcon,
  CrawlSiteIcon,
};

const STORAGE_KEY_PREFIX = 'host-list-edit-grid-';

const HostListEditToolbar = ({
  onSave,
  onAdd,
  onHelp,
  isEdited,
  disableActions,
}) => (
  <GridToolbarContainer
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 1,
      py: 0.75,
      px: 1,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <FadeWrapper toggle={isEdited}>
        <Tooltip title="Save Host List">
          <span>
            <IconButton
              color="primary"
              size="small"
              aria-label="Save host list"
              onClick={onSave}
              disabled={disableActions}
            >
              <Badge color="secondary" variant="dot" overlap="circular">
                <SaveIcon />
              </Badge>
            </IconButton>
          </span>
        </Tooltip>
      </FadeWrapper>
      <Tooltip title="Add new Host">
        <span>
          <IconButton
            color="primary"
            size="small"
            aria-label="Add host"
            onClick={onAdd}
            disabled={disableActions}
          >
            <Badge color="secondary" variant="dot" overlap="circular">
              <AddIcon />
            </Badge>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Click for help">
        <span>
          <IconButton
            color="primary"
            size="small"
            aria-label="Open help dialog"
            onClick={onHelp}
          >
            <Badge color="secondary" variant="dot" overlap="circular">
              <HelpIcon />
            </Badge>
          </IconButton>
        </span>
      </Tooltip>
    </Box>
    <GridToolbarQuickFilter
      variant="outlined"
      size="small"
      debounceMs={300}
      placeholder="Search hosts"
    />
  </GridToolbarContainer>
);

export const HostListEdit = ({ siteId, processorList, defaultSearchValue }) => {
  const { userInfo } = useFusionAuth();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [data, setData] = useState([]);
  const [resetToggle, setResetToggle] = useState(true);
  const [openHelp, setOpenHelp] = useState(false);
  const [message, setMessage] = useState({ info: 'init', success: false, text: 'Internal Error' });
  const [displayEdit, setDisplayEdit] = useState(true);
  const [isEdited, setIsEdited] = useState(false);
  const [editingHost, setEditingHost] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [endpointTypes, setEndpointTypes] = useState([]);
  const [endpointTypeMap, setEndpointTypeMap] = useState({});

  const storageKey = `${STORAGE_KEY_PREFIX}${siteId ?? 'default'}`;
  const persistedState = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('Unable to parse HostListEdit grid state from storage', error);
      return null;
    }
  }, [storageKey]);

  const [filterModel, setFilterModel] = useState(() => {
    if (defaultSearchValue) {
      return { items: [], quickFilterValues: [defaultSearchValue] };
    }
    return persistedState?.filterModel ?? { items: [], quickFilterValues: [] };
  });

  const [sortModel, setSortModel] = useState(
    () => persistedState?.sortModel ?? [{ field: 'address', sort: 'asc' }],
  );

  const [paginationModel, setPaginationModel] = useState(
    () => persistedState?.paginationModel ?? { pageSize: 25, page: 0 },
  );

  useEffect(() => {
    if (!defaultSearchValue) {
      return;
    }
    setFilterModel((prev) => {
      const matchesDefault =
        prev.quickFilterValues &&
        prev.quickFilterValues.length === 1 &&
        prev.quickFilterValues[0] === defaultSearchValue;
      if (matchesDefault) {
        return prev;
      }
      return { ...prev, quickFilterValues: [defaultSearchValue] };
    });
  }, [defaultSearchValue]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ filterModel, sortModel, paginationModel }),
    );
  }, [filterModel, sortModel, paginationModel, storageKey]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hostData, endpointData] = await Promise.all([
          fetchEditHostData(siteId, userInfo),
          fetchEndpointTypes(siteId),
        ]);

        if (endpointData) {
          const map = endpointData.reduce((acc, entry) => {
            if (entry?.internalType) {
              acc[entry.internalType.toLowerCase()] = entry;
            }
            return acc;
          }, {});
          setEndpointTypeMap(map);
          setEndpointTypes(endpointData);
        }

        if (hostData) {
          setData(hostData);
        }
      } catch (error) {
        console.error('Error fetching host list data', error);
        setMessage({ text: 'Failed to fetch data.', success: false, info: false });
      }
    };

    fetchData();
  }, [resetToggle, siteId, userInfo]);

  const processorMap = useMemo(() => {
    const map = new Map();
    (processorList ?? []).forEach((processor) => {
      if (processor?.appID !== undefined && processor?.appID !== null) {
        map.set(String(processor.appID), processor.location ?? String(processor.appID));
      }
    });
    return map;
  }, [processorList]);

  const processorOptionsByRow = useCallback(
    (row) => {
      const normalizedEndpoint = `${row?.endPointType ?? ''}`.toLowerCase();

      return (processorList ?? [])
        .filter((processor) => {
          if (processor?.isAtMaxLoad) {
            return false;
          }
          const disabledTypes = (processor?.disabledEndPointTypes ?? []).map((type) =>
            `${type ?? ''}`.toLowerCase(),
          );
          if (disabledTypes.length === 0) {
            return true;
          }
          return !disabledTypes.includes(normalizedEndpoint);
        })
        .map((processor) => ({
          value: String(processor.appID),
          label: processor.location ?? String(processor.appID),
        }));
    },
    [processorList],
  );

  const rows = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );

  const handleProcessRowUpdate = useCallback((newRow, oldRow) => {
    const updatedRow = { ...oldRow, ...newRow };
    setData((prev) => prev.map((row) => (row.id === oldRow.id ? updatedRow : row)));
    setIsEdited(true);
    return updatedRow;
  }, []);

  const handleProcessRowUpdateError = useCallback((error) => {
    console.error('Row update failed', error);
  }, []);

  const openEditDialog = useCallback((row) => {
    setEditingHost(row);
    setIsEditDialogOpen(true);
  }, []);

  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditingHost(null);
  }, []);

  const saveData = useCallback(
    async (hosts) => {
      const hostsToPersist = hosts ?? data;
      setDisplayEdit(false);
      setMessage({ text: 'Please wait. Saving can take up to one minute...', info: false });
      try {
        const sanitizedData = hostsToPersist.map(({ edit, ...host }) => host);
        const response = await saveHostData(siteId, sanitizedData);
        setMessage(response);
        if (response.success) {
          setIsEdited(false);
        }
      } catch (error) {
        console.error('Error saving data', error);
        setMessage({ text: 'Failed to save data.', success: false, info: false });
      } finally {
        setDisplayEdit(true);
      }
    },
    [data, siteId],
  );

  const handleEditSave = useCallback(
    async (editedHost) => {
      try {
        const updatedData = data.map((row) =>
          row.id === editedHost.id ? { ...row, ...editedHost } : row,
        );
        setData(updatedData);
        setIsEdited(true);
        await saveData(updatedData);
        setIsEdited(false);
        closeEditDialog();
      } catch (error) {
        console.error('Error saving edited host', error);
        setMessage({ text: 'Failed to save edited host.', success: false, info: false });
        setIsEdited(true);
      }
    },
    [closeEditDialog, data, saveData],
  );

  const handleSaveClick = useCallback(() => {
    saveData(data);
  }, [data, saveData]);

  const addHost = useCallback(async () => {
    if (!displayEdit) {
      setMessage({ text: 'Please save before adding another host.', success: false });
      return;
    }
    setDisplayEdit(false);
    setMessage({ text: 'Please wait...', info: true });
    try {
      const messageResponse = await addHostApi(siteId, userInfo, data);
      setMessage(messageResponse);
      setResetToggle((prev) => !prev);
    } catch (error) {
      console.error('Error adding host', error);
      setMessage({ text: 'Failed to add host.', success: false, info: false });
    } finally {
      setDisplayEdit(true);
    }
  }, [data, displayEdit, siteId, userInfo]);

  const delHost = useCallback(
    async (id) => {
      if (!id) {
        return;
      }
      setDisplayEdit(false);
      setMessage({ text: 'Please wait...', info: true });
      try {
        const response = await delHostApi(siteId, userInfo, id);
        setMessage(response);
        setResetToggle((prev) => !prev);
      } catch (error) {
        console.error('Error deleting host', error);
        setMessage({ text: 'Failed to delete host.', success: false, info: false });
      } finally {
        setDisplayEdit(true);
      }
    },
    [siteId, userInfo],
  );

  const columns = useMemo(() => {
    const endpointOptions = endpointTypes.map((type) => ({
      value: type.internalType,
      label: type.name,
    }));

    return [
      {
        field: 'actions',
        headerName: '',
        type: 'actions',
        width: isSmallScreen ? 90 : 110,
        getActions: (params) => {
          const row = params.row;
          return [
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title="Edit Host">
                  <EditIcon />
                </Tooltip>
              }
              label="Edit Host"
              onClick={() => openEditDialog(row)}
              showInMenu={false}
            />,
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title="Delete Host">
                  <DeleteIcon />
                </Tooltip>
              }
              label="Delete Host"
              onClick={() => delHost(row.id)}
              showInMenu={false}
            />,
          ];
        },
        sortable: false,
        filterable: false,
      },
      {
        field: 'address',
        headerName: 'Host Address',
        flex: 1.3,
        minWidth: 220,
        editable: true,
      },
      {
        field: 'endPointType',
        headerName: 'End Point',
        flex: 1,
        minWidth: 180,
        editable: true,
        type: 'singleSelect',
        valueOptions: endpointOptions,
        renderCell: (params) => {
          const internalType = `${params.value ?? ''}`.toLowerCase();
          const endpointType = endpointTypeMap[internalType];
          if (!endpointType) {
            return (
              <Tooltip title="Endpoint type unavailable">
                <ErrorIcon color="warning" fontSize="small" />
              </Tooltip>
            );
          }
          const IconComponent = iconComponentMap[endpointType.icon] ?? ErrorIcon;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <IconComponent color="primary" fontSize="small" />
              <span>{endpointType.name}</span>
            </Box>
          );
        },
        valueFormatter: ({ value }) => {
          const endpointType = endpointTypeMap[`${value ?? ''}`.toLowerCase()];
          return endpointType?.name || value || '';
        },
      },
      {
        field: 'timeout',
        headerName: 'Timeout (ms)',
        width: 140,
        type: 'number',
        editable: true,
      },
      {
        field: 'port',
        headerName: 'Port',
        width: 110,
        type: 'number',
        editable: true,
      },
      {
        field: 'enabled',
        headerName: 'Enabled',
        width: 120,
        type: 'boolean',
        editable: true,
      },
      {
        field: 'appID',
        headerName: 'Monitor Location',
        flex: 1,
        minWidth: 200,
        editable: true,
        type: 'singleSelect',
        valueOptions: ({ row }) => processorOptionsByRow(row),
        valueFormatter: ({ value }) => processorMap.get(String(value)) || value || '',
        renderCell: ({ value }) => processorMap.get(String(value)) || value || '',
      },
    ];
  }, [
    delHost,
    endpointTypeMap,
    endpointTypes,
    isSmallScreen,
    openEditDialog,
    processorMap,
    processorOptionsByRow,
  ]);

  return (
    <>
      {openHelp ? <HelpDialog setOpen={setOpenHelp} /> : null}
      <Message message={message} />
      <EditHostDialog
        open={isEditDialogOpen}
        onClose={closeEditDialog}
        host={editingHost}
        endpointTypes={endpointTypes}
        processorList={processorList}
        onSave={handleEditSave}
      />
      <Box sx={{ width: '100%', height: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          density={isSmallScreen ? 'compact' : 'standard'}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          getRowId={(row) =>
            row?.id ??
            row?.monitorIPID ??
            `${row?.address ?? 'row'}-${row?.appID ?? ''}`
          }
          slots={{
            toolbar: HostListEditToolbar,
          }}
          slotProps={{
            toolbar: {
              onSave: handleSaveClick,
              onAdd: addHost,
              onHelp: () => setOpenHelp(true),
              isEdited,
              disableActions: !displayEdit,
            },
          }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.grey[100],
              fontSize: isSmallScreen ? '0.75rem' : '0.875rem',
            },
            '& .MuiDataGrid-cell': {
              fontSize: isSmallScreen ? '0.7rem' : '0.875rem',
            },
            '& .MuiDataGrid-toolbarContainer': {
              padding: theme.spacing(1),
            },
          }}
        />
      </Box>
    </>
  );
};

export default React.memo(HostListEdit);

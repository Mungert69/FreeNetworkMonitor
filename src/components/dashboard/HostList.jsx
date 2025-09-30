import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StorageIcon from '@mui/icons-material/Storage';
import BarChartIcon from '@mui/icons-material/BarChart';
import ErrorIcon from '@mui/icons-material/Error';
import PingIcon from '@mui/icons-material/Speed';
import HttpIcon from '@mui/icons-material/Http';
import HttpsIcon from '@mui/icons-material/Https';
import LinkIcon from '@mui/icons-material/Link';
import HtmlIcon from '@mui/icons-material/Html';
import LanguageIcon from '@mui/icons-material/Language';
import DnsIcon from '@mui/icons-material/Dns';
import EmailIcon from '@mui/icons-material/Email';
import QuantumIcon from '@mui/icons-material/Flare';
import NmapIcon from '@mui/icons-material/Search';
import NmapVulnIcon from '@mui/icons-material/BugReport';
import CrawlSiteIcon from '@mui/icons-material/Public';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import DataSetsList from './DataSetsList';
import { fetchEndpointTypes } from './ServiceAPI';

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

const STORAGE_KEY_PREFIX = 'host-list-grid-state-';

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  if (Number.isNaN(Number(value))) {
    return value;
  }
  return Number(value).toLocaleString();
};

const HostListToolbar = ({ onToggleDataSets }) => (
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
    <Box>
      <Tooltip title="Select Dataset">
        <span>
          <IconButton
            color="primary"
            size="small"
            aria-label="Select dataset"
            onClick={onToggleDataSets}
          >
            <Badge color="secondary" variant="dot" overlap="circular">
              <StorageIcon />
            </Badge>
          </IconButton>
        </span>
      </Tooltip>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <GridToolbarQuickFilter variant="outlined" size="small" placeholder="Search hosts" />
    </Box>
  </GridToolbarContainer>
);

export const HostList = ({
  siteId,
  data,
  clickViewChart,
  resetHostAlert,
  resetPredictAlert,
  processorList,
  dataSets,
  handleSetDataSetId,
  setDateStart,
  setDateEnd,
  defaultSearchValue,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [showDataSetsList, setShowDataSetsList] = useState(false);
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
      console.warn('Unable to parse HostList grid state from storage', error);
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
        const endpointData = await fetchEndpointTypes(siteId);
        if (endpointData) {
          const map = endpointData.reduce((acc, entry) => {
            if (entry?.internalType) {
              acc[entry.internalType.toLowerCase()] = entry;
            }
            return acc;
          }, {});
          setEndpointTypeMap(map);
        }
      } catch (error) {
        console.error('Error fetching endpoint types', error);
      }
    };

    fetchData();
  }, [siteId]);

  const processorMap = useMemo(() => {
    const map = new Map();
    (processorList ?? []).forEach((processor) => {
      map.set(processor.appID, processor.location);
    });
    return map;
  }, [processorList]);

  const rows = useMemo(
    () =>
      (data ?? []).map((row) => ({
        ...row,
        id: row.monitorIPID ?? row.id ?? `${row.address}-${row.appID ?? ''}`,
      })),
    [data],
  );

  const columns = useMemo(
    () => [
      {
        field: 'actions',
        headerName: '',
        type: 'actions',
        width: isSmallScreen ? 100 : 140,
        getActions: (params) => {
          const row = params.row;
          const actions = [
            <GridActionsCellItem
              key="view"
              icon={
                <Tooltip title="View Chart">
                  <BarChartIcon color="action" />
                </Tooltip>
              }
              label="View Chart"
              onClick={() => clickViewChart(row)}
              showInMenu={false}
            />,
          ];

          if (row.alertFlag) {
            actions.push(
              <GridActionsCellItem
                key="reset-alert"
                icon={
                  <Tooltip title="Reset Alert">
                    <ErrorIcon sx={{ color: theme.palette.error.main }} />
                  </Tooltip>
                }
                label="Reset Alert"
                onClick={() => resetHostAlert(row.monitorIPID)}
                showInMenu={false}
              />,
            );
          }

          if (row.predictAlertFlag) {
            actions.push(
              <GridActionsCellItem
                key="reset-predict"
                icon={
                  <Tooltip title="Reset Predict Alert">
                    <ErrorIcon sx={{ color: theme.palette.warning.main }} />
                  </Tooltip>
                }
                label="Reset Predict Alert"
                onClick={() => resetPredictAlert(row.monitorIPID)}
                showInMenu={false}
              />,
            );
          }

          return actions;
        },
        sortable: false,
        filterable: false,
      },
      {
        field: 'address',
        headerName: 'Host Address',
        flex: 1.25,
        minWidth: 180,
      },
      {
        field: 'endPointType',
        headerName: 'Endpoint Type',
        align: 'center',
        headerAlign: 'center',
        width: 130,
        sortable: true,
        renderCell: (params) => {
          const internalType = `${params.value ?? ''}`.toLowerCase();
          const endpointType = endpointTypeMap[internalType];

          if (!endpointType) {
            return (
              <Tooltip title="Endpoint type unavailable">
                <ErrorIcon color="warning" />
              </Tooltip>
            );
          }

          const IconComponent = iconComponentMap[endpointType.icon] ?? ErrorIcon;

          return (
            <Tooltip title={endpointType.description || endpointType.name}>
              <Box component="span" sx={{ display: 'inline-flex' }}>
                <IconComponent color="primary" fontSize="small" />
              </Box>
            </Tooltip>
          );
        },
        valueFormatter: (params) => params.value,
      },
      {
        field: 'packetsSent',
        headerName: 'Data Sent',
        type: 'number',
        width: 120,
        valueFormatter: ({ value }) => formatNumber(value),
      },
      {
        field: 'packetsLost',
        headerName: 'Data Lost',
        type: 'number',
        width: 120,
        valueFormatter: ({ value }) => formatNumber(value),
      },
      {
        field: 'percentageLost',
        headerName: '% Lost',
        width: 100,
        valueFormatter: ({ value }) =>
          value === null || value === undefined || value === ''
            ? ''
            : `${value}`,
      },
      {
        field: 'roundTripAverage',
        headerName: 'Average ms',
        width: 130,
        valueFormatter: ({ value }) => formatNumber(value),
      },
      {
        field: 'appID',
        headerName: 'Monitor Location',
        flex: 1,
        minWidth: 160,
        valueGetter: ({ value }) => processorMap.get(value) || value,
      },
    ],
    [
      clickViewChart,
      endpointTypeMap,
      isSmallScreen,
      processorMap,
      resetHostAlert,
      resetPredictAlert,
      theme,
    ],
  );

  return (
    <>
      {showDataSetsList && (
        <DataSetsList
          dataSets={dataSets}
          handleSetDataSetId={handleSetDataSetId}
          setDateStart={setDateStart}
          setDateEnd={setDateEnd}
          onClose={() => setShowDataSetsList(false)}
        />
      )}
      <Box sx={{ width: '100%', height: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          density={isSmallScreen ? 'compact' : 'standard'}
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50, 100]}
          getRowId={(row) => row.id}
          slots={{ toolbar: HostListToolbar }}
          slotProps={{ toolbar: { onToggleDataSets: () => setShowDataSetsList(true) } }}
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

export default React.memo(HostList);

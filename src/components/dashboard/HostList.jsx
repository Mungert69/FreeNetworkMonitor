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

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value;
  }
  return numeric.toLocaleString();
};

const parseNumericValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  const cleaned = String(value).replace(/[^0-9.-]+/g, '');
  if (cleaned === '') {
    return null;
  }
  const numeric = Number(cleaned);
  return Number.isNaN(numeric) ? null : numeric;
};

const numericValueGetter = ({ row, field }) => parseNumericValue(row?.[field]);

const numericValueFormatter = (params = {}) => formatNumber(params?.value);

const percentageValueFormatter = (params = {}) => {
  const value = params?.value;
  if (value === null || value === undefined || value === '') {
    return '';
  }
  return `${formatNumber(value)}%`;
};

const createDefaultSortModel = () => [{ field: 'address', sort: 'asc' }];
const createDefaultPaginationModel = () => ({ pageSize: 25, page: 0 });

const getDefaultFilterModel = (searchValue) =>
  searchValue
    ? { items: [], quickFilterValues: [searchValue] }
    : { items: [], quickFilterValues: [] };

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

  const [filterModel, setFilterModel] = useState(() => getDefaultFilterModel(defaultSearchValue));

  const [sortModel, setSortModel] = useState(() => createDefaultSortModel());

  const [paginationModel, setPaginationModel] = useState(() => createDefaultPaginationModel());

  useEffect(() => {
    const rowCount = Array.isArray(data) ? data.length : 0;
    console.debug('HostList debug: received data props', {
      siteId,
      rowCount,
      sample: rowCount > 0 ? data.slice(0, Math.min(3, rowCount)) : [],
      defaultSearchValue,
    });
  }, [data, siteId, defaultSearchValue]);

  useEffect(() => {
    setFilterModel(getDefaultFilterModel(defaultSearchValue));
    setPaginationModel(createDefaultPaginationModel());
  }, [defaultSearchValue]);

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
      if (processor?.appID) {
        map.set(processor.appID, processor.location ?? processor.appID);
      }
    });
    return map;
  }, [processorList]);

  const monitorLocationOptions = useMemo(() => {
    const options = [];
    const seen = new Set();
    (processorList ?? []).forEach(({ location }) => {
      if (!location) {
        return;
      }
      const normalized = String(location);
      if (!seen.has(normalized)) {
        seen.add(normalized);
        options.push(normalized);
      }
    });
    return options;
  }, [processorList]);

  const rows = useMemo(
    () =>
      (data ?? []).map((row) => ({
        ...row,
        id: row.monitorIPID ?? row.id ?? `${row.address}-${row.appID ?? ''}`,
      })),
    [data],
  );

  useEffect(() => {
    console.debug('HostList debug: computed rows for grid', {
      rowCount: rows.length,
      sample: rows.length > 0 ? rows.slice(0, Math.min(3, rows.length)) : [],
    });
  }, [rows]);

  useEffect(() => {
    const count = processorList?.length ?? 0;
    console.debug('HostList debug: processor list updated', {
      count,
      sample: count > 0 ? processorList.slice(0, Math.min(3, count)) : [],
    });
  }, [processorList]);

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
        valueGetter: numericValueGetter,
        valueFormatter: numericValueFormatter,
      },
      {
        field: 'packetsLost',
        headerName: 'Data Lost',
        type: 'number',
        width: 120,
        valueGetter: numericValueGetter,
        valueFormatter: numericValueFormatter,
      },
      {
        field: 'percentageLost',
        headerName: '% Lost',
        width: 100,
        type: 'number',
        valueGetter: numericValueGetter,
        valueFormatter: percentageValueFormatter,
      },
      {
        field: 'roundTripAverage',
        headerName: 'Average ms',
        width: 130,
        type: 'number',
        valueGetter: numericValueGetter,
        valueFormatter: numericValueFormatter,
      },
      {
        field: 'appID',
        headerName: 'Monitor Location',
        flex: 1,
        minWidth: 160,
        type: 'singleSelect',
        valueOptions: monitorLocationOptions,
        valueGetter: ({ row }) => processorMap.get(row?.appID) || row?.appID || '',
        sortComparator: (value1, value2) => String(value1).localeCompare(String(value2)),
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

  useEffect(() => {
    console.debug('HostList debug: grid state changed', {
      filterModel,
      sortModel,
      paginationModel,
    });
  }, [filterModel, sortModel, paginationModel]);

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

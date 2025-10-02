import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  useMediaQuery,
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
import HugIcon from '@mui/icons-material/AccessAlarm';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import DataSetsList from './DataSetsList';
import { fetchEndpointTypes } from './ServiceAPI';

const muiCache = createCache({
  key: 'mui',
  prepend: true,
});

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
  HugIcon,
};

const STORAGE_KEY_PREFIX = 'host-list-grid-state-';

const formatNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const numeric = Number(
    typeof value === 'number' ? value : String(value).replace(/[^0-9.-]+/g, ''),
  );
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

const arraysAreEqual = (a = [], b = []) => {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) {
      return false;
    }
  }
  return true;
};

const filterModelsEqual = (a, b) =>
  arraysAreEqual(a?.items ?? [], b?.items ?? []) &&
  arraysAreEqual(a?.quickFilterValues ?? [], b?.quickFilterValues ?? []);

const createDefaultSortModel = () => [{ field: 'address', sort: 'asc' }];
const createDefaultPaginationModel = () => ({ pageSize: 25, page: 0 });

const getDefaultFilterModel = (searchValue) => ({
  items: [],
  quickFilterValues: searchValue ? [searchValue] : [],
});

const sanitizeFilterModel = (model) => ({
  items: Array.isArray(model?.items) ? model.items : [],
  quickFilterValues: Array.isArray(model?.quickFilterValues)
    ? model.quickFilterValues
    : [],
});

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

const HostListMobileToolbar = ({
  onToggleDataSets,
  quickFilterValue,
  onQuickFilterChange,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
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
    <TextField
      value={quickFilterValue}
      onChange={(event) => onQuickFilterChange(event.target.value)}
      variant="outlined"
      size="small"
      placeholder="Search hosts"
      InputProps={{
        'aria-label': 'Search hosts',
      }}
    />
  </Box>
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

  const storageKey = useMemo(
    () => `${STORAGE_KEY_PREFIX}${siteId ?? 'default'}`,
    [siteId],
  );

  const [filterModel, setFilterModel] = useState(() =>
    sanitizeFilterModel(getDefaultFilterModel(defaultSearchValue)),
  );
  const [sortModel, setSortModel] = useState(() => createDefaultSortModel());
  const [paginationModel, setPaginationModel] = useState(() =>
    createDefaultPaginationModel(),
  );
  const [density, setDensity] = useState(isSmallScreen ? 'compact' : 'standard');

  useEffect(() => {
    setDensity(isSmallScreen ? 'compact' : 'standard');
  }, [isSmallScreen]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        setFilterModel((prev) => {
          const next = sanitizeFilterModel(getDefaultFilterModel(''));
          return filterModelsEqual(prev, next) ? prev : next;
        });
        setSortModel((prev) => {
          const next = createDefaultSortModel();
          return arraysAreEqual(prev, next) ? prev : next;
        });
        setPaginationModel((prev) => {
          const next = createDefaultPaginationModel();
          return prev.page === next.page && prev.pageSize === next.pageSize ? prev : next;
        });
        return;
      }

      const parsed = JSON.parse(raw);

      if (parsed.filterModel) {
        const nextFilter = sanitizeFilterModel(parsed.filterModel);
        setFilterModel((prev) => (filterModelsEqual(prev, nextFilter) ? prev : nextFilter));
      }

      if (parsed.sortModel) {
        setSortModel((prev) =>
          arraysAreEqual(prev, parsed.sortModel) ? prev : parsed.sortModel,
        );
      }

      if (parsed.paginationModel) {
        setPaginationModel((prev) => {
          const next = parsed.paginationModel;
          if (prev.page === next.page && prev.pageSize === next.pageSize) {
            return prev;
          }
          return next;
        });
      }
    } catch (error) {
      console.warn('HostList unable to load persisted grid state', error);
    }
  }, [storageKey]);

  useEffect(() => {
    setFilterModel((prev) => {
      const nextQuickValues = defaultSearchValue ? [defaultSearchValue] : [];
      const currentQuickValues = prev.quickFilterValues ?? [];
      const isSame =
        currentQuickValues.length === nextQuickValues.length &&
        currentQuickValues.every((value, index) => value === nextQuickValues[index]);
      if (isSame) {
        return prev;
      }
      return {
        ...prev,
        quickFilterValues: nextQuickValues,
      };
    });
  }, [defaultSearchValue]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const stateToPersist = {
      filterModel,
      sortModel,
      paginationModel,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(stateToPersist));
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
        console.error('HostList failed to fetch endpoint types', error);
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
    () => (Array.isArray(data) ? data : []),
    [data],
  );

  const columns = useMemo(
    () => [
      {
        field: 'actions',
        headerName: '',
        sortable: false,
        filterable: false,
        width: isSmallScreen ? 50 : 90,
        renderCell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            <Tooltip title="View Chart">
              <span>
                <Button
                  size="small"
                  onClick={() => clickViewChart(row)}
                  aria-label="View Chart"
                  sx={{ minWidth: 32, px: 0.5 }}
                >
                  <BarChartIcon color="action" fontSize="small" />
                </Button>
              </span>
            </Tooltip>
            {row.alertFlag && (
              <Tooltip title="Reset Alert">
                <span>
                  <Button
                    size="small"
                    onClick={() => resetHostAlert(row.monitorIPID)}
                    aria-label="Reset Alert"
                    sx={{ minWidth: 32, px: 0.5 }}
                  >
                    <ErrorIcon sx={{ color: theme.palette.error.main }} fontSize="small" />
                  </Button>
                </span>
              </Tooltip>
            )}
            {row.predictAlertFlag && (
              <Tooltip title="Reset Predict Alert">
                <span>
                  <Button
                    size="small"
                    onClick={() => resetPredictAlert(row.monitorIPID)}
                    aria-label="Reset Predict Alert"
                    sx={{ minWidth: 32, px: 0.5 }}
                  >
                    <ErrorIcon sx={{ color: theme.palette.warning.main }} fontSize="small" />
                  </Button>
                </span>
              </Tooltip>
            )}
          </Box>
        ),
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
        renderCell: ({ value }) => {
          const internalType = `${value ?? ''}`.toLowerCase();
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
            <Tooltip title={endpointType.description || endpointType.name}>
              <Box component="span" sx={{ display: 'inline-flex' }}>
                <IconComponent color="primary" fontSize="small" />
              </Box>
            </Tooltip>
          );
        },
      },
      {
        field: 'packetsSent',
        headerName: 'Data Sent',
        type: 'number',
        width: 100,
        valueGetter: ({ row }) => parseNumericValue(row?.packetsSent),
        renderCell: ({ row }) => formatNumber(row?.packetsSent),
      },
      {
        field: 'packetsLost',
        headerName: 'Data Lost',
        type: 'number',
        width: 100,
        valueGetter: ({ row }) => parseNumericValue(row?.packetsLost),
        renderCell: ({ row }) => formatNumber(row?.packetsLost),
      },
      {
        field: 'percentageLost',
        headerName: '% Lost',
        width: 100,
        type: 'number',
        valueGetter: ({ row }) => parseNumericValue(row?.percentageLost),
        renderCell: ({ row }) => {
          const value = row?.percentageLost;
          if (value === null || value === undefined || value === '') {
            return '';
          }
          return `${formatNumber(value)}%`;
        },
      },
      {
        field: 'roundTripAverage',
        headerName: 'Average ms',
        width: 130,
        type: 'number',
        valueGetter: ({ row }) => parseNumericValue(row?.roundTripAverage),
        renderCell: ({ row }) => formatNumber(row?.roundTripAverage),
      },
      {
        field: 'appID',
        headerName: 'Monitor Location',
        flex: 1,
        minWidth: 160,
        type: 'singleSelect',
        valueOptions: monitorLocationOptions,
        valueGetter: ({ row }) => processorMap.get(row?.appID) || row?.appID || '',
        sortComparator: (value1, value2) =>
          String(value1 || '').localeCompare(String(value2 || ''), undefined, {
            sensitivity: 'base',
          }),
        renderCell: ({ row }) => processorMap.get(row?.appID) || row?.appID || '',
      },
    ],
    [
      clickViewChart,
      endpointTypeMap,
      isSmallScreen,
      monitorLocationOptions,
      processorMap,
      resetHostAlert,
      resetPredictAlert,
      theme.palette.error.main,
      theme.palette.warning.main,
    ],
  );

  const quickFilterValue = filterModel?.quickFilterValues?.[0] ?? '';

  const getEndpointTypeName = useCallback(
    (value) => {
      if (value === null || value === undefined || value === '') {
        return '';
      }
      const normalized = `${value}`.toLowerCase();
      const endpointType = endpointTypeMap[normalized];
      return endpointType?.name || value || '';
    },
    [endpointTypeMap],
  );

  const handleQuickFilterValueChange = useCallback(
    (value) => {
      setFilterModel((prev) => {
        const next = sanitizeFilterModel({
          ...prev,
          quickFilterValues: value ? [value] : [],
        });
        return filterModelsEqual(prev, next) ? prev : next;
      });
      setPaginationModel((prev) =>
        prev.page === 0
          ? prev
          : {
              ...prev,
              page: 0,
            },
      );
    },
    [setFilterModel, setPaginationModel],
  );

  const filteredRows = useMemo(() => {
    const quickValues = filterModel?.quickFilterValues ?? [];
    const normalizedFilters = quickValues
      .map((value) => (typeof value === 'string' ? value.trim().toLowerCase() : ''))
      .filter((value) => value.length > 0);

    if (!isSmallScreen || normalizedFilters.length === 0) {
      return rows;
    }

    return rows.filter((row) => {
      if (!row || typeof row !== 'object') {
        return false;
      }

      const searchableValues = [
        row.address,
        row.endPointType,
        row.monitorIPID,
        row.appID,
        processorMap.get(row?.appID),
        row.packetsSent,
        row.packetsLost,
        row.percentageLost,
        row.roundTripAverage,
      ]
        .flatMap((value) => {
          if (value === null || value === undefined) {
            return [];
          }
          if (Array.isArray(value)) {
            return value;
          }
          return [value];
        })
        .map((value) => String(value).toLowerCase());

      if (searchableValues.length === 0) {
        return false;
      }

      return normalizedFilters.every((filterToken) =>
        searchableValues.some((candidate) => candidate.includes(filterToken)),
      );
    });
  }, [filterModel, isSmallScreen, processorMap, rows]);

  const handleFilterModelChange = (model) => {
    const sanitized = sanitizeFilterModel(model);
    setFilterModel((prev) => (filterModelsEqual(prev, sanitized) ? prev : sanitized));
  };

  // Responsive: Show DataGrid on desktop, Card list on small screens
  if (isSmallScreen) {
    return (
      <CacheProvider value={muiCache}>
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
          <Box sx={{ mb: 2 }}>
            <HostListMobileToolbar
              onToggleDataSets={() => setShowDataSetsList((prev) => !prev)}
              quickFilterValue={quickFilterValue}
              onQuickFilterChange={handleQuickFilterValueChange}
            />
          </Box>
          {filteredRows.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
              No hosts match your current filters.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {filteredRows.map((row) => {
                const endpointTypeLabel = getEndpointTypeName(row.endPointType);
                const stats = [
                  {
                    label: 'Data Sent',
                    value: formatNumber(row.packetsSent) || '—',
                  },
                  {
                    label: 'Data Lost',
                    value: formatNumber(row.packetsLost) || '—',
                  },
                  {
                    label: '% Lost',
                    value:
                      row.percentageLost != null && row.percentageLost !== ''
                        ? `${formatNumber(row.percentageLost)}%`
                        : '—',
                  },
                  {
                    label: 'Average ms',
                    value: formatNumber(row.roundTripAverage) || '—',
                  },
                ];

                return (
                  <Card
                    key={row?.monitorIPID ?? row?.id ?? `${row?.address ?? 'row'}-${row?.appID ?? ''}`}
                    sx={{ mb: 1 }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: 1,
                          mb: 1.5,
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 700, mb: 0.5 }}
                            noWrap
                          >
                            {row.address}
                          </Typography>
                          {endpointTypeLabel && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              Endpoint Type: {endpointTypeLabel}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Monitor: {processorMap.get(row?.appID) || row?.appID || '—'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {columns[0].renderCell({ row })}
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                        }}
                      >
                        {stats.map((stat) => (
                          <Box
                            key={stat.label}
                            sx={{
                              flex: '1 1 120px',
                              minWidth: 120,
                              borderRadius: 1,
                              px: 1.25,
                              py: 1,
                              backgroundColor: theme.palette.grey[100],
                            }}
                          >
                            <Typography variant="caption" color="text.secondary">
                              {stat.label}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {stat.value}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          )}
        </Box>
      </CacheProvider>
    );
  }

  // Desktop/tablet: show DataGrid
  return (
    <CacheProvider value={muiCache}>
      {showDataSetsList && (
        <DataSetsList
          dataSets={dataSets}
          handleSetDataSetId={handleSetDataSetId}
          setDateStart={setDateStart}
          setDateEnd={setDateEnd}
          onClose={() => setShowDataSetsList(false)}
        />
      )}
      <Box
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          density={density}
          onDensityChange={(newDensity) => setDensity(newDensity)}
          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
          sortModel={sortModel}
          onSortModelChange={(model) =>
            setSortModel((prev) => (arraysAreEqual(prev, model) ? prev : model))
          }
          paginationModel={paginationModel}
          onPaginationModelChange={(model) =>
            setPaginationModel((prev) =>
              prev.page === model.page && prev.pageSize === model.pageSize ? prev : model,
            )
          }
          pageSizeOptions={[10, 25, 50, 100]}
          getRowId={(row) =>
            row?.monitorIPID ?? row?.id ?? `${row?.address ?? 'row'}-${row?.appID ?? ''}`
          }
          showToolbar
          slots={{ toolbar: HostListToolbar }}
          slotProps={{ toolbar: { onToggleDataSets: () => setShowDataSetsList((prev) => !prev) } }}
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
    </CacheProvider>
  );
};

export default React.memo(HostList);

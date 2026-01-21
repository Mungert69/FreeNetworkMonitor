import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import HelpIcon from '@mui/icons-material/Help';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import TuneIcon from '@mui/icons-material/Tune';
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
import EditMonitorModelConfigDialog from './EditMonitorModelConfigDialog';
import { useFusionAuth } from '@fusionauth/react-sdk';
import {
  fetchEditHostData,
  saveHostData,
  addHostApi,
  delHostApi,
  fetchEndpointTypes,
  updateMonitorModelConfig,
  deleteMonitorModelConfig,
} from './ServiceAPI';
import { getEndpointIcon } from './endpointIcons';

const STORAGE_KEY_PREFIX = 'host-list-edit-grid-';

const toPascalCaseKey = (key) => {
  if (key === 'id') {
    return 'ID';
  }
  if (!key) {
    return key;
  }
  return key.charAt(0).toUpperCase() + key.slice(1);
};

const toCamelCaseKey = (key) => {
  if (key === 'ID') {
    return 'id';
  }
  if (!key) {
    return key;
  }
  return key.charAt(0).toLowerCase() + key.slice(1);
};

const toApiMonitorModelConfigPayload = (config) => {
  if (!config) {
    return null;
  }
  const payload = {};
  Object.entries(config).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }
    payload[toPascalCaseKey(key)] = value;
  });
  if (!Object.prototype.hasOwnProperty.call(payload, 'ID')) {
    payload.ID = 0;
  }
  return payload;
};

const fromApiMonitorModelConfigPayload = (config) => {
  if (!config) {
    return null;
  }
  const normalized = {};
  Object.entries(config).forEach(([key, value]) => {
    normalized[toCamelCaseKey(key)] = value;
  });
  return normalized;
};

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

export const HostListEdit = ({ siteId, processorList, defaultSearchValue, llmUpdateToken }) => {
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
  const [editingModelConfigHost, setEditingModelConfigHost] = useState(null);
  const [isModelConfigDialogOpen, setIsModelConfigDialogOpen] = useState(false);
  const [isLlmConflictDialogOpen, setIsLlmConflictDialogOpen] = useState(false);
  const [llmConflictSummary, setLlmConflictSummary] = useState(null);
  const pendingLlmDataRef = useRef(null);
  const localDraftRef = useRef(null);
  const baselineDataRef = useRef(null);

  const applyEndpointData = useCallback((endpointData) => {
    if (!endpointData) {
      return;
    }
    const map = endpointData.reduce((acc, entry) => {
      if (entry?.internalType) {
        acc[entry.internalType.toLowerCase()] = entry;
      }
      return acc;
    }, {});
    setEndpointTypeMap(map);
    setEndpointTypes(endpointData);
  }, []);

  const resolveAgentLocation = useCallback(
    (appId) => {
      if (!appId) {
        return '';
      }
      const match = (processorList ?? []).find((row) => String(row.appID) === String(appId));
      return match?.location ?? '';
    },
    [processorList],
  );

  const mergeEndpointData = useCallback(
    (endpointData, currentType) => {
      if (!currentType) {
        applyEndpointData(endpointData);
        return;
      }
      const normalizedCurrent = String(currentType).toLowerCase();
      const alreadyExists = (endpointData ?? []).some(
        (entry) => String(entry?.internalType ?? '').toLowerCase() === normalizedCurrent,
      );
      if (!alreadyExists) {
        applyEndpointData([
          ...(endpointData ?? []),
          {
            internalType: currentType,
            name: `Custom (offline): ${currentType}`,
            icon: 'CustomConnectIcon',
            description: 'Custom endpoint type from offline agent.',
          },
        ]);
        return;
      }
      applyEndpointData(endpointData);
    },
    [applyEndpointData],
  );

  const loadEndpointTypes = useCallback(
    async (appId) => {
      try {
        const location = resolveAgentLocation(appId);
        console.log('HostListEdit.loadEndpointTypes', {
          appId,
          location,
        });
        const endpointData = await fetchEndpointTypes(siteId, location);
        const appIdValue = appId ?? '';
        const currentType = data.find((row) => String(row?.appID ?? '') === String(appIdValue))
          ?.endPointType;
        mergeEndpointData(endpointData, currentType);
      } catch (error) {
        console.error('HostListEdit failed to fetch endpoint types', error);
      }
    },
    [data, mergeEndpointData, resolveAgentLocation, siteId],
  );

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
    () => persistedState?.sortModel ?? [],
  );

  const [paginationModel, setPaginationModel] = useState(
    () => persistedState?.paginationModel ?? { pageSize: 25, page: 0 },
  );

  const pendingAdditionRef = useRef(false);
  const lastKnownRowIdsRef = useRef(new Set());
  const recentlyAddedRowIdsRef = useRef(new Set());
  const lastEndpointFetchRef = useRef(null);

  const getRowIdentifier = useCallback(
    (row) =>
      row?.id ??
      row?.monitorIPID ??
      `${row?.address ?? 'row'}-${row?.appID ?? ''}`,
    [],
  );

  const arrangeRowsForDisplay = useCallback(
    (incomingRows) => {
      const rowsArray = Array.isArray(incomingRows) ? incomingRows : [];
      const previousIds = lastKnownRowIdsRef.current ?? new Set();
      const nextIds = new Set();
      const prioritizedIds = new Set(recentlyAddedRowIdsRef.current ?? []);
      const pendingBeforeProcessing = pendingAdditionRef.current;
      const newlyDetectedIds = [];

      rowsArray.forEach((row) => {
        const rowId = getRowIdentifier(row);
        nextIds.add(rowId);
        if (pendingBeforeProcessing && !previousIds.has(rowId)) {
          newlyDetectedIds.push(rowId);
        }
      });

      if (pendingBeforeProcessing) {
        if (newlyDetectedIds.length > 0) {
          newlyDetectedIds.forEach((id) => prioritizedIds.add(id));
        } else if (rowsArray.length > 1) {
          const lastRowId = getRowIdentifier(rowsArray[rowsArray.length - 1]);
          prioritizedIds.add(lastRowId);
        }
      }

      const prioritizedRows = [];
      const otherRows = [];

      rowsArray.forEach((row) => {
        const rowId = getRowIdentifier(row);
        if (prioritizedIds.has(rowId)) {
          prioritizedRows.push(row);
        } else {
          otherRows.push(row);
        }
      });

      const hasPrioritizedRows = prioritizedRows.length > 0;
      const reorderedRows = hasPrioritizedRows ? [...prioritizedRows, ...otherRows] : rowsArray;
      const newRowsAdded = pendingBeforeProcessing && hasPrioritizedRows;

      if (hasPrioritizedRows && pendingBeforeProcessing) {
        recentlyAddedRowIdsRef.current = prioritizedIds;
      } else {
        recentlyAddedRowIdsRef.current = new Set();
      }

      lastKnownRowIdsRef.current = nextIds;
      pendingAdditionRef.current = false;

      return {
        rows: reorderedRows,
        newRowsAdded,
      };
    },
    [getRowIdentifier],
  );

  useEffect(() => {
    if (isEdited && !baselineDataRef.current) {
      baselineDataRef.current = data;
    }
    if (!isEdited) {
      baselineDataRef.current = null;
    }
  }, [data, isEdited]);

  const normalizeRowForCompare = useCallback((row) => {
    if (!row) {
      return null;
    }
    return {
      id: row.id ?? row.monitorIPID ?? null,
      address: row.address,
      endPointType: row.endPointType,
      timeout: row.timeout,
      port: row.port,
      enabled: row.enabled,
      hidden: row.hidden,
      appID: row.appID,
      username: row.username,
      password: row.password,
      args: row.args,
      monitorModelConfigId: row.monitorModelConfigId,
      modelConfig: row.modelConfig ?? null,
    };
  }, []);

  const buildRowMaps = useCallback(
    (rows) => {
      const map = new Map();
      (rows ?? []).forEach((row) => {
        map.set(getRowIdentifier(row), normalizeRowForCompare(row));
      });
      return map;
    },
    [getRowIdentifier, normalizeRowForCompare],
  );

  const computeConflictSummary = useCallback(
    (baseRows, localRows, remoteRows) => {
      const baseMap = buildRowMaps(baseRows);
      const localMap = buildRowMaps(localRows);
      const remoteMap = buildRowMaps(remoteRows);
      const allIds = new Set([...baseMap.keys(), ...localMap.keys(), ...remoteMap.keys()]);
      const conflictIds = new Set();

      allIds.forEach((rowId) => {
        const base = baseMap.get(rowId);
        const local = localMap.get(rowId);
        const remote = remoteMap.get(rowId);

        if (!base || !local || !remote) {
          return;
        }

        Object.keys(base).forEach((field) => {
          const baseVal = base[field];
          const localVal = local[field];
          const remoteVal = remote[field];
          if (localVal !== baseVal && remoteVal !== baseVal && localVal !== remoteVal) {
            conflictIds.add(rowId);
          }
        });
      });

      return {
        totalConflicts: conflictIds.size,
      };
    },
    [buildRowMaps],
  );

  const applyRemoteMerge = useCallback(
    (baseRows, localRows, remoteRows) => {
      const baseMap = buildRowMaps(baseRows);
      const localMap = buildRowMaps(localRows);
      const remoteMap = buildRowMaps(remoteRows);
      const mergedRows = (localRows ?? []).map((row) => {
        const rowId = getRowIdentifier(row);
        const base = baseMap.get(rowId);
        const local = localMap.get(rowId);
        const remote = remoteMap.get(rowId);
        if (!base || !local || !remote) {
          return row;
        }
        const merged = { ...row };
        Object.keys(base).forEach((field) => {
          const baseVal = base[field];
          const localVal = local[field];
          const remoteVal = remote[field];
          if (localVal === baseVal && remoteVal !== baseVal) {
            merged[field] = remoteVal;
          }
        });
        return merged;
      });

      return mergedRows;
    },
    [buildRowMaps, getRowIdentifier],
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
        const hostData = await fetchEditHostData(siteId, userInfo);
        if (hostData) {
          const { rows: adjustedRows, newRowsAdded } = arrangeRowsForDisplay(hostData);
          setData(adjustedRows);
          fetchEndpointTypes(siteId)
            .then((endpointData) => mergeEndpointData(endpointData, adjustedRows?.[0]?.endPointType))
            .catch((error) =>
              console.error('HostListEdit failed to fetch endpoint types', error),
            );
          if (newRowsAdded) {
            setSortModel((prevModel) => (Array.isArray(prevModel) && prevModel.length === 0
              ? prevModel
              : []));
          }
          if (newRowsAdded) {
            setPaginationModel((prevModel) =>
              prevModel?.page === 0 ? prevModel : { ...prevModel, page: 0 },
            );
          }
        } else {
          const { rows: adjustedRows } = arrangeRowsForDisplay([]);
          setData(adjustedRows);
          fetchEndpointTypes(siteId)
            .then((endpointData) => mergeEndpointData(endpointData, null))
            .catch((error) =>
              console.error('HostListEdit failed to fetch endpoint types', error),
            );
        }
      } catch (error) {
        console.error('Error fetching host list data', error);
        setMessage({ text: 'Failed to fetch data.', success: false, info: false });
        pendingAdditionRef.current = false;
      }
    };

    fetchData();
  }, [arrangeRowsForDisplay, mergeEndpointData, resetToggle, siteId, userInfo]);

  useEffect(() => {
    if (!isEditDialogOpen || !editingHost) {
      return;
    }
    loadEndpointTypes(editingHost.appID);
  }, [editingHost, isEditDialogOpen, loadEndpointTypes]);

  const lastProcessedLlmTokenRef = useRef(null);

  useEffect(() => {
    if (!llmUpdateToken || siteId === null || siteId === undefined) {
      return;
    }

    if (lastProcessedLlmTokenRef.current === llmUpdateToken) {
      return;
    }
    lastProcessedLlmTokenRef.current = llmUpdateToken;

    const handleLlmUpdate = async () => {
      if (!isEdited) {
        setResetToggle((prev) => !prev);
        return;
      }

      try {
        localDraftRef.current = data;
        const remoteRows = await fetchEditHostData(siteId, userInfo);
        if (!remoteRows) {
          return;
        }
        pendingLlmDataRef.current = remoteRows;
        const baseRows = baselineDataRef.current ?? data;
        const summary = computeConflictSummary(baseRows, data, remoteRows);
        if (summary.totalConflicts === 0) {
          const merged = applyRemoteMerge(baseRows, data, remoteRows);
          setData(merged);
          setMessage({ text: 'Network Monitor Assistant updates merged with your edits.', success: true, info: false });
          return;
        }
        console.warn('HostListEdit detected Network Monitor Assistant edit conflicts', summary);
        setLlmConflictSummary(summary);
        setIsLlmConflictDialogOpen(true);
      } catch (error) {
        console.error('Error processing Network Monitor Assistant host update', error);
      }
    };

    handleLlmUpdate();
  }, [applyRemoteMerge, computeConflictSummary, data, isEdited, llmUpdateToken, siteId, userInfo]);

  const processorMap = useMemo(() => {
    const map = new Map();
    (processorList ?? []).forEach((processor) => {
      if (processor?.appID !== undefined && processor?.appID !== null) {
        map.set(String(processor.appID), processor.location ?? String(processor.appID));
      }
    });
    return map;
  }, [processorList]);

  const processorDisabledMap = useMemo(() => {
    const map = new Map();
    (processorList ?? []).forEach((processor) => {
      if (processor?.appID !== undefined && processor?.appID !== null) {
        const disabled = (processor.disabledEndPointTypes ?? []).map((type) =>
          String(type ?? '').toLowerCase(),
        );
        map.set(String(processor.appID), disabled);
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

  useEffect(() => {
    if (!editingModelConfigHost?.id) {
      return;
    }
    const latest = data.find((row) => row.id === editingModelConfigHost.id);
    if (latest && latest !== editingModelConfigHost) {
      setEditingModelConfigHost(latest);
    }
  }, [data, editingModelConfigHost]);

  const handleProcessRowUpdate = useCallback(
    (newRow, oldRow) => {
      const updatedRow = { ...oldRow, ...newRow };
      setData((prev) => prev.map((row) => (row.id === oldRow.id ? updatedRow : row)));
      setIsEdited(true);
      if (updatedRow.appID !== oldRow.appID) {
        const nextAppId = updatedRow.appID ?? '';
        const normalized = nextAppId ? String(nextAppId) : '';
        if (normalized && lastEndpointFetchRef.current !== normalized) {
          lastEndpointFetchRef.current = normalized;
          loadEndpointTypes(nextAppId);
        }
      }
      return updatedRow;
    },
    [loadEndpointTypes],
  );

  const handleProcessRowUpdateError = useCallback((error) => {
    console.error('Row update failed', error);
  }, []);

  const handleCellEditStop = useCallback(
    (params) => {
      if (params.field === 'appID') {
        const nextAppId = params.value ?? params.row?.appID ?? '';
        const normalized = nextAppId ? String(nextAppId) : '';
        if (normalized && lastEndpointFetchRef.current !== normalized) {
          lastEndpointFetchRef.current = normalized;
          loadEndpointTypes(nextAppId);
        }
      }
    },
    [loadEndpointTypes],
  );

  const handleCellEditStart = useCallback(
    (params) => {
      if (params.field === 'endPointType') {
        const nextAppId = params.row?.appID ?? '';
        const normalized = nextAppId ? String(nextAppId) : '';
        if (normalized && lastEndpointFetchRef.current !== normalized) {
          lastEndpointFetchRef.current = normalized;
          loadEndpointTypes(nextAppId);
        }
      }
    },
    [loadEndpointTypes],
  );

  const openEditDialog = useCallback((row) => {
    setEditingHost(row);
    setIsEditDialogOpen(true);
  }, []);

  const closeEditDialog = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditingHost(null);
  }, []);

  const openModelConfigDialog = useCallback((row) => {
    setEditingModelConfigHost(row);
    setIsModelConfigDialogOpen(true);
  }, []);

  const closeModelConfigDialog = useCallback(() => {
    setIsModelConfigDialogOpen(false);
    setEditingModelConfigHost(null);
  }, []);

  const saveData = useCallback(
    async (hosts) => {
      const hostsToPersist = hosts ?? data;
      setDisplayEdit(false);
      setMessage({ text: 'Please wait. Saving can take up to one minute...', info: false });
      try {
        const prioritizedIds = new Set(recentlyAddedRowIdsRef.current ?? []);
        const orderedHosts =
          prioritizedIds.size > 0
            ? [
                ...hostsToPersist.filter((row) => prioritizedIds.has(getRowIdentifier(row))),
                ...hostsToPersist.filter((row) => !prioritizedIds.has(getRowIdentifier(row))),
              ]
            : hostsToPersist;
        const sanitizedData = orderedHosts.map(({ edit, ...host }) => host);
        const response = await saveHostData(siteId, sanitizedData);
        setMessage(response);
        if (response.success) {
          setIsEdited(false);
        }
        return response;
      } catch (error) {
        console.error('Error saving data', error);
        setMessage({ text: 'Failed to save data.', success: false, info: false });
        return { success: false };
      } finally {
        setDisplayEdit(true);
      }
    },
    [data, siteId, getRowIdentifier],
  );

  const handleKeepLocalChanges = useCallback(async () => {
    const localRows = localDraftRef.current ?? data;
    setIsLlmConflictDialogOpen(false);
    setLlmConflictSummary(null);
    pendingLlmDataRef.current = null;
    const response = await saveData(localRows);
    if (response?.success) {
      setResetToggle((prev) => !prev);
    }
  }, [data, saveData]);

  const handleAcceptLlmChanges = useCallback(() => {
    const remoteRows = pendingLlmDataRef.current;
    setIsLlmConflictDialogOpen(false);
    setLlmConflictSummary(null);
    pendingLlmDataRef.current = null;
    if (Array.isArray(remoteRows)) {
      setData(remoteRows);
      setIsEdited(false);
      setResetToggle((prev) => !prev);
    }
  }, []);

  const handleDismissLlmDialog = useCallback(() => {
    setIsLlmConflictDialogOpen(false);
    setLlmConflictSummary(null);
    pendingLlmDataRef.current = null;
    localDraftRef.current = null;
  }, []);

  const handleEditSave = useCallback(
    async (editedHost) => {
      try {
        const updatedData = data.map((row) =>
          row.id === editedHost.id ? { ...row, ...editedHost } : row,
        );
        setData(updatedData);
        setIsEdited(true);
        const response = await saveData(updatedData);
        if (response?.success) {
          setIsEdited(false);
          closeEditDialog();
          setResetToggle((prev) => !prev);
        } else {
          setIsEdited(true);
        }
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

  const handleModelConfigSave = useCallback(
    async (configOverride) => {
      if (!editingModelConfigHost?.id) {
        closeModelConfigDialog();
        return;
      }

      const hostId = editingModelConfigHost.id;
      const existingConfigId = editingModelConfigHost.monitorModelConfigId;

      setDisplayEdit(false);
      setMessage({ text: 'Please wait. Saving model configuration...', info: true });

      try {
        if (configOverride && existingConfigId) {
          const payload = toApiMonitorModelConfigPayload({
            ...configOverride,
            id: existingConfigId,
          });
          const apiResult = await updateMonitorModelConfig(siteId, existingConfigId, payload);
          const apiConfig = fromApiMonitorModelConfigPayload(apiResult?.data) ?? {
            ...configOverride,
            id: existingConfigId,
          };
          const nextConfigId = apiConfig?.id ?? existingConfigId;

          setData((prev) =>
            prev.map((row) =>
              row.id === hostId
                ? {
                    ...row,
                    modelConfig: apiConfig,
                    monitorModelConfigId: nextConfigId,
                  }
                : row,
            ),
          );

          setMessage({
            text: apiResult?.message ?? 'Success updating monitor model config.',
            success: true,
            info: false,
          });
          closeModelConfigDialog();
          return;
        }

        if (configOverride && !existingConfigId) {
          const normalizedConfig = { ...configOverride };
          const updatedData = data.map((row) =>
            row.id === hostId
              ? {
                  ...row,
                  modelConfig: normalizedConfig,
                  monitorModelConfigId: row.monitorModelConfigId ?? null,
                }
              : row,
          );
          setData(updatedData);
          setIsEdited(true);
          await saveData(updatedData);
          setIsEdited(false);
          setResetToggle((prev) => !prev);
          closeModelConfigDialog();
          return;
        }

        if (!configOverride && existingConfigId) {
          const apiResult = await deleteMonitorModelConfig(siteId, existingConfigId);
          const updatedData = data.map((row) =>
            row.id === hostId
              ? {
                  ...row,
                  modelConfig: null,
                  monitorModelConfigId: null,
                }
              : row,
          );
          setData(updatedData);
          setIsEdited(true);
          await saveData(updatedData);
          setIsEdited(false);
          setResetToggle((prev) => !prev);
          setMessage({
            text: apiResult?.message ?? 'Success deleting monitor model config.',
            success: true,
            info: false,
          });
          closeModelConfigDialog();
          return;
        }

        closeModelConfigDialog();
      } catch (error) {
        console.error('Error saving monitor model config', error);
        setMessage({ text: 'Failed to save monitor model config.', success: false, info: false });
        setIsEdited(true);
      } finally {
        setDisplayEdit(true);
      }
    },
    [closeModelConfigDialog, data, editingModelConfigHost, saveData, setResetToggle, siteId],
  );

  const addHost = useCallback(async () => {
    if (!displayEdit) {
      setMessage({ text: 'Please save before adding another host.', success: false });
      return;
    }
    pendingAdditionRef.current = true;
    setDisplayEdit(false);
    setMessage({ text: 'Please wait...', info: true });
    try {
      const messageResponse = await addHostApi(siteId, userInfo, data);
      setMessage(messageResponse);
      setResetToggle((prev) => !prev);
    } catch (error) {
      console.error('Error adding host', error);
      setMessage({ text: 'Failed to add host.', success: false, info: false });
      pendingAdditionRef.current = false;
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
    return [
      {
        field: 'actions',
        headerName: '',
        type: 'actions',
        width: isSmallScreen ? 120 : 150,
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
              key="modelConfig"
              icon={
                <Tooltip title="Edit Model Config">
                  <TuneIcon />
                </Tooltip>
              }
              label="Edit Model Config"
              onClick={() => openModelConfigDialog(row)}
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
        valueOptions: ({ row }) => {
          const disabled = processorDisabledMap.get(String(row?.appID ?? '')) ?? [];
          const options = endpointTypes
            .filter((type) => !disabled.includes(String(type.internalType ?? '').toLowerCase()))
            .map((type) => ({
              value: type.internalType,
              label: type.name,
            }));
          const currentType = row?.endPointType;
          const normalizedCurrent = String(currentType ?? '').toLowerCase();
          if (
            normalizedCurrent &&
            !options.some((option) => String(option.value ?? '').toLowerCase() === normalizedCurrent)
          ) {
            options.push({
              value: currentType,
              label: `Custom (offline): ${currentType}`,
            });
          }
          return options;
        },
        renderCell: (params) => {
          const internalType = `${params.value ?? ''}`.toLowerCase();
          const endpointType = endpointTypeMap[internalType];
          if (!endpointType) {
            if (params.value) {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <ErrorIcon color="warning" fontSize="small" />
                  <span>{`Custom (offline): ${params.value}`}</span>
                </Box>
              );
            }
            return (
              <Tooltip title="Endpoint type unavailable">
                <ErrorIcon color="warning" fontSize="small" />
              </Tooltip>
            );
          }
          const IconComponent = getEndpointIcon(endpointType.icon) ?? ErrorIcon;
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <IconComponent color="primary" fontSize="small" />
              <span>{endpointType.name}</span>
            </Box>
          );
        },
        valueFormatter: ({ value }) => {
          const endpointType = endpointTypeMap[`${value ?? ''}`.toLowerCase()];
          if (endpointType?.name) {
            return endpointType.name;
          }
          if (value) {
            return `Custom (offline): ${value}`;
          }
          return '';
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
    processorDisabledMap,
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
        onLocationChange={loadEndpointTypes}
      />
      <EditMonitorModelConfigDialog
        open={isModelConfigDialogOpen}
        onClose={closeModelConfigDialog}
        host={editingModelConfigHost}
        onSave={handleModelConfigSave}
      />
      <Dialog open={isLlmConflictDialogOpen} onClose={handleDismissLlmDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Network Monitor Assistant updates detected</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            The assistant updated hosts while you were editing. We detected {llmConflictSummary?.totalConflicts ?? 0} conflicting host updates.
          </Typography>
          <Typography variant="body2">
            Choose whether to keep your edits (this will overwrite the Network Monitor Assistant changes) or accept the Network Monitor Assistant updates.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDismissLlmDialog}>Decide later</Button>
          <Button onClick={handleAcceptLlmChanges} color="warning">Accept Network Monitor Assistant updates</Button>
          <Button onClick={handleKeepLocalChanges} variant="contained">Keep my edits</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ width: '100%', height: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          density={isSmallScreen ? 'compact' : 'standard'}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          onCellEditStop={handleCellEditStop}
          onCellEditStart={handleCellEditStart}
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
          showToolbar
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

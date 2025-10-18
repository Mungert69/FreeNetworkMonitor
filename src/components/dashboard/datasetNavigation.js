import { useCallback, useMemo } from 'react';

const normalizeDataSets = (dataSets) =>
  Array.isArray(dataSets) ? dataSets.filter(Boolean) : [];
const coerceDataSetId = (value) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'number') {
    return value;
  }
  const numeric = Number(value);
  return Number.isNaN(numeric) ? String(value) : numeric;
};

export const findDataSetIndex = (dataSets, dataSetId) => {
  const normalized = normalizeDataSets(dataSets);
  if (!normalized.length) {
    return -1;
  }
  const targetId = coerceDataSetId(dataSetId ?? normalized[0]?.id);
  return normalized.findIndex((item) => coerceDataSetId(item?.id) === targetId);
};

export const formatSelectedDataSetLabel = (selectedDate, currentDataSet) => {
  const rawValue = selectedDate ?? currentDataSet?.date;
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return 'Current';
  }

  if (typeof rawValue === 'string') {
    return rawValue;
  }

  if (rawValue instanceof Date && !Number.isNaN(rawValue.getTime())) {
    return rawValue.toLocaleString();
  }

  if (typeof rawValue?.format === 'function') {
    try {
      return rawValue.format('YYYY-MM-DD HH:mm');
    } catch (error) {
      return rawValue.format();
    }
  }

  return rawValue.toString();
};

export const formatDataSetLabel = (dataSet) => formatSelectedDataSetLabel(undefined, dataSet);

export const useDataSetNavigation = (dataSets, dataSetId, handleSetDataSetId) => {
  const normalizedDataSets = useMemo(() => normalizeDataSets(dataSets), [dataSets]);

  const currentIndex = useMemo(
    () => findDataSetIndex(normalizedDataSets, dataSetId),
    [normalizedDataSets, dataSetId],
  );

  const currentDataSet =
    currentIndex >= 0 && currentIndex < normalizedDataSets.length
      ? normalizedDataSets[currentIndex]
      : null;

  const canGoBack = currentIndex >= 0 && currentIndex < normalizedDataSets.length - 1;
  const canGoForward = currentIndex > 0;

  const navigateDataSet = useCallback(
    (step) => {
      if (typeof handleSetDataSetId !== 'function' || currentIndex < 0) {
        return;
      }

      const nextIndex = currentIndex + step;
      if (nextIndex < 0 || nextIndex >= normalizedDataSets.length) {
        return;
      }

      const nextDataSet = normalizedDataSets[nextIndex];
      if (!nextDataSet) {
        return;
      }

      handleSetDataSetId(nextDataSet.id, nextDataSet.date);
    },
    [currentIndex, normalizedDataSets, handleSetDataSetId],
  );

  return {
    currentIndex,
    currentDataSet,
    canGoBack,
    canGoForward,
    navigateDataSet,
  };
};

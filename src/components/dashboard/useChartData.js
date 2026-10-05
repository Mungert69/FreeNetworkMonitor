import { useEffect, useState } from 'react';
import { fetchChartData, fetchChartRange } from './ServiceAPI';

// Background telemetry does not change host/selection; only explicit navigation or refresh does.
export function useChartData({ host, datasetId, selection, refresh, siteId, user, loggedIn, enabled }) {
  const [datasetData, setDatasetData] = useState([]);
  const [rangeResult, setRangeResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!enabled) return undefined;
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setRangeResult(null);
    const load = async () => {
      try {
        if (selection.mode === 'dataset') {
          await fetchChartData(host, datasetId, siteId, data => {
            if (!controller.signal.aborted) setDatasetData(data);
          }, user, loggedIn, controller.signal);
        } else {
          const response = await fetchChartRange(host.monitorIPID, selection, siteId, loggedIn, controller.signal);
          if (!controller.signal.aborted) setRangeResult(response);
        }
      } catch (failure) {
        if (!controller.signal.aborted) setError(failure.response?.data?.message || failure.message || 'Unable to load chart data.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [host, datasetId, selection, refresh, siteId, user, loggedIn, enabled]);
  return { datasetData, rangeResult, loading, error };
}

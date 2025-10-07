import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import {
  findDataSetIndex,
  formatSelectedDataSetLabel,
  formatDataSetLabel,
  useDataSetNavigation,
} from '../datasetNavigation';

describe('datasetNavigation helpers', () => {
  it('finds dataset index with mixed id types', () => {
    const datasets = [{ id: 5 }, { id: '4' }, { id: 3 }];

    expect(findDataSetIndex(datasets, '4')).toBe(1);
    expect(findDataSetIndex(datasets, 3)).toBe(2);
    expect(findDataSetIndex(datasets, undefined)).toBe(0);
  });

  it('formats selected dataset label with sensible fallbacks', () => {
    expect(formatSelectedDataSetLabel(undefined, { date: '2024-02-01 00:00' })).toBe(
      '2024-02-01 00:00',
    );
    expect(formatSelectedDataSetLabel('2024-03-04 09:00', { date: 'ignored' })).toBe(
      '2024-03-04 09:00',
    );
    expect(formatSelectedDataSetLabel('', { date: '' })).toBe('Current');
    expect(formatDataSetLabel({ date: undefined })).toBe('Current');
  });

  it('exposes navigation state and calls handler on navigation', () => {
    const datasets = [
      { id: 2, date: '2024-02-10 08:00' },
      { id: 1, date: '2024-02-05 08:00' },
      { id: 0, date: undefined },
    ];
    const handler = vi.fn();

    const { result } = renderHook(() => useDataSetNavigation(datasets, 1, handler));

    expect(result.current.canGoBack).toBe(true);
    expect(result.current.canGoForward).toBe(true);
    expect(result.current.currentDataSet).toEqual({ id: 1, date: '2024-02-05 08:00' });

    act(() => {
      result.current.navigateDataSet(1);
    });
    expect(handler).toHaveBeenCalledWith(0, undefined);

    act(() => {
      result.current.navigateDataSet(-1);
    });
    expect(handler).toHaveBeenCalledWith(2, '2024-02-10 08:00');
  });
});


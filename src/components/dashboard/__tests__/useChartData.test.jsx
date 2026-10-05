import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useChartData } from '../useChartData';
import { fetchChartRange } from '../ServiceAPI';
vi.mock('../ServiceAPI', () => ({ fetchChartData: vi.fn(), fetchChartRange: vi.fn() }));
describe('chart request ordering', () => {
  it('ignores an older response and does not reload for unrelated background renders', async () => {
    let resolveOld, resolveNew;
    fetchChartRange.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }))
      .mockImplementationOnce(() => new Promise(resolve => { resolveNew = resolve; }));
    const initial = { host: { monitorIPID: 75 }, datasetId: 0, selection: { mode: 'day' }, refresh: 0, siteId: 0, user: {}, loggedIn: true, enabled: true };
    const { result, rerender } = renderHook(props => useChartData(props), { initialProps: initial });
    const newer = { ...initial, selection: { mode: 'week' } };
    rerender(newer);
    expect(fetchChartRange.mock.calls[0][4].aborted).toBe(true);
    await act(async () => resolveNew({ unit: 'V', points: ['new'] }));
    await waitFor(() => expect(result.current.rangeResult.points).toEqual(['new']));
    await act(async () => resolveOld({ unit: 'V', points: ['old'] }));
    expect(result.current.rangeResult.points).toEqual(['new']);
    rerender({ ...newer });
    expect(fetchChartRange).toHaveBeenCalledTimes(2);
  });
});

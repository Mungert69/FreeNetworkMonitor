import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import Chart from '../Chart';
import { useDataSetNavigation, formatSelectedDataSetLabel } from '../datasetNavigation';

vi.mock('../datasetNavigation', () => {
  const navigateMock = vi.fn();
  return {
    useDataSetNavigation: vi.fn(() => ({
      currentDataSet: { id: 0 },
      canGoBack: true,
      canGoForward: true,
      navigateDataSet: navigateMock,
    })),
    formatSelectedDataSetLabel: vi.fn(() => 'Current dataset'),
  };
});

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children, data }) => <div data-testid="line-chart" data-points={JSON.stringify(data)}>{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: ({ children }) => <>{children}</>,
  Label: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Area: () => null,
  ReferenceLine: () => null,
}));

const mockedUseDataSetNavigation = useDataSetNavigation;
const mockedFormatSelectedDataSetLabel = formatSelectedDataSetLabel;

const baseProps = {
  data: [
    { response: 120, time: '10:00', status: 'OK' },
    { response: 95, time: '10:05', status: 'OK' },
  ],
  selectedDate: '2025-01-05 10:00',
  hostname: 'example.com',
  dataSetId: 0,
  dataSets: [{ id: 0 }],
  handleSetDataSetId: vi.fn(),
  hostDetail: {
    date: '2025-01-05 10:00',
    packetsSent: 100,
    packetsLost: 2,
    percentageLost: '2',
  },
};

describe('Chart', () => {
  const theme = createTheme();

  const renderChart = (overrideProps = {}) =>
    render(
      <ThemeProvider theme={theme}>
        <Chart {...baseProps} {...overrideProps} />
      </ThemeProvider>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses complete range statistics and keeps signed physical values unscaled', () => {
    const refresh = vi.fn();
    renderChart({ timeSelection: { mode: 'day', start: '2026-10-01T00:00:00Z', end: '2026-10-02T00:00:00Z' },
      rangeResult: { unit: 'A', average: -1.25, minimum: -2, maximum: 3, successful: 5000, failed: 4, notices: ['Archived data unavailable.'] },
      data: [{ timestamp: Date.parse('2026-10-01T12:00:00Z'), response: -2, valid: true }],
      hostDetail: { unit: 'A', scale: .1, offset: -3276.8 }, newDataAvailable: true, onRefresh: refresh,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Show details' }));
    expect(screen.getByText('-1.25 A')).toBeInTheDocument();
    expect(screen.getByText('Archived data unavailable.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Load new data' }));
    expect(refresh).toHaveBeenCalledOnce();
  });

  it('marks violations against physical current limits and preserves failures and equality', () => {
    renderChart({ hostDetail: { unit: 'A', scale: .1, offset: -3276.8, lowThreshold: -1.1, highThreshold: 1 },
      data: [{response:32756}, {response:32757}, {response:32768}, {response:32779}, {response:-1}] });
    const points = JSON.parse(screen.getByTestId('line-chart').dataset.points);
    expect(points.map(p => p.violation ?? null)).toEqual(['low', null, null, 'high', null]);
    expect(points[4].response).toBeNull();
    expect(screen.getByText('Current limits')).toBeInTheDocument();
    expect(screen.getByText('Colours show violations, not alert events.')).toBeInTheDocument();
  });

  it('shows monitor location and expands physical limits without scaling them again', () => {
    renderChart({
      processorList: [{ appID: 'board', location: 'Workshop' }],
      hostDetail: { ...baseProps.hostDetail, appID: 'board', endPointType: 'blebroadcast', unit: 'A', scale: .1, offset: -3276.8, lowThreshold: -2, highThreshold: null },
    });
    expect(screen.getByText('Workshop')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Show details' }));
    fireEvent.click(screen.getByRole('button', { name: /host and alert settings/i }));
    expect(screen.getByText('-2 A')).toBeInTheDocument();
    expect(screen.getByText('Disabled')).toBeInTheDocument();
    expect(screen.getByText('Minimum')).toBeInTheDocument();
  });

  it('shows live indicator and disables the back-to-live button when viewing the latest dataset', () => {
    mockedUseDataSetNavigation.mockReturnValue({
      currentDataSet: { id: 0 },
      canGoBack: false,
      canGoForward: false,
      navigateDataSet: vi.fn(),
    });
    mockedFormatSelectedDataSetLabel.mockReturnValue('Current dataset');

    renderChart({ dataSetId: 0 });

    expect(screen.getByText(/viewing/i)).toBeInTheDocument();
    expect(screen.getAllByText(/live \(current\)/i)[0]).toBeInTheDocument();

    const backToLiveButton = screen.getByRole('button', { name: /back to live/i });
    expect(backToLiveButton).toBeDisabled();
  });

  it('enables history navigation and returns to live data when requested', () => {
    const navigateMock = vi.fn();
    mockedUseDataSetNavigation.mockReturnValue({
      currentDataSet: { id: 2, date: '2025-01-04 08:00' },
      canGoBack: true,
      canGoForward: true,
      navigateDataSet: navigateMock,
    });
    mockedFormatSelectedDataSetLabel.mockReturnValue('2025-01-04 08:00');

    const handleSetDataSetId = vi.fn();

    renderChart({ dataSetId: 2, handleSetDataSetId });

    expect(screen.getAllByText('2025-01-04 08:00')).not.toHaveLength(0);

    const [backButton] = screen.getAllByLabelText(/previous dataset/i, { selector: 'button' });
    const [forwardButton] = screen.getAllByLabelText(/next dataset/i, { selector: 'button' });
    fireEvent.click(backButton);
    fireEvent.click(forwardButton);

    expect(navigateMock).toHaveBeenCalledWith(1);
    expect(navigateMock).toHaveBeenCalledWith(-1);

    const backToLiveButton = screen.getByRole('button', { name: /back to live/i });
    expect(backToLiveButton).toBeEnabled();
    fireEvent.click(backToLiveButton);

    expect(handleSetDataSetId).toHaveBeenCalledWith(0, undefined);
  });
});

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
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: ({ children }) => <>{children}</>,
  Label: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Area: () => null,
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

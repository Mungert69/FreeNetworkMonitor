import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi } from 'vitest';
import HostList from '../HostList';

vi.mock('../DataSetsList', () => ({
  default: ({ onClose }) => (
    <div data-testid="datasets-modal">
      Dataset Picker
      <button type="button" onClick={onClose}>
        Close
      </button>
    </div>
  ),
}));

vi.mock('../ServiceAPI', () => ({
  fetchEndpointTypesForLocations: vi.fn().mockResolvedValue({
    'New York': [
      {
        internalType: 'HTTP',
        name: 'HTTP',
        description: 'HTTP Endpoint',
        icon: 'HttpIcon',
      },
    ],
  }),
}));

const baseProps = {
  siteId: 1,
  data: [
    {
      monitorIPID: 42,
      address: 'example.com',
      endPointType: 'HTTP',
      packetsSent: 100,
      packetsLost: 2,
      percentageLost: '2',
      roundTripAverage: 120,
      appID: 'A1',
      alertFlag: true,
      predictAlertFlag: true,
    },
  ],
  processorList: [{ appID: 'A1', location: 'New York' }],
  clickViewChart: vi.fn(),
  resetHostAlert: vi.fn(),
  resetPredictAlert: vi.fn(),
  dataSets: [
    { id: 2, date: '2025-01-04 08:00' },
    { id: 1, date: '2025-01-03 08:00' },
    { id: 0, date: undefined },
  ],
  dataSetId: 1,
  selectedDate: '2025-01-03 08:00',
  handleSetDataSetId: vi.fn(),
  setDateStart: vi.fn(),
  setDateEnd: vi.fn(),
  defaultSearchValue: '',
};

const TEST_TIMEOUT_MS = 20000;

describe('HostList', () => {
  const theme = createTheme();

  const renderHostList = (overrideProps = {}) =>
    render(
      <ThemeProvider theme={theme}>
        <HostList {...baseProps} {...overrideProps} />
      </ThemeProvider>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  beforeAll(() => {
    if (!window.matchMedia) {
      window.matchMedia = () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      });
    }
  });

  it('renders primary columns and actions', async () => {
    renderHostList();

    expect(await screen.findByRole('columnheader', { name: /host address/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /monitor location/i })).toBeInTheDocument();

    // Numeric columns should format values for display
    expect(await screen.findByText('100')).toBeInTheDocument();
    expect(screen.getByText('2%')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();

    const viewChartButton = (await screen.findAllByLabelText(/view chart/i)).find(
      (el) => el.tagName === 'BUTTON',
    );
    expect(viewChartButton).toBeTruthy();
    fireEvent.click(viewChartButton);

    const alertButton = (await screen.findAllByLabelText(/reset alert/i)).find(
      (el) => el.tagName === 'BUTTON',
    );
    expect(alertButton).toBeTruthy();
    const predictButton = (await screen.findAllByLabelText(/reset predict alert/i)).find(
      (el) => el.tagName === 'BUTTON',
    );
    expect(predictButton).toBeTruthy();

    fireEvent.click(alertButton);
    fireEvent.click(predictButton);

    expect(baseProps.resetHostAlert).toHaveBeenCalledWith(42);
    expect(baseProps.resetPredictAlert).toHaveBeenCalledWith(42);
  }, TEST_TIMEOUT_MS);

  it('shows dataset selector when toolbar button is activated', async () => {
    renderHostList();

    const datasetButton = screen
      .getAllByLabelText(/select dataset/i)
      .find((el) => el.tagName === 'BUTTON');
    expect(datasetButton).toBeTruthy();

    fireEvent.click(datasetButton);
    expect(await screen.findByTestId('datasets-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByTestId('datasets-modal')).not.toBeInTheDocument();
    });
  }, TEST_TIMEOUT_MS);

  it('navigates between datasets using toolbar controls', async () => {
    renderHostList();

    expect(screen.getAllByText('2025-01-03 08:00')[0]).toBeInTheDocument();

    const previousButton = screen.getByLabelText(/previous dataset/i, { selector: 'button' });
    const nextButton = screen.getByLabelText(/next dataset/i, { selector: 'button' });

    fireEvent.click(previousButton);
    fireEvent.click(nextButton);

    expect(baseProps.handleSetDataSetId).toHaveBeenCalledWith(0, undefined);
    expect(baseProps.handleSetDataSetId).toHaveBeenCalledWith(2, '2025-01-04 08:00');
  }, TEST_TIMEOUT_MS);
  it('shows full location text on hover', async () => {
    renderHostList();
    const location = await screen.findByText('New York');
    fireEvent.mouseOver(location);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('New York');
  }, TEST_TIMEOUT_MS);

  it('restores optional measurement columns without showing them by default', async () => {
    window.localStorage.setItem('host-list-grid-state-1', JSON.stringify({
      columnVisibilityModel: { status: false, args: false, roundTripMinimum: true },
    }));
    renderHostList({ data: [{ ...baseProps.data[0], roundTripMinimum: 32757, scale: 0.1, offset: -3276.8, unit: 'A' }] });
    expect(await screen.findByRole('columnheader', { name: 'Minimum' })).toBeInTheDocument();
    expect(await screen.findByText('-1.1 A')).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: 'Arguments' })).not.toBeInTheDocument();
  }, TEST_TIMEOUT_MS);

  it('offers extra columns in table options without cluttering the initial table', async () => {
    renderHostList();
    expect(screen.queryByRole('columnheader', { name: 'Arguments' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Table options' }));
    fireEvent.click(await screen.findByRole('button', { name: /columns/i }));
    expect(await screen.findByRole('checkbox', { name: 'Arguments' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Low alert limit' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Maximum' })).not.toBeChecked();
  }, TEST_TIMEOUT_MS);

});

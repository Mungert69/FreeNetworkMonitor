import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi } from 'vitest';
import HostListEdit from '../HostListEdit';

vi.mock('../FadeWrapper', () => ({
  default: ({ children }) => <>{children}</>,
}));

vi.mock('../HelpDialog', () => ({
  default: ({ setOpen }) => (
    <div data-testid="help-dialog">
      Help Dialog
      <button type="button" onClick={() => setOpen(false)}>
        Close
      </button>
    </div>
  ),
}));

vi.mock('../Message', () => ({
  default: () => null,
}));

vi.mock('../EditHostDialog', () => ({
  default: () => null,
}));

vi.mock('../EditMonitorModelConfigDialog', () => ({
  default: () => null,
}));

const fetchEditHostData = vi.fn();
const fetchEndpointTypes = vi.fn();
const fetchEndpointTypesForLocations = vi.fn();
const saveHostData = vi.fn();
const addHostApi = vi.fn();
const delHostApi = vi.fn();
const createMonitorModelConfig = vi.fn();
const updateMonitorModelConfig = vi.fn();
const deleteMonitorModelConfig = vi.fn();

vi.mock('../ServiceAPI', () => ({
  fetchEditHostData: (...args) => fetchEditHostData(...args),
  fetchEndpointTypes: (...args) => fetchEndpointTypes(...args),
  fetchEndpointTypesForLocations: (...args) => fetchEndpointTypesForLocations(...args),
  saveHostData: (...args) => saveHostData(...args),
  addHostApi: (...args) => addHostApi(...args),
  delHostApi: (...args) => delHostApi(...args),
  createMonitorModelConfig: (...args) => createMonitorModelConfig(...args),
  updateMonitorModelConfig: (...args) => updateMonitorModelConfig(...args),
  deleteMonitorModelConfig: (...args) => deleteMonitorModelConfig(...args),
}));

vi.mock('@fusionauth/react-sdk', () => ({
  useFusionAuth: () => ({ userInfo: { email: 'user@example.com' } }),
}));

const theme = createTheme();

const baseHostRows = [
  {
    id: 101,
    address: 'example.com',
    endPointType: 'HTTP',
    timeout: '1000',
    port: '80',
    enabled: true,
    appID: 'A1',
  },
];

const endpointTypes = [
  {
    internalType: 'HTTP',
    name: 'HTTP',
    icon: 'HttpIcon',
  },
];

describe('HostListEdit', () => {
  const renderComponent = (props = {}) =>
    render(
      <ThemeProvider theme={theme}>
        <HostListEdit
          siteId={1}
          processorList={[{ appID: 'A1', location: 'New York' }]}
          defaultSearchValue=""
          {...props}
        />
      </ThemeProvider>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    fetchEditHostData.mockResolvedValue(baseHostRows);
    fetchEndpointTypes.mockResolvedValue(endpointTypes);
    fetchEndpointTypesForLocations.mockResolvedValue({ 'New York': endpointTypes });
    saveHostData.mockResolvedValue({ success: true, text: 'Saved' });
    addHostApi.mockResolvedValue({ success: true, text: 'Added' });
    delHostApi.mockResolvedValue({ success: true, text: 'Deleted' });
    createMonitorModelConfig.mockResolvedValue({ success: true, message: 'Created', data: { ID: 123 } });
    updateMonitorModelConfig.mockResolvedValue({ success: true, message: 'Updated', data: { ID: 101 } });
    deleteMonitorModelConfig.mockResolvedValue({ success: true, message: 'Deleted' });
  });

  it('loads host data and saves changes via toolbar action', async () => {
    renderComponent();

    expect(await screen.findByText('example.com')).toBeInTheDocument();

    const saveButton = await screen.findByRole('button', { name: /save host list/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(saveHostData).toHaveBeenCalledTimes(1);
    });

    const [siteIdArg, payload] = saveHostData.mock.calls[0];
    expect(siteIdArg).toBe(1);
    expect(Array.isArray(payload)).toBe(true);
    expect(payload[0]).toMatchObject({ address: 'example.com', endPointType: 'HTTP' });
  });

  it('triggers help dialog when help button is pressed', async () => {
    renderComponent();

    expect(await screen.findByText('example.com')).toBeInTheDocument();

    const helpButton = await screen.findByRole('button', { name: /open help dialog/i });
    fireEvent.click(helpButton);

    expect(screen.getByTestId('help-dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByTestId('help-dialog')).not.toBeInTheDocument();
    });
  });

  it('places a newly added host at the top of the grid', async () => {
    const newHostRow = {
      id: 202,
      address: 'newhost.com',
      endPointType: 'HTTP',
      timeout: '500',
      port: '443',
      enabled: false,
      appID: 'A1',
    };

    fetchEditHostData.mockImplementation(async () => {
      if (addHostApi.mock.calls.length > 0) {
        return [...baseHostRows, newHostRow];
      }
      return baseHostRows;
    });

    renderComponent();

    expect(await screen.findByText('example.com')).toBeInTheDocument();

    const addButton = await screen.findByRole('button', { name: /add host/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addHostApi).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText('newhost.com')).toBeInTheDocument();

    const saveButton = await screen.findByRole('button', { name: /save host list/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(saveHostData).toHaveBeenCalledTimes(1);
    });

    const [, payload] = saveHostData.mock.calls[0];
    expect(payload.some((row) => row.address === 'newhost.com')).toBe(true);
  });
});

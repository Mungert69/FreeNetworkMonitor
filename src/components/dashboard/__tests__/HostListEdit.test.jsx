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

const fetchEditHostData = vi.fn();
const fetchEndpointTypes = vi.fn();
const saveHostData = vi.fn();
const addHostApi = vi.fn();
const delHostApi = vi.fn();

vi.mock('../ServiceAPI', () => ({
  fetchEditHostData: (...args) => fetchEditHostData(...args),
  fetchEndpointTypes: (...args) => fetchEndpointTypes(...args),
  saveHostData: (...args) => saveHostData(...args),
  addHostApi: (...args) => addHostApi(...args),
  delHostApi: (...args) => delHostApi(...args),
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
    saveHostData.mockResolvedValue({ success: true, text: 'Saved' });
    addHostApi.mockResolvedValue({ success: true, text: 'Added' });
    delHostApi.mockResolvedValue({ success: true, text: 'Deleted' });
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
});

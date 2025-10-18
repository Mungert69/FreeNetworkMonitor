import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DataSetsList from '../DataSetsList';

vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => (
    <div data-testid="localization-wrapper">{children}</div>
  ),
}));

vi.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: function AdapterDayjs() {},
}));

vi.mock('@mui/x-date-pickers/MobileDatePicker', () => ({
  MobileDatePicker: ({ label, onChange }) => (
    <button type="button" aria-label={label} onClick={() => onChange(`${label}-value`)}>
      {label}
    </button>
  ),
}));

const theme = createTheme();

const sampleDataSets = [
  { id: 1, date: '2024-04-01 08:00' },
  { id: 2, date: '2024-04-02 09:30' },
  { id: 3, date: null },
];

const renderComponent = (overrideProps = {}) => {
  const handleSetDataSetId = vi.fn();
  const setDateStart = vi.fn();
  const setDateEnd = vi.fn();
  const onClose = vi.fn();

  const props = {
    dataSets: sampleDataSets,
    handleSetDataSetId,
    setDateStart,
    setDateEnd,
    onClose,
    ...overrideProps,
  };

  render(
    <ThemeProvider theme={theme}>
      <DataSetsList {...props} />
    </ThemeProvider>,
  );

  return {
    handleSetDataSetId,
    setDateStart,
    setDateEnd,
    onClose,
  };
};

describe('DataSetsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lists datasets and triggers selection handler', () => {
    const { handleSetDataSetId } = renderComponent();

    // The dataset label should be rendered; clicking should call handler
    const [datasetLabel] = screen.getAllByText('2024-04-01 08:00');
    fireEvent.click(datasetLabel.closest('li') ?? datasetLabel);

    expect(handleSetDataSetId).toHaveBeenCalledWith(1, '2024-04-01 08:00');
  });

  it('invokes date filter callbacks when date pickers change', () => {
    const { setDateStart, setDateEnd } = renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /start date/i }));
    fireEvent.click(screen.getByRole('button', { name: /end date/i }));

    expect(setDateStart).toHaveBeenCalledWith('Start Date-value');
    expect(setDateEnd).toHaveBeenCalledWith('End Date-value');
  });

  it('supports closing the picker via the close icon', () => {
    const { onClose } = renderComponent();

    const closeButton = screen.getByTestId('CloseIcon').closest('button');
    expect(closeButton).toBeTruthy();
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

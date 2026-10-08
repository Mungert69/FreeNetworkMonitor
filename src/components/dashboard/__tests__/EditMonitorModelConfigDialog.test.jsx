import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import EditMonitorModelConfigDialog, { validateConfigValues } from '../EditMonitorModelConfigDialog';

const host = { address: 'example.com', modelConfig: { changeConfidence: 0.6, logJson: true } };

it('shows percentage confidence and preserves inherited diagnostic overrides when saved', () => {
  const onSave = vi.fn();
  render(<EditMonitorModelConfigDialog open host={host} onClose={vi.fn()} onSave={onSave} />);
  expect(screen.getByLabelText('Change Confidence', { selector: 'input' })).toHaveValue(60);
  fireEvent.click(screen.getByText('Save', { selector: 'button' }));
  expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
    changeConfidence: 60, logJson: true, changeLogJson: null, spikeLogJson: null,
  }));
});

it('lets developer diagnostics inherit, use JSON, or use text', () => {
  const onSave = vi.fn();
  render(<EditMonitorModelConfigDialog open host={host} onClose={vi.fn()} onSave={onSave} />);
  fireEvent.mouseDown(screen.getByLabelText('Change Log JSON'));
  fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'Text' }));
  fireEvent.click(screen.getByText('Save', { selector: 'button' }));
  expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ changeLogJson: false }));
});

it('prevents saving invalid combinations and fractional confidence entry', () => {
  const invalidHost = { ...host, modelConfig: { ...host.modelConfig,
    kOfNK: 7, kOfNN: 4, predictWindow: 20, changePreTrain: 20 } };
  render(<EditMonitorModelConfigDialog open host={invalidHost} onClose={vi.fn()} onSave={vi.fn()} />);
  fireEvent.change(screen.getByLabelText('Change Confidence', { selector: 'input' }), { target: { value: '0.6' } });
  expect(screen.getByText('Enter a percentage from 1 to 100 (for example, 60).')).toBeInTheDocument();
  expect(screen.getAllByText('K must not exceed N.').length).toBeGreaterThan(0);
  expect(screen.getByText('History must be smaller than the observation window.')).toBeInTheDocument();
  expect(screen.getByText('Save', { selector: 'button' })).toBeDisabled();
}, 20000);

it('clears values back to inheritance and can remove the whole host override', () => {
  const onSave = vi.fn();
  render(<EditMonitorModelConfigDialog open host={host} onClose={vi.fn()} onSave={onSave} />);
  fireEvent.click(screen.getByText('Clear values', { selector: 'button' }));
  fireEvent.click(screen.getByText('Save', { selector: 'button' }));
  expect(onSave).toHaveBeenLastCalledWith(expect.objectContaining({ logJson: null, changeConfidence: null }));
  fireEvent.click(screen.getByLabelText('Use custom model configuration for this host'));
  fireEvent.click(screen.getByText('Save', { selector: 'button' }));
  expect(onSave).toHaveBeenLastCalledWith(null);
});

it('validates diagnostic ranges and detector-specific persistence against inherited shared values', () => {
  expect(validateConfigValues({ kOfNK: '6', kOfNN: '12', changeKOfNN: '4', sampleRows: '-1',
    nearMissFraction: '1.1', spikePreTrain: '1.5', notes: 'x'.repeat(513) })).toEqual(expect.objectContaining({
      changeKOfNK: 'K must not exceed N.', sampleRows: 'Must be zero or greater.',
      nearMissFraction: 'Enter a fraction from 0 to 1.',
      spikePreTrain: 'Enter a whole number within the supported integer range.', notes: 'Use no more than 512 characters.',
    }));
});

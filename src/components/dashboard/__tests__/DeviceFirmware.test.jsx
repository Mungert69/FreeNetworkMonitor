import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeviceFirmware from '../DeviceFirmware';
import { fetchUserProcessors, fetchFirmwareImages, requestFirmwareUpdate } from '../ServiceAPI';

vi.mock('../ServiceAPI', () => ({ fetchUserProcessors: vi.fn(), fetchFirmwareImages: vi.fn(), requestFirmwareUpdate: vi.fn() }));
const device = { appID: 'my-device', location: 'My desk', isEnabled: true, isQuantumCapable: false, rabbitTopologyVersion: 2 };
const image = { version: '0.1.6', sha256: 'a'.repeat(64), sizeBytes: 2048 };
beforeEach(() => {
    cleanup(); vi.clearAllMocks();
    fetchUserProcessors.mockResolvedValue([device]);
    fetchFirmwareImages.mockResolvedValue([image, { ...image, version: '0.1.8', sha256: 'b'.repeat(64) }]);
    requestFirmwareUpdate.mockResolvedValue({ requestId: 'request-1' });
});

describe('Device firmware', () => {
    it.each(['0.1.6', '0.1.8'])('allows selecting release %s and requires confirmation before sending', async version => {
        const user = userEvent.setup();
        render(<DeviceFirmware siteId={0} />);
        await waitFor(() => expect(screen.getByRole('combobox', { name: 'Processor' })).not.toBeDisabled());
        await user.click(screen.getByRole('combobox', { name: 'Processor' }));
        await user.click(screen.getByRole('option', { name: /My desk/ }));
        await user.click(screen.getByRole('combobox', { name: 'Firmware image' }));
        await user.click(screen.getByRole('option', { name: new RegExp(version.replaceAll('.', '\\.')) }));
        expect(screen.getByRole('button', { name: 'Install selected firmware' })).toBeDisabled();
        await user.click(screen.getByRole('checkbox'));
        await user.click(screen.getByRole('button', { name: 'Install selected firmware' }));
        await screen.findByText(/not that installation completed/);
        expect(requestFirmwareUpdate).toHaveBeenCalledExactlyOnceWith(0, 'my-device', expect.objectContaining({ version }));
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    }, 15000);

    it('shows load errors without allowing an update', async () => {
        fetchUserProcessors.mockRejectedValue(new Error('offline'));
        render(<DeviceFirmware siteId={0} />);
        await screen.findByText(/Unable to load devices/);
        expect(screen.getByRole('button', { name: 'Install selected firmware' })).toBeDisabled();
        expect(requestFirmwareUpdate).not.toHaveBeenCalled();
    });

    it('does not enable firmware installation for a .NET processor', async () => {
        fetchUserProcessors.mockResolvedValue([{ ...device, isQuantumCapable: true }]);
        const user = userEvent.setup();
        render(<DeviceFirmware siteId={0} />);
        await waitFor(() => expect(screen.getByRole('combobox', { name: 'Processor' })).not.toBeDisabled());
        await user.click(screen.getByRole('combobox', { name: 'Processor' }));
        await user.click(screen.getByRole('option', { name: /My desk/ }));
        expect(screen.getByRole('checkbox')).toBeDisabled();
        expect(requestFirmwareUpdate).not.toHaveBeenCalled();
    });
});

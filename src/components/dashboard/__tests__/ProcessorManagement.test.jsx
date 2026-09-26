import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProcessorManagement from '../ProcessorManagement';
import { fetchUserProcessors, deleteUserProcessor } from '../ServiceAPI';
vi.mock('../ServiceAPI', () => ({ fetchUserProcessors: vi.fn(), deleteUserProcessor: vi.fn() }));
beforeEach(() => {
    cleanup(); vi.clearAllMocks();
    fetchUserProcessors.mockResolvedValue([{ appID: 'my-device', location: 'Test desk' }]);
    deleteUserProcessor.mockResolvedValue(undefined);
});
describe('Processor management', () => {
    it('requires confirmation and does not claim completion for a queued deletion', async () => {
        const user = userEvent.setup();
        const refreshed = vi.fn();
        render(<ProcessorManagement siteId={0} onRemoved={refreshed} />);
        await user.click(await screen.findByRole('button', { name: 'Remove Test desk' }));
        expect(deleteUserProcessor).not.toHaveBeenCalled();
        expect(screen.getByText(/No MonitorIPs or monitoring history will be deleted/)).toBeInTheDocument();
        await user.click(screen.getByRole('button', { name: 'Confirm removal' }));
        await screen.findByText(/Removal requested/);
        expect(deleteUserProcessor).toHaveBeenCalledExactlyOnceWith(0, 'my-device');
        expect(refreshed).toHaveBeenCalledOnce();
    }, 15000);
    it('can cancel without sending a request', async () => {
        const user = userEvent.setup();
        render(<ProcessorManagement siteId={0} />);
        await user.click(await screen.findByRole('button', { name: 'Remove Test desk' }));
        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(deleteUserProcessor).not.toHaveBeenCalled();
    });
    it('shows failure without removing the device from the list', async () => {
        const user = userEvent.setup();
        deleteUserProcessor.mockRejectedValue(new Error('forbidden'));
        render(<ProcessorManagement siteId={0} />);
        await user.click(await screen.findByRole('button', { name: 'Remove Test desk' }));
        await user.click(screen.getByRole('button', { name: 'Confirm removal' }));
        await screen.findByText(/Removal could not be confirmed/);
        expect(fetchUserProcessors).toHaveBeenCalledTimes(1);
    });
});

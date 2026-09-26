import { beforeAll, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
vi.mock('axios', () => ({ default: vi.fn() }));
let api;
beforeAll(async () => {
    window.runConfig = { appsettingsFile: 'appsettings.json' };
    api = await import('../ServiceAPI');
});
describe('Firmware API authentication', () => {
    it('deletes only the selected processor using authenticated cookies and no retries', async () => {
        axios.mockResolvedValue({});
        await api.deleteUserProcessor(0, 'owner/device');
        expect(axios).toHaveBeenLastCalledWith(expect.objectContaining({ method: 'delete', withCredentials: true,
            url: expect.stringMatching(/\/processors\/owner%2Fdevice$/), 'axios-retry': { retries: 0 } }));
    });
    it('uses authenticated cookies for inventory and owned processors', async () => {
        axios.mockResolvedValue({ data: [] });
        await api.fetchUserProcessors(0);
        expect(axios).toHaveBeenLastCalledWith(expect.objectContaining({ method: 'get', withCredentials: true,
            url: expect.stringMatching(/\/processors$/) }));
        await api.fetchFirmwareImages(0);
        expect(axios).toHaveBeenLastCalledWith(expect.objectContaining({ method: 'get', withCredentials: true,
            url: expect.stringMatching(/\/firmware\/esp32-s3\/images$/) }));
    });
    it('sends only the selected target and release, without identity or automatic retries', async () => {
        axios.mockResolvedValue({ data: { requestId: 'id' } });
        await api.requestFirmwareUpdate(0, 'device', { version: '0.1.6', sha256: 'a'.repeat(64), requestedBy: 'attacker' });
        expect(axios).toHaveBeenLastCalledWith(expect.objectContaining({ withCredentials: true, method: 'post',
            data: { AppID: 'device', Version: '0.1.6', Sha256: 'a'.repeat(64) }, 'axios-retry': { retries: 0 } }));
    });
});

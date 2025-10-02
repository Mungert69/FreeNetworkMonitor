import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

if (typeof dayjs.invalid !== 'function') {
  dayjs.invalid = () => dayjs(NaN);
}

describe('ServiceAPI convertDate', () => {
  let originalRunConfig;
  let dateTimeFormatSpy;
  let convertDate;

  beforeAll(async () => {
    originalRunConfig = window.runConfig;
    window.runConfig = { appsettingsFile: 'appsettings.json' };

    dateTimeFormatSpy = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => ({
      resolvedOptions: () => ({ timeZone: 'America/New_York' }),
    }));

    ({ convertDate } = await import('../ServiceAPI.js'));
  });

  afterAll(() => {
    if (originalRunConfig === undefined) {
      delete window.runConfig;
    } else {
      window.runConfig = originalRunConfig;
    }

    dateTimeFormatSpy?.mockRestore();
  });

  it('converts a UTC timestamp string into the user timezone', () => {
    const result = convertDate('2024-02-15 18:45:00', 'YYYY-MM-DD HH:mm');
    expect(result).toBe('2024-02-15 13:45');
  });

  it('formats dayjs instances correctly', () => {
    const utcInstance = dayjs.utc('2024-02-15 20:10:00');
    const result = convertDate(utcInstance, 'HH:mm');
    expect(result).toBe('15:10');
  });

  it('returns an empty string for invalid input', () => {
    expect(convertDate('not-a-date', 'YYYY-MM-DD')).toBe('');
    expect(convertDate(null, 'YYYY-MM-DD')).toBe('');
  });
});

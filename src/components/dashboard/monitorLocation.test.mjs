import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monitorLocationValue } from './monitorLocation.js';

test('location filter compares the displayed location, not the processor ID', () => {
  const processors = new Map([['owner-esp32', 'contact@example.com-esp32']]);
  const getter = (value, row) => monitorLocationValue(value, row, processors);
  assert.equal(getter('owner-esp32', { appID: 'owner-esp32' }), 'contact@example.com-esp32');
  const rows = [{ appID: 'owner-esp32' }, { appID: 'other' }];
  assert.deepEqual(rows.filter(row => getter(row.appID, row) === 'contact@example.com-esp32'), [rows[0]]);
  assert.equal(getter('other', { appID: 'other' }), 'other');
  assert.equal(getter(undefined, {}), '');
});

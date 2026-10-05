import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeThresholds, resetLimitsForChangedMeasurement } from './alertThresholds.js';

test('blank limits disable comparisons while zero and negative limits remain valid', () => {
  assert.deepEqual(normalizeThresholds({ lowThreshold: '', highThreshold: undefined }), { lowThreshold: null, highThreshold: null });
  assert.deepEqual(normalizeThresholds({ lowThreshold: '-1', highThreshold: '0' }), { lowThreshold: -1, highThreshold: 0 });
  for (const host of [{ lowThreshold: 1, highThreshold: 1 }, { lowThreshold: 2, highThreshold: 1 }, { lowThreshold: Infinity }, { lowThreshold: 'invalid' }])
    assert.throws(() => normalizeThresholds(host));
});

test('changing the measurement clears limits while unrelated edits preserve them', () => {
  const host = { endPointType: 'blebroadcast', args: '--metric battery_current', username: '', lowThreshold: -1, highThreshold: 2 };
  assert.equal(resetLimitsForChangedMeasurement({ ...host, address: 'device' }, host).lowThreshold, -1);
  assert.equal(resetLimitsForChangedMeasurement({ ...host, args: '--metric battery_voltage' }, host).lowThreshold, null);
});

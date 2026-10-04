import { test } from 'node:test';
import assert from 'node:assert/strict';
import { measurementMetadata, scaleMeasurement, formatMeasurement, formatMeasurementNumber } from './measurement.js';

test('default durations and custom physical readings use parent result metadata', () => {
  assert.deepEqual(measurementMetadata(), { unit: 'ms', scale: 1 });
  assert.deepEqual(measurementMetadata(null), { unit: 'ms', scale: 1 });
  assert.equal(scaleMeasurement(1367, { unit: 'V', scale: 0.01 }), 13.67);
  assert.equal(formatMeasurement(1367, { unit: 'V', scale: 0.01 }), '13.67 V');
  assert.equal(formatMeasurement(42, {}), '42 ms');
  assert.equal(formatMeasurement(0, { unit: 'W', scale: 1 }), '0 W');
  assert.equal(formatMeasurement(1, { unit: 'A', scale: 0.001 }), '0.001 A');
  assert.equal(formatMeasurement(20, { unit: 'raw value' }), '20 raw value');
});

test('failure markers and missing samples are never scaled into valid readings', () => {
  const parent = { unit: 'V', scale: 0.01 };
  assert.equal(scaleMeasurement(-1, parent), -1);
  for (const sample of [-1, null, undefined, '', NaN, Infinity])
    assert.equal(formatMeasurement(sample, parent), '—');
  assert.equal(scaleMeasurement(42, { scale: 0 }), 42);
  assert.equal(scaleMeasurement(65534, { scale: Number.MAX_VALUE }), null);
});

test('only general millisecond readings are capped at two decimal places', () => {
  assert.equal(formatMeasurementNumber(40.4444), (40.44).toLocaleString());
  assert.equal(formatMeasurement(141.672), `${(141.67).toLocaleString()} ms`);
  assert.equal(formatMeasurement(1.234567, { unit: 'V' }), `${(1.234567).toLocaleString(undefined, { maximumFractionDigits: 6 })} V`);
  assert.equal(formatMeasurement(1.234567, { unit: 'raw value' }), `${(1.234567).toLocaleString(undefined, { maximumFractionDigits: 6 })} raw value`);
  assert.equal(scaleMeasurement(141.672), 141.672);
});

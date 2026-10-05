export function measurementMetadata(metadata = {}) {
  metadata ??= {};
  const scale = metadata.scale ?? metadata.Scale ?? 1;
  const offset = metadata.offset ?? metadata.Offset ?? 0;
  return {
    offset: typeof offset === 'number' && Number.isFinite(offset) ? offset : 0,
    unit: metadata.unit ?? metadata.Unit ?? 'ms',
    scale: typeof scale === 'number' && Number.isFinite(scale) && scale > 0 ? scale : 1,
  };
}

export function scaleMeasurement(value, metadata) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  // Negative values are failure/no-data markers, never physical measurements.
  const { scale, offset } = measurementMetadata(metadata);
  const scaled = number < 0 ? number : number * scale + offset;
  return Number.isFinite(scaled) ? scaled : null;
}

export function formatMeasurement(value, metadata) {
  const scaled = scaleMeasurement(value, metadata);
  if (scaled === null || Number(value) < 0) return '—';
  const { unit } = measurementMetadata(metadata);
  return `${formatMeasurementNumber(scaled, metadata)} ${unit}`;
}

// Keep display rounding separate from scaling and chart calculations.
export function formatMeasurementNumber(value, metadata) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  const { unit, scale } = measurementMetadata(metadata);
  return value.toLocaleString(undefined, { maximumFractionDigits: unit === 'ms' && scale === 1 ? 2 : 6 });
}

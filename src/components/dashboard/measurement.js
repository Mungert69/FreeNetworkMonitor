export function measurementMetadata(metadata = {}) {
  metadata ??= {};
  const scale = metadata.scale ?? metadata.Scale ?? 1;
  return {
    unit: metadata.unit ?? metadata.Unit ?? 'ms',
    scale: typeof scale === 'number' && Number.isFinite(scale) && scale > 0 ? scale : 1,
  };
}

export function scaleMeasurement(value, metadata) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  // Negative values are failure/no-data markers, never physical measurements.
  const scaled = number < 0 ? number : number * measurementMetadata(metadata).scale;
  return Number.isFinite(scaled) ? scaled : null;
}

export function formatMeasurement(value, metadata) {
  const scaled = scaleMeasurement(value, metadata);
  if (scaled === null || scaled < 0) return '—';
  const { unit } = measurementMetadata(metadata);
  return `${scaled.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${unit}`;
}

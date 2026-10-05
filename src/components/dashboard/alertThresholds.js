export function normalizeThresholds(host) {
  const parse = value => value === '' || value == null ? null : Number(value);
  const lowThreshold = parse(host.lowThreshold);
  const highThreshold = parse(host.highThreshold);
  if ((lowThreshold != null && !Number.isFinite(lowThreshold)) ||
      (highThreshold != null && !Number.isFinite(highThreshold)) ||
      (lowThreshold != null && highThreshold != null && lowThreshold >= highThreshold))
    throw new Error('Alert limits must be finite, with low less than high.');
  return { lowThreshold, highThreshold };
}

export function resetLimitsForChangedMeasurement(next, previous) {
  if (next.endPointType !== previous.endPointType || next.args !== previous.args || next.username !== previous.username)
    return { ...next, lowThreshold: null, highThreshold: null };
  return next;
}

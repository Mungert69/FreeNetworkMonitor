// DataGrid v8 passes the cell value and row as separate arguments.
export function monitorLocationValue(value, row, processorMap) {
  const appID = row?.appID ?? value;
  return processorMap.get(appID) || appID || '';
}

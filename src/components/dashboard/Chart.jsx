import React from 'react';
import ChartTimeRange from './ChartTimeRange';
import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import { Accordion, AccordionSummary, AccordionDetails, useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { alpha, useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid, Tooltip, Area, ReferenceLine } from 'recharts';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import Chip from '@mui/material/Chip';
import TooltipBase from '@mui/material/Tooltip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BoltIcon from '@mui/icons-material/Bolt';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import { formatSelectedDataSetLabel, useDataSetNavigation } from './datasetNavigation';
import { measurementMetadata, scaleMeasurement, formatMeasurementNumber } from './measurement';

export function Chart({ data: rawData, selectedDate, hostname, dataSetId, dataSets, handleSetDataSetId, hostDetail, processorList = [], fullScreen = false, timeSelection = { mode: 'dataset' }, onTimeSelection, rangeResult, loading = false, error, newDataAvailable, onRefresh }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isRange = timeSelection.mode !== 'dataset';
  const unit = isRange ? (rangeResult?.unit ?? measurementMetadata(hostDetail).unit) : measurementMetadata(hostDetail).unit;
  const processor = processorList.find(p => String(p.appID) === String(hostDetail?.appID));
  const location = processor?.location
    ?? hostDetail?.location ?? hostDetail?.appID ?? 'Not available';
  const formatLimit = value => value == null ? 'Disabled' : `${formatMeasurementNumber(value, hostDetail)} ${unit}`;
  const configuration = [
    ['Endpoint', hostDetail?.endPointType], ['Monitor location', location],
    ['Processor ID', hostDetail?.appID],
    ['Processor last contact', processor?.lastAccessDate ? new Date(processor.lastAccessDate).toLocaleString() : undefined], ['Timeout (ms)', hostDetail?.timeout],
    ['Port', hostDetail?.port], ['Skip cycles', hostDetail?.skipCycles],
    ['Monitoring', typeof hostDetail?.enabled === 'boolean' ? (hostDetail.enabled ? 'Enabled' : 'Disabled') : undefined],
    ['Last event', hostDetail?.eventTime ?? hostDetail?.monitorStatus?.eventTime],
    ['Low alert limit', hostDetail && 'lowThreshold' in hostDetail ? formatLimit(hostDetail.lowThreshold) : undefined],
    ['High alert limit', hostDetail && 'highThreshold' in hostDetail ? formatLimit(hostDetail.highThreshold) : undefined],
  ];
  const lowLimit = Number.isFinite(hostDetail?.lowThreshold) ? hostDetail.lowThreshold : null;
  const highLimit = Number.isFinite(hostDetail?.highThreshold) ? hostDetail.highThreshold : null;
  const limitColors = { low: theme.palette.info.main, high: theme.palette.warning.dark };
  const hasLimits = lowLimit !== null || highLimit !== null;
  const data = React.useMemo(() => Array.isArray(rawData)
    ? rawData.map(point => ({ ...point,
      valid: isRange ? point.valid : typeof point.response === 'number' && point.response >= 0,
      failureMarker: (isRange ? point.valid === false : typeof point.response !== 'number' || point.response < 0) ? 0 : null,
      response: isRange ? point.response : typeof point.response === 'number' && point.response >= 0
        ? scaleMeasurement(point.response, hostDetail) : null }))
      .map(point => {
        if (!point.valid || !Number.isFinite(point.response)) return point;
        const { scale, offset } = measurementMetadata(hostDetail);
        const encoded = (point.response - offset) / scale;
        const tolerance = 8 * Number.EPSILON * (Math.abs(encoded * scale) + Math.abs(offset) + Math.abs(point.response));
        return { ...point, violation: lowLimit !== null && point.response < lowLimit - tolerance ? 'low'
          : highLimit !== null && point.response > highLimit + tolerance ? 'high' : null };
      })
    : rawData, [rawData, hostDetail, isRange, lowLimit, highLimit]);

  const hasData = Array.isArray(data) && data.length > 0;
  const [isStatusExpanded, setIsStatusExpanded] = React.useState(false);
  const [hasStatusOverflow, setHasStatusOverflow] = React.useState(false);
  const [areDetailsVisible, setAreDetailsVisible] = React.useState(false);
  const statusTextRef = React.useRef(null);
  const detailsId = React.useId();
  React.useEffect(() => { setAreDetailsVisible(false); }, [hostDetail?.monitorIPID]);

  const chartHeight = fullScreen ? 'max(360px, calc(100vh - 320px))' : 'clamp(260px, 45vh, 400px)';
  const statusCollapsedHeight = 52;
  const statusExpandedMaxHeight = 220;

  const summary = React.useMemo(() => {
    if (isRange && rangeResult) return { average: rangeResult.average, max: rangeResult.maximum, min: rangeResult.minimum };
    if (!hasData) {
      return { average: null, max: null, min: null };
    }

    const validPoints = data.filter((point) => point.valid && typeof point.response === 'number');
    if (!validPoints.length) {
      return { average: null, max: null, min: null };
    }

    const total = validPoints.reduce((acc, point) => acc + point.response, 0);
    const average = total / validPoints.length;
    const max = Math.max(...validPoints.map((point) => point.response));
    const min = Math.min(...validPoints.map((point) => point.response));

    return { average, max, min };
  }, [data, hasData, isRange, rangeResult]);

  const chunkStatus = React.useCallback((rawStatus) => {
    if (!rawStatus || typeof rawStatus !== 'string') {
      return [];
    }

    const words = rawStatus
      .split(/[ .]/)
      .map((word) => word.trim())
      .filter(Boolean);

    const formatted = [];
    for (let i = 0; i < words.length; i += 3) {
      formatted.push(words.slice(i, i + 3).join(' '));
    }

    return formatted;
  }, []);

  const renderTooltip = React.useCallback(({ active, payload }) => {
    if (!active || !payload || !payload.length) {
      return null;
    }

    const { response, status, time, timestamp, valid, violation } = payload[0].payload ?? {};
    const statusLines = chunkStatus(status);
    const showResponse = typeof response === 'number';

    return (
      <Box
        sx={{
          px: 1.5,
          py: 1,
          minWidth: 200,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.92),
          backdropFilter: 'blur(6px)',
          boxShadow: '0px 12px 32px rgba(15, 23, 42, 0.18)',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
          {timestamp ? new Date(timestamp).toLocaleString() : time}
        </Typography>
        {valid === false && <Typography variant="body2" color="error" sx={{ fontWeight: 600 }}>Timeout / failed reading</Typography>}
        {showResponse && (
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {`${formatMeasurementNumber(response, hostDetail)} ${unit}`}
          </Typography>
        )}
        {violation && <Typography variant="caption" sx={{ display: 'block', color: limitColors[violation], fontWeight: 700 }}>
          {violation === 'low' ? 'Below current low limit' : 'Above current high limit'}: {formatMeasurementNumber(violation === 'low' ? lowLimit : highLimit, hostDetail)} {unit}
        </Typography>}
        {statusLines.map((line, idx) => (
          <Typography
            variant="caption"
            sx={{ display: 'block', color: theme.palette.text.secondary }}
            key={`${line}-${idx}`}
          >
            {line}
          </Typography>
        ))}
      </Box>
    );
  }, [chunkStatus, theme, unit, hostDetail, lowLimit, highLimit]);

  const renderDot = React.useCallback(
    ({ cx, cy, payload }) => {
      if (cx == null || cy == null) {
        return null;
      }

      const successColor = theme.palette.success?.main || theme.palette.primary.main;
      const errorColor = theme.palette.error?.main || theme.palette.warning?.main || '#d32f2f';
      const baseColor = payload?.violation === 'low' ? theme.palette.info.main : payload?.violation === 'high' ? theme.palette.warning.dark : payload?.valid === false ? errorColor : successColor;

      return (
        <g aria-label={payload?.violation ? `${payload.violation} limit violation` : undefined}>
          {payload?.violation && <circle cx={cx} cy={cy} r={7} fill="none" stroke={baseColor} strokeWidth={1.5} />}
          <circle cx={cx} cy={cy} r={6} fill={alpha(baseColor, 0.18)} />
          <circle
            cx={cx}
            cy={cy}
            r={3.6}
            fill={baseColor}
            stroke={theme.palette.background.paper}
            strokeWidth={1.6}
          />
        </g>
      );
    },
    [theme]
  );

  const navButtonSx = React.useMemo(
    () => ({
      border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
      backgroundColor: alpha(theme.palette.primary.main, 0.06),
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.14),
      },
      '&.Mui-disabled': {
        opacity: 0.3,
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.4),
      },
    }),
    [theme]
  );

  const details = React.useMemo(() => {
    const fallbackDate = selectedDate ? selectedDate.toString() : null;

    if (!hostDetail) {
      return {
        datasetStarted: fallbackDate,
        packetsSent: null,
        packetsLost: null,
        packetLossPercent: null,
        statusText: null,
      };
    }

    const rawStatus = hostDetail.status
      ?? hostDetail.monitorStatus?.status
      ?? (typeof hostDetail.monitorStatus === 'string' ? hostDetail.monitorStatus : null);

    const statusText = typeof rawStatus === 'string' ? rawStatus.trim() || null : rawStatus;

    return {
      datasetStarted: hostDetail.date ?? fallbackDate,
      packetsSent: hostDetail.packetsSent ?? hostDetail.PacketsSent ?? null,
      packetsLost: hostDetail.packetsLost ?? hostDetail.PacketsLost ?? null,
      packetLossPercent: hostDetail.percentageLost ?? hostDetail.PacketsLostPercentage ?? null,
      statusText,
    };
  }, [hostDetail, selectedDate]);

  React.useEffect(() => {
    setIsStatusExpanded(false);
  }, [details.statusText]);

  React.useLayoutEffect(() => {
    if (!areDetailsVisible) {
      setHasStatusOverflow(false);
      return undefined;
    }

    const statusNode = statusTextRef.current;
    if (!statusNode) {
      return undefined;
    }

    const measureOverflow = () => {
      const fullHeight = statusNode.scrollHeight;
      setHasStatusOverflow(fullHeight > statusCollapsedHeight + 1);
    };

    measureOverflow();

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(measureOverflow);
      resizeObserver.observe(statusNode);
    } else {
      window.addEventListener('resize', measureOverflow);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', measureOverflow);
      }
    };
  }, [areDetailsVisible, details.statusText, statusCollapsedHeight]);

  React.useEffect(() => {
    if (!hasStatusOverflow && isStatusExpanded) {
      setIsStatusExpanded(false);
    }
  }, [hasStatusOverflow, isStatusExpanded]);

  const {
    currentDataSet,
    canGoBack,
    canGoForward,
    navigateDataSet,
  } = useDataSetNavigation(dataSets, dataSetId, handleSetDataSetId);

  const dateString = formatSelectedDataSetLabel(selectedDate, currentDataSet);
  const isLatestDataSet = React.useMemo(() => Number(dataSetId) === 0, [dataSetId]);
  const handleSelectLiveData = React.useCallback(() => {
    handleSetDataSetId(0, undefined);
  }, [handleSetDataSetId]);

  const chipProps = isLatestDataSet
    ? {
        icon: <BoltIcon fontSize="small" />,
        label: 'Live (current)',
        color: 'primary',
        variant: 'filled',
      }
    : {
        icon: <HistoryToggleOffIcon fontSize="small" />,
        label: dateString,
        color: 'default',
        variant: 'outlined',
      };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        borderRadius: 4,
        backgroundColor: theme.palette.background.paper,
        border: '1px solid', borderColor: 'divider',
        p: { xs: 2, sm: 3 },
        gap: fullScreen ? 3 : 2,
      }}
    >
      <Stack spacing={fullScreen ? 2 : 1.6} sx={{ flexShrink: 0 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ color: alpha(theme.palette.text.primary, 0.64), letterSpacing: 0.6 }}>
              {hostDetail?.endPointType ? `${hostDetail.endPointType} · ${unit}` : 'Measurement history'}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mt: 0.25, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ overflowWrap: 'anywhere' }}>{hostname || 'Host readings'}</span>
            </Typography>
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1 }}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">{location}</Typography>
              {hostDetail?.alertFlag && <Chip size="small" variant="outlined" label="Alert active" color="warning" />}
            </Stack>
          </Box>
            <Button
              size="small"
              aria-expanded={areDetailsVisible}
              aria-controls={detailsId}
              onClick={() => setAreDetailsVisible(prev => !prev)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {areDetailsVisible ? 'Hide details' : 'Show details'}
            </Button>

        </Stack>

        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
          <Stack direction="row" spacing={0} alignItems="center" justifyContent="space-between" sx={{ flexWrap: 'wrap', gap: 1.5 }}>
            <ChartTimeRange selection={timeSelection} onSelect={onTimeSelection} />
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            sx={{ gap: 1, minWidth: 0 }}
            justifyContent="flex-start"
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ display: isRange ? 'none' : 'flex' }}>
              <TooltipBase title="Previous dataset">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => navigateDataSet(1)}
                    disabled={isRange || !canGoBack}
                    sx={navButtonSx}
                    aria-label="Previous dataset"
                  >
                    <ArrowBackIcon fontSize="inherit" />
                  </IconButton>
                </span>
              </TooltipBase>
              <TooltipBase title="Next dataset">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => navigateDataSet(-1)}
                    disabled={isRange || !canGoForward}
                    sx={navButtonSx}
                    aria-label="Next dataset"
                  >
                    <ArrowForwardIcon fontSize="inherit" />
                  </IconButton>
                </span>
              </TooltipBase>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              {!isRange && <>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: alpha(theme.palette.text.primary, 0.72) }}
              >
                Viewing
              </Typography>
              <Chip
                size="small"
                {...(isRange ? { label: 'Time range', variant: 'outlined' } : chipProps)}
                sx={{
                  '& .MuiChip-icon': { marginLeft: 0.45 },
                  '& .MuiChip-label': {
                    px: 1.2,
                    maxWidth: 220,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }}
              />
              </>}
              <TooltipBase
                title={
                  isLatestDataSet
                    ? 'You are already viewing the live dataset'
                    : 'Jump back to the most recent dataset'
                }
              >
                <span>
                  <Button
                    size="small"
                    startIcon={<BoltIcon fontSize="small" />}
                    variant={isLatestDataSet ? 'outlined' : 'contained'}
                    color={isLatestDataSet ? 'inherit' : 'primary'}
                    onClick={handleSelectLiveData}
                    disabled={!isRange && isLatestDataSet}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Back to live
                  </Button>
                </span>
              </TooltipBase>
            </Stack>
          </Stack>
          </Stack>
          {isRange && <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.25 }}>
            {new Date(timeSelection.start).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} – {new Date(timeSelection.end).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · local time
          </Typography>}
        </Box>
        {newDataAvailable && <Alert severity="info" action={<Button onClick={onRefresh} size="small" sx={{ whiteSpace: 'nowrap' }}>Load new data</Button>}>New data available.</Alert>}
        {loading && <LinearProgress aria-label="Loading chart data" />}
        {error && <Alert severity="error">{error}</Alert>}
        {isRange && rangeResult?.notices?.map(notice => <Alert key={notice} severity="info">{notice}</Alert>)}
      </Stack>

        <Collapse id={detailsId} in={areDetailsVisible} timeout="auto" unmountOnExit>
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" fontWeight={700}>Reading summary</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5 }}>
              <SummaryTile label="Average" value={summary.average != null ? `${formatMeasurementNumber(summary.average, hostDetail)} ${unit}` : '—'} accent={theme.palette.primary.main} />
              <SummaryTile label="Maximum" value={summary.max != null ? `${formatMeasurementNumber(summary.max, hostDetail)} ${unit}` : '—'} />
              <SummaryTile label="Minimum" value={summary.min != null ? `${formatMeasurementNumber(summary.min, hostDetail)} ${unit}` : '—'} />
            </Box>

            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <InfoTile label={isRange ? "Range started" : "Dataset started"} value={isRange ? new Date(timeSelection.start).toLocaleString() : details.datasetStarted ?? '—'} />
              <InfoTile label="Packets sent" value={formatCount(isRange ? (rangeResult?.successful ?? 0) + (rangeResult?.failed ?? 0) : details.packetsSent)} />
              <InfoTile label="Packets lost" value={formatCount(isRange ? rangeResult?.failed : details.packetsLost)} />
              <InfoTile label="Loss" value={formatPercentage(isRange ? (rangeResult?.successful + rangeResult?.failed > 0 ? 100 * rangeResult.failed / (rangeResult.successful + rangeResult.failed) : null) : details.packetLossPercent)} />
            </Stack>

            <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography fontWeight={600}>Host and alert settings</Typography></AccordionSummary>
              <AccordionDetails>
                <Typography variant="caption" color="text.secondary">Available host settings. Historical readings use the currently resolved measurement definition.</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1.5, mt: 2 }}>
                  {configuration.map(([label, value]) => <InfoTile key={label} label={label} value={value ?? 'Not available'} />)}
                </Box>
              </AccordionDetails>
            </Accordion>
            {details.statusText && (
              <Box
                sx={{
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.info.light ?? theme.palette.primary.light, 0.12),
                  border: `1px solid ${alpha(theme.palette.info.main ?? theme.palette.primary.main, 0.12)}`,
                  boxShadow: 'none',
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 1, sm: 1.25 },
                }}
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, color: alpha(theme.palette.text.secondary, 0.9) }}>
                    Status details
                  </Typography>
                  {hasStatusOverflow && (
                    <Button size="small" onClick={() => setIsStatusExpanded(prev => !prev)}>
                      {isStatusExpanded ? 'Show less' : 'Show more'}
                    </Button>
                  )}
                </Stack>
                <Collapse in={isStatusExpanded} collapsedSize={statusCollapsedHeight} timeout="auto">
                  <Box
                    sx={{
                      mt: 0.75,
                      maxHeight: isStatusExpanded ? statusExpandedMaxHeight : 'none',
                      overflowY: isStatusExpanded ? 'auto' : 'visible',
                      pr: isStatusExpanded ? 0.5 : 0,
                    }}
                  >
                    <Typography
                      ref={statusTextRef}
                      variant="body2"
                      sx={{
                        color: theme.palette.text.primary,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {details.statusText}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            )}
          </Stack>
        </Collapse>

      {hasLimits && <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">Current limits</Typography>
        {[[lowLimit, 'low', 'Below'], [highLimit, 'high', 'Above']].filter(([limit]) => limit !== null).map(([limit, direction, label]) => (
          <Box key={direction} sx={{ display: 'flex', alignItems: 'center', gap: .75 }}>
            <Box aria-hidden sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: limitColors[direction], outline: `1px solid ${limitColors[direction]}`, outlineOffset: 2 }} />
            <Typography variant="caption">{label} {formatMeasurementNumber(limit, hostDetail)} {unit}</Typography>
          </Box>
        ))}
        <Typography variant="caption" color="text.secondary">Colours show violations, not alert events.</Typography>
      </Box>}

      <Box
        sx={{
          position: 'relative',
          flexGrow: 1,
          width: '100%',
          minWidth: 0,
          flexShrink: 0,
          overflow: 'hidden',
          height: chartHeight,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.background.paper, 0.78),
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .recharts-tooltip-wrapper': {
            outline: 'none',
          },
        }}
      >
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart
              data={data}
              margin={{
                top: 32,
                right: 32,
                bottom: 16,
                left: -4,
              }}
            >
              <defs>
                <linearGradient id="responseStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={alpha(theme.palette.primary.main, 0.9)} />
                  <stop offset="100%" stopColor={alpha(theme.palette.secondary?.main || theme.palette.primary.dark, 0.9)} />
                </linearGradient>
                <linearGradient id="statusStroke" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={alpha(theme.palette.info?.main || theme.palette.primary.main, 0.7)} />
                  <stop offset="100%" stopColor={alpha(theme.palette.info?.light || theme.palette.primary.light, 0.3)} />
                </linearGradient>
                <linearGradient id="responseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={alpha(theme.palette.primary.main, 0.35)} />
                  <stop offset="90%" stopColor={alpha(theme.palette.primary.main, 0.02)} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={alpha(theme.palette.divider, 0.24)} strokeDasharray="4 8" vertical={false} />
              <Tooltip content={renderTooltip} animationEasing={false} cursor={{ stroke: alpha(theme.palette.primary.main, 0.25), strokeWidth: 1 }} />
              <XAxis
                dataKey={isRange ? "timestamp" : "time"}
                type={isRange ? "number" : "category"}
                scale={isRange ? "time" : "auto"}
                domain={isRange ? [Date.parse(timeSelection.start), Date.parse(timeSelection.end)] : undefined}
                stroke={theme.palette.text.secondary}
                minTickGap={isSmallScreen ? 65 : 30}
                tickCount={isRange ? (isSmallScreen ? 3 : 6) : undefined}
                ticks={isRange ? Array.from({ length: isSmallScreen ? 3 : 6 }, (_, i) => Date.parse(timeSelection.start) + i * (Date.parse(timeSelection.end) - Date.parse(timeSelection.start)) / (isSmallScreen ? 2 : 5)) : undefined}
                tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                axisLine={{ stroke: alpha(theme.palette.divider, 0.6) }}
                tickLine={false}
                interval={isRange ? 'preserveStartEnd' : Math.ceil((data?.length || 1) / 6) - 1}
                padding={{ left: 10, right: 20 }}
                tickMargin={8}
                allowDuplicatedCategory={false}
                allowDataOverflow={isRange}
                tickFormatter={(value, index) => {
                  if (isRange) return new Date(value).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  // Only show the last label if it's not overlapping
                  if (index === data.length - 1 && data.length > 1) {
                    return ` ${value} `;
                  }
                  return value;
                }}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                width={54}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                allowDecimals
                tickFormatter={(value) => formatMeasurementNumber(value, hostDetail)}
                domain={['dataMin', 'dataMax']}
                tickMargin={0}
                axisLine={{ stroke: alpha(theme.palette.divider, 0.6) }}
                tickLine={false}
              >
                <Label
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle', fill: theme.palette.text.primary, fontSize: 12, fontWeight: 600 }}
                >
                  {unit}
                </Label>
              </YAxis>
              <YAxis yAxisId="failures" hide domain={[0, 1]} />
              {[[lowLimit, 'low'], [highLimit, 'high']].filter(([limit]) => limit !== null).map(([limit, direction]) => (
                <ReferenceLine key={direction} y={limit} stroke={limitColors[direction]} strokeDasharray="5 5" strokeOpacity={.7} ifOverflow="discard" />
              ))}
              <Area
                type="monotone"
                dataKey="response"
                stroke="none"
                fill="url(#responseFill)"
                fillOpacity={1}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="response"
                stroke="url(#responseStroke)"
                dot={renderDot}
                strokeWidth={2.4}
                activeDot={{ r: 6, stroke: alpha(theme.palette.primary.dark, 0.3), strokeWidth: 2 }}
                isAnimationActive={false}
              />
              <Line
                yAxisId="failures"
                dataKey="failureMarker"
                stroke="none"
                activeDot={false}
                isAnimationActive={false}
                dot={({ cx, cy, payload }) => payload?.valid === false && Number.isFinite(cx) && Number.isFinite(cy) ? (
                  <g transform={`translate(${cx},${cy})`} aria-label="Timeout / failed reading">
                    <title>Timeout / failed reading</title>
                    <path d="M -1.5 2 H 1.5 V 6 H 4 L 0 11 L -4 6 H -1.5 Z" fill={theme.palette.error.main} />
                  </g>
                ) : null}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Typography variant="body2" sx={{ color: alpha(theme.palette.text.primary, 0.5), fontWeight: 500 }}>
            No data available for this range
          </Typography>
        )}
      </Box>
    </Box>
  );
}

const SummaryTile = React.memo(function SummaryTile({ label, value, accent }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        px: 2,
        py: 1.1,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.42)',
        boxShadow: 'none',
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600 }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ color: accent || 'text.primary', fontWeight: 700, mt: 0.4 }}>
        {value}
      </Typography>
    </Box>
  );
});

const InfoTile = React.memo(function InfoTile({ label, value }) {
  return (
    <Box
      sx={{
        minWidth: 0,
        px: 1.8,
        py: 1,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.45)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.36)',
        boxShadow: 'none',
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, mt: 0.4, overflowWrap: 'anywhere' }}>
        {value ?? '—'}
      </Typography>
    </Box>
  );
});

function formatCount(value) {
  if (value == null || Number.isNaN(Number(value))) {
    return '—';
  }

  const numeric = Number(value);
  if (Number.isInteger(numeric)) {
    return numeric.toLocaleString();
  }
  return numeric.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function formatPercentage(value) {
  if (value == null || Number.isNaN(Number(value))) {
    return '—';
  }

  const numeric = Number(value);
  return `${numeric.toFixed(2)}%`;
}

export default React.memo(Chart);

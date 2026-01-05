import React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid, Tooltip, Area } from 'recharts';
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

export function Chart({ data, selectedDate, hostname, dataSetId, dataSets, handleSetDataSetId, hostDetail, fullScreen = false }) {
  const theme = useTheme();

  const hasData = Array.isArray(data) && data.length > 0;
  const [isStatusExpanded, setIsStatusExpanded] = React.useState(false);
  const [hasStatusOverflow, setHasStatusOverflow] = React.useState(false);
  const [areDetailsVisible, setAreDetailsVisible] = React.useState(false);
  const statusTextRef = React.useRef(null);

  const chartHeight = fullScreen ? 'max(360px, calc(100vh - 320px))' : 'clamp(260px, 45vh, 400px)';
  const statusCollapsedHeight = 52;
  const statusExpandedMaxHeight = 220;

  const summary = React.useMemo(() => {
    if (!hasData) {
      return { average: null, max: null, min: null };
    }

    const validPoints = data.filter((point) => typeof point.response === 'number' && point.response >= 0);
    if (!validPoints.length) {
      return { average: null, max: null, min: null };
    }

    const total = validPoints.reduce((acc, point) => acc + point.response, 0);
    const average = Math.round((total / validPoints.length) * 10) / 10;
    const max = Math.max(...validPoints.map((point) => point.response));
    const min = Math.min(...validPoints.map((point) => point.response));

    return { average, max, min };
  }, [data, hasData]);

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

    const { response, status, time } = payload[0].payload ?? {};
    const statusLines = chunkStatus(status);
    const showResponse = response !== -1 && response !== undefined;

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
          {time}
        </Typography>
        {showResponse && (
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {`${response} ms`}
          </Typography>
        )}
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
  }, [chunkStatus, theme]);

  const renderDot = React.useCallback(
    ({ cx, cy, value }) => {
      if (cx == null || cy == null) {
        return null;
      }

      const numericValue = Number(value);
      const successColor = theme.palette.success?.main || theme.palette.primary.main;
      const errorColor = theme.palette.error?.main || theme.palette.warning?.main || '#d32f2f';
      const baseColor = numericValue < 0 ? errorColor : successColor;

      return (
        <g>
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
        height: '100%',
        borderRadius: 4,
        background: `linear-gradient(145deg, ${alpha(theme.palette.primary.light, 0.18)} 0%, ${alpha(theme.palette.background.paper, 0.92)} 45%, ${alpha(theme.palette.secondary?.light || theme.palette.primary.main, 0.16)} 100%)`,
        p: { xs: 2, sm: 3 },
        gap: fullScreen ? 3 : 2,
      }}
    >
      <Stack spacing={fullScreen ? 2 : 1.6} sx={{ flexShrink: 0 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 1.5, md: 2 }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ color: alpha(theme.palette.text.primary, 0.64), letterSpacing: 0.6 }}>
              {hostname ? `Latency for ${hostname}` : 'Latency Overview'}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mt: 0.25, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>{chipProps.label}</span>
              {isLatestDataSet && (
                <Chip
                  size="small"
                  color="primary"
                  variant="filled"
                  icon={<BoltIcon fontSize="small" />}
                  label="Live"
                  sx={{
                    '& .MuiChip-icon': { marginLeft: 0.35 },
                    '& .MuiChip-label': { px: 1, fontWeight: 600 },
                  }}
                />
              )}
            </Typography>
          </Box>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
            justifyContent="flex-end"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <TooltipBase title="Previous dataset">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => navigateDataSet(1)}
                    disabled={!canGoBack}
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
                    disabled={!canGoForward}
                    sx={navButtonSx}
                    aria-label="Next dataset"
                  >
                    <ArrowForwardIcon fontSize="inherit" />
                  </IconButton>
                </span>
              </TooltipBase>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: alpha(theme.palette.text.primary, 0.72) }}
              >
                Viewing
              </Typography>
              <Chip
                size="small"
                {...chipProps}
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
                    disabled={isLatestDataSet}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Back to live
                  </Button>
                </span>
              </TooltipBase>
            </Stack>
            <Button
              size="small"
              onClick={() => setAreDetailsVisible(prev => !prev)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {areDetailsVisible ? 'Hide details' : 'Show details'}
            </Button>
          </Stack>
        </Stack>

        <Collapse in={areDetailsVisible} timeout="auto" unmountOnExit>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <SummaryTile label="Average" value={summary.average != null ? `${summary.average} ms` : '—'} accent={theme.palette.primary.main} />
              <SummaryTile label="Peak" value={summary.max != null ? `${summary.max} ms` : '—'} />
              <SummaryTile label="Best" value={summary.min != null ? `${summary.min} ms` : '—'} />
            </Stack>

            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <InfoTile label="Dataset started" value={details.datasetStarted ?? '—'} />
              <InfoTile label="Packets sent" value={formatCount(details.packetsSent)} />
              <InfoTile label="Packets lost" value={formatCount(details.packetsLost)} />
              <InfoTile label="Loss" value={formatPercentage(details.packetLossPercent)} />
            </Stack>

            {details.statusText && (
              <Box
                sx={{
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.info.light ?? theme.palette.primary.light, 0.12),
                  border: `1px solid ${alpha(theme.palette.info.main ?? theme.palette.primary.main, 0.12)}`,
                  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
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
      </Stack>

      <Box
        sx={{
          position: 'relative',
          flexGrow: 1,
          width: '100%',
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
          <ResponsiveContainer width="100%" height="100%">
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
                dataKey="time"
                stroke={theme.palette.text.secondary}
                minTickGap={30}
                tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                axisLine={{ stroke: alpha(theme.palette.divider, 0.6) }}
                tickLine={false}
                interval={Math.ceil((data?.length || 1) / 6) - 1}
                padding={{ left: 10, right: 20 }}
                tickMargin={8}
                allowDuplicatedCategory={false}
                allowDataOverflow={false}
                tickFormatter={(value, index) => {
                  // Only show the last label if it's not overlapping
                  if (index === data.length - 1 && data.length > 1) {
                    return ` ${value} `;
                  }
                  return value;
                }}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                width={36}
                tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                allowDecimals={false}
                domain={[0, 'auto']}
                tickMargin={0}
                axisLine={{ stroke: alpha(theme.palette.divider, 0.6) }}
                tickLine={false}
              >
                <Label
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle', fill: theme.palette.text.primary, fontSize: 12, fontWeight: 600 }}
                >
                  ms
                </Label>
              </YAxis>
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
                type="monotone"
                dataKey="status"
                stroke="url(#statusStroke)"
                strokeWidth={1.4}
                strokeDasharray="6 8"
                dot={false}
                opacity={0.7}
                isAnimationActive={false}
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
        minWidth: 140,
        px: 2,
        py: 1.1,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.42)',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.10)',
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
        minWidth: 160,
        px: 1.8,
        py: 1,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.45)',
        backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.36)',
        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600, mt: 0.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

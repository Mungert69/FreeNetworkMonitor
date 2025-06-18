import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import useClasses from "./useClasses";
import { useTheme } from '@mui/material/styles';

const styleObject = (theme) => ({
  detailContainer: {
    padding: theme.spacing(1),
    background: 'transparent',
    boxShadow: 'none',
    borderRadius: theme.shape.borderRadius,
    minWidth: 0,
  },
  detailHeader: {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
    marginBottom: 4,
    marginTop: 2,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '2px 0',
    fontSize: '0.85rem',
    lineHeight: 1.2,
  },
  detailLabel: {
    color: theme.palette.text.secondary,
    fontWeight: 500,
    fontSize: '0.95rem',
    marginRight: 4,
  },
  detailValue: {
    color: theme.palette.text.primary,
    fontWeight: 500,
    fontSize: '0.85rem',
    marginLeft: 4,
    marginRight: 6,
    wordBreak: 'break-all',
  },
});

export function HostDetail({ hostData }) {
  const theme = useTheme();
  const classes = useClasses(styleObject(theme));

  if (!hostData || hostData.address === undefined) return null;

  return (
    <Paper className={classes.detailContainer}>
      <div className={classes.detailRow}>
        <span className={classes.detailLabel}>Dataset started at:</span>
        <span className={classes.detailValue}>{hostData.date}</span>
      </div>
      <div className={classes.detailRow}>
        <span className={classes.detailLabel}>Round Trip Max:</span>
        <span className={classes.detailValue}>{hostData.roundTripMaximum}</span>
      </div>
      <div className={classes.detailRow}>
        <span className={classes.detailLabel}>Round Trip Min:</span>
        <span className={classes.detailValue}>{hostData.roundTripMinimum}</span>
      </div>
      <div className={classes.detailRow}>
        <span className={classes.detailLabel}>Current Status:</span>
        <span className={classes.detailValue}>{hostData.status}</span>
      </div>
    </Paper>
  );
}
export default React.memo(HostDetail);

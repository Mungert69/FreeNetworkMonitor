import React from 'react';
import Typography from '@mui/material/Typography';

export default function HeaderBrand({ className, sx }) {
  return (
    <Typography component="span" color="inherit" noWrap className={className}
      sx={{ minWidth: 0, fontWeight: 600, ...sx }}>
      Ready for Quantum
    </Typography>
  );
}

import React, { Suspense } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { alpha, useTheme } from '@mui/material/styles';

const DashboardChartDialog = ({
  open,
  onClose,
  TransitionComponent,
  ChartComponent,
  chartProps,
  loadingFallback,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={TransitionComponent}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogContent
        sx={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, sm: 4 },
        }}
      >
        <IconButton
          onClick={onClose}
          aria-label="Close chart"
          sx={{
            position: 'absolute',
            top: { xs: 12, sm: 16 },
            right: { xs: 12, sm: 16 },
            bgcolor: alpha(theme.palette.background.paper, 0.75),
            boxShadow: 2,
            '&:hover': {
              bgcolor: alpha(theme.palette.background.paper, 0.95),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Suspense fallback={loadingFallback}>
          <ChartComponent {...chartProps} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DashboardChartDialog);


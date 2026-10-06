import React, { Suspense } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/material/styles';

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
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, sm: 4 },
        }}
      >
        <Suspense fallback={loadingFallback}>
          <ChartComponent {...chartProps} onClose={onClose} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DashboardChartDialog);

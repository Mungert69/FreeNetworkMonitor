import React, { Suspense } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

const DashboardMainPanel = ({
  classes,
  isMediumOrLarger,
  toggleTable,
  HostListComponent,
  hostListProps,
  HostListEditComponent,
  hostListEditProps,
  loadingFallback,
  statusMessage,
  isChatOpen,
  chatKey,
  siteId,
  ChatComponent,
  chatProps,
}) => (
  <main className={classes.content}>
    <div className={classes.appBarSpacer} />
    <Container
      maxWidth={false}
      disableGutters={!isMediumOrLarger}
      sx={{
        maxWidth: 'none',
        px: { xs: 2, sm: 4, md: 6 },
        pt: { xs: 3, md: 6 },
        pb: isMediumOrLarger ? 4 : 1,
      }}
    >
      {statusMessage}
      <Grid container spacing={isMediumOrLarger ? 4 : 2} sx={{ width: '100%' }}>
        <Grid size={{ xs: 12 }}>
          <Paper
            className={classes.paper}
            sx={{
              p: isMediumOrLarger ? 2 : 1,
              m: 0,
              boxShadow: isMediumOrLarger ? 2 : 1,
              borderRadius: isMediumOrLarger ? 3 : 1,
            }}
          >
            <Suspense fallback={loadingFallback}>
              {toggleTable ? (
                <HostListComponent {...hostListProps} />
              ) : (
                <HostListEditComponent {...hostListEditProps} />
              )}
            </Suspense>
          </Paper>
          {isChatOpen && siteId !== null && siteId !== undefined && (
            <div className={classes.chatContainer}>
              <Suspense fallback={loadingFallback}>
                <ChatComponent key={chatKey} {...chatProps} />
              </Suspense>
            </div>
          )}
        </Grid>
      </Grid>
    </Container>
  </main>
);

export default React.memo(DashboardMainPanel);

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
  isChatOpen,
  chatKey,
  siteId,
  ChatComponent,
  chatProps,
}) => (
  <main className={classes.content}>
    <div className={classes.appBarSpacer} />
    <Container
      className={classes.container}
      disableGutters={!isMediumOrLarger}
      sx={{
        px: isMediumOrLarger ? 3 : 1,
        pt: isMediumOrLarger ? 4 : 1,
        pb: isMediumOrLarger ? 4 : 1,
      }}
    >
      <Grid container spacing={isMediumOrLarger ? 4 : 2}>
        <Grid item xs={12}>
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

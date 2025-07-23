import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Copyright from './Copyright';
import ByMeACoffeeLink from './BuyMeACoffee';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

function Footer() {
  // Modern Trustpilot logo style
  const trustpilotImageStyle = {
    maxWidth: 120,
    height: 'auto',
    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))',
    marginRight: 12,
    verticalAlign: 'middle',
  };

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            mb: 2,
            boxShadow: 6,
            background: "rgba(255,255,255,0.98)",
          }}
        >
          <Grid
            container
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <img
                  src="https://cdn.trustpilot.net/brand-assets/4.3.0/logo-white.svg"
                  alt="Trustpilot"
                  style={trustpilotImageStyle}
                />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  <Link
                    href="https://uk.trustpilot.com/review/freenetworkmonitor.click"
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                    color="primary"
                    sx={{ fontWeight: 600, ml: 1 }}
                  >
                    Review us on Trustpilot
                  </Link>
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-end' },
                gap: 2,
              }}>
                <ByMeACoffeeLink />
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    ml: 2,
                  }}
                >
                  <iframe
                    src="https://github.com/sponsors/Mungert69/button"
                    title="Sponsor Mungert69"
                    height="32"
                    width="114"
                    style={{
                      border: 0,
                      borderRadius: 6,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                      background: 'transparent',
                    }}
                  ></iframe>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Copyright />
        </Box>
      </Container>
    </Box>
  );
}

export default React.memo(Footer);

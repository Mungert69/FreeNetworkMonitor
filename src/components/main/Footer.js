import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Copyright from './Copyright';
import MegaLink from './MegaLink';
import ByMeACoffeeLink from './BuyMeACoffee';
import Grid from '@mui/material/Grid';

function Footer(props) {
  const { description, title } = props;

  // Add a CSS class for the Trustpilot image
  const trustpilotImageStyle = {
    maxWidth: '20%', // Adjust the width as needed
    height: 'auto', // Maintain aspect ratio
  };

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container>
        <Grid
          container
          spacing={2}
          direction="column"
        >
          <Grid
            container
            spacing={12}
            direction="row"
            align="center"
            justifyContent="space-around"
          >
            <Grid item xs={6}>
              <Grid container alignItems="center" justifyContent="center" spacing={2}>
                <Grid item>
                  <img src="https://cdn.trustpilot.net/brand-assets/4.3.0/logo-white.svg" alt="Trustpilot" style={trustpilotImageStyle} />
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    <Link href="https://uk.trustpilot.com/review/freenetworkmonitor.click" target="_blank" rel="noopener">
                      Review us on Trustpilot
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Copyright />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default React.memo(Footer);

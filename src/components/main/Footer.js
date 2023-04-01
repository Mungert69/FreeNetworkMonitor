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

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
      <Container >
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
    

              <div class="trustpilot-widget" data-locale="en-GB" data-template-id="5419b6a8b0d04a076446a9ad" data-businessunit-id="63224c4a7ccb8c2b2d77712f" data-style-height="24px" data-style-width="100%" data-theme="light" data-min-review-count="10" data-without-reviews-preferred-string-id="1" data-style-alignment="center">
                <a href="https://uk.trustpilot.com/review/freenetworkmonitor.click" target="_blank" rel="noopener">Trustpilot</a>
              </div>
              <div class="trustpilot-widget" data-locale="en-GB" data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="63224c4a7ccb8c2b2d77712f" data-style-height="52px" data-style-width="100%">
                <a href="https://uk.trustpilot.com/review/freenetworkmonitor.click" target="_blank" rel="noopener">Trustpilot</a>
              </div>

            
          </Grid>
          <Grid item >
            <Copyright />
          </Grid>

        </Grid>


      </Container>
    </Box >
  );
}

Footer.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Footer;

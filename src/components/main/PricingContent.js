import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Typography from '@mui/material/Typography';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../login-button";
import { getApiSubscriptionUrl } from '../dashboard/ServiceAPI';


const tiers = [
  {
    title: 'Free',
    price: '0',
    description: [
      '10 hosts included',
      'ICMP, Http, Dns and Smtp Ping',
      'Email support',
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
  },
  {
    title: 'Standard',
    subheader: 'Most popular',
    price: '1',
    description: [
      '100 Hosts included',
      'ICMP, Http, Dns and Smtp Ping. Includes Quantum Ready check',
      'Priority email support',
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
  },
  {
    title: 'Professional',
    price: '2',
    description: [
      '300 Hosts included',
      'ICMP, Http, Dns and Smtp Ping. Includes Quantum Ready check',
      'Priority email support',
    ],
    buttonText: 'Get started',
    buttonVariant: 'outlined',
  },
];


function PricingContent({ noRedirect, apiUser, siteId }) {
  const { isAuthenticated } = useAuth0();

  const url = (title, userId, customerId) => {
    if (noRedirect) return '/Dashboard?initViewSub=true';

    if (customerId !== '') return getApiSubscriptionUrl()+'/customer-portal/' + customerId;

    if (title === 'Free') {
      return '';
    }
    return getApiSubscriptionUrl()+'/CreateCheckoutSession/' + userId + '/' + title;

  }
  const buttonText = (tier, accountType, customerId) => {

    if (noRedirect) return 'View Subcription';
    if (customerId !== ''){
      if (tier.title === accountType) {
        return 'Current Plan';
      }
      return 'Change Subscription';
    }
    if (tier.title === accountType) {
        return 'Current Plan';
    }
    return tier.buttonText;
   
  }

  const descriptionText =(accountType,cancelAt) => {
    if (noRedirect) return 'Keep Your Business Online with 24/7 Network Monitoring. Subscribe Now.';
    if (accountType === 'Free') return 'You are subcribed to the Free Plan. Choose a new Plan to access more features';
    var cancelStr='';
    if (cancelAt!=null){
      cancelStr=' Cancels on '+cancelAt;
    }
    return 'You are subcribed to the ' + accountType + ' plan .'+cancelStr;
  }


  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />

      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h2" align="center" >
          <img src='/img/logo.png' alt="Free Network Monitor Logo" height="96px" /></Typography>

        <Typography variant="h5" align="center" color="text.secondary" component="p">
          {descriptionText(apiUser.accountType, apiUser.cancelAt)}</Typography>
      </Container>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === 'Enterprise' ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  action={tier.title === 'Standard' ? <StarIcon /> : null}
                  subheaderTypographyProps={{
                    align: 'center',
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Typography component="h2" variant="h3" color="text.primary">
                      £{tier.price}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /mo
                    </Typography>
                  </Box>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  {isAuthenticated ? <Button href={url(tier.title, apiUser.userID, apiUser.customerId)} fullWidth variant={tier.buttonVariant}>
                    {buttonText(tier, apiUser.accountType,apiUser.customerId)}
                  </Button> : <LoginButton loginText={'Login First'} redirectUrl={'/Dashboard?initViewSub=true'} />}

                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export default React.memo(PricingContent);

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
import LoginButton from "../login-button";
import { getApiSubscriptionUrl, convertDate } from '../dashboard/ServiceAPI';
import { useFusionAuth } from '@fusionauth/react-sdk';

const tiers = [
  {
    title: 'Free',
    price: '0',
    description: [
      '10 hosts included',
      'Basic ICMP, HTTP, DNS, and SMTP Ping',
      '50k Max tokens, 25k added daily for the Turbo AI Assistant',
      'FreeLLM Assistant for basic monitoring tasks and guidance on network setup',
      'Limited access to AI-driven security insights and health checks',
      'One Month full response data retention',
      'Must login every 3 months'
    ],
    buttonText: 'Sign up for free',
    buttonVariant: 'outlined',
  },
  {
    title: 'Standard',
    price: '1',
    description: [
      'Monitor up to 50 Hosts',
      'Local network monitoring with Network Monitor and Quantum Secure Agents',
      'Advanced monitoring with ICMP, HTTP, DNS, Raw Connect, SMTP Ping, and Quantum-Ready checks',
      '150k Max tokens, fill 50k daily for Turbo AI Assistant',
      'Turbo AI Assistant for enhanced network monitoring and intelligent alerts',
      'FreeLLM Assistant for routine commands, basic checks, and troubleshooting',
      'AI-driven recommendations on network performance optimizations and security checks',
      'Email support',
      '6 Month full response data retention',
    ],
    buttonText: 'Get started',
    buttonVariant: 'outlined',
  },
  {
    title: 'Professional',
    subheader: 'Most popular',
    price: '3',
    description: [
      'All features of the Standard Plan plus:',
      'Monitor up to 300 Hosts with advanced tracking',
      'Conduct local and remote network security assessments and penetration tests using the Network Monitor and Quantum Secure Agents.',
      'Comprehensive health checks (ICMP, HTTP, DNS, Raw Connect, SMTP Ping, Quantum-Ready checks)',
      '750k Max tokens, fill 250k daily for Turbo AI Assistant',
      'Access to advanced Turbo AI Assistant with full network diagnostic capabilities',
      'Security and Penetration Expert LLMs for detailed audits, vulnerability scans, and threat detection',
      'Predictive AI models for identifying and resolving network issues before they happen',
      'Priority email support',
      '2-year full response data retention',
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
  },
  {
    title: 'Enterprise',
    price: '5',
    description: [
      'All features of the Professional Plan plus:',
      'Monitor up to 500 Hosts with dedicated support',
      '2000k Max tokens, fill 500k daily for Turbo AI Assistant',
      'Exclusive access to the most advanced features of the Turbo AI Assistant for real-time, large-scale monitoring, comprehensive penetration testing, and in-depth network insights.',
      'Includes BusyBox command execution on agents for enhanced functionality and versatility, enabling more comprehensive system management and automation directly from your monitoring agents.',
      'Unlimited FreeLLM Assistant usage for all basic and advanced queries',
      'One high-priority dedicated monitor service agent in a datacenter location',
      'Unlimited full response data retention and export',
    ],
    buttonText: 'Get started',
    buttonVariant: 'outlined',
  },
];

function PricingContent({ noRedirect, apiUser }) {
  const { isLoggedIn } = useFusionAuth();

  const url = (title, userId, email, customerId) => {
    if (noRedirect) return '/Dashboard?initViewSub=true';

    if (customerId !== '') return getApiSubscriptionUrl() + '/customer-portal/' + customerId;

    if (title === 'Free') {
      return '';
    }
    return getApiSubscriptionUrl() + '/CreateCheckoutSession/' + userId + '/' + title + '/' + email;
  };

  const buttonText = (tier, accountType, customerId) => {
    if (noRedirect) return 'View Subscription';
    if (customerId !== '') {
      if (tier.title === accountType) {
        return 'Current Plan';
      }
      return 'Change Subscription';
    }
    if (tier.title === accountType) {
      return 'Current Plan';
    }
    return tier.buttonText;
  };

  const descriptionText = (accountType, cancelAt) => {
    if (noRedirect) return 'Keep Your Business Online with 24/7 Network Monitoring. Subscribe Now.';
    if (accountType === 'Free') return 'You are subscribed to the Free Plan. Choose a new Plan to access more features.';
    let cancelStr = '';
    if (cancelAt != null) {
      cancelStr = ' Cancels on ' + convertDate(cancelAt, "Do MMMM YYYY");
    }
    return 'You are subscribed to the ' + accountType + ' plan.' + cancelStr;
  };

  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />

      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h2" align="center">
          <img src='/img/logo.png' alt="Free Network Monitor Logo" height="96px" />
        </Typography>

        <Typography variant="h5" align="center" color="text.secondary" component="p">
          {descriptionText(apiUser.accountType, apiUser.cancelAt)}
        </Typography>
      </Container>
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
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
                  action={tier.title === 'Professional' ? <StarIcon /> : null}
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
                      ${tier.price}
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
                  {isLoggedIn ? (
                    <Button href={url(tier.title, apiUser.userID, apiUser.email, apiUser.customerId)} fullWidth variant={tier.buttonVariant}>
                      {buttonText(tier, apiUser.accountType, apiUser.customerId)}
                    </Button>
                  ) : (
                    <LoginButton loginText={'Login First'} redirectUrl={'/Dashboard?initViewSub=true'} />
                  )}
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

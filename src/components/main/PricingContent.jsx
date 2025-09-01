// PricingContent.jsx
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import LoginButton from '../login-button';
import { getApiSubscriptionUrl, convertDate, fetchTiers, getStartSiteId } from '../dashboard/ServiceAPI';
import { useFusionAuth } from '@fusionauth/react-sdk';

const ScrollableBox = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  maxHeight: '300px',
  paddingRight: theme.spacing(1),
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': { width: '6px' },
  '&::-webkit-scrollbar-thumb': { backgroundColor: theme.palette.divider, borderRadius: '3px' },
  maskImage: 'linear-gradient(to bottom, black calc(100% - 2em), transparent 100%)',
  [theme.breakpoints.down('sm')]: {
    maxHeight: '200px',
    maskImage: 'linear-gradient(to bottom, black calc(100% - 1.5em), transparent 100%)',
  },
}));

function PricingContent({ noRedirect, apiUser }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { isLoggedIn } = useFusionAuth();

  const [tiers, setTiers] = React.useState([]);
  const [loadingTiers, setLoadingTiers] = React.useState(true);
  const [tiersError, setTiersError] = React.useState('');

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const siteId = getStartSiteId(); // from appsettings
        const result = await fetchTiers(siteId);
        if (!mounted) return;
        setTiers(Array.isArray(result) ? result : []);
      } catch (err) {
        if (!mounted) return;
        setTiersError('Failed to load plans. Please try again later.');
        setTiers([]);
      } finally {
        if (mounted) setLoadingTiers(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const url = (title, userId, email, customerId) => {
    if (noRedirect) return '/Dashboard?initViewSub=true';
    if (customerId) return getApiSubscriptionUrl() + '/customer-portal/' + customerId;
    if (title === 'Free') return '';
    return getApiSubscriptionUrl() + '/CreateCheckoutSession/' + userId + '/' + title + '/' + email;
  };

  const buttonText = (tier, accountType, customerId) => {
    if (noRedirect) return 'View Subscription';
    if (customerId) {
      return tier.title === accountType ? 'Current Plan' : 'Change Subscription';
    }
    return tier.title === accountType ? 'Current Plan' : tier.buttonText;
  };

  const descriptionText = (accountType, cancelAt) => {
    if (noRedirect) return 'Keep Your Business Online with 24/7 Network Monitoring. Subscribe Now.';
    if (accountType === 'Free') return 'You are subscribed to the Free Plan. Choose a new Plan to access more features.';
    let cancelStr = '';
    if (cancelAt != null) {
      cancelStr = ' Cancels on ' + convertDate(cancelAt, 'Do MMMM YYYY');
    }
    return 'You are subscribed to the ' + accountType + ' plan.' + cancelStr;
  };

  // Loading state
  if (loadingTiers) {
    return (
      <Container component="main" sx={{ pt: 8, pb: 6, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Loading plans…</Typography>
        <CircularProgress />
      </Container>
    );
  }

  // Error or empty state
  if (tiersError || tiers.length === 0) {
    return (
      <Container component="main" sx={{ pt: 8, pb: 6, textAlign: 'center' }}>
        <Typography variant="h5" color="error" sx={{ mb: 1 }}>
          {tiersError || 'No plans available right now.'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please refresh the page or try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <React.Fragment>
      <Container disableGutters component="main" sx={{ pt: 8, pb: 6 }}>
        <Typography variant="h2" align="center">
          <img src="/img/logo.png" alt="Quantum Network Monitor Logo" height="96px" />
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          {descriptionText(apiUser.accountType, apiUser.cancelAt)}
        </Typography>
      </Container>

      <Container component="main">
        <Grid container spacing={5} alignItems="stretch">
          {tiers.map((tier) => (
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === 'Enterprise' ? 12 : 6}
              md={3}
              sx={{ display: 'flex' }}
            >
              <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: isSmallScreen ? 'auto' : 'auto' }}>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center', variant: 'h5' }}
                  action={tier.title === 'Professional' ? <StarIcon color="primary" /> : null}
                  subheaderTypographyProps={{ align: 'center', color: 'primary.main', fontWeight: 'bold' }}
                  sx={{
                    backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
                    <Typography component="h2" variant="h4" color="text.primary">
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">/mo</Typography>
                  </Box>

                  <ScrollableBox>
                    <ul style={{ paddingLeft: theme.spacing(2) }}>
                      {tier.description?.map((line) => (
                        <Typography
                          component="li"
                          variant="body2"
                          key={line}
                          sx={{
                            mb: 1,
                            '&:before': {
                              content: '"•"',
                              color: theme.palette.primary.main,
                              display: 'inline-block',
                              width: '1em',
                              marginLeft: '-1em',
                            },
                          }}
                        >
                          {line}
                        </Typography>
                      ))}
                    </ul>
                  </ScrollableBox>
                </CardContent>

                <CardActions sx={{ p: theme.spacing(2), borderTop: '1px solid', borderColor: 'divider' }}>
                  {isLoggedIn ? (
                    <Button
                      href={url(tier.title, apiUser.userID, apiUser.email, apiUser.customerId)}
                      fullWidth
                      variant={tier.buttonVariant}
                      size="large"
                      sx={{ whiteSpace: 'normal', lineHeight: 1.2, py: 1.5 }}
                    >
                      {buttonText(tier, apiUser.accountType, apiUser.customerId)}
                    </Button>
                  ) : (
                    <LoginButton
                      loginText="Login First"
                      redirectUrl="/Dashboard?initViewSub=true"
                      fullWidth
                      size="large"
                    />
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

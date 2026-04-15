// PricingContent.jsx
import * as React from 'react';
import { useTheme } from '@mui/material/styles';              // ⟵ removed `styled`
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
import { getApiSubscriptionUrl, convertDate, fetchTiers, getStartSiteId, getPaymentRedirectUrl } from '../dashboard/ServiceAPI';
import { useFusionAuth } from '@fusionauth/react-sdk';

// ⟵ removed ScrollableBox

function PricingContent({ noRedirect, apiUser }) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { isLoggedIn } = useFusionAuth();

  const [tiers, setTiers] = React.useState([]);
  const [loadingTiers, setLoadingTiers] = React.useState(true);
  const [tiersError, setTiersError] = React.useState('');
  const [paymentLoading, setPaymentLoading] = React.useState('');
  const [paymentError, setPaymentError] = React.useState('');

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
    if (customerId) return getApiSubscriptionUrl() + '/customer-portal/' + encodeURIComponent(customerId);
    if (title === 'Free') return '';
    return getApiSubscriptionUrl()
      + '/CreateCheckoutSession/'
      + encodeURIComponent(userId)
      + '/'
      + encodeURIComponent(title)
      + '/'
      + encodeURIComponent(email);
  };

  const handlePaymentClick = async (event, tier) => {
    const redirectUrl = url(tier.title, apiUser.userID, apiUser.email, apiUser.customerId);
    if (!redirectUrl) {
      event.preventDefault();
      return;
    }

    if (noRedirect) {
      return;
    }

    event.preventDefault();
    setPaymentError('');
    setPaymentLoading(tier.title);

    try {
      const stripeRedirectUrl = await getPaymentRedirectUrl(redirectUrl);
      if (!stripeRedirectUrl) throw new Error('Missing payment redirect URL.');
      window.location.assign(stripeRedirectUrl);
    } catch (error) {
      console.log('Payment redirect failed:', error);
      setPaymentError('Unable to start subscription. Please try again.');
    } finally {
      setPaymentLoading('');
    }
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
        {paymentError ? (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {paymentError}
          </Typography>
        ) : null}
      </Container>

      <Container component="main">
        <Grid
          container
          spacing={5}
          alignItems="stretch"
          justifyContent="center"                 // ⟵ center the grid contents
        >
          {tiers.map((tier) => (
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === 'Enterprise' ? 12 : 6}
              md={3}
              sx={{ display: 'flex', justifyContent: 'center' }}   // ⟵ center each card
            >
              <Card
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  height: isSmallScreen ? 'auto' : 'auto',
                }}
              >
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

                  {/* ⟵ no more ScrollableBox; just a normal list */}
                  <Box component="ul" sx={{ pl: theme.spacing(2), m: 0 }}>
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
                  </Box>
                </CardContent>

                <CardActions sx={{ p: theme.spacing(2), borderTop: '1px solid', borderColor: 'divider' }}>
                  {isLoggedIn ? (
                    <Button
                      href={url(tier.title, apiUser.userID, apiUser.email, apiUser.customerId)}
                      onClick={(event) => handlePaymentClick(event, tier)}
                      fullWidth
                      variant={tier.buttonVariant}
                      size="large"
                      disabled={paymentLoading === tier.title}
                      sx={{ whiteSpace: 'normal', lineHeight: 1.2, py: 1.5 }}
                    >
                      {paymentLoading === tier.title ? 'Opening...' : buttonText(tier, apiUser.accountType, apiUser.customerId)}
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

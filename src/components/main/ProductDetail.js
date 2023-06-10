import React from "react";
import clsx from 'clsx';
//combine all the @mui/material imports into one line not including icons
import { CssBaseline, Drawer, Box, CardMedia, Grow, AppBar, Toolbar, List, Typography, Divider, IconButton, Link, Container, Grid, Paper } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import ApiTwoToneIcon from '@mui/icons-material/ApiTwoTone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import MainListItems from '../dashboard/MainListItems';
import styleObject from '../dashboard/styleObject';
import Loading from '../../loading';
import { Helmet } from 'react-helmet'
import Blog from './Blog';
import Footer from './Footer';
import useClasses from "../dashboard/useClasses";
import useTheme from '@mui/material/styles/useTheme';
import AuthNav from '../auth-nav';
import LogoLink from './LogoLink';
import reportWebVitals from '../../reportWebVitals';
import ReactGA4 from 'react-ga4';
function sendToAnalytics({ id, name, value }) {

    ReactGA4.event({
        eventCategory: 'Web Vitals',
        eventAction: name,
        eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
        eventLabel: id, // id unique to current page load
        nonInteraction: true, // avoids affecting bounce rate
        // Use `sendBeacon()` if the browser supports it.
        transport: 'beacon',
    });
}

const ProductDetail = () => {
    const classes = useClasses(styleObject(useTheme(), process.env.PUBLIC_URL + '/ping.svg'));
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };


    reportWebVitals(sendToAnalytics);
    return (
        <div className={classes.root}>
            <CssBaseline />
            <Helmet>
                <title>Free Network and Quatum Readyiness Monitor Online Website Monitoring</title>
                <meta name="description" content="Discover our innovative network monitoring tool, equipped with an advanced quantum readiness feature to ensure your website's preparedness for the quantum computing era. Our free, user-friendly monitor offers comprehensive network host availability checks, including HTTP, ICMP, DNS, and SMTP services. Embrace future technology today with our leading-edge quantum-ready network monitor."></meta>
            </Helmet>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    {isLoading && <Loading small={true} />}

                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        size="large">
                        <MenuIcon />
                    </IconButton>
                    <LogoLink />
                    <Typography sx={{ paddingLeft: 4 }} component="h1" color="inherit" noWrap className={classes.title}>
                        Free Network Monitor
                    </Typography>
                    <AuthNav />

                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>

                    <IconButton onClick={handleDrawerClose} size="large">

                        <ChevronLeftIcon />
                    </IconButton>
                </div>

                <Divider />
                <List><MainListItems classes={classes} /></List>
                <Divider />

            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={6}>
                        <Grid item xs={12}  >
                            <Grid container
                                direction="row"
                                justifyContent="space-evenly"
                                alignItems="center"
                            >
                                <Grid align="center">
                                    <Grid container
                                        direction="column"
                                        justifyContent="space-around"
                                        alignItems="center"
                                    >
                                        <Grid item  >
                                            <Typography color='primary' variant="h2">
                                                Free Network Monitor
                                            </Typography>
                                        </Grid>
                                        <Grid item >
                                            <Typography color='secondary' variant="h4">
                                                Are You Ready For Quantum...
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} align="center" >
                                    <Box
                                        sx={{
                                            width: 270,
                                            height: 230,
                                        }}
                                    >
                                        <CardMedia component='video'
                                            className={classes.media}
                                            image={"/img/monitor-screen.webm"}
                                            loop
                                            autoPlay />

                                    </Box>
                                </Grid>

                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6}>
                            <Grid container spacing={3} >
                                <Grid item xs={12} sm={6} align="center" >

                                    <Grow
                                        in={!isLoading}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(!isLoading ? { timeout: 1000 } : {})}
                                    >
                                        <NetworkPingIcon color='secondary' fontSize='large' />
                                    </Grow>
                                    <Paper className={classes.paper}>
                                        Presenting a cutting-edge network monitor that not only monitors your network services and websites but is now quantum-ready! This pioneering feature ushers in advanced readiness checks for the quantum computing age. This revolutionary leap forward ensures that your network is primed for the future. Regardless of its sophisticated capabilities, our tool remains remarkably user-friendly, offering a simple way to gain an overall understanding of your networks health.
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6} align="center" >


                                    <Grow
                                        in={!isLoading}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(!isLoading ? { timeout: 2000 } : {})}
                                    >
                                        <LanguageIcon color='secondary' fontSize='large' />
                                    </Grow>
                                    <Paper className={classes.paper}>
                                    Elevating your network monitoring to the next frontier, our real-time quantum readiness monitor is here to assess your website's preparedness for the quantum computing era. By using our innovative Quantum monitor, you can ensure that your website is not only up to current standards but also ready to embrace the technological advancements of the future. Paired with our robust service monitor, you'll have all the necessary tools to keep your website at the top of its game.
                                    </Paper>
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} align="center" >
                                    <Grow
                                        in={!isLoading}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(!isLoading ? { timeout: 3000 } : {})}
                                    >
                                        <ApiTwoToneIcon color='secondary' fontSize='large' />

                                    </Grow>
                                    <Paper className={classes.paper}>
                                    In addition to quantum readiness, we have expanded monitoring capabilities to cover essential online services. Our business-critical API monitor includes HTTP for website performance, ICMP for network pinging, DNS for domain lookup, and SMTP for email service monitoring. This vigilant monitor alerts you via email if any of these services aren't responding within the set timeout threshold, ensuring efficient performance of your business-critical services.
                                    </Paper>
                                    </Grid>
                                <Grid item xs={12} sm={6} align="center">
                                    <Grow
                                        in={!isLoading}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(!isLoading ? { timeout: 3000 } : {})}
                                    >
                                        <EmailIcon color='secondary' fontSize='large' />

                                    </Grow>
                                    <Paper className={classes.paper}>
                                        Login with an email address to receive alerts and enjoy peace of mind with 24/7, 365-day monitoring. Our aim is to help ensure your services remain online at all times. With the introduction of our quantum readiness feature, we are more equipped than ever to support your network monitoring needs and elevate them to the next level.
                                    </Paper>

                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <hr></hr>
                    <hr></hr>
                    <Grid container
                        spacing={6}
                        direction="column"
                        justifyContent="space-evenly"
                        alignItems="center"
                    >
                        <Grid item>

                            <IconButton>
                                <Link className={classes.link}
                                    href="/Dashboard">Watch how to guides below on how to setup your Free Network Monitor. Then click here to get started..
                                </Link>
                            </IconButton>

                        </Grid>
                    </Grid>

                    <hr></hr>
                    <hr></hr>

                    <Blog classes={classes} />
                    <Footer />

                </Container>
            </main>
        </div >
    );
}

export default ProductDetail;

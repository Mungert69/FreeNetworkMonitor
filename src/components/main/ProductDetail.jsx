import React, { useState, useEffect, useRef } from "react";
import clsx from 'clsx';
import { CssBaseline, Drawer, Box, CardMedia, Grow, AppBar, Toolbar, List, Typography, Divider, IconButton, Link, Container, Grid, Paper } from '@mui/material';
import { getStartSiteId, fetchFirstLoadServer, getSiteIdfromUrl } from '../dashboard/ServiceAPI';

import MenuIcon from '@mui/icons-material/Menu';
import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import LanguageIcon from '@mui/icons-material/Language';
import ApiTwoToneIcon from '@mui/icons-material/ApiTwoTone';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AssistantIcon from '@mui/icons-material/Assistant';
import SecurityIcon from '@mui/icons-material/Security';

import MainListItems from '../dashboard/MainListItems';
import styleObject from '../dashboard/styleObject';
import Loading from '../../loading';
import { SuperSEO } from 'react-super-seo';
import Blog from './Blog';
import Footer from './Footer';
import useClasses from "../dashboard/useClasses";
import Chat from "../dashboard/Chat/Chat";
import useTheme from '@mui/material/styles/useTheme';
import AuthNav from '../auth-nav';
import LogoLink from './LogoLink';
import reportWebVitals from '../../reportWebVitals';
import ReactGA4 from 'react-ga4';
import pingImage from '/ping.svg';

function sendToAnalytics({ id, name, value }) {
    ReactGA4.event({
        eventCategory: 'Web Vitals',
        eventAction: name,
        eventValue: Math.round(name === 'CLS' ? value * 1000 : value),
        eventLabel: id,
        nonInteraction: true,
        transport: 'beacon',
    });
}

const ProductDetail = () => {
    const blogRef = useRef(null);
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;
    const classes = useClasses(styleObject(useTheme(), pingImage));
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isChatOpen, setIsChatOpen] = React.useState(false);
    const isChatOpenRef = useRef(isChatOpen);
    const [siteId, setSiteId] = React.useState(null);

    const toggleChatView = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        isChatOpenRef.current = isChatOpen;
    }, [isChatOpen]);

    useEffect(() => {
        const firstLoadSiteId = async () => {
            var siteId = 0;
            try {
                console.log("Calling fetchLoadServer for user default");
                var loadServer = await fetchFirstLoadServer();
                console.log("Calling getSiteIdfromUrl");
                siteId = await getSiteIdfromUrl(loadServer);
                console.log("Calling setSiteId");
                await setSiteId(siteId);
            } catch (e) {
                console.log("Error in Dashboard failed to get load SiteId for default user");
            }
        }
        firstLoadSiteId();

        const chatTimer = setTimeout(() => {
            if (!isChatOpenRef.current) {
                console.log('20s timeout - opening chat');
                setIsChatOpen(true);
            }
        }, 15000);

        return () => clearTimeout(chatTimer);
    }, []);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <SuperSEO
                title="AI Network Monitor: Quantum-Ready Security & Nmap Automation"
                description="Get 24/7 network monitoring with zero setup. Our AI assistant automates Nmap scans, Metasploit tests, and quantum-readiness checks—with alerts in plain English. Start free: no configuration needed."
                openGraph={{
                    ogImage: {
                        ogImage: `${publicUrl}/ping.svg`,
                        ogImageAlt: "AI Network Monitor: Automated Nmap & Quantum Security",
                    },
                    ogUrl: "https://freenetworkmonitor.click",
                    ogType: "website",
                    ogSiteName: "Free Network Monitor",
                    ogLocale: "en_US",
                }}
            />
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
                    <IconButton onClick={toggleChatView} className={clsx(classes.chatToggle, { [classes.chatToggleShift]: isChatOpen })}>
                        <ChatIcon />
                    </IconButton>
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
                        <Grid item xs={12}>
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
                                        <Grid item>
                                            <Typography color='primary' variant="h2">
                                                Free Network Monitor
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color='secondary' variant="h4">
                                                Are You Ready For Quantum...
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6} align="center">
                                    <Box sx={{ width: 270, height: 230 }}>
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
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} align="center">
                                    <Grow
                                        in={!isLoading}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(!isLoading ? { timeout: 1000 } : {})}
                                    >
                                        <NetworkPingIcon color='secondary' fontSize='large' />
                                    </Grow>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h6" gutterBottom>AI-Powered Network Protection</Typography>
                                        Our monitoring system automatically:
                                        <ul>
                                            <li>Scans for vulnerabilities (Nmap, Metasploit, OpenSSL)</li>
                                            <li>Checks quantum computing readiness</li>
                                            <li>Provides plain-English security insights</li>
                                        </ul>
                                        No configuration needed - the AI learns your network's normal behavior.
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6} align="center">
                                    <Grow
                                        in={!isLoading}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(!isLoading ? { timeout: 2000 } : {})}
                                    >
                                        <LanguageIcon color='secondary' fontSize='large' />
                                    </Grow>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h6" gutterBottom>Enterprise Security Made Simple</Typography>
                                        <strong>Chat with the AI Assistant</strong> to:
                                        <ul>
                                            <li>Run instant penetration tests</li>
                                            <li>Investigate anomalies</li>
                                            <li>Trigger security scans</li>
                                        </ul>
                                        Get enterprise-grade protection without the complexity.
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} sm={12} md={6}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} align="center">
                                    <Grow
                                        in={!isLoading}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(!isLoading ? { timeout: 3000 } : {})}
                                    >
                                        <ApiTwoToneIcon color='secondary' fontSize='large' />
                                    </Grow>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h6" gutterBottom>Complete Performance History</Typography>
                                        Our dashboard shows:
                                        <ul>
                                            <li>Real-time network health metrics</li>
                                            <li>Historical trend analysis</li>
                                            <li>Interactive time-series graphs</li>
                                        </ul>
                                        Track gradual degradation or sudden outages with precision.
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
                                        <Typography variant="h6" gutterBottom>Smart Alert System</Typography>
                                        Just provide your email to get:
                                        <ul>
                                            <li>24/7 automated monitoring</li>
                                            <li>AI-curated alerts (no spam)</li>
                                            <li>Quantum vulnerability reports</li>
                                        </ul>
                                        The system learns and improves over time.
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <hr />
                    <Grid container
                        spacing={6}
                        direction="column"
                        justifyContent="space-evenly"
                        alignItems="center"
                    >
                        <Grid item>
                            <IconButton>
                                <Link className={classes.link}
                                    href="/Dashboard">Enter Dashboard
                                </Link>
                            </IconButton>
                        </Grid>
                    </Grid>

                    <hr />
                    <hr />

                    <Blog ref={blogRef} classes={classes} />
                    <Footer />

                    <div className={isChatOpen ? classes.chatContainer : classes.chatHidden}>
                        {siteId !== null && siteId !== undefined && <Chat isDashboard={false} initRunnerType={'TurboLLM'} setIsChatOpen={setIsChatOpen} siteId={siteId} />}
                    </div>
                </Container>
            </main>
        </div>
    );
}

export default ProductDetail;
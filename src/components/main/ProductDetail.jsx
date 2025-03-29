import React, { useState, useEffect, useRef } from "react";
import clsx from 'clsx';
//combine all the @mui/material imports into one line not including icons
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
        eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
        eventLabel: id, // id unique to current page load
        nonInteraction: true, // avoids affecting bounce rate
        // Use `sendBeacon()` if the browser supports it.
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

    // Add this ref to track chat state
    const isChatOpenRef = useRef(isChatOpen);
    
    // Keep the ref updated when state changes
    useEffect(() => {
        isChatOpenRef.current = isChatOpen;
    }, [isChatOpen]);

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
         // New 20-second fallback
         const chatTimer = setTimeout(() => {
            if (!isChatOpenRef.current) {
                console.log('20s timeout - opening chat');
                setIsChatOpen(true);
            }
        }, 15000); // 15 seconds

        return () => clearTimeout(chatTimer);
    }, []);

  
    return (
        <div className={classes.root}>
            <CssBaseline />
            <SuperSEO
                title="Free Network & Quantum Readiness Monitor - Real-Time Monitoring for Modern Networks"
                description="Monitor your network's health and quantum readiness with the Free Network Monitor. Track HTTP, ICMP, DNS, and SMTP services in real-time. Leverage AI-powered insights, advanced security tools, and quantum-ready checks to future-proof your infrastructure. Start monitoring for free today!"
                openGraph={{
                    ogImage: {
                        ogImage: `${publicUrl}/ping.svg`, // Add your OpenGraph image
                        ogImageAlt: "Free Network Monitor Logo", // Add alt text for the image
                    },
                    ogUrl: "https://freenetworkmonitor.click", // Canonical URL
                    ogType: "website", // Type of content
                    ogSiteName: "Free Network Monitor", // Site name
                    ogLocale: "en_US", // Language and locale
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
                    <IconButton onClick={toggleChatView} className={clsx(classes.chatToggle, { [classes.chatToggleShift]: isChatOpen })}
                    >
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
                                        Introducing our state-of-the-art network monitor with integrated AI capabilities. Our intelligent assistant now handles all monitoring of your network services and websites. the AI assistant conducts advanced preparedness checks for the coming quantum computing era. This innovative approach ensures your network remains future-proof while the AI interface makes complex monitoring remarkably intuitive, providing clear insights into your network's health
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
                                        AI-powered Network Monitor Assistant: The core of our system now intelligently manages hosts, performs comprehensive network scans, and investigates anomalies through simple conversation that trigger actions and GUI navigations. The assistant autonomously conducts Nmap scans, executes Metasploit modules, and performs OpenSSL checks, bringing enterprise-grade penetration testing and security auditing into a streamlined workflow.
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
                                        Alongside the Assistant is the GUI dashboard showcasing detailed charts of response data with comprehensive navigation through historical metrics. The time-series graphs allow for precise analysis of historical patterns, enabling identification of performance anomalies or gradual degradation over custom date ranges. Every collected metric is preserved and accessible through this visual interface, creating a complete historical record of your network's performance.
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
                                        Simply provide your email address, and the AI assistant handles the entire alert management system, delivering 24/7, 365-day monitoring without requiring you to configure alert parameters through the interface. The assistant continuously learns from your network patterns, offering increasingly personalized monitoring while managing quantum readiness checks in the background, creating a significantly more efficient experience compared to the previous GUI-based approach.
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
                                    href="/Dashboard">Enter Dashboard
                                </Link>
                            </IconButton>

                        </Grid>
                    </Grid>

                    <hr></hr>
                    <hr></hr>

                    <Blog ref={blogRef} classes={classes} />
                    <Footer />


                    <div className={isChatOpen ? classes.chatContainer : classes.chatHidden}>
                        {siteId !== null && siteId !== undefined && <Chat isDashboard={false} initRunnerType={'TurboLLM'} setIsChatOpen={setIsChatOpen} siteId={siteId} />}
                    </div>
                </Container>
            </main>
        </div >
    );
}

export default ProductDetail;

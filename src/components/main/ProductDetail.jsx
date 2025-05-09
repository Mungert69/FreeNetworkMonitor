import React, { useState, useEffect, useRef } from "react";
import clsx from 'clsx';
import { CssBaseline, Drawer, Box, CardMedia, Grow, AppBar, Toolbar, List, Typography, Divider, IconButton, Link, Container, Grid, Paper, Tooltip } from '@mui/material';
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
import { useMediaQuery } from '@mui/material';
import MainListItems from '../dashboard/MainListItems';
import styleObject from '../dashboard/styleObject';
import Loading from '../../loading';
import { SuperSEO } from 'react-super-seo';
import Blog from './Blog';
import Footer from './Footer';
import useClasses from "../dashboard/useClasses";
import Chat from "../dashboard/Chat/Chat";
import { useTheme } from '@mui/material/styles';
import AuthNav from '../auth-nav';
import LogoLink from './LogoLink';
import reportWebVitals from '../../reportWebVitals';
import ReactGA4 from 'react-ga4';
import pingImage from '/ping.svg';
import { getBaseDomain } from '../dashboard/ServiceAPI';

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
// Add this above your ProductDetail component
const interactiveStyles = {
    assistantTrigger: {
        color: 'primary.main',
        textDecoration: 'underline',
        cursor: 'pointer',
        '&:hover': {
            color: 'primary.dark',
        }
    }
};



const ProductDetail = () => {
    const blogRef = useRef(null);
    const theme = useTheme();
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;
    const classes = useClasses(styleObject(theme, pingImage));
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isChatOpen, setIsChatOpen] = React.useState(false);
    const isChatOpenRef = useRef(isChatOpen);
    const [siteId, setSiteId] = React.useState(null);
    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up('md'));
    const [openInNewTab, setOpenInNewTab] = React.useState(false);
    const [blogHash,setBlogHash] =React.useState('');
    const toggleChatView = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const sendToAssistant = (setIsChatOpen, prompt) => {
        setIsChatOpen(true);
        // You'll need to pass down a prop to handle the prompt (see step 3)
        window.dispatchEvent(new CustomEvent('send-chat-prompt', { detail: prompt }));
    };

    useEffect(() => {
        isChatOpenRef.current = isChatOpen;
    }, [isChatOpen]);

    useEffect(() => {
        const hash = window.location.hash.slice(1); // Remove the '#'
        const hashParams = new URLSearchParams(hash); // Parse the hash as query-like parameters
            
        if (!hashParams.has('assistant') && !hashParams.has('openInNewTab')) {
          // Not a reserved login parameter; assume it's a blog post hash or scroll target
          setBlogHash(hash);
        }
        // Check for 'openInNewTab' in either query or hash
        if (query.has('openInNewTab') || hashParams.has('openInNewTab')) {
            setOpenInNewTab(true);
            console.log("Setting openInNewTab");
        }

        // Check for 'assistant' in either query or hash
        if (query.get('assistant') === 'open' || hashParams.get('assistant') === 'open') {
            setIsChatOpen(true);
            console.log("Setting assistant=open");
        }
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

        const isFirstVisit = sessionStorage.getItem('visitedBefore') === null;

        if (isFirstVisit) {
            const chatTimer = setTimeout(() => {
                if (!isChatOpenRef.current) {
                    sendToAssistant(setIsChatOpen, "What types of network monitoring and security functions can you assist me with?");
                    // Mark as visited
                    sessionStorage.setItem('visitedBefore', 'true');
                }
            }, 30000);

            return () => clearTimeout(chatTimer);
        }
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
                    ogUrl: `https://${getBaseDomain()}`,
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
                    <AuthNav openInNewTab={openInNewTab} />
                </Toolbar>
            </AppBar>

            <Drawer
                variant={isMediumOrLarger ? "permanent" : "temporary"}
                open={open}
                onClose={handleDrawerClose}
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                }}
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
                                        {...(!isLoading ? { timeout: 3000 } : {})}
                                    >
                                        <NetworkPingIcon color='secondary' fontSize='large' />
                                    </Grow>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h6" gutterBottom>AI-Powered Network Protection</Typography>
                                        Our monitoring system automatically:
                                        <ul>
                                            <li>
                                                Scans for vulnerabilities (
                                                <Tooltip title="Ask about Nmap scans" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "Explain how the secutiry expert performs a nmap scan")}
                                                    >
                                                        Nmap
                                                    </Typography>
                                                </Tooltip>,
                                                <Tooltip title="Ask about Metasploit" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "Explain how the penetration expert performs a penetration test with metasploit")}
                                                    >
                                                        Metasploit
                                                    </Typography>
                                                </Tooltip>,
                                                <Tooltip title="Ask about OpenSSL" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "How can the secutiry expert use openssl to test my security configuration")}
                                                    >
                                                        OpenSSL
                                                    </Typography>
                                                </Tooltip>)
                                            </li>
                                            <li>
                                                <Tooltip title="Ask about quantum readiness" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "What can the quantum expert do and how does this check my services for quantum readiness")}
                                                    >
                                                        Checks quantum computing readiness
                                                    </Typography>
                                                </Tooltip>
                                            </li>
                                            <li>
                                                <Tooltip title="Ask about security insights" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "What kind of plain English security insights can the security expert give")}
                                                    >
                                                        Provides plain-English security insights
                                                    </Typography>
                                                </Tooltip>
                                            </li>
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
                                        <Tooltip title="Ask about the AI Assistant" arrow>
                                            <Typography
                                                component="span"
                                                sx={interactiveStyles.assistantTrigger}
                                                onClick={() => sendToAssistant(setIsChatOpen, "How do I use the AI Assistant?")}
                                            >
                                                <strong>Chat with the AI Assistant</strong>
                                            </Typography>
                                        </Tooltip> to:
                                        <ul>
                                            <li>
                                                <Tooltip title="Ask about penetration tests" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "How do I run an instant penetration test?")}
                                                    >
                                                        Run instant penetration tests
                                                    </Typography>
                                                </Tooltip>
                                            </li>
                                            <li>
                                                <Tooltip title="Ask about anomaly detection" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "How does anomaly investigation work?")}
                                                    >
                                                        Investigate anomalies
                                                    </Typography>
                                                </Tooltip>
                                            </li>
                                            <li>
                                                <Tooltip title="Ask about security scans" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "How do I trigger a security scan?")}
                                                    >
                                                        Trigger security scans
                                                    </Typography>
                                                </Tooltip>
                                            </li>
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
                                        {...(!isLoading ? { timeout: 5000 } : {})}
                                    >
                                        <ApiTwoToneIcon color='secondary' fontSize='large' />
                                    </Grow>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h6" gutterBottom>Complete Performance History</Typography>
                                        Our dashboard shows:
                                        <ul>
                                            <li>
                                                <Tooltip title="Ask about network metrics" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "What network health metrics can the network monitor track after a host is added")}
                                                    >
                                                        Real-time network health metrics
                                                    </Typography>
                                                </Tooltip>
                                            </li>
                                            <li>
                                                <Tooltip title="Ask about trend analysis" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "How can you show and analyse histroical data for a given host")}
                                                    >
                                                        Historical trend analysis
                                                    </Typography>
                                                </Tooltip>
                                            </li>
                                            <li>

                                                <Typography
                                                    component="span"
                                                    sx={interactiveStyles.assistantTrigger}
                                                    onClick={() => sendToAssistant(setIsChatOpen, "How do I interpret the time-series graphs?")}
                                                >
                                                    Interactive time-series graphs
                                                </Typography>

                                            </li>
                                        </ul>
                                        Track gradual degradation or sudden outages with precision.
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6} align="center">
                                    <Grow
                                        in={!isLoading}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(!isLoading ? { timeout: 7000 } : {})}
                                    >
                                        <EmailIcon color='secondary' fontSize='large' />
                                    </Grow>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h6" gutterBottom>Smart Alert System</Typography>
                                        Just provide your email to get:
                                        <ul>
                                            <li>
                                                <Tooltip title="Ask about 24/7 monitoring" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "How does the network monitoring that you are managing work 24/7")}
                                                    >
                                                        24/7 automated monitoring
                                                    </Typography>
                                                </Tooltip>
                                            </li>
                                            <li>
                                                <Tooltip title="Ask about AI alerts" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "Tell me about the email alerts I will receive if my host goes down")}
                                                    >
                                                        AI-curated alerts (no spam)
                                                    </Typography>
                                                </Tooltip>
                                            </li>
                                            <li>
                                                <Typography
                                                    component="span"
                                                    sx={interactiveStyles.assistantTrigger}
                                                    onClick={() => sendToAssistant(setIsChatOpen, "How can you test if a service is using a quantum safe tls connection")}
                                                >
                                                    Weekly network monitoring performance reports
                                                </Typography>

                                            </li>
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

                    <Blog ref={blogRef} classes={classes} blogHash={blogHash}  />
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

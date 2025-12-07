import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { TextField, CssBaseline, Box, Grow, Typography, Divider, Link, Container, Grid, Paper, Tooltip } from '@mui/material';
import { getStartSiteId, fetchFirstLoadServer, getSiteIdfromUrl } from '../dashboard/ServiceAPI';

import NetworkPingIcon from '@mui/icons-material/NetworkPing';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import ApiTwoToneIcon from '@mui/icons-material/ApiTwoTone';
import AssistantIcon from '@mui/icons-material/Assistant';
import SecurityIcon from '@mui/icons-material/Security';
import { useMediaQuery } from '@mui/material';
import styleObject from '../dashboard/styleObject';
import Loading from '../../loading';
import Seo from '../Seo';
import Blog from './Blog';
import Footer from './Footer';
import useClasses from "../dashboard/useClasses";
import { FaDiscord } from "react-icons/fa";
import Button from '@mui/material/Button';
import BlogArticle from './BlogArticle';
import DashboardAppBar from '../dashboard/DashboardAppBar';
import DashboardDrawer from '../dashboard/DashboardDrawer';


const Chat = lazy(() => import('../dashboard/Chat/Chat'));

import { useTheme } from '@mui/material/styles';
//import { ga4Event } from '../../ga4';
import pingImage from '/ping.svg';
import { getBaseDomain } from '../dashboard/ServiceAPI';

function sendToAnalytics({ id, name, value }) {
    /*ga4Event({
        eventCategory: 'Web Vitals',
        eventAction: name,
        eventValue: Math.round(name === 'CLS' ? value * 1000 : value),
        eventLabel: id,
        nonInteraction: true,
        transport: 'beacon',
    });*/
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

const hasChatContent = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    try {
        return window.localStorage.getItem('chatHasContent') === 'true';
    } catch (error) {
        console.warn('Unable to read chat content flag', error);
        return false;
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
    const [blogHash, setBlogHash] = React.useState('');
    const [serverAddress, setServerAddress] = useState('');
    const [quantumCheck, setQuantumCheck] = useState('');
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
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.setItem('chatHasContent', 'true');
            } catch (error) {
                console.warn('Unable to persist chat content flag', error);
            }
        }
        // You'll need to pass down a prop to handle the prompt (see step 3)
        window.dispatchEvent(new CustomEvent('send-chat-prompt', { detail: prompt }));
    };

    useEffect(() => {
        isChatOpenRef.current = isChatOpen;
    }, [isChatOpen]);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);

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

        const hasAutoPrompted = () => {
            if (typeof window === 'undefined') {
                return false;
            }
            return sessionStorage.getItem('autoPrompted') === 'true';
        };

        const isFirstVisit = (() => {
            if (typeof window === 'undefined') {
                return false;
            }
            return sessionStorage.getItem('visitedBefore') === null;
        })();

        let chatTimer;

        const chatAlreadyHasContent = hasChatContent();

        if (isFirstVisit && !hasAutoPrompted()) {
            try {
                sessionStorage.setItem('visitedBefore', 'true');
            } catch (error) {
                console.warn('Unable to persist visit state', error);
            }

            if (!chatAlreadyHasContent) {
                chatTimer = setTimeout(() => {
                    if (!isChatOpenRef.current && !hasAutoPrompted() && !hasChatContent()) {
                        try {
                            sessionStorage.setItem('autoPrompted', 'true');
                        } catch (error) {
                            console.warn('Unable to mark auto prompt state', error);
                        }
                        sendToAssistant(setIsChatOpen, "What types of network monitoring and security functions can you assist me with?");
                    }
                }, 30000);
            }
        }

        return () => {
            if (chatTimer) {
                clearTimeout(chatTimer);
            }
        };
    }, []);

    useEffect(() => {
        if (!isChatOpen) {
            return;
        }
        if (typeof window === 'undefined') {
            return;
        }
        try {
            sessionStorage.setItem('autoPrompted', 'true');
        } catch (error) {
            console.warn('Unable to set auto prompt state when chat opened', error);
        }
    }, [isChatOpen]);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Seo
                title="AI Network Monitor: Quantum-Ready Security & Nmap Automation"
                description="Get 24/7 network monitoring with zero setup. Our AI assistant automates Nmap scans, Metasploit tests, and quantum-readiness checks—with alerts in plain English. Start free: no configuration needed."
                openGraph={{
                    ogImage: {
                        ogImage: `${publicUrl}/ping.svg`,
                        ogImageAlt: "AI Network Monitor: Automated Nmap & Quantum Security",
                    },
                    ogUrl: `https://${getBaseDomain()}`,
                    ogType: "website",
                    ogSiteName: "Quantum Network Monitor",
                    ogLocale: "en_US",
                }}
            />
            <DashboardAppBar
                classes={classes}
                open={open}
                handleDrawerOpen={handleDrawerOpen}
                isMediumOrLarger={isMediumOrLarger}
                toggleChatView={toggleChatView}
                isChatOpen={isChatOpen}
                openInNewTab={openInNewTab}
                showLoading={isLoading}
                loadingProps={{ small: true }}
            />

            <DashboardDrawer
                classes={classes}
                open={open}
                handleDrawerClose={handleDrawerClose}
                isMediumOrLarger={isMediumOrLarger}
            />

            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container className={classes.container}>
                    {/* Hero Section */}
                    <Grid
                        container
                        spacing={12}
                        alignItems="center"
                        justifyContent="center"
                        sx={{ mb: { xs: 4, md: 8 } }}
                    >
                        <Grid item xs={12} md={7} sx={{ textAlign: { xs: "center", md: "left" } }}>
                            <Typography
                                color='primary'
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    fontSize: { xs: "2.2rem", md: "3.2rem" },
                                    letterSpacing: "-1px",
                                }}
                            >
                                Quantum Network Monitor
                            </Typography>
                            <Typography
                                color='secondary'
                                variant="h3"
                                sx={{
                                    fontWeight: 500,
                                    mb: 3,
                                    fontSize: { xs: "1.2rem", md: "2rem" },
                                }}
                            >
                                Are You Ready For Quantum Security?
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={5} sx={{ display: "flex", justifyContent: "center" }}>
                            <Box sx={{ width: { xs: 220, md: 320 }, height: { xs: 180, md: 260 } }}>
                                <video
                                    src="/img/monitor-screen.webm"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    style={{ width: "100%", height: "100%", borderRadius: 8, display: "block", border: "none", outline: "none" }}
                                    aria-label="AI Network Monitor main visual"
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    {/* Features Section */}
                    <Grid
                        container
                        spacing={6}
                        justifyContent="center"
                        alignItems="stretch"
                        sx={{ mb: { xs: 4, md: 8 } }}
                    >
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={6} justifyContent="center" alignItems="stretch">
                                <Grid item xs={12} sm={6} align="center">
                                    <Grow
                                        in={!isLoading}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(!isLoading ? { timeout: 3000 } : {})}
                                    >
                                        <NetworkPingIcon color='secondary' fontSize='large' />
                                    </Grow>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h4" gutterBottom sx={{ fontSize: '1.25rem' }}>AI-Powered Network Protection</Typography>
                                        Our monitoring system automatically:
                                        <ul>
                                            <li>
                                                Scans for vulnerabilities (
                                                <Tooltip title="Ask about Nmap scans" arrow>
                                                    <Typography
                                                        component="span"
                                                        sx={interactiveStyles.assistantTrigger}
                                                        onClick={() => sendToAssistant(setIsChatOpen, "Explain how the Security expert performs a nmap scan")}
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
                                                        onClick={() => sendToAssistant(setIsChatOpen, "How can the Security expert use openssl to test my security configuration")}
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
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            No configuration needed - the AI learns your network's normal behavior.
                                        </Typography>
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
                                        <Typography variant="h4" gutterBottom sx={{ fontSize: '1.25rem' }}>Enterprise Security Made Simple</Typography>
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
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Get enterprise-grade protection without the complexity.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                                <Grid item xs={12} sm={6} align="center">
                                    <Grow
                                        in={!isLoading}
                                        style={{ transformOrigin: '0 0 0' }}
                                        {...(!isLoading ? { timeout: 5000 } : {})}
                                    >
                                        <ApiTwoToneIcon color='secondary' fontSize='large' />
                                    </Grow>
                                    <Paper className={classes.paper}>
                                        <Typography variant="h4" gutterBottom sx={{ fontSize: '1.25rem' }}>Complete Performance History</Typography>
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
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Track gradual degradation or sudden outages with precision.
                                        </Typography>
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
                                        <Typography variant="h4" gutterBottom sx={{ fontSize: '1.25rem' }}>Smart Alert System</Typography>
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
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            The system learns and improves over time.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Call-to-Action Section */}
                    <Divider sx={{ my: 6 }} />
                    <Grid
                        container
                        spacing={4}
                        justifyContent="center"
                        alignItems="stretch"
                        sx={{ mb: { xs: 4, md: 8 } }}
                    >
                        <Grid item xs={12} md={6}>
                            <Paper className={classes.paper}>
                                <NetworkPingIcon fontSize="large" color="primary" />
                                <Typography variant="h4" sx={{ fontSize: '1.25rem' }}>AI-Powered Network Protection</Typography>
                                <TextField
                                    fullWidth
                                    label="Server Address"
                                    variant="outlined"
                                    value={serverAddress}
                                    onChange={(e) => setServerAddress(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    aria-label="Basic security check with AI assistant"
                                    onClick={() => sendToAssistant(setIsChatOpen, `Using the Security Expert run a security check on my server: ${serverAddress} checking only common ports and ssl certificates. I confirm that I have permission to check this server. Please use the agent Scanner - EU`)}
                                >
                                    Check Server Security
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper className={classes.paper}>
                                <LanguageIcon fontSize="large" color="secondary" />
                                <Typography variant="h4" sx={{ fontSize: '1.25rem' }}>Quantum Security Check</Typography>
                                <TextField
                                    fullWidth
                                    label="Service URL"
                                    variant="outlined"
                                    value={quantumCheck}
                                    onChange={(e) => setQuantumCheck(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    sx={{ mt: 2 }}
                                    aria-label="Test quantum ready tls negotiation with AI assistant"
                                    onClick={() => sendToAssistant(setIsChatOpen, `Check quantum readiness using the Quantum Expert on my server ${quantumCheck}  .I confirm that I have permission to check this server. Please use the agent Scanner - EU`)}
                                >
                                    Check Quantum Readiness
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 6 }} />
                    {/* Action Buttons Section */}
                    <Grid
                        container
                        spacing={2}
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        sx={{ mt: 2, mb: 4 }}
                    >
                        <Grid item>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{
                                    borderRadius: 3,
                                    px: 4,
                                    py: 1.5,
                                    fontWeight: 700,
                                    fontSize: "1.2rem",
                                    boxShadow: 3,
                                }}
                                href="/Dashboard"
                                aria-label="Enter Dashboard"
                            >
                                Enter Dashboard
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<FaDiscord size={24} />}
                                href="https://discord.gg/pG4gEE4QXz"
                                target="_blank"
                                rel="noopener"
                                aria-label="Join our Discord community"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    px: 3,
                                    py: 1.2,
                                    backgroundColor: theme => theme.palette.secondary.main,
                                    color: theme => theme.palette.getContrastText(theme.palette.secondary.main),
                                    '&:hover': {
                                        backgroundColor: theme => theme.palette.secondary.dark,
                                    }
                                }}
                            >
                                Join our Discord
                            </Button>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 6 }} />
                    <Box sx={{ mt: 6 }}>
                        <BlogArticle title="Quantum-Safe TLS: Practical Guide & Playbook" />
                    </Box>
                    <Divider sx={{ my: 6 }} />
                    <Footer />

                    <div className={isChatOpen ? classes.chatContainer : classes.chatHidden}>
                        {siteId !== null && siteId !== undefined && (
                            <Suspense fallback={<div>Loading chat...</div>}>
                                <Chat
                                    isDashboard={false}
                                    initRunnerType={'TurboLLM'}
                                    setIsChatOpen={setIsChatOpen}
                                    siteId={siteId}
                                />
                            </Suspense>
                        )}
                    </div>
                </Container>
            </main>

        </div>
    );
}

export default ProductDetail;

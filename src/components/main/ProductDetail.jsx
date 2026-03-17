import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { TextField, CssBaseline, Box, Grow, Typography, Divider, Link, Container, Grid, Paper, Tooltip, MenuItem, Alert, Checkbox, FormControlLabel } from '@mui/material';
import { getStartSiteId, fetchFirstLoadServer, getSiteIdfromUrl, fetchProcessorList } from '../dashboard/ServiceAPI';

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
import Message from '../dashboard/Message';
import { useFusionAuth } from '@fusionauth/react-sdk';


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

const HeroSection = React.memo(() => (
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
));

const FeaturesSection = React.memo(({ isLoading, onAssistant, paperClassName }) => (
    <Grid
        container
        spacing={6}
        justifyContent="center"
        alignItems="stretch"
        sx={{ mb: { xs: 4, md: 8 } }}
    >
        <Grid item xs={12} md={6}>
            <Grid container spacing={6} justifyContent="center" alignItems="stretch">
                <Grid item xs={12} sm={6} align="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ mb: 1, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Grow
                            in={!isLoading}
                            style={{ transformOrigin: '0 0 0' }}
                            {...(!isLoading ? { timeout: 3000 } : {})}
                        >
                            <NetworkPingIcon color='secondary' fontSize='large' />
                        </Grow>
                    </Box>
                    <Paper className={paperClassName} sx={{ height: '100%' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontSize: '1.25rem' }}>AI-Powered Network Protection</Typography>
                        Our monitoring system helps teams:
                        <ul>
                            <li>
                                Run approved security diagnostics (
                                <Tooltip title="Ask about Nmap scans" arrow>
                                    <Typography
                                        component="span"
                                        sx={interactiveStyles.assistantTrigger}
                                        onClick={() => onAssistant("Explain how the Security expert performs a nmap scan")}
                                    >
                                        Nmap
                                    </Typography>
                                </Tooltip>,
                                <Tooltip title="Ask about Metasploit" arrow>
                                    <Typography
                                        component="span"
                                        sx={interactiveStyles.assistantTrigger}
                                        onClick={() => onAssistant("Explain how the penetration expert performs a penetration test with metasploit")}
                                    >
                                        Metasploit
                                    </Typography>
                                </Tooltip>,
                                <Tooltip title="Ask about OpenSSL" arrow>
                                    <Typography
                                        component="span"
                                        sx={interactiveStyles.assistantTrigger}
                                        onClick={() => onAssistant("How can the Security expert use openssl to test my security configuration")}
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
                                        onClick={() => onAssistant("What can the quantum expert do and how does this check my services for quantum readiness")}
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
                                        onClick={() => onAssistant("What kind of plain English security insights can the security expert give")}
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

                <Grid item xs={12} sm={6} align="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ mb: 1, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Grow
                            in={!isLoading}
                            style={{ transformOrigin: '0 0 0' }}
                            {...(!isLoading ? { timeout: 2000 } : {})}
                        >
                            <LanguageIcon color='secondary' fontSize='large' />
                        </Grow>
                    </Box>
                    <Paper className={paperClassName} sx={{ height: '100%' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontSize: '1.25rem' }}>Enterprise Security Made Simple</Typography>
                        <Tooltip title="Ask about the AI Assistant" arrow>
                            <Typography
                                component="span"
                                sx={interactiveStyles.assistantTrigger}
                                onClick={() => onAssistant("How do I use the AI Assistant?")}
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
                                        onClick={() => onAssistant("How do I run an instant penetration test?")}
                                    >
                                        Request guided diagnostic checks
                                    </Typography>
                                </Tooltip>
                            </li>
                            <li>
                                <Tooltip title="Ask about anomaly detection" arrow>
                                    <Typography
                                        component="span"
                                        sx={interactiveStyles.assistantTrigger}
                                        onClick={() => onAssistant("How does anomaly investigation work?")}
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
                                        onClick={() => onAssistant("How do I trigger a security scan?")}
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
                <Grid item xs={12} sm={6} align="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ mb: 1, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Grow
                            in={!isLoading}
                            style={{ transformOrigin: '0 0 0' }}
                            {...(!isLoading ? { timeout: 5000 } : {})}
                        >
                            <ApiTwoToneIcon color='secondary' fontSize='large' />
                        </Grow>
                    </Box>
                    <Paper className={paperClassName} sx={{ height: '100%' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontSize: '1.25rem' }}>Complete Performance History</Typography>
                        Our dashboard shows:
                        <ul>
                            <li>
                                <Tooltip title="Ask about network metrics" arrow>
                                    <Typography
                                        component="span"
                                        sx={interactiveStyles.assistantTrigger}
                                        onClick={() => onAssistant("What network health metrics can the network monitor track after a host is added")}
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
                                        onClick={() => onAssistant("How can you show and analyse histroical data for a given host")}
                                    >
                                        Historical trend analysis
                                    </Typography>
                                </Tooltip>
                            </li>
                            <li>
                                <Typography
                                    component="span"
                                    sx={interactiveStyles.assistantTrigger}
                                    onClick={() => onAssistant("How do I interpret the time-series graphs?")}
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
                <Grid item xs={12} sm={6} align="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{ mb: 1, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Grow
                            in={!isLoading}
                            style={{ transformOrigin: '0 0 0' }}
                            {...(!isLoading ? { timeout: 7000 } : {})}
                        >
                            <EmailIcon color='secondary' fontSize='large' />
                        </Grow>
                    </Box>
                    <Paper className={paperClassName} sx={{ height: '100%' }}>
                        <Typography variant="h4" gutterBottom sx={{ fontSize: '1.25rem' }}>Smart Alert System</Typography>
                        Just provide your email to get:
                        <ul>
                            <li>
                                <Tooltip title="Ask about 24/7 monitoring" arrow>
                                    <Typography
                                        component="span"
                                        sx={interactiveStyles.assistantTrigger}
                                        onClick={() => onAssistant("How does the network monitoring that you are managing work 24/7")}
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
                                        onClick={() => onAssistant("Tell me about the email alerts I will receive if my host goes down")}
                                    >
                                        AI-curated alerts (no spam)
                                    </Typography>
                                </Tooltip>
                            </li>
                            <li>
                                <Typography
                                    component="span"
                                    sx={interactiveStyles.assistantTrigger}
                                    onClick={() => onAssistant("How can you test if a service is using a quantum safe tls connection")}
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
));

const AdvancedToolsSection = React.memo(({ isLoggedIn, localAgentOptions, onAssistant, paperClassName }) => {
    const [serverAddress, setServerAddress] = useState('');
    const [quantumCheck, setQuantumCheck] = useState('');
    const [advancedTarget, setAdvancedTarget] = useState('');
    const [customCodeDescription, setCustomCodeDescription] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('');
    const [authorizedUseConfirmed, setAuthorizedUseConfirmed] = useState(false);
    const [message, setMessage] = useState({ info: 'init' });

    const hasAdvancedTarget = advancedTarget.trim().length > 0;
    const hasCustomCodeDescription = customCodeDescription.trim().length > 0;
    const hasLocalAgentSelected = Boolean(selectedAgent);
    const hasIntrusivePrereqs = isLoggedIn && hasLocalAgentSelected;

    const showAuthorizationError = React.useCallback(() => {
        setMessage({
            text: 'Authorization required. Check "I am authorised to test these targets" before running this action.',
            warning: '',
            persist: false,
        });
    }, []);

    const runWithAuthorization = React.useCallback((action) => {
        if (!authorizedUseConfirmed) {
            showAuthorizationError();
            return;
        }
        action();
    }, [authorizedUseConfirmed, showAuthorizationError]);

    const withAgent = React.useCallback(
        (prompt) => (selectedAgent ? `${prompt} Please use the agent ${selectedAgent}.` : prompt),
        [selectedAgent],
    );

    useEffect(() => {
        if (localAgentOptions.length > 0 && !selectedAgent) {
            setSelectedAgent(localAgentOptions[0].value);
        }
    }, [localAgentOptions, selectedAgent]);

    return (
        <>
            <Divider sx={{ my: 6 }} />
            {/* Target and Agent Section */}
            <Box sx={{ mb: { xs: 4, md: 8 } }}>
                <Grid
                    container
                    spacing={4}
                    justifyContent="center"
                    alignItems="stretch"
                    sx={{ mb: 4 }}
                >
                    <Grid item xs={12} md={6}>
                        <Paper className={paperClassName}>
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
                                onClick={() => runWithAuthorization(() => onAssistant(
                                    `Using the Security Expert run a security check on my server: ${serverAddress} checking only common ports and ssl certificates. I am authorised. Please use the agent Scanner - EU`
                                ))}
                            >
                                Check Server Security
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper className={paperClassName}>
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
                                onClick={() => runWithAuthorization(() => onAssistant(
                                    `Check quantum readiness using the Quantum Expert on my server ${quantumCheck}. I am authorised. Please use the agent Scanner - EU`
                                ))}
                            >
                                Check Quantum Readiness
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container justifyContent="center" sx={{ mb: 3 }}>
                    <Grid item xs={12} md={10}>
                        <FormControlLabel
                            sx={{ mt: 1 }}
                            control={
                                <Checkbox
                                    checked={authorizedUseConfirmed}
                                    onChange={(event) => setAuthorizedUseConfirmed(event.target.checked)}
                                />
                            }
                            label="I am authorised to test these targets"
                        />
                        <Alert severity="warning" sx={{ alignItems: 'center' }}>
                            Active scanning and testing is restricted to authorized assets only. By continuing, you confirm you own the target or have explicit written permission to test it. For security, compliance, and abuse prevention, all LLM interactions in this service are recorded and may be reviewed. Where required by law or to address suspected abuse, relevant information may be shared with appropriate authorities.
                        </Alert>
                    </Grid>
                </Grid>
                <Typography
                    variant="h3"
                    align="center"
                    sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "1.6rem", md: "2.2rem" } }}
                >
                    Advanced Tools & Agent Selection
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 4 }}>
                    Use these tools only on targets you own or are explicitly authorized in writing to test. For deeper diagnostics and agent-powered workflows,
                    select a local agent and target below.
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Target Host or URL"
                            variant="outlined"
                            value={advancedTarget}
                            onChange={(e) => setAdvancedTarget(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Local Agent"
                            value={selectedAgent}
                            onChange={(e) => setSelectedAgent(e.target.value)}
                        >
                            {localAgentOptions.length === 0 ? (
                                <MenuItem value="">
                                    <em>No local agents found</em>
                                </MenuItem>
                            ) : (
                                localAgentOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>
                        {(!isLoggedIn || localAgentOptions.length === 0) && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Install a local agent for intrusive checks.{" "}
                                <Link href="https://freenetworkmonitor.click/download" target="_blank" rel="noopener">
                                    Download the agent
                                </Link>
                                .
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Box>

            <Divider sx={{ my: 6 }} />
            {/* Expert Toolkit Section */}
            <Box sx={{ mb: { xs: 4, md: 8 } }}>
                <Typography
                    variant="h3"
                    align="center"
                    sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "1.6rem", md: "2.2rem" } }}
                >
                    Expert Toolkit
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 4 }}>
                    Launch targeted security workflows powered by specialist AI experts.
                </Typography>
                <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                    <Grid item xs={12} sm={6} md={3} align="center">
                        <Paper className={paperClassName}>
                            <Typography variant="h4" gutterBottom sx={{ fontSize: '1.15rem' }}>
                                Nmap Recon
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Discover open ports, services, and surface vulnerabilities in seconds.
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={!hasAdvancedTarget}
                                onClick={() => runWithAuthorization(() => onAssistant(
                                    withAgent(`Using the Security Expert, run an Nmap service/version scan on ${advancedTarget}. I confirm I have permission to scan this target.`)
                                ))}
                            >
                                Run Recon
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} align="center">
                        <Paper className={paperClassName}>
                            <Typography variant="h4" gutterBottom sx={{ fontSize: '1.15rem' }}>
                                TLS Hardening
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Check certificates, cipher suites, and protocol support with OpenSSL.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!hasAdvancedTarget}
                                onClick={() => runWithAuthorization(() => onAssistant(
                                    withAgent(`Using the Security Expert, run an OpenSSL TLS configuration check on ${advancedTarget}. I confirm I have permission to test this service.`)
                                ))}
                            >
                                Check TLS
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} align="center">
                        <Paper className={paperClassName}>
                            <Typography variant="h4" gutterBottom sx={{ fontSize: '1.15rem' }}>
                                Quantum Readiness Scan
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Test TLS KEM support, certificate algorithms, and quantum-safe posture.
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={!hasAdvancedTarget}
                                onClick={() => runWithAuthorization(() => onAssistant(
                                    withAgent(`Using the Quantum Expert, run a quantum readiness scan for ${advancedTarget}. I confirm I have permission to test this service.`)
                                ))}
                            >
                                Scan Quantum Safety
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} align="center">
                        <Paper className={paperClassName}>
                            <Typography variant="h4" gutterBottom sx={{ fontSize: '1.15rem' }}>
                                Metasploit Guided Test
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Let the penetration expert choose safe modules and validate exposure.
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={!hasAdvancedTarget || !hasIntrusivePrereqs}
                                onClick={() => runWithAuthorization(() => onAssistant(
                                    withAgent(`Using the Penetration Expert, run a guided Metasploit check against ${advancedTarget}. I confirm I have explicit permission to test this target.`)
                                ))}
                            >
                                Start Guided Test
                            </Button>
                            {!hasIntrusivePrereqs && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    Requires login and a local agent.
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <Divider sx={{ my: 6 }} />
            {/* Custom Code Section */}
            <Box sx={{ mb: { xs: 4, md: 8 } }}>
                <Typography
                    variant="h3"
                    align="center"
                    sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "1.6rem", md: "2.2rem" } }}
                >
                    Custom Code on Your Agents
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 4 }}>
                    Deploy bespoke .NET automation to your agent fleet. Build command processors for on-demand execution,
                    or create custom connect endpoints that run on a schedule and stream monitoring data.
                </Typography>
                <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
                    <Grid item xs={12} md={10}>
                        <TextField
                            fullWidth
                            label="Custom Code Description"
                            variant="outlined"
                            value={customCodeDescription}
                            onChange={(e) => setCustomCodeDescription(e.target.value)}
                            placeholder="Describe the workflow, inputs, and outputs you want the code to handle."
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                    <Grid item xs={12} md={6} align="center">
                        <Paper className={paperClassName}>
                            <Typography variant="h4" gutterBottom sx={{ fontSize: '1.2rem' }}>
                                Cmd Processor Expert
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Generate .NET cmd processors that run scripts or CLI tools, return full output, and can be
                                listed, updated, or executed on demand.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={!hasIntrusivePrereqs || !hasCustomCodeDescription}
                                onClick={() => runWithAuthorization(() => onAssistant(
                                    withAgent(`Using the Cmd Processor Expert, create a custom cmd processor based on this description: ${customCodeDescription}. I confirm I have permission to deploy this code.`)
                                ))}
                            >
                                Build a Cmd Processor
                            </Button>
                            {!hasIntrusivePrereqs && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    Requires login and a local agent.
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} align="center">
                        <Paper className={paperClassName}>
                            <Typography variant="h4" gutterBottom sx={{ fontSize: '1.2rem' }}>
                                Connect Expert
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                Create custom monitoring endpoints that run on a schedule, collect metrics, and feed alerting
                                or dashboards with your own logic.
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                disabled={!hasIntrusivePrereqs || !hasCustomCodeDescription}
                                onClick={() => runWithAuthorization(() => onAssistant(
                                    withAgent(`Using the Connect Expert, create a custom Connect endpoint based on this description: ${customCodeDescription}. I confirm I have permission to deploy this code.`)
                                ))}
                            >
                                Create a Connect
                            </Button>
                            {!hasIntrusivePrereqs && (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                    Requires login and a local agent.
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
                {(!isLoggedIn || localAgentOptions.length === 0) && (
                    <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                        Install a local agent to unlock custom code deployments.{" "}
                        <Link href="https://freenetworkmonitor.click/download" target="_blank" rel="noopener">
                            Download the agent
                        </Link>
                        .
                    </Typography>
                )}
                <Message message={message} />
            </Box>
        </>
    );
});

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
    const { isLoggedIn, userInfo } = useFusionAuth();
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
    const [processorList, setProcessorList] = useState([]);

    const toggleChatView = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const sendToAssistant = React.useCallback((prompt) => {
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
    }, []);

    const localAgentOptions = React.useMemo(
        () =>
            (processorList ?? [])
                .filter((processor) => processor?.isPrivate)
                .filter((processor) => processor?.isEnabled !== false)
                .map((processor) => ({
                    value: String(processor.location ?? processor.appID ?? '').trim(),
                    label: String(processor.location ?? processor.appID ?? '').trim(),
                }))
                .filter((option) => option.value),
        [processorList],
    );

    useEffect(() => {
        isChatOpenRef.current = isChatOpen;
    }, [isChatOpen]);

    useEffect(() => {
        if (siteId === null || siteId === undefined) {
            return;
        }
        fetchProcessorList(siteId, setProcessorList, userInfo, isLoggedIn);
    }, [siteId, userInfo, isLoggedIn]);

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
                        sendToAssistant("What types of network monitoring and security functions can you assist me with?");
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
                title="AI Network Monitor: Quantum-Ready Security & Continuous Monitoring"
                description="Helps teams protect their infrastructure with continuous monitoring and streamlined, approved security diagnostics. Start free with clear controls and plain-English alerts."
                openGraph={{
                    ogImage: {
                        ogImage: `${publicUrl}/ping.svg`,
                        ogImageAlt: "AI Network Monitor: Continuous Monitoring and Approved Security Diagnostics",
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
                    <HeroSection />
                    <Grid container justifyContent="center" sx={{ mb: 4 }}>
                        <Grid item xs={12} md={10}>
                            <Alert severity="warning">
                                Authorized use only: scanning, security testing, and monitoring may be performed only on systems you own or are explicitly authorized in writing to test. Review our{' '}
                                <Link href="/termofservice.html">Terms & AUP</Link>.
                            </Alert>
                        </Grid>
                    </Grid>

                    {/* Features Section */}
                    <FeaturesSection
                        isLoading={isLoading}
                        onAssistant={sendToAssistant}
                        paperClassName={classes.paper}
                    />

                    <AdvancedToolsSection
                        isLoggedIn={isLoggedIn}
                        localAgentOptions={localAgentOptions}
                        onAssistant={sendToAssistant}
                        paperClassName={classes.paper}
                    />

                    <Grid container justifyContent="center" sx={{ mb: 4 }}>
                        <Grid item xs={12} md={10}>
                            <Paper className={classes.paper}>
                                <Typography variant="h4" gutterBottom sx={{ fontSize: '1.25rem' }}>
                                    Hugging Face GGUF model selection for TestLLM
                                </Typography>
                                <Typography variant="body1">
                                    Running the Network Monitor Assistant with Hugging Face models? Use our{' '}
                                    <Link href="/huggingface_gguf_selection_guide.html">
                                        GGUF selection guide
                                    </Link>{' '}
                                    to choose quant formats for your hardware, then validate quality in the{' '}
                                    <Link href="/dashboard">
                                        dashboard assistant workflow
                                    </Link>.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>

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

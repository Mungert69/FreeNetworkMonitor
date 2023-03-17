import React from "react";
import clsx from 'clsx';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MainListItems from '../dashboard/MainListItems';
import PingImage from '../../img/ping.svg';
import styleObject from '../dashboard/styleObject';
import Loading from '../loading';
import { Helmet } from 'react-helmet'
import Footer from './Footer';
import useClasses from "../dashboard/useClasses";
import useTheme from '@mui/material/styles/useTheme';
import FaqList from "react-faq-component";
import LogoLink from './LogoLink';
import { HashLink } from 'react-router-hash-link';


const data = {
    title: "FAQ (Find answers to common questions here)",
    rows: [
        {
            title: "How do I add websites and hosts to monitor?",
            content: `You must first login to add hosts. Goto the dashboard page and click login.
            If you dont already have an account then create an account when given this option. When you have logged in then click the edit icon top left next to login icon. For a visual guide see guide number 2 above.`,
        },
        {
            title: "How do I receive alerts?",
            content:
                "Alerts are automatically sent to the email address you have associated with your login. As long as you are still subscribed to receive alerts there is nothing you additional you need to do.",
        },
        {
            title: "Why can't I add more than 10 hosts?",
            content: `The limit is 10 hosts so trying to more hosts you will receive an error. The limit is in place to ensure that this service remains free for as many users as possible.
            If you need more hosts then we can set this up for you for a small monthly charge. Please contact support@freenetworkmonitor.click to request this.`,
        },
        {
            title: "The time of events changes when I login in different locations?",
            content: 'The timezone of your browser is used to calculate the time of events. On the server all times are stored as UTC.  So the time of events will appear to change if you login from different geographical locations. However the alerts will be sent with the UTC being used as a timestamp.',
        },
        {
            title: "How do I get support or ask a question?",
            content: 'You can contact us for support or to ask a question by emailing <b>support@freenetworkmonitor.click</b> or <b>support@mahadeva.co.uk</b>.',
        },
        {
            title: "I am not receiving email notifications when the dashboard shows a new alert",
            content: 'Check that you have Send emails notifications enable in your profile: Click the profile icon top right on dashboard. Click on the bell icon to toggle notifications on and off. Note if you unsubscribe from receiving emails within the alert emails this will disable email notifications.',
        },
        {
            title: "I no longer receive any alerts for a host.",
            content: 'Only one host alert is sent until you reset that alert: On the dashboard host list click the red alert icon to reset the alert',
        },
    ],
};

const Faq = () => {
    const theme = useTheme();
    const classes = useClasses(styleObject(theme, PingImage));
    const test = theme.palette.secondary.main;
   
    const styles = {
        bgColor: 'rgba(255,255,255,0.8)',
        titleTextColor: theme.palette.secondary.light,
        rowTitleColor: theme.palette.primary.dark,
        rowContentColor: theme.palette.primary.light,
        arrowColor: theme.palette.error.light,
    };
    const config = {
        animate: true,
        arrowIcon: "v",
        tabFocus: true
    };
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    return (
        <div className={classes.root}>
            <CssBaseline />
            <Helmet>
                <title>Free Network Monitor FAQ Support</title>
                <meta name="description" content="This page provides support answers for user of free network monitor."></meta>
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
                    <LogoLink/>
                    <Typography sx={{  paddingLeft:4 }} component="h1" color="inherit" noWrap className={classes.title}>
                        Free Network Monitor
                    </Typography>

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
                <List><MainListItems /></List>
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
                                                FAQ
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>


                            </Grid>
                        </Grid>


                    </Grid>
                    <hr></hr>
                    <Grid align="center">
                        <Grid container
                            direction="rows"
                            justifyContent="space-around"
                            alignItems="center"
                        >
                            <Grid item  >
                                <Typography variant="body2" color="textSecondary" align="center">
                                        <HashLink  to="/#blog-post1"  scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })} className={classes.link}>
                                            Visual Guide 1 : View Charts
                                        </HashLink>
                                </Typography>
                            </Grid>
                            <Grid item >
                                <Typography variant="body2" color="textSecondary" align="center">
                                    <HashLink to="/#blog-post2" scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })} className={classes.link}>
                                        Visual Guide 2 : Add Hosts
                                    </HashLink>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <hr></hr>

                    <FaqList
                        data={data}
                        styles={styles}
                        config={config}
                    />
                    <hr></hr>
                    <hr></hr>

                    <Footer />
                </Container>
            </main>
        </div>
    );
}

export default Faq;

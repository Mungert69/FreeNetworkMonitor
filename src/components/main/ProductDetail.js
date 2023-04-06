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
import Loading from '../loading';
import { Helmet } from 'react-helmet'
import Blog from './Blog';
import Footer from './Footer';
import useClasses from "../dashboard/useClasses";
import useTheme from '@mui/material/styles/useTheme';
import AuthNav from '../auth-nav';
import LogoLink from './LogoLink';

const ProductDetail = () => {
    const classes = useClasses(styleObject(useTheme(), process.env.PUBLIC_URL+'/ping.svg'));
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
                <title>Free Network Monitor Online Website Monitoring</title>
                <meta name="description" content="This website provides a free network monitor online service.
     Providing realtime monitoring, charts and alerts
     for all your websites and network hosts. Setup is easy and simple. It is free to use."></meta>
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
                    <Typography sx={{  paddingLeft:4 }}  component="h1" color="inherit" noWrap className={classes.title}>
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
                                                Free online network monitoring made easy.
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
                                         <CardMedia  component='video'
            className={classes.media}
            image={"/img/monitor-screen.webm"}
            loop
            autoPlay/>
                               
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
                                        Featuring a free network monitor online which pings the network host or website. It is an extremely simple monitor for getting a general idea of network host availability
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
                                        Free real time monitoring of how much time it takes for your website to load. Charts how do load times change over time. You can monitor these parameters with Http monitor.

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
                                        Business critical applications can be monitored with the API monitor. The monitor will send an email if the application is not responding within the timeout threshold.
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
                                        Choose an email address to have email alerts sent to. Receive alerts 24/7 365 days a year. Helping to ensure your services stay online.
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

                <Blog classes={classes}/>
                <Footer /> 
            
            </Container>
        </main>
        </div >
    );
}

export default ProductDetail;

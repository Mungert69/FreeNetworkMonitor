import React from "react";
import clsx from 'clsx';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MainListItems from '../dashboard/MainListItems';
//import PingImage from '../../img/ping.svg';
import styleObject from '../dashboard/styleObject';
import Loading from '../../loading';
import { Helmet } from 'react-helmet'
import useClasses from "../dashboard/useClasses";
import useTheme from '@mui/material/styles/useTheme';
import AuthNav from '../auth-nav';
import LogoLink from './LogoLink';
import PricingContent from './PricingContent';

const Pricing = () => {
 
    const classes = useClasses(styleObject(useTheme(),  process.env.PUBLIC_URL+'/ping.svg'));
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

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
                <List><MainListItems classes={classes} /></List>
                <Divider />

            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
           <PricingContent noRedirect={true} apiUser={{}}/>
           </Container>
   
        </main>
     
        </div >
    );
}

export default React.memo(Pricing);

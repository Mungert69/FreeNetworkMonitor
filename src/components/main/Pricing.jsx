import React, { useState, useEffect, useRef }  from "react";
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
import Seo from '../Seo';
import useClasses from "../dashboard/useClasses";
import { useTheme } from '@mui/material/styles';
import AuthNav from '../auth-nav';
import LogoLink from './LogoLink';
import PricingContent from './PricingContent';
import pingImage from '/ping.svg';
import { useMediaQuery } from '@mui/material';
import {  getBaseDomain} from '../dashboard/ServiceAPI';
export default function Pricing(){
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;
    const theme = useTheme();
    const classes = useClasses(styleObject(theme, pingImage));
    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up('md'));
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
     const [openInNewTab, setOpenInNewTab] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
    
        const hash = window.location.hash.slice(1); // Remove the '#'
        const hashParams = new URLSearchParams(hash); // Parse the hash as query-like parameters
            
       
        // Check for 'openInNewTab' in either query or hash
        if (query.has('openInNewTab') || hashParams.has('openInNewTab')) {
            setOpenInNewTab(true);
            console.log("Setting openInNewTab");
        }
    
      }, []);
    return (
        <div className={classes.root}>
            <CssBaseline />
            <Seo
                title="Quantum Network Monitor Online Website Monitoring"
                description="This website provides a Quantum Network Monitor online service. Providing realtime monitoring, charts and alerts for all your websites and network hosts. Setup is easy and simple. It is free to use."
                openGraph={{
                    ogImage: {
                        ogImage: `${publicUrl}/ping.svg`, // Add your OpenGraph image
                        ogImageAlt: "Quantum Network Monitor Logo", // Add alt text for the image
                    },
                    ogUrl: `https://${getBaseDomain()}/subscription`, // Canonical URL
                    ogType: "website", // Type of content
                    ogSiteName: "Quantum Network Monitor", // Site name
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
                        Quantum Network Monitor
                    </Typography>
                    <AuthNav openInNewTab={openInNewTab}/>

                </Toolbar>
            </AppBar>

            <Drawer
                 variant={isMediumOrLarger ? "permanent" : "temporary"}
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
                    <PricingContent noRedirect={true} apiUser={{}} />
                </Container>

            </main>

        </div >
    );
}

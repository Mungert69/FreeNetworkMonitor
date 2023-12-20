import React from "react";
import clsx from "clsx";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MainListItems from "../dashboard/MainListItems";
import styleObject from "../dashboard/styleObject";
import Loading from "../../loading-circle";
import { Helmet } from "react-helmet";
import Footer from "./Footer";
import useClasses from "../dashboard/useClasses";
import useTheme from "@mui/material/styles/useTheme";
import LogoLink from "./LogoLink";
import AuthNav from '../auth-nav';
import Button from "@mui/material/Button";
const Download = () => {
  const theme = useTheme();
  const classes = useClasses(styleObject(theme, process.env.PUBLIC_URL + "/ping.svg"));
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Helmet>
        <title>Download Free Network Monitor App</title>
        <meta name="description" content="Download the Free Network Monitor Android app for monitoring your network services and websites." />
      </Helmet>
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          {isLoading && <Loading small={true} />}
          <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} className={clsx(classes.menuButton, open && classes.menuButtonHidden)} size="large">
            <MenuIcon />
          </IconButton>
          <LogoLink />
          <Typography sx={{ paddingLeft: 4 }} component="h1" color="inherit" noWrap className={classes.title}>
            Free Network Monitor
          </Typography>
          <AuthNav />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" classes={{ paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose) }} open={open}>
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
              <Typography color="primary" variant="h2" gutterBottom>
                Download the Free Network Monitor App
              </Typography>
              <Typography variant="h5" color="textPrimary" gutterBottom>
                Take Control of Your Network Anytime, Anywhere
              </Typography>
              <Grid item xs={12}>
                <Typography variant="h4" color="secondary" gutterBottom>
                  Why Use a Local Device for Network Monitoring?
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Monitoring your network with a local device offers unparalleled insights and control. Here’s why it’s a game-changer:
                </Typography>
                <ul className={classes.bulletList}>
                  <li>
                    <Typography variant="body1">Real-Time Local Network Insights: Precise monitoring of your local network, including specific IP ranges.</Typography>
                  </li>
                  <li>
                    <Typography variant="body1">Enhanced Internet Service Metrics: Understand how your internet services perform from your specific location.</Typography>
                  </li>
                  <li>
                    <Typography variant="body1">Proactive Problem Solving: Detect potential network issues early, before they impact operations.</Typography>
                  </li>
                  <li>
                    <Typography variant="body1">Detailed Problem Identification: Quickly pinpoint the exact location and source of network problems.</Typography>
                  </li>
                  <li>
                    <Typography variant="body1">Access to Historical Data: Utilize historical and baseline data for comparative analysis and troubleshooting.</Typography>
                  </li>
                </ul>
              </Grid>
            </Grid>
          </Grid>
          <hr />
          <Grid container spacing={2}>
            {/* Platform Selection and Download Instructions */}
            <Grid item xs={12}>
              <Typography variant="h5" color="textPrimary">
                Choose your platform:
              </Typography>
            </Grid>
           {/* APK Download Instructions */}
           <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                To download the Free Network Monitor App APK for Android, click the link below. After downloading, open the file to start the installation process.
              </Typography>
              <Button variant="contained" color="primary" href="https://devwww.freenetworkmonitor.click/click.freenetworkmonitor.networkmonitormaui.apk" target="_blank" className={classes.button}>
                Download APK
              </Button>
            </Grid>
            {/* Windows Download Instructions */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                To download the Free Network Monitor App for Windows, click the link below. After downloading, run the installer to complete the setup.
              </Typography>
              <Button variant="contained" color="primary" href="https://devwww.freenetworkmonitor.click/click.freenetworkmonitor.networkmonitormaui.apk" target="_blank" className={classes.button}>
                Download for Windows
                </Button>
            </Grid>
          </Grid>
          <Typography variant="body1" color="textPrimary" gutterBottom>
            After installing the app, follow these instructions:
          </Typography>
          <ol>
            <li>Open the app and click the "Authorize" button to begin the authentication process.</li>
            <li>Follow the on-screen instructions to log in to your account. If you don't have an account, you can create one during the authentication process.</li>
            <li>Once you have successfully logged in and authenticated the app you can return to the website and login here to add hosts to monitor via your device. You will see the device listed as your email address - local when selecting a monitor location.</li>
            <li>After logging in, you can add and manage hosts using the same email address you used for authentication in the app.</li>
          </ol>
          <Footer />
        </Container>
      </main>
    </div>
  );
};

export default React.memo(Download);

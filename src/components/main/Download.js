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
import ReactMarkdown from 'react-markdown';
const markdown = `
# Choose your platform:

## Android Download Instructions

To download the Free Network Monitor Agent APK for Android, click the link below. After downloading, open the file to start the installation process. Note this version is alpha testing and is not yet available in google play store. Android has limitations on background network usage that prevent the monitoring from working when the device sleeps. This version is provided for testing only.

[Download APK](https://freenetworkmonitor.click/click.freenetworkmonitor.networkmonitormaui.apk)

## Windows Install Instructions

To install the Free Network Monitor Agent App from the Windows Store, click the link below.

[Install for Windows](https://apps.microsoft.com/detail/9P58PM1PM9TZ?hl)

## Post-Installation Instructions

After installing the app:

1. **Authorization**: In order for your device to function as an agent, it first needs to be authorized. Start by clicking the 'Authorize' button on the main page to begin the authentication process.

2. **Login**: Follow the on-screen instructions to log in to your account. If you don't have an account, you can create one during the authentication process.

3. **Dashboard Access**: Once you have successfully logged in and authenticated your agent, visit the website [Free Network Monitor Dashboard](https://freenetworkmonitor.click/dashboard) and log in with the same email address you used to authorize your agent. It is from here that you will view and manage network monitoring.

4. **Adding Hosts**: Once logged into the Free Network Monitor site, go to the dashboard and add a host that you want to monitor, click the flashing edit icon. You might wish to monitor a local router at the IP address 192.168.1.1 using the endpoint type 'icmp' to ping the local router, thereby monitoring its availability.

5. **Select Monitor Location**: You can choose either predefined remote agents or your local agent. However, for monitoring local devices like a router at 192.168.1.1, you would need to choose 'your email address - local' when selecting a monitor location.

6. **View and Edit Mode**: Click the edit icon to toggle between view and edit modes. In view mode, after about 2 minutes, host monitoring data should start appearing. For detailed response data, click the chart icon next to the host.

7. **Alerts and Reports**: Alerts will be sent to your email address if the host is detected as down. Weekly reports are also sent to your email address with an analysis of your hosts' performance. Note that you must verify your email address to receive email alerts and reports. If you don't receive the verification email, exclude support@mahadeva.co.uk from your spam filter.

8. **Account Management**: You can manage your account by clicking the profile icon.

**View Log Entries**: To verify that hosts are being added to the agent successfully, click View Logs on the main page of the agent app. The following log entry indicates one host being updated:

\`\`\`
MessageAPI : ProcessorQueueDic :  AddMonitorIPsToQueueDic :  Success : Added 1 MonitorIPs Queue .
\`\`\`

Note: Android and Windows version of the agents do not support Quantum Safe TLS connection monitoring. If you need this feature in your agent then use the fully featured docker version below.

# Docker Setup Instructions

## Installing Docker Compose

Docker Compose is included when you install Docker Desktop. This is the easiest and recommended method to get Docker Compose, which also installs Docker Engine and Docker CLI, necessary for running Compose. Docker Desktop is available for:

- Linux
- macOS
- Windows

For detailed instructions on installing Docker Desktop, refer to the [official Docker documentation](https://docs.docker.com/get-docker/).

To set up the Free Network Monitor Agent within Docker, follow these steps:

1. **Create a Docker Compose File**: Create a \`docker-compose.yml\` file with the following content:

\`\`\`yaml
version: "3.8"

services:
  networkmonitorprocessor:
    image: mungert/networkmonitorprocessor:1.0.0
    container_name: processor
    restart: always
    volumes:
      - ~/state/appsettings-processor.json:/app/appsettings.json
      - ~/state/ProcessorDataObj:/app/ProcessorDataObj
      - ~/state/PingParams:/app/PingParams
      - ~/state/MonitorIPs:/app/MonitorIPs
\`\`\`

**Notes on compose file** Create the folder ~/state . From shell type  mkdir ~/state (this is a linux folder path, adjust acordingly for windows) this folder must be writable by the docker instance that is running. Start by setting full permissions ( chmod 777 ~/state ). After the agent is authorised and you have setup your first hosts. If you are concerned for secutiry of these files then change the owner to the same as the owner of the files that have been created by the docker agent and set full permissions only for this user. 


2. **Run Docker Compose**: In the directory where your \`docker-compose.yml\` file is located, run:

\`\`\`bash
docker-compose up -d
\`\`\`

## Authorizing the Agent

Unlike the app version, the Docker version of the Free Network Monitor Agent requires manual authorization:

1. **Start the Authorization Process**: After starting the Docker container, use the following command to view the logs:

\`\`\`bash
docker logs processor -f
\`\`\`

2. **Retrieve the Authorization URL**: Look for a log entry similar to the following:

\`\`\`
https://authnew.freenetworkmonitor.click:2096/oauth2/device?client_id=de064977-4bde-4426-81f7-4354041fe58b&tenantId=a4d7499b-557c-d132-7d6f-0a575402a781&user_code=2PBLYP
\`\`\`

Copy and paste this URL into a web browser to start the authentication process.

3. **Complete the Authentication**: Follow the on-screen instructions to log in to your account or create a new one.

4. **Verify Successful Authorization**: Check the Docker logs for a success message like the following:

\`\`\`
MessageAPI : SetAuthKey :  SetAuthKey :  Success : Set AuthKey and saved NetConnectConfig to appsettings.json
\`\`\`

## Adding Hosts for Monitoring

Once the agent is authorized, you can start adding hosts to monitor:

1. **Monitor Hosts**: Add hosts to monitor via the Free Network Monitor Service dashboard at [https://freenetworkmonitor.click/dashboard](https://freenetworkmonitor.click/dashboard). Login with the same email address you used to authorize the agent.

2. **Adding Hosts**: Once logged into the Free Network Monitor site, go to the dashboard and add a host that you want to monitor, click the flashing edit icon. You might wish to monitor a local router at the IP address 192.168.1.1 using the endpoint type 'icmp' to ping the local router, thereby monitoring its availability.

3. **Select Monitor Location**: You can choose either predefined remote agents or your local agent. However, for monitoring local devices like a router at 192.168.1.1, you would need to choose 'your email address - local' when selecting a monitor location.

4. **View and Edit Mode**: Click the edit icon to toggle between view and edit modes. In view mode, after about 2 minutes, host monitoring data should start appearing. For detailed response data, click the chart icon next to the host.

5. **Alerts and Reports**: Alerts will be sent to your email address if the host is detected as down. Weekly reports are also sent to your email address with an analysis of your hosts' performance. Note that you must verify your email address to receive email alerts and reports. If you don't receive the verification email, exclude support@mahadeva.co.uk from your spam filter.

6. **Account Management**: You can manage your account by clicking the profile icon.



**View Log Entries**: To verify that hosts are being added successfully, check the Docker logs for entries like:

\`\`\`
MessageAPI : ProcessorQueueDic :  AddMonitorIPsToQueueDic :  Success : Added 1 MonitorIPs Queue .
\`\`\`

## Support

If you encounter any issues or have questions, please feel free to reach out to us at support@mahadeva.co.uk. We're here to help and would love to hear your feedback!
`;

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
          <div>
            <ReactMarkdown children={markdown} />
        </div>
          <Footer />
        </Container>
      </main>
    </div>
  );
};

export default React.memo(Download);

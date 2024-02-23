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

**Exclusive Beta Testing Invitation**

As part of our select group of beta testers, you will have exclusive access to download the Free Network Monitor Agent app directly from the Google Play Store. This opportunity is currently available only to users who have received a special invitation.

**How to Download:**

1. **Access the Google Play Store**: Use the link provided below to navigate to our app on the Google Play Store. Please note, this link will only grant access to users who have been invited.
   
   [Confirm Tester Access to Free Network Monitor Agent](https://play.google.com/apps/testing/click.freenetworkmonitor.networkmonitormaui) 

2. **Installation**: Upon successful redirection to the Google Play Store, proceed to download and install the Free Network Monitor Agent app on your device. Follow the Post-Installation Instructions below to complete the setup process.

**Haven't Received an Invitation?**

If you do not have an invitation but are interested in participating in our beta testing program, we welcome your enthusiasm! Please send a request to [support@freenetworkmonitor.click](mailto:support@freenetworkmonitor.click) to express your interest. Include a brief note about why you're excited to join our beta testing community, and we'll get back to you with details on how you can participate.

**Beta Tester Rewards:**

In appreciation of your valuable feedback and participation, all testers involved in the beta phase will receive an upgrade to a **Standard Subscription** at no cost. This upgrade is our way of saying thank you for helping us enhance the Free Network Monitor Agent app. Your insights are instrumental in ensuring the highest quality and performance of our network monitoring solutions.



Note: Android version has two limitaions: it does not support Quantum Safe TLS connection monitoring and Android's battery saving features may affect pollng frequency. If you don't want these limitations in your agent then use the fully featured docker version below.  

## Windows Install Instructions

To install the Local Network Monitor Agent App from the Windows Store, click the link below.

[Install for Windows](https://apps.microsoft.com/detail/9PFJ3203JWDT)

Note : Windows version does not currently support Quantum Safe TLS connection monitoring. Again if you don't want this limitation in your agent then use the fully featured docker version below.

## Post-Installation Instructions

After installing the app:

1. **Enable Agent**: Toggle the "Enable Agent" slider to the on position. Three task buttons will appear below. Complete each task to ensure full functionality of your device as an agent.

2. **Authorization**: Your device needs authorization to function as an agent. Click the 'Authorize' button on the main page, which redirects you to the OAuth authentication site. Follow the on-screen instructions to log in to your account. If you do not have an account, you can create one during this process. Close the browser window once you receive a message confirming your agent is authenticated.

3. **Login to Free Network Monitor**: Click this task to be redirected to the [Free Network Monitor Dashboard](https://freenetworkmonitor.click/dashboard). Login with the same email address you used for agent authorization. This is where you'll manage your network monitoring.

4. **Adding Hosts**: After logging into the Free Network Monitor site, navigate to the dashboard. To add a host for monitoring, click the flashing edit icon. For instance, to monitor a local router, input its IP address (e.g., 192.168.1.1) and select 'icmp' as the endpoint type. This action enables you to ping the router, monitoring its availability.

5. **Select Monitor Location**: You have the option to choose between predefined remote agents or your local agent for monitoring purposes. For local devices like a router at 192.168.1.1, select 'your email address - local' as the monitor location.

6. **View and Edit Mode**: Utilize the edit icon to switch between view and edit modes. In view mode, monitoring data for hosts will appear after about 2 minutes. Click the chart icon next to a host for more detailed response data.

7. **Alerts and Reports**: Receive email alerts if a host is detected as down, along with weekly reports that analyze your hosts' performance. It's necessary to verify your email address to receive these alerts and reports. If the verification email doesn't arrive, make sure to whitelist support@mahadeva.co.uk in your spam filter.

8. **Account Management**: Manage your account by clicking the profile icon.

**View Monitoring Data**: You have two options for viewing detailed monitoring data. You can use the Free Network Monitor Dashboard or the Agent App, which displays current monitoring data for each dataset (6-hour set of response data).

- **Using the Free Network Monitor Dashboard**: Access the dashboard to view comprehensive monitoring data and analyses. 

- **Using the Agent App**: To view data in the app, return to the Agent App and navigate to the Data tab. Here, monitoring data is visually represented:
    - **Indicator Circles**: Each host is indicated by a circle, which will appear green or red based on the host's current status.
    - **Click on the Circle**: For more detailed monitoring information, click on the circle representing a host.
    - **Pulsing Circles**: A pulsing circle indicates that the host is up. The rate of pulsing reflects the response time - faster pulsing signifies quicker response times.
    - **The Purple Beacon Effect**: This effect shows the percentage of successful responses. A smaller circle indicates a lower success rate, visually representing the reliability of each host.

By providing these visual cues and interactive elements, users can quickly ascertain the health and performance of their monitored hosts at a glance, enhancing the user experience with intuitive navigation and real-time insights.


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
    image: mungert/networkmonitorprocessor:1.1.2
    container_name: processor
    restart: always
    volumes:
      - ~/state/:/app/state/

\`\`\`

**Notes on compose file** Create the folder ~/state . From shell type  mkdir ~/state (this is a linux folder path, adjust acordingly for windows) this folder must be writable by the docker instance that is running. Start by setting full permissions ( chmod 777 ~/state ). If you are concerned for the secutiry of the files then change the owner to the same as the owner of the files that will be created, in the folder, by the docker agent. Then set full permissions only for this user. 


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
        <title>Download Beta - Free Network Monitor App</title>
        <meta name="description" content="Join the exclusive beta testing program for the Free Network Monitor App and help shape its future." />
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
              <Typography color="primary" variant="h3" gutterBottom>
              Beta Tester Download Portal
              </Typography>
              <Typography variant="h4" gutterBottom>
                Welcome Beta Testers!
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                You've been selected to participate in our exclusive beta testing program. Follow the steps below to get started.
              </Typography>
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

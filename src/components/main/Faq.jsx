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
import Grid from '@mui/material/Grid';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MainListItems from '../dashboard/MainListItems';
import styleObject from '../dashboard/styleObject';
import Loading from '../../loading-circle';
import Seo from '../Seo';
import Footer from './Footer';
import useClasses from "../dashboard/useClasses";
import { useTheme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import LogoLink from './LogoLink';
import { HashLink } from 'react-router-hash-link';
import TextField from '@mui/material/TextField';
import pingImage from '/ping.svg';
import { getBaseDomain, getSupportEmail } from '../dashboard/ServiceAPI';
import { useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

const data = {
    title: "FAQ (Find answers to common questions here)",
    rows: [
        {
            title: "How do I add websites and hosts to monitor?",
            content: `
                <p>You must first login to add hosts. Go to the 
                <a href="https://${getBaseDomain()}/dashboard" target="_blank">dashboard page</a> and click "Login".</p>
                <p>If you don't already have an account, create one when prompted. After logging in, click the edit icon at the top left, next to the login icon. For a visual guide, refer to guide number 2 above.</p>
            `,
        },
        {
            title: "How do I receive alerts?",
            content: `
                <p>Alerts are automatically sent to the email address associated with your login. As long as you are still subscribed to receive alerts, no additional action is required.</p>
            `,
        },
        {
            title: "How do I add more hosts?",
            content: `
                <p>The number of hosts you can add is determined by your account type. To add more hosts and enjoy additional benefits, 
                <a href="https://${getBaseDomain()}/subscription" target="_blank">upgrade your subscription</a>.</p>
            `,
        },
        {
            title: "The time of events changes when I login in different locations?",
            content: `
                <p>The timezone of your browser is used to calculate the time of events. On the server, all times are stored as UTC. Therefore, the time of events may appear to change if you log in from different geographical locations. However, alerts will always be sent with UTC as the timestamp.</p>
            `,
        },
        {
            title: "How do I get support or ask a question?",
            content: `
                <p>You can contact us for support or to ask a question by emailing 
                <strong>support@${getBaseDomain()}</strong> or <strong>${getSupportEmail()}</strong>.</p>
            `,
        },
        {
            title: "I am not receiving email notifications when the dashboard shows a new alert.",
            content: `
                <p>Check that you have email notifications enabled in your profile:</p>
                <ol>
                    <li>Click the profile icon in the top right of the 
                    <a href="https://${getBaseDomain()}/dashboard" target="_blank">dashboard</a>.</li>
                    <li>Click the bell icon to toggle notifications on and off.</li>
                </ol>
                <p>Note: If you unsubscribe from receiving emails via an alert email, this will disable email notifications.</p>
            `,
        },
        {
            title: "I no longer receive any alerts for a host.",
            content: `
                <p>Only one host alert is sent until you reset that alert:</p>
                <p>On the 
                <a href="https://${getBaseDomain()}/dashboard" target="_blank">dashboard host list</a>, click the red alert icon to reset the alert.</p>
            `,
        },
        {
            title: "Network Monitor Assistant : How do I add a new host?",
            content: `
                <p><strong>User:</strong> How do I add a host?</p>
                <p><strong>Assistant:</strong> I can help you add a new host! Could you please provide the host address?</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> What type of service (endpoint) would you like to monitor? Options are HTTP, HTTPS, ICMP, DNS, etc.</p>
                <p><strong>User:</strong> HTTP</p>
                <p><strong>Assistant:</strong> Would you like to specify a port number, or should I use the default one?</p>
                <p><strong>User:</strong> Use the default.</p>
                <p><strong>Assistant:</strong> Got it! I’ve added <strong>example.com</strong> to your monitoring list using the HTTP service on the default port. You will start receiving alerts shortly.</p>
            `
        },
        {
            title: "Network Monitor Assistant : How do I edit an existing host?",
            content: `
                <p><strong>User:</strong> How do I edit a host?</p>
                <p><strong>Assistant:</strong> Sure! Please provide the host's address or ID that you want to edit.</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> What would you like to change? You can enable/disable monitoring, change the endpoint type, or update the port.</p>
                <p><strong>User:</strong> Disable monitoring for now.</p>
                <p><strong>Assistant:</strong> Monitoring for <strong>example.com</strong> has been disabled.</p>
            `
        },
        {
            title: "Network Monitor Assistant : How do I view monitoring data for a host?",
            content: `
                <p><strong>User:</strong> How do I view monitoring data for a host?</p>
                <p><strong>Assistant:</strong> Which host would you like to view the data for? Please provide the address or ID.</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> Would you like a summary or detailed report?</p>
                <p><strong>User:</strong> A detailed report, please.</p>
                <p><strong>Assistant:</strong> Here is the detailed monitoring data for <strong>example.com</strong>: Uptime is 99.9%, average response time is 150ms, and no alerts in the past 24 hours.</p>
            `
        },
        {
            title: "Network Monitor Assistant : How do I get a list of all monitored hosts?",
            content: `
                <p><strong>User:</strong> Show me all my monitored hosts.</p>
                <p><strong>Assistant:</strong> Here's a list of your monitored hosts:</p>
                <ul>
                    <li><strong>example.com</strong> - HTTP</li>
                    <li><strong>anotherhost.com</strong> - ICMP</li>
                </ul>
                <p><strong>Assistant:</strong> Would you like more details about any of these hosts?</p>
            `
        },
        {
            title: "Network Monitor Assistant : How do I run a security assessment?",
            content: `
                <p><strong>User:</strong> Can you run a security scan?</p>
                <p><strong>Assistant:</strong> I can perform a security scan. Which host would you like to scan?</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> Would you prefer an <strong>Nmap</strong> scan or an <strong>OpenSSL</strong> check?</p>
                <p><strong>User:</strong> Let's go with Nmap.</p>
                <p><strong>Assistant:</strong> Running an Nmap scan on <strong>example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The scan has completed. No vulnerabilities were found.</p>
            `
        },
        {
            title: "Network Monitor Assistant : How do I request penetration testing?",
            content: `
                <p><strong>User:</strong> Can you run a penetration test on my host?</p>
                <p><strong>Assistant:</strong> I can help with that! However, I need confirmation that you have permission to test this server. Do you confirm?</p>
                <p><strong>User:</strong> Yes, I confirm.</p>
                <p><strong>Assistant:</strong> Great! Which host would you like to test?</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> Would you like to use a specific Metasploit module, or should I suggest one?</p>
                <p><strong>User:</strong> Use <strong>ms17_010_eternalblue</strong>.</p>
                <p><strong>Assistant:</strong> Running the <strong>ms17_010_eternalblue</strong> module on <strong>example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The test has completed. No vulnerabilities were found.</p>
            `
        },
        {
            title: "Network Monitor Assistant : How do I run diagnostics with BusyBox?",
            content: `
                <p><strong>User:</strong> Can you help me run diagnostics on my host?</p>
                <p><strong>Assistant:</strong> I can run diagnostics, but I need to confirm that you have permission to perform this on the server. Do you confirm?</p>
                <p><strong>User:</strong> Yes, I confirm.</p>
                <p><strong>Assistant:</strong> What diagnostics would you like to run? For example, you can ping an IP address.</p>
                <p><strong>User:</strong> Ping 8.8.8.8</p>
                <p><strong>Assistant:</strong> Running <strong>ping -c 4 8.8.8.8</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The ping has completed. All packets received successfully with an average response time of 30ms.</p>
            `
        },
        {
            title: "Network Monitor Assistant : How do I perform a web search?",
            content: `
                <p><strong>User:</strong> Can you help me search the web for network monitoring tools?</p>
                <p><strong>Assistant:</strong> Sure! Searching the web for <strong>network monitoring tools</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> Here are the top results:</p>
                <ul>
                    <li><strong>Tool A:</strong> A comprehensive solution for network monitoring.</li>
                    <li><strong>Tool B:</strong> A cloud-based monitoring tool.</li>
                </ul>
            `
        },
        {
            title: "Network Monitor Assistant : How do I crawl a web page for information?",
            content: `
                <p><strong>User:</strong> Can you extract information from a web page?</p>
                <p><strong>Assistant:</strong> Sure! Please provide the URL of the page you'd like to crawl.</p>
                <p><strong>User:</strong> https://example.com</p>
                <p><strong>Assistant:</strong> Crawling <strong>https://example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> Here's the information I extracted:</p>
                <ul>
                    <li><strong>Page title:</strong> Example Website</li>
                    <li><strong>Meta description:</strong> This is an example website for testing purposes.</li>
                </ul>
            `
        },
        {
            title: "Network Monitor Assistant : How do I retrieve my account information?",
            content: `
                <p><strong>User:</strong> Can you show me my account details?</p>
                <p><strong>Assistant:</strong> Sure! Here's your account information:</p>
                <ul>
                    <li><strong>Username:</strong> john_doe</li>
                    <li><strong>Email:</strong> john@example.com</li>
                    <li><strong>Monitored hosts:</strong> 5</li>
                </ul>
            `
        },
        {
            title: "Network Monitor Assistant : How do I run an Nmap scan?",
            content: `
                <p><strong>User:</strong> Can you run an Nmap scan on my host?</p>
                <p><strong>Assistant:</strong> Sure! But first, I need to confirm that you are authorized to scan this host. Do you confirm?</p>
                <p><strong>User:</strong> Yes, I confirm.</p>
                <p><strong>Assistant:</strong> Great! Please provide the target host's IP or domain.</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> Running an Nmap scan on <strong>example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The scan has completed. Open ports: 80 (HTTP), 443 (HTTPS).</p>
            `
        },
        {
            title: "Network Monitor Assistant : How do I run an SSL/TLS check?",
            content: `
                <p><strong>User:</strong> Can you check the SSL configuration of my website?</p>
                <p><strong>Assistant:</strong> Sure! Please provide the host address you'd like to check.</p>
                <p><strong>User:</strong> example.com</p>
                <p><strong>Assistant:</strong> Running an SSL/TLS check on <strong>example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The check has completed. The certificate is valid and uses <strong>TLS 1.2</strong>.</p>
            `
        },
        {
            title: "Network Monitor Assistant : How do I run a Metasploit module?",
            content: `
                <p><strong>User:</strong> Can you run a Metasploit module?</p>
                <p><strong>Assistant:</strong> I can run a Metasploit module, but first, I need confirmation that you are authorized to test the target. Do you confirm?</p>
                <p><strong>User:</strong> Yes, I confirm.</p>
                <p><strong>Assistant:</strong> Great! Please provide the module name and the target host.</p>
                <p><strong>User:</strong> Use the <strong>exploit/windows/smb/ms17_010_eternalblue</strong> module on example.com.</p>
                <p><strong>Assistant:</strong> Running <strong>ms17_010_eternalblue</strong> on <strong>example.com</strong>. Please wait...</p>
                <p><strong>Assistant:</strong> The module has completed. No vulnerabilities were found.</p>
            `
        },

        {
            title: "Why can't I run certain functions like penetration tests or network scans?",
            content: `
                <p>Advanced functions such as penetration tests, security assessments, and network scans are only available in the <strong>Professional</strong> and <strong>Enterprise</strong> plans.</p>
                <p>If you're on the <strong>Free</strong> or <strong>Standard</strong> plan, these features are restricted. You can upgrade via the <a href="https://${getBaseDomain()}/subscription">subscription page</a>.</p>
            `
        },
        {
            title: "How do I upgrade my subscription plan?",
            content: `
                <p>To upgrade your plan:</p>
                <ol>
                    <li>Go to the <a href="https://${getBaseDomain()}/subscription">subscription page</a>.</li>
                    <li>Select the plan that suits your needs.</li>
                    <li>Follow the instructions to upgrade.</li>
                </ol>
                <p>After upgrading, new features will be available immediately.</p>
            `
        },
        {
            title: "What are the token limits in each plan?",
            content: `
                <p>The AI-powered assistants have token limits, which dictate the amount of data the AI can process daily:</p>
                <ul>
                    <li><strong>Free Plan:</strong> 50k max tokens, with 25k added daily.</li>
                    <li><strong>Standard Plan:</strong> 150k max tokens, with 50k added daily.</li>
                    <li><strong>Professional Plan:</strong> 2000k max tokens, with 500k added daily.</li>
                    <li><strong>Enterprise Plan:</strong> 5000k max tokens, with 1000k added daily.</li>
                </ul>
                <p>These limits reset daily, allowing you to run AI-driven tasks.</p>
            `
        },
        {
            title: "What features are available with the Free Plan?",
            content: `
                <p>The <strong>Free Plan</strong> includes:</p>
                <ul>
                    <li>Monitor up to 10 hosts.</li>
                    <li>Network monitors for ICMP, Http, Dns, Raw Connect and Smtp Ping.</li>
                    <li>50k Max tokens, 25k added daily, for Network Monitor Turbo AI Assistant.</li>
                    <li>FreeLM Assistant.</li>
                    <li>1 Month full response data retention.</li>
                    <li>Must login every 3 months.</li>
                </ul>
                <p>To access more hosts and advanced features, upgrade to the <strong>Standard</strong> or higher plan.</p>
            `
        },
        {
            title: "What features are included in the Standard Plan?",
            content: `
                <p>The <strong>Standard Plan</strong> ($2/mo) builds on the Free Plan and includes:</p>
                <ul>
                    <li>Monitor up to 50 hosts.</li>
                    <li>Local network monitoring with Network Monitor Agent.</li>
                    <li>Network monitors for ICMP, Http, Dns, Raw Connect and Smtp Ping.</li>
                    <li>Includes Quantum Ready checks.</li>
                    <li>Email support.</li>
                    <li>150k Max Turbo AI tokens, fill 50k daily.</li>
                    <li>FreeLM Assistant.</li>
                    <li>6 Months full response data retention.</li>
                    <li>No need to login every 3 months.</li>
                </ul>
                <p>This plan is great for users who need more hosts and advanced monitoring capabilities beyond the Free Plan.</p>
            `
        },
        {
            title: "What does the Professional Plan offer?",
            content: `
                <p>The <strong>Professional Plan</strong> ($5/mo) builds on the Standard Plan and includes:</p>
                <ul>
                    <li>All the features of the Standard Plan plus:</li>
                    <li>Monitor up to 300 hosts.</li>
                    <li>Advanced health check monitors; detect potential issues before they happen.</li>
                    <li>Advanced health checks for ICMP, Http, Dns, Raw Connect and Smtp Ping, includes Quantum Ready checks.</li>
                    <li>2000k Max Turbo AI tokens, fill 500k daily.</li>
                    <li>Priority Email support.</li>
                    <li>2 year full response data retention.</li>
                </ul>
                <p>This plan is ideal for users needing enhanced security features and more extensive monitoring.</p>
            `
        },
        {
            title: "What features are in the Enterprise Plan?",
            content: `
                <p>The <strong>Enterprise Plan</strong> ($10/mo) builds on the Professional Plan and offers:</p>
                <ul>
                    <li>All the features of the Professional Plan plus:</li>
                    <li>Monitor up to 500 hosts.</li>
                    <li>One high priority dedicated monitor service agent in one of our datacenter locations (contact support with your requirements).</li>
                    <li>5000k Max Turbo AI tokens, fill 1000k daily.</li>
                    <li>Unlimited full response data retention and Data Export.</li>
                </ul>
                <p>This plan is designed for large-scale networks that require real-time monitoring and advanced security features.</p>
            `
        },
        {
            title: "How do I know which plan is right for me?",
            content: `
                <p>The best plan depends on your monitoring needs:</p>
                <ul>
                    <li><strong>Free Plan:</strong> Suitable for small networks with up to 10 hosts.</li>
                    <li><strong>Standard Plan:</strong> Ideal for monitoring up to 50 hosts with local network monitoring and Quantum Ready checks.</li>
                    <li><strong>Professional Plan:</strong> Great for users needing advanced health checks and up to 300 hosts.</li>
                    <li><strong>Enterprise Plan:</strong> Best for large networks and those requiring advanced features and up to 500 hosts, with dedicated agent options.</li>
                </ul>
                <p>You can always upgrade your plan as your network monitoring needs evolve.</p>
            `
        },

        {
            title: "How do I add websites and hosts to monitor?",
            content: `You must first login to add hosts. Goto the dashboard page and click login.
            If you dont already have an account then create an account when given this option. When you have logged in then click the edit icon top left next to login icon. For a visual guide see guide number 2 above.`,
        },
        {
            title: "How do I receive alerts?",
            content:
                "Alerts are automatically sent to the email address you have associated with your login. As long as you are still subscribed to receive alerts there is nothing additional you need to do.",
        },
        {
            title: "How do I install the Network Monitor Agent on Android?",
            content: `
                <p>You can download the Quantum Network Monitor Agent app from the 
                <a href="https://play.google.com/store/apps/details?id=click.freenetworkmonitor.networkmonitormaui">Google Play Store</a> 
                or the <a href="https://play.google.com/store/apps/details?id=click.freenetworkmonitor.quantumsecure">Quantum Secure Agent</a>. 
                Follow the installation instructions, and after the app is installed, enable the agent and follow the post-installation steps to start monitoring.</p>
            `,
        },
        {
            title: "How do I install the Network Monitor Agent on Windows?",
            content: `
                <p>The Network Monitor Agent can be installed from the 
                <a href="https://www.microsoft.com/store/apps/9PFJ3203JWDT">Microsoft Store</a> for Windows. 
                If you are using the Quantum Secure Agent, you can find it 
                <a href="https://www.microsoft.com/store/apps/9NXT248W9NR6">here</a>. 
                After installation, enable the agent and complete the post-installation steps to authorize and manage your monitoring.</p>
            `,
        },
        {
            title: "What are the post-installation steps after installing the agent?",
            content: `
                <ol>
                    <li>Toggle the "Enable Agent" slider to activate the agent.</li>
                    <li>Authorize the agent by logging in through OAuth when prompted.</li>
                    <li>Login to the Quantum Network Monitor Dashboard using the same email to manage your monitoring setup.</li>
                    <li>Add hosts for monitoring by selecting the appropriate IP addresses and monitor location.</li>
                </ol>
            `,
        },
        {
            title: "What are the limitations of the Android version of the agent?",
            content: `
                <p>Due to Android’s battery-saving features, the polling frequency may be reduced when the device is not connected to a charger. 
                If you require continuous monitoring without this limitation, consider using the Docker version of the agent.</p>
            `,
        },
        {
            title: "How do I install the Network Monitor Agent using Docker?",
            content: `
                <p>To install using Docker, first install Docker Desktop, which includes Docker Compose. 
                Then, create a <code>docker-compose.yml</code> file as shown in the 
                <a href="https://docs.docker.com/get-docker/">documentation</a> and run the 
                <code>docker-compose up -d</code> command to start the container. 
                Follow the logs for the authorization URL and complete the authorization process to start monitoring.</p>
            `,
        },
        {
            title: "How do I authorize the Docker version of the agent?",
            content: `
                <ol>
                    <li>After starting the Docker container, view the logs with the command <code>docker logs processor -f</code>.</li>
                    <li>Look for the OAuth authorization URL in the logs, and visit the link to complete the authentication process.</li>
                </ol>
            `,
        },
        {
            title: "How do I add hosts for monitoring using the Docker agent?",
            content: `
                <ol>
                    <li>Once the Docker agent is authorized, go to the 
                    <a href="https://${getBaseDomain()}/dashboard">Quantum Network Monitor Dashboard</a> to add hosts.</li>
                    <li>Select a monitor location and the endpoint type (e.g., 'icmp' for ping monitoring), and switch between view and edit modes to monitor your hosts.</li>
                </ol>
            `,
        },
        {
            title: "How do I view monitoring data for hosts?",
            content: `
                <p>You can view monitoring data through the Quantum Network Monitor Dashboard or directly in the Agent App. 
                In the app, host statuses are represented by indicator circles. Click the circle to get more detailed monitoring information, 
                with visual effects such as pulsing and beacon effects to represent response time and reliability.</p>
            `,
        },
        {
            title: "How do I set up alerts and reports for monitored hosts?",
            content: `
                <p>You’ll receive email alerts if a host goes down, and weekly reports analyzing the performance of your hosts. 
                Be sure to verify your email address to receive these notifications. If you don’t see the verification email, 
                whitelist <a href="${getSupportEmail()}">${getSupportEmail()}</a> to ensure it reaches your inbox.</p>
            `,
        },
        {
            title: "What is a Local Agent?",
            content: `
                <p>A Local Agent is an agent that you install and run on a device within your local network, such as a computer, phone, or a Docker container. 
                It monitors devices and services that are accessible from your local network, such as routers, local servers, or other private network devices.</p>
                <p>Local Agents provide visibility into network devices that are not publicly accessible and offer insights into the health of your local infrastructure.</p>
            `,
        },
        {
            title: "What is an Internet-Based Agent provided by Quantum Network Monitor?",
            content: `
                <p>Internet-Based Agents are managed by the Quantum Network Monitor service and operate from predefined global locations. 
                These agents monitor public-facing services like websites or cloud servers and are ideal for tracking availability and performance from different regions.</p>
                <p>Unlike Local Agents, Internet-Based Agents do not need to be installed or configured by the user and are ready to use via the dashboard.</p>
            `,
        },
        {
            title: "When should I use a Local Agent?",
            content: `
                <p>You should use a Local Agent when you need to monitor devices or services within your private network that are not accessible to the internet. 
                This is ideal for checking the availability of routers, local servers, or other internal devices. Local Agents give you full control and visibility over your private network.</p>
            `,
        },
        {
            title: "When should I use an Internet-Based Agent?",
            content: `
                <p>Use an Internet-Based Agent when monitoring public-facing services such as websites, public servers, or cloud services. 
                These agents are useful for ensuring that your services are accessible and performing well from different global locations.</p>
            `,
        },
        {
            title: "Can I use both a Local Agent and an Internet-Based Agent together?",
            content: `
                <p>Yes, you can use both types of agents together. For example, you can use a Local Agent to monitor internal devices like routers and servers, 
                while using an Internet-Based Agent to monitor public-facing services like websites or cloud applications. This gives you a complete view of your infrastructure.</p>
            `,
        },
        {
            title: "How do I use the penetration testing function of the Network Monitor Local Agents?",
            content: `
                <p>The penetration testing function of the Network Monitor Agent requires Metasploit to be installed:</p>
                <ul>
                    <li><strong>Docker Version:</strong> The Docker version of the agent has Metasploit pre-installed, so no additional setup is required.</li>
                    <li><strong>Windows Version:</strong> You need to manually install Metasploit and ensure it is accessible via the system's <code>PATH</code>. 
                    For installation instructions, refer to the <a href="https://www.metasploit.com/download" target="_blank">Metasploit official site</a>.</li>
                    <li><strong>Android Version:</strong> Metasploit is not available for Android at this time, so the penetration testing function is unavailable on this platform.</li>
                </ul>
            `,
        },
        {
            title: "What is the difference between the Quantum Network Monitor Agent and the Quantum Secure Agent?",
            content: `
                <p>The Quantum Network Monitor Agent and the Quantum Secure Agent are nearly identical in functionality. 
                However, the Quantum Secure Agent includes additional features that allow it to scan your local network for devices and monitor whether they are using 
                quantum-safe TLS KEM (Key Encapsulation Mechanism) encryption. This makes the Quantum Secure Agent ideal for environments where quantum-safe encryption 
                is a priority for network security.</p>
            `,
        },
        {
            title: "How do I cancel my subscription?",
            content: `
                <p>You can cancel your subscription on the <a href="https://${getBaseDomain()}/dashboard">Quantum Network Monitor Dashboard</a> . Click on your profile icon (top right corner). On the Profile page at the bottom click View Subscription. On the view subscription page: Click on your subscription plan. This will redirect you to your stripe account. One the stripe account page click cancel subscription. Alternativeley send an email to support@readtforquantum.com with your requested change.</p>
            `,
        },
        {
            title: "How does the Network Monitor Assistant use AI to manage my hosts?",
            content: `
        <p>The Network Monitor Assistant uses AI to interpret your requests and perform actions on your behalf. 
        It connects to the same APIs that power the Quantum Network Monitor Dashboard and Agents. 
        You can ask it to add, edit, or view hosts, perform diagnostics, run security scans, or even retrieve account details.</p>
        <p>The Assistant respects your account permissions and plan limits. 
        Advanced operations such as penetration tests or vulnerability scans are only available in higher-tier plans.</p>
    `,
        },
        {
            title: "What is a Command Processor and how can I create one?",
            content: `
        <p>A Command Processor is a custom-built module that runs code on your selected agent. 
        You can create your own Command Processor using the Quantum Network Monitor Assistant. Either ask it to produce the code or give it the C# .NET code that you wise to use. <strong>AddCmdProcessor</strong> function.</p>
        <p>Once added, you can execute it by asking the Quantum Network Monitor Assistant to run the Cmd Processor by name. 
        Command Processors can perform custom monitoring, data collection, or automation tasks.</p>
        <p>For security, only your authorized agents can execute your custom processors, and source code cannot access other users’ data.</p>
    `,
        },
        {
            title: "Can I share or reuse my custom Command Processors across agents?",
            content: `
        <p>Yes. Once a Command Processor is uploaded, you can deploy it on any of your authorized agents. 
        This allows you to run the same processor from multiple network locations or environments.</p>
        <p>To replicate a processor, use the same processor name and source code when calling <strong>AddCmdProcessor</strong> on another agent. 
        You can also modify and redeploy processors at any time.</p>
    `,
        },
        {
            title: "What is the difference between a system Command Processor and a custom one?",
            content: `
        <p>System Command Processors are built-in by Quantum Network Monitor and include common tools like Nmap, Metasploit, and OpenSSL. 
        These cannot be edited or deleted.</p>
        <p>Custom Command Processors are user-created and can perform any task you define in code, such as running database queries, testing APIs, 
        or monitoring custom endpoints.</p>
    `,
        },
        {
            title: "What does 'Quantum Ready' mean in my plan?",
            content: `
        <p>'Quantum Ready' refers to advanced TLS encryption checks that verify whether your systems are prepared for quantum-safe cryptography. 
        The Quantum Network Monitor Secure Agent includes built-in scans to detect and analyze the use of post-quantum TLS KEM algorithms.</p>
        <p>This ensures your infrastructure is ready for upcoming cryptographic standards.</p>
    `,
        },
        {
            title: "How can I integrate Quantum Network Monitor data into other platforms?",
            content: `
        <p>You can use the API endpoints provided by Quantum Network Monitor to retrieve data programmatically. 
        Common integrations include dashboards like Grafana, automation tools like Zapier, or custom scripts.</p>
        <p>Endpoints such as <strong>GetHostDataByHostAddressAuth</strong> and <strong>GetMonitorIPsWithFilterAuth</strong> 
        allow you to extract uptime, latency, and alert information for use in other systems.</p>
    `,
        },
        {
            title: "Can I export or back up my monitoring data?",
            content: `
        <p>Yes. You can export all your monitoring and ping data as a compressed archive. 
        Use the <strong>GetUserPingInfoTar</strong> API endpoint to generate a downloadable link to your data archive.</p>
        <p>Enterprise users also have continuous data export and retention without expiration.</p>
    `,
        },
        {
            title: "How are monitoring alerts triggered?",
            content: `
        <p>Alerts are triggered automatically when a monitored host fails five consecutive checks within its monitoring interval. 
        These checks depend on the endpoint type (e.g., ICMP, HTTPS, SMTP).</p>
        <p>Once triggered, an alert is sent to your registered email address. You must manually reset the alert in the dashboard to re-enable notifications for that host.</p>
    `,
        },
        {
            title: "Can I schedule when my monitors run?",
            content: `
        <p>Yes. Monitoring schedules are handled by agents based on their polling configuration. 
        Each agent maintains an internal schedule that determines when it performs checks on your hosts.</p>
        <p>Advanced users can adjust schedules or add downtime exclusions through the agent configuration or custom processors.</p>
    `,
        },
        {
  "title": "How secure is communication between the agent and the dashboard?",
  "content": `
    <p>All communication between Quantum Network Monitor agents and the Dashboard is encrypted using TLS&nbsp;1.3, ensuring that transmitted data remains confidential and tamper-proof.</p>

    <p>Each agent is individually authorized through OAuth during setup, creating a unique identity that ties it securely to your account. Beyond OAuth, two additional authentication mechanisms protect communication and verify agent authenticity:</p>

    <ul>
      <li><strong>Agent Secret:</strong> When authorization is complete, a unique secret is generated and securely stored on the agent itself. This secret is used to prove the agent’s identity to the network during encrypted communication. Without it, no data or command messages can be sent using your login identity.</li>

      <li><strong>AuthKey Validation:</strong> A second secret, the <em>AuthKey</em>, is established between the agent and the Quantum Network Monitor backend services. This key validates that the connection originates from the correct, named agent location. It prevents spoofing or impersonation by ensuring that only the authentic agent — not a cloned or simulated one — can exchange data with the backend.</li>
    </ul>

    <p>Together, these layers ensure that no unverified or tampered agent can send or receive monitoring data. Sensitive configuration details and credentials are never stored or transmitted in plaintext at any point.</p>
  `
}
,
        {
            title: "Can multiple users share access to the same Quantum Network Monitor account?",
            content: `
        <p>Currently, each account is tied to a single login email address for security reasons. 
        However, you can share access by authorizing multiple agents using the same account credentials.</p>
        <p>Team-sharing and multi-user support are planned for future releases.</p>
    `,
        },
        {
            title: "Can I view historical uptime and latency trends?",
            content: `
        <p>Yes. The dashboard displays charts showing uptime percentage, latency averages, and packet loss over time. 
        Data retention depends on your subscription plan — Free users retain one month of data, while Enterprise users retain it indefinitely.</p>
    `,
        },
        {
            title: "How do I view detailed error logs for a host?",
            content: `
        <p>You can access detailed error logs through the dashboard by clicking the host’s alert or status indicator. 
        Logs include the last response code, timeout reason, and any diagnostic data collected by the agent.</p>
        <p>Advanced users can also retrieve raw log data via the <strong>GetHostResponseObjByDateRangeAuth</strong> API endpoint.</p>
    `,
        },
        {
            title: "Can the Quantum Network Monitor detect anomalies or predict outages?",
            content: `
        <p>Yes. The Professional and Enterprise plans include predictive analysis features that use AI to detect anomalies 
        and identify potential issues before they cause downtime. The Assistant will alert you if unusual patterns are detected in latency or uptime metrics.</p>
    `,
        },
        {
            title: "How can I test quantum-safe encryption on my servers?",
            content: `
        <p>If you're using the Quantum Secure Agent, you can run a <strong>quantum</strong> endpoint check. 
        This feature tests your server's TLS configuration and determines whether it supports post-quantum encryption algorithms such as MLKEM.</p>
        <p>To use this, add a host with the endpoint type <strong>quantum</strong> or run the check directly from the dashboard or assistant.</p>
    `,
        },
        {
            title: "Can I automate actions based on monitoring results?",
            content: `
        <p>Yes. You can create custom Command Processors that automatically perform actions, such as restarting a service or sending a webhook, 
        when a certain condition is met (e.g., host down, high latency).</p>
        <p>This allows you to build self-healing or auto-remediation workflows within your network.</p>
    `,
        },
        {
            title: "How do I monitor private IP addresses or local devices?",
            content: `
        <p>Private IPs and local devices can only be monitored using a Local Agent. 
        Install the Quantum Network Monitor Agent on a system within your private network, authorize it, and assign the agent to monitor your internal IPs or services.</p>
        <p>This ensures your private infrastructure is monitored securely without exposing it to the internet.</p>
    `,
        },
        {
            title: "What happens if my agent goes offline?",
            content: `
        <p>If your agent goes offline, the data in the dashboard will stop at that point . 
        If the agent if still running it will store data until it can again connect to the Quantum Network Monitor service.</p>
        <p>Once reconnected, all missed pings and host checks will be updated automatically.</p>
    `,
        },
        {
            title: "Can I run network scans from a specific geographic location?",
            content: `
        <p>Yes. When running Nmap, OpenSSL, or Metasploit tasks, you can specify the <strong>agentLocation</strong> parameter 
        (for example, 'London - UK' or 'Berlin - Germany').</p>
        <p>This lets you simulate how your network or site appears from different global regions.</p>
    `,
        },
        {
            title: "Does the Quantum Network Monitor comply with privacy regulations?",
            content: `
        <p>Yes. Quantum Network Monitor complies with major data protection regulations, including GDPR. 
        Monitoring data is anonymized and stored in secure regions. You can request data deletion at any time by contacting support.</p>
    `,
        }

    ],
};
const downloadFAQAsJson = () => {
    const simplified = data.rows.map(row => ({
        input: row.title,
        output: stripHtml(row.content)
    }));

    const blob = new Blob([JSON.stringify(simplified, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'faq.json';
    a.click();

    URL.revokeObjectURL(url);
};

// Helper to strip HTML from content
const stripHtml = (html) => {
    if (!html) {
        return '';
    }
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
};

const Faq = () => {
    const publicUrl = import.meta.env.VITE_PUBLIC_URL;

    const theme = useTheme();
    const classes = useClasses(styleObject(theme, pingImage));
    const isMediumOrLarger = useMediaQuery(theme.breakpoints.up('md'));
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState(''); // State for search query

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredFaqs = React.useMemo(() => {
        if (!normalizedQuery) {
            return data.rows;
        }
        return data.rows.filter((faq) => {
            const plainContent = stripHtml(faq.content).toLowerCase();
            return (
                faq.title.toLowerCase().includes(normalizedQuery) ||
                plainContent.includes(normalizedQuery)
            );
        });
    }, [normalizedQuery]);

    const accordionPalette = React.useMemo(
        () => ({
            background: 'rgba(255,255,255,0.8)',
            title: theme.palette.primary.dark,
            content: theme.palette.primary.light,
            icon: theme.palette.error.light,
        }),
        [theme],
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <Seo
                title="Quantum Network Monitor FAQ - Get Answers to Common Questions"
                description="Find answers to frequently asked questions about Quantum Network Monitor. Learn how to add hosts, set up alerts, troubleshoot issues, and use advanced features like the Network Monitor Assistant."
                openGraph={{
                    ogImage: {
                        ogImage: `${publicUrl}/ping.svg`, // Add your OpenGraph image
                        ogImageAlt: "Quantum Network Monitor Logo", // Add alt text for the image
                    },
                    ogUrl: `https://${getBaseDomain()}/faq`, // Canonical URL
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
                    <Grid container spacing={6}>
                        <Grid item xs={12}>
                            <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                                <Grid align="center">
                                    <Grid container direction="column" justifyContent="space-around" alignItems="center">
                                        <Grid item>
                                            <Typography color="primary" variant="h2">
                                                Quantum Network Monitor
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography color="secondary" variant="h4">
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
                                    <HashLink to="/#blog-post1" scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })} className={classes.link}>
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
                    {/* Search Field */}
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Search FAQs"
                                variant="outlined"
                                fullWidth
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </Grid>
                    </Grid>


                    <hr />

                    {/* Filtered FAQ List */}
                    <Grid container justifyContent="center">
                        <Grid item xs={12} md={10}>
                            {filteredFaqs.length === 0 ? (
                                <Typography align="center" color="textSecondary" sx={{ py: 4 }}>
                                    No FAQs match your search yet. Try a different keyword.
                                </Typography>
                            ) : (
                                filteredFaqs.map((faq, index) => (
                                    <Accordion
                                        key={`${faq.title}-${index}`}
                                        disableGutters
                                        elevation={0}
                                        square
                                        sx={{
                                            backgroundColor: accordionPalette.background,
                                            mb: 1.5,
                                            borderRadius: 2,
                                            '&:before': { display: 'none' },
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon sx={{ color: accordionPalette.icon }} />}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: accordionPalette.title,
                                                }}
                                            >
                                                {faq.title}
                                            </Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box
                                                sx={{
                                                    color: accordionPalette.content,
                                                    width: '100%',
                                                    textAlign: 'left',
                                                }}
                                                dangerouslySetInnerHTML={{ __html: faq.content }}
                                            />
                                        </AccordionDetails>
                                    </Accordion>
                                ))
                            )}
                        </Grid>
                    </Grid>

                    <hr />
                    <Grid container justifyContent="center" style={{ marginTop: 20 }}>
                        <button onClick={downloadFAQAsJson}>📥 Download FAQ as JSON</button>
                    </Grid>
                    <Footer />
                </Container>
            </main>
        </div>
    );
}

export default React.memo(Faq);

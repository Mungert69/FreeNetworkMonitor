## Choose your app

Install [Network Monitor Agent from the Microsoft Store](https://www.microsoft.com/store/apps/9P58PM1PM9TZ) for local monitoring and assistant access, or [Quantum Secure](https://www.microsoft.com/store/apps/9NXT248W9NR6) for the additional single-host checks, local network discovery and logs views.

Both use your service account and can host a local agent. The [platform comparison](/docs/platforms/) explains the alternatives, including Docker.

## Enable and authorise the agent

Open the app and turn on **Enable Agent**. Use the **Authorize** task/button to open the browser authorisation flow, then sign in and approve with the same account you use on the website. The app provides setup controls; unlike Linux/Docker and ESP32, you do not need to retrieve the authorisation URL from a log. Return to the app and wait for the agent to register.

The app’s setup and configuration views help you confirm the selected account and agent state. Open [the dashboard](/dashboard), add a host and choose this PC’s agent location. An app login and an enabled, authorised agent are different steps; confirm both before expecting readings.

## Use the app and website together

The Monitored Hosts view shows hosts assigned to your account, their readings and status. The assistant helps manage hosts and run available diagnostics. The website provides the fuller [charts, table and history controls](/docs/charts/).

Quantum Secure’s Check Host view is for a direct test; Scan Local Network helps discover devices from a selected local interface; Logs helps inspect local operation. A discovery result is not automatically proof that a recurring monitor is configured—check your host list.

## Bluetooth and diagnostic tools

Live Bluetooth monitoring requires a working Bluetooth adapter and device broadcasts in range. Follow [sensor setup](/docs/sensors/) for addresses, keys and metrics.

Metasploit requires a separate Framework installation and a usable executable path, as well as account entitlement. Follow [Rapid7’s installation guidance](https://docs.metasploit.com/docs/using-metasploit/getting-started/nightly-installers.html). Other tools depend on the app build and installed dependencies; consult [diagnostics](/docs/diagnostics/).

Keep the PC awake and connected for continuous checks. Update through the Store, then verify fresh observations. For missing hosts or unavailable commands, see [troubleshooting](/docs/troubleshooting/).

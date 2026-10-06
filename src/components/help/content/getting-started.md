## Choose where the check runs

Your monitor checks a target from a **monitor location**. Choose an available service-provided agent for a public website. For a router, private server or Bluetooth sensor, use an [agent on that network](/docs/platforms).

You can manage hosts from the website even when checks run on Linux, Windows, Android or an ESP32. Keep the agent running so it can collect readings.

## Enrol a local agent first

Windows and Android apps provide an **Enable Agent / Authorize** workflow. Linux/Docker and ESP32 have no graphical setup interface: read the agent’s log, open its printed authorisation URL in a browser, sign in and approve the device, then return to the log to confirm registration. Use the same account on the dashboard afterwards.

For the exact log commands and completion checks, follow [Linux/Docker enrolment](/docs/linux#enrol-the-agent-through-its-logs) or [ESP32 serial enrolment](/docs/esp32#enrol-the-board-through-its-serial-log). Installing an image or logging into the website alone does not enrol the agent.

## Add your first host

1. Open the [dashboard](/dashboard) and sign in. Use the same account you used to authorise your local agent.
2. Switch to **Edit hosts** and add a host. A new row may start disabled; open its edit details to configure it.
3. Enter the address. For a website, use a clear URL such as `https://example.com`. For a local router, enter its private IP address.
4. Choose an **Endpoint Type** and **Monitor Location**. Start with `http` for website reachability or `icmp` for a device that responds to ping. Check the [endpoint reference](/docs/endpoints) before choosing a certificate or security check.
5. Set a port if the service needs one. Leave credentials and Args empty unless that endpoint requires them.
6. Enable the host and save your changes. Return to the viewing table and allow time for a check and upload.

> Example addresses in these guides are illustrative. Replace them with a target you own or are authorised to monitor.

## Read the first result

Look at the endpoint, monitor location, latest status, successful/failed observations and measurement unit together. `ms` describes duration; `V`, `A` or `°C` describes a sensor measurement. A response alone does not prove that a website’s content or security is correct.

Open the host’s chart for readings over time. Expand **Show details** for its configuration and location. The agent apps also show hosts as status circles: tap a circle for a summary, then open its details. Physical readings use their own units, not latency ratings.

## Set a useful alert

Verify your email in **Profile** and enable email notifications. Availability alerts use failed-check state. For a numeric measurement, set optional low/high limits in the host’s edit details; leave them empty if you do not want measurement-limit alerts. See [alerts](/docs/alerts).

## Use the assistant instead

You can ask the [AI assistant](/docs/assistant) to discover agents, add a monitor or explain results. An example request is:

> Show my available agents. Add a monitor for my router at 192.168.1.1 using ICMP from my local agent. Ask me which location to use if there is more than one.

Check the completed function result and confirm that the host appears in your table.

## Change or add another monitor

Use edit details to change the endpoint, port, location, timeout, Args, credentials or limits. You can disable monitoring without deleting the host. **Skip cycles** reduces check frequency: a value of 0 checks every eligible cycle, 1 skips one cycle between checks, and 2 skips two. Agent schedules and endpoint-specific intervals still apply.

You can monitor the same address from different locations or with different endpoint/Args combinations. For Bluetooth, separate hosts select separate metrics from the same device. Exact duplicate configurations are rejected.

Continue with [host tables and charts](/docs/charts), [Bluetooth sensors](/docs/sensors), or [troubleshooting](/docs/troubleshooting).

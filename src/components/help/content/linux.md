## Run a persistent Linux agent

The Docker agent is suitable for an always-on Linux host. Docker Desktop can also run the Linux container on Windows or macOS; container networking differs from native host networking. Check the published image’s architecture support before choosing hardware.

Install Docker and Compose using the [official Docker installation instructions](https://docs.docker.com/engine/install/) or [Docker Desktop](https://docs.docker.com/desktop/).

## Create the container

Create a working directory and a persistent state directory. Save this as `compose.yaml`:

```yaml
services:
  networkmonitorprocessor:
    image: mungert/networkmonitorprocessor:latest
    container_name: processor
    user: root
    restart: always
    volumes:
      - ./state:/app/state/
```

Run from that directory:

```sh
mkdir -p state
docker compose up -d
docker logs -f processor
```

Keep the state volume when replacing the container. It holds agent state; deleting it can lose registration or buffered observations. See the [Compose documentation](https://docs.docker.com/compose/) for container management.

## Enrol the agent through its logs

The Linux/Docker agent has **no graphical setup interface**. It prints its device-authorisation instructions in the log; complete authentication in a browser on your computer or phone.

1. Start the container and leave it running. Open its output with `docker logs -f processor`, using your actual container name if you changed it. From the Compose directory, `docker compose logs -f networkmonitorprocessor` is an alternative for the service name shown above. For an agent run directly rather than in Docker, read its terminal/service log.
2. Find the HTTPS device-authorisation URL and accompanying user code. Copy the **complete URL printed by your running agent** into a browser. It may include the code and other required query parameters. Do not reuse a URL or code copied from an example or another agent.
3. Sign in or create your account and approve the device. If the page requests a code, enter the code from this agent’s log. Use the same account you intend to use on the website.
4. Return to the log and wait for successful authorisation and registration. The old download guide showed `Set AuthKey and saved NetConnectConfig to appsettings.json` as a success example; wording can vary by version. A browser approval page alone does not establish that the agent finished registering.
5. Open the dashboard with that same account, refresh available locations and select this registered agent.

Keep the agent running while completing the browser flow. If a code expires, use a fresh request printed by the agent rather than retrying the old code. If no fresh request appears, inspect the logs and restart the container normally; preserve its state volume. Keep active authorisation codes private.

## Assign your first host

Open [the dashboard](/dashboard), add or edit a host and choose the new agent as its monitor location. Use an address reachable from the container. Enable the host and confirm fresh readings. See [your first monitor](/docs/getting-started/).

## Tools and updates

Available diagnostics depend on the image and installed native dependencies. Linux supports many network and browser workflows, but live BLE advertisement scanning is not currently implemented; use [Windows, Android or ESP32](/docs/sensors/) for live sensor monitoring.

To update a container, preserve the volume and use:

```sh
docker compose pull
docker compose up -d
docker logs -f processor
```

Confirm the registered agent reconnects and readings resume. For a missing location or a stopped upload, use [troubleshooting](/docs/troubleshooting/). Compare [other platforms](/docs/platforms/) before choosing a replacement.

## No host readings

Check that the host is enabled, saved and assigned to the intended monitor location. Confirm the agent is powered, authorised to the same account and able to reach the target. A public agent cannot reach a private LAN address; a Bluetooth reading needs a nearby scanner.

Review skip cycles, scheduling and the host’s status text. Some jobs are daily rather than every polling cycle. A registered agent or a successful earlier check does not establish that this target is reachable now.

## Bluetooth decodes but the number is wrong

Confirm the selected `--format` and `--metric`, address and protocol key. The decoded text can contain many fields; the selected metric determines the recorded value. Supported metrics supply their own units and conversion—do not manually apply an extra scale.

Negative current or temperature can be valid. A missing field, unsupported record or invalid key is different from a numeric reading. See [sensor setup](/docs/sensors/) and the [metric reference](/docs/ble-metrics/).

## An endpoint or command is unavailable

Ask the assistant for available endpoints/commands on the chosen agent. Check the [platform comparison](/docs/platforms/), account entitlement and installed dependencies. Android restricts browser tasks, Linux has no live BLE scanner and ESP32 provides a fixed embedded subset.

Inspect agent logs or the app’s configuration/logs views where available. For native tool failures, returned errors are more useful than assuming the target is down.

## A chart says there is no data

Check the selected range and timezone, then try the latest dataset or a wider period. Range requests use explicit UTC bounds; the website displays local times. Older archives can be outside retention or temporarily unavailable. A coverage notice distinguishes incomplete history from an empty successful range.

Long ranges retain representative points rather than plotting every observation. Summaries use the available range data. A new-data indicator preserves your chosen view until you refresh. See [charts](/docs/charts/).

## Alerts did not arrive

Verify email and profile notification settings. Check the host’s alert state and reset it if you want another notification. Optional limits use actual measurement units; blank means disabled. A failed observation is not automatically a numeric limit violation.

Predictive and ordinary monitor alerts have separate reset controls. See [alert setup](/docs/alerts/).

## Disconnection and backlog

A running agent can buffer observations during an upload outage, within storage limits, then upload after reconnecting. A powered-off agent cannot collect readings. A full backlog can pause new checks to preserve stored data.

For Docker, preserve the state volume and inspect container logs. For Android, check battery/background settings. For ESP32, check power and Wi-Fi and use the normal [firmware update/recovery guidance](/docs/esp32/).

## Assistant and report problems

Check the chosen model, token allowance and agent location. Stop generation and inspect operation status if a task appears stuck. Local model history can require the original server. Reports may be delayed or lack optional AI analysis depending on configuration; they should not invent missing observations.

If asking for help, include the platform, endpoint or command, time range and returned error. Keep passwords, keys and personal data out of public messages. Return to [FAQ](/faq/) or [all guides](/docs/).

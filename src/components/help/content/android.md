## Install the right app

Choose [Network Monitor Agent on Google Play](https://play.google.com/store/apps/details?id=click.freenetworkmonitor.networkmonitormaui) for monitoring and assistant access, or [Quantum Secure](https://play.google.com/store/apps/details?id=click.freenetworkmonitor.quantumsecure) for additional single-host tests, local network discovery and logs.

Both can run an authorised local agent. Compare [platform capabilities](/docs/platforms/) before choosing a phone as an always-on processor.

## Enable, authorise and assign

Open the app, turn on **Enable Agent** and use the **Authorize** task/button to open browser authorisation. Sign in and approve with the account you use on the website. The app provides setup controls; unlike Linux/Docker and ESP32, you do not need to retrieve the URL from a log. Return to the app and confirm registration. In [the dashboard](/dashboard), choose that agent as the host’s monitor location, enable the host and save.

Use Monitored Hosts for current readings and the assistant for supported tasks. Quantum Secure adds Check Host, local network discovery and Logs. Discovery helps find targets; confirm a saved recurring host exists before expecting ongoing monitoring.

## Permissions and Bluetooth

Grant the Bluetooth/nearby-device permissions requested by the app and enable Bluetooth. Some Android versions also require location permission or related settings for scanning. Keep your device within range of the sensor.

Use [Bluetooth setup](/docs/sensors/) for Victron, Ruuvi and BTHome. Ordinary network checks do not imply that live BLE scanning is permitted; verify permissions separately.

## Background operation and limits

Battery saving and Android background restrictions can delay polling. Keep the device powered for continuous use and review its app background/battery settings. A sleeping or stopped app cannot guarantee the same schedule as an always-on machine.

Browser automation endpoints such as rendered-page checks, site hashes, crawls and Space workflows are restricted on Android. Metasploit execution is not supported. Other native tooling also depends on the build and platform. Use [Linux](/docs/linux/), [Windows](/docs/windows/) or [ESP32](/docs/esp32/) when its capabilities better match your task.

Update through Google Play and check that observations resume. Read [Android’s background-work guidance](https://developer.android.com/develop/background-work/background-tasks/bg-work-restrictions) and [troubleshooting](/docs/troubleshooting/) if the agent becomes unavailable.

## A dedicated small monitor

The firmware targets an ESP32-S3 N16R8 board with 16 MB flash, 8 MB octal PSRAM and 2.4 GHz Wi-Fi. Use a USB data cable and a compatible board; firmware for a different memory layout is not interchangeable.

Start with the [latest published Live firmware release](https://github.com/Mungert69/NetworkMonitorProcessorAgentEmbedded/releases/latest). Follow the project’s [first physical board guide](https://github.com/Mungert69/NetworkMonitorProcessorAgentEmbedded/blob/main/docs/first-physical-board.md) for the exact image files, flash addresses, USB setup and recovery procedure.

## First installation and Wi-Fi setup

Factory installation erases flash. Use it for a new board and follow the linked physical-board guide for flashing. The ESP32 has **no graphical setup interface**: first-time setup and enrolment instructions appear in its USB serial log.

After flashing, open the USB serial console at **115200 baud**. With the Python serial tools used by the board guide, an example is:

```sh
python -m serial.tools.miniterm /dev/ttyACM0 115200
```

Replace `/dev/ttyACM0` with the port used for your board: for example `/dev/ttyUSB0` on Linux, `COM3` on Windows or `/dev/cu.usbmodem…` on macOS. Use a USB data cable. Close a serial monitor before flashing and reopen it afterwards.

Enter the 2.4 GHz Wi-Fi SSID and password at the serial prompts. Input is not echoed. Leave the board powered and connected while it joins the network.

## Enrol the board through its serial log

1. After Wi-Fi connects, find the log line beginning **`nm_enrollment: Sign in at`**. It contains an HTTPS authorisation URL followed by a short user code.
2. Copy **only the URL**, not the trailing `; code ...` text, into a browser on your computer or phone. Use the actual URL printed by your board; it may already include the code.
3. Sign in or create your Network Monitor account and approve the device. If the page asks for a code, enter the short code printed in the serial log. Use the same account you will use on the website.
4. Return to the serial console. Wait for successful registration and **`ESP32_S3_MQTT_READY`**. Browser approval alone does not confirm that the board finished registering and connecting.
5. Open the dashboard with the same account, refresh available locations and select the registered board.

If the code expires, restart the board to obtain a new URL and code. If Wi-Fi setup or OAuth is interrupted, restart and follow the serial prompts; the device resumes from its saved setup stage. Keep the serial log private while a live authorisation code is visible. Do not erase flash merely to retry enrolment.

## Assign your first host

After registration, add a host in [the dashboard](/dashboard) using the board as the monitor location. Keep it powered and connected. For BLE, the board must be within range of the transmitting device; see [sensor setup](/docs/sensors/).

## Supported recurring checks

The built-in endpoints are `icmp`, `dns`, `rawconnect`, `http`, `httphtml`, `https`, `quantum`, `quantumcert`, `nmap`, `blebroadcast` and `blebroadcastlisten`.

The board uses the same measurement meaning, selected BLE metrics and actual-unit limits as other supported agents. Its network and TLS implementations have embedded limits; compare [endpoint meanings](/docs/endpoints/) and [quantum checks](/docs/quantum/).

## Supported diagnostics and limits

Embedded commands are `QuantumCert`, `QuantumConnect`, `QuantumPortScanner`, `QuantumInfo`, `Openssl` and `Nmap`. These are selected diagnostics, not full desktop executables.

Nmap supports bounded TCP scans and discovery; it does not provide NSE vulnerability scripts, UDP scans or OS fingerprinting. Service-name labels are hints. Quantum negotiation uses the compiled algorithm set. The board does not load custom C# Connects or command modules and does not provide browser automation, Metasploit or camera capture.

## Update an enrolled board

Use Profile → Device firmware on the website to select an available firmware image and request an update. Check progress and the board’s return to normal operation. Signed update and recovery/rollback handling protect the normal update path; follow the project guide if a board needs USB recovery.

Do not use factory flashing as the routine update procedure for an enrolled processor. Manage registered devices from [your profile](/docs/account/), and use [troubleshooting](/docs/troubleshooting/) when readings stop.

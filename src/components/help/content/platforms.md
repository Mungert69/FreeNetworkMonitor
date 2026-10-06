## Website or local agent

The website manages your monitors, displays history and runs the assistant. An agent performs checks from its network location. A public website can use an available service-provided location; private devices need an agent with access to that network. Bluetooth devices also need a nearby scanner.

You can use multiple authorised locations to compare public-service behaviour from different networks. Never assume a location exists from an example: check your actual available-agent list.

## Authorisation depends on the platform

Windows and Android apps have setup controls that start device authorisation. Linux/Docker and ESP32 have no graphical user interface: the running agent prints a URL and code in its log. Open that URL in a browser on another device if necessary, sign in and approve, then check the agent log for completed registration. Afterwards use that same account on the website and select the registered monitor location.

See [Linux/Docker log enrolment](/docs/linux#enrol-the-agent-through-its-logs), [ESP32 USB serial enrolment](/docs/esp32#enrol-the-board-through-its-serial-log), [Windows setup](/docs/windows) or [Android setup](/docs/android).

## Platform comparison

| Capability | Linux / Docker | Windows apps | Android apps | ESP32-S3 |
| --- | --- | --- | --- | --- |
| Website/network monitoring | Broad .NET endpoint set | Broad .NET endpoint set | Core checks; platform restrictions apply | Fixed set of 11 endpoints |
| Live BLE sensors | Not currently implemented | Supported with adapter/permissions | Supported with permissions | Supported in BLE-enabled firmware |
| Browser page checks/crawling | With browser dependencies | With browser dependencies | Disabled by browser policy | Unavailable |
| Quantum diagnostics | With bundled/configured PQ tools | With bundled/configured PQ tools | Depends on native tools/build | Bounded built-in algorithm set |
| Metasploit | With configured framework | Separate framework installation | Unavailable | Unavailable |
| Custom C# Connects/processors | Supported on capable agents | Supported on capable agents | Subject to platform/tool restrictions | Unavailable |
| Camera capture | Capable agent with camera dependencies | Capable agent with camera dependencies | Check actual native-tool capability | Unavailable |
| Local host display | Website and logs | App and website | App and website | Website |

All features also depend on your [current plan](/subscription), agent configuration and installed dependencies. “Broad endpoint set” does not mean every tool is ready on every installation.

## Linux and Docker

Use Linux/Docker for an always-on local agent and the widest diagnostic workflows. The processor has x64/amd64 and arm64 build paths; check the published image for your host architecture. On Windows/macOS, Docker Desktop runs the Linux container rather than a native app. Container network and device access can differ from the host.

Follow [Linux/Docker installation](/docs/linux). Live Linux BLE capture is not currently implemented; supplying an offline payload for decoding is different from radio scanning.

## Windows and Android apps

**Network Monitor Agent** provides agent setup, monitored-host status/details, the assistant, configuration and a setup guide. **Quantum Secure** shares those functions and adds dedicated single-host checks, local network discovery and logs views. Both need authorisation and a running agent for recurring local checks.

Choose [Windows](/docs/windows) for a desktop agent with suitable tools, or [Android](/docs/android) for a phone/tablet and nearby Bluetooth monitoring. Android background and native-execution restrictions can limit frequency and diagnostics.

## ESP32-S3

A dedicated board can run ICMP, DNS, TCP, HTTP/HTML/HTTPS, quantum handshake/certificate, bounded Nmap and BLE targeted/discovery checks. Its six embedded diagnostic commands cover quantum checks, algorithm information, OpenSSL-style TLS diagnostics and bounded Nmap scanning. They are not full desktop command-line tools.

Use an ESP32-S3 N16R8 target with 16 MB flash, 8 MB octal PSRAM and 2.4 GHz Wi-Fi. Follow the [board guide](/docs/esp32) for setup and updates. It cannot compile custom C# code or run browser automation, Metasploit or camera capture.

## Pick a practical starting point

- Public uptime: [add a website monitor](/docs/getting-started) using an available remote location.
- Private servers and diagnostics: [Linux/Docker](/docs/linux) or [Windows](/docs/windows).
- BLE measurements: [Android](/docs/android), [Windows](/docs/windows) or [ESP32](/docs/esp32), within radio range.
- Predictable unattended monitoring: a powered, stable Linux/Windows host or dedicated board.
- A phone for occasional checks: Android, with its [background limits](/docs/android#background-operation-and-limits) understood.

## A diagnostic is an on-demand task

Use the assistant for a check you want to run now. Use a [monitoring endpoint](/docs/endpoints/) when you want repeated observations and alerts. Choose an agent that can reach the target and has the required tools.

“Using my office agent, run an Nmap TCP scan of the ports I specify on my server and explain the result” provides more useful scope than “scan everything.” Follow the [Acceptable Use Policy](/acceptable-use.html).

## Network and TLS tools

Nmap can discover hosts and inspect ports and services on supported desktop agents. NSE vulnerability checks require the full tool and scripts. On ESP32, Nmap is a bounded TCP scan/discovery implementation: no NSE, UDP scan or OS fingerprinting; service labels are hints rather than active version detection.

OpenSSL helps inspect TLS connections, certificates and configuration. ESP32 provides selected typed TLS diagnostics rather than the complete desktop command line. BusyBox provides supported command-line utilities on capable agents. Inspect returned output and errors before drawing a conclusion.

Primary references: [Nmap reference guide](https://nmap.org/book/man.html), [OpenSSL manuals](https://docs.openssl.org/), [BusyBox documentation](https://busybox.net/downloads/BusyBox.html).

## Guided Metasploit work

The Penetration expert can search modules, explain their options and run a specified module. The Live expert can work through a persistent console session. Use a clear authorised scope and stop when the task is complete.

Linux and Windows require suitable tools and account entitlement; Windows needs a separate Metasploit Framework installation. Android and ESP32 do not execute Metasploit. See [Rapid7’s Framework documentation](https://docs.metasploit.com/) and the [Windows setup guide](/docs/windows/).

## Search, crawl and Space maintenance

Search can retrieve web results, inspect a page, crawl site links or engage with a supported website workflow. Browser-dependent tasks require a capable agent. Crawling and Hugging Face Space wake/keep-alive tasks depend on the remote page and access controls; they do not guarantee that a Space will remain running.

The recurring alternatives are listed in the [endpoint reference](/docs/endpoints/). Read the [Hugging Face Spaces documentation](https://huggingface.co/docs/hub/spaces-overview) for the upstream service behaviour.

## Built-in command reference

These are command processor names for on-demand operations, not the lowercase periodic endpoint names. Available commands follow the selected agent and your account.

| Command | Purpose |
| --- | --- |
| `Ping` | ICMP connectivity check. |
| `Nmap` | Host and port diagnostics. |
| `Openssl` | TLS and certificate diagnostics. |
| `Busybox` | Supported command-line utility tasks. |
| `Meta` | Metasploit module search, information and execution. |
| `MetaLive` | Stateful Metasploit console session. |
| `SearchWeb` | Web search. |
| `SearchEngage` | Supported browser engagement workflow. |
| `CrawlPage` | Inspect a single page. |
| `CrawlSite` | Follow links in a site. |
| `HugSpaceWake` | Attempt a Space wake workflow. |
| `HugSpaceKeepAlive` | Attempt Space activity/keep-alive. |
| `QuantumConnect` | Post-quantum TLS key-exchange check. |
| `QuantumPortScanner` | Look for quantum-capable services. |
| `QuantumInfo` | Algorithm information. |
| `QuantumCert` | Post-quantum certificate inspection. |
| `BleBroadcast` | Capture/decode a selected BLE advertisement. |
| `BleBroadcastListen` | Bounded nearby BLE discovery. |
| `CameraCapture` | RTSP/ONVIF still capture. |

For special workflows, see [quantum readiness](/docs/quantum/), [Bluetooth sensors](/docs/sensors/), [cameras](/docs/cameras/) and [custom commands](/docs/automation/).

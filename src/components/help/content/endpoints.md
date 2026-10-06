## Pick the question you want answered

An endpoint is the type of recurring check your agent performs. Use reachability checks for “Can I reach it?”, content checks for “What did it return?”, and security checks for a specific security property. The status explains the outcome; elapsed time alone does not.

The endpoint menu follows your selected agent and account. Ask the [assistant](/docs/assistant) to show available endpoints for a location if you are unsure. [Custom Connects](/docs/automation) appear where you have deployed them.

## Website and network checks

| Endpoint | Use it for | How to interpret it |
| --- | --- | --- |
| `icmp` | Device reachability using ping | Measures reply duration. Firewalls can block ICMP even when other services work. |
| `http` | Website request completion | Measures a request and body download. A completed 4xx/5xx response can still count as reachable; inspect its status. |
| `https` | Certificate-check request mode | Checks certificate trust/expiry when the request uses TLS. A certificate within seven days of expiry is treated as a failed check. See the address note below. |
| `httphtml` | Website HTML without JavaScript | Fetches HTML; it does not test a rendered web application. |
| `httpfull` | Full page loading including JavaScript | Uses a browser. Requires a capable Linux/Windows agent; unavailable under the Android browser policy and on ESP32. |
| `dns` | Domain resolution | Shows lookup status and duration; the chosen location’s resolver matters. |
| `rawconnect` | TCP service reachability | Connects to a host/port. Use the service’s actual port; successful TCP does not prove application health. |
| `smtp` | Mail-server connection and HELO | Checks the SMTP greeting exchange, not whether a message reaches an inbox. |

> The .NET and ESP32 address-handling paths currently differ for HTTP/HTTPS, including the .NET certificate endpoint’s URL normalisation. Do not use an `https` monitor alone as proof of certificate validation for every input. For a focused certificate investigation, use the [OpenSSL diagnostic workflow](/docs/diagnostics#network-and-tls-tools) and inspect its result.

## Changes and local configuration

| Endpoint | Use it for | Requirements |
| --- | --- | --- |
| `sitehash` | Detect changes to rendered page content | Browser-capable agent. The page is compared with a saved baseline; a reset can establish a new baseline. Dynamic pages may change legitimately. |
| `configintegrity` | Read a local Debian configuration-integrity result | A local administrator must install/configure the checker and publish its status file. The monitor reads that result; it does not itself inspect all system files. |

## Security and quantum checks

| Endpoint | Use it for | Requirements |
| --- | --- | --- |
| `nmap` | Scheduled port/service scan | Full Nmap on capable .NET agents; a bounded TCP/service-hint implementation on ESP32. |
| `nmapvuln` | Scheduled Nmap vulnerability-script scan | Nmap scripts and a capable agent. Not supported on ESP32. |
| `quantum` | Test post-quantum TLS key exchange | Supported cryptographic algorithms on the selected agent. |
| `quantumcert` | Inspect certificate post-quantum properties | Separate from key exchange and ordinary certificate trust. |

Run these only on authorised targets. For an immediate investigation, use [on-demand diagnostics](/docs/diagnostics) rather than adding a recurring monitor. Read [quantum result interpretation](/docs/quantum) before treating a check as an assessment of your whole infrastructure.

## Bluetooth checks

| Endpoint | Use it for | Recorded information |
| --- | --- | --- |
| `blebroadcast` | One device and a selected metric | Device address plus format/metric in Args. The selected reading is displayed in its own unit. |
| `blebroadcastlisten` | Discover nearby advertisements | A bounded capture window and diagnostic list. Its duration is not a sensor reading from a chosen device. |

See [sensor setup](/docs/sensors) and the [metric reference](/docs/ble-metrics). Live capture needs Windows, Android or ESP32 hardware in radio range; Linux does not currently provide live BLE scanning.

## Crawl and Space maintenance

| Endpoint | Use it for | Requirements |
| --- | --- | --- |
| `crawlsite` | Crawl internal site links and generate traffic | Browser-capable Linux/Windows agent; bounded depth/page count. |
| `dailycrawl` | Lower-frequency daily crawling | Browser and daily scheduling. |
| `dailyhugkeepalive` | Daily activity for a Hugging Face Space | Browser workflow; depends on the Space and upstream page behaviour. |
| `hugwake` | Periodic attempt to wake/restart a sleeping Space | Browser workflow and appropriate access. |

These maintenance checks are not a guarantee that an external provider will keep a Space running. View [Hugging Face Spaces guidance](https://huggingface.co/docs/hub/spaces-overview) for provider behaviour.

## Timing and scheduling

Timeout is the execution budget in milliseconds. Longer scan/crawl/discovery jobs have endpoint-specific extended budgets; their displayed duration is converted automatically. **Skip cycles** adjusts host cadence, while some endpoints have daily or other scheduling rules. It is not an exact wall-clock scheduler.

Only genuine timing measurements with a defined rating use latency categories. A quantum scan’s completion time, a configuration outcome and a voltage reading have different meanings. Use [alerts](/docs/alerts) for operational limits, [charts](/docs/charts) for trends and [platform comparison](/docs/platforms) to choose the right agent.

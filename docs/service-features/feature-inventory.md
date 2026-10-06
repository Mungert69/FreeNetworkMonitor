# Ready for Quantum feature inventory

This describes current source capabilities as of 6 October 2026. Availability is
the intersection of implementation, deployed version, agent capabilities, installed
dependencies, configuration and account entitlement. Dynamic endpoints are
additional to the static list. Do not present this as unconditional parity across
all processors or as a list of verified live features.

## 1. Continuous monitoring and host management

- Monitor public websites/services using service-provided agents, or private/local
  targets through a registered local agent. The chosen agent/location determines
  network reachability and where a check runs; it is not just a chart label.
- Add/edit/delete hosts, enable or disable monitoring, choose endpoint and port,
  set timeout, args and credentials where applicable, and control host skip cycles.
- Monitor an address more than once for different endpoints, agents or args, such
  as multiple BLE metrics from one device. Exact duplicate detection includes args.
- Periodic execution, configurable endpoint scheduling/filter strategies, daily
  jobs, saved processor state, batching/publication and acknowledgement of readings.
- Store status/diagnostics alongside measurements, success/failure counts,
  averages, minimum/maximum and historical datasets.
- Resolve measurement metadata from the Connect/decoder catalogue: label/meaning,
  metric identifier, unit, scale, offset and report-analysis guidance. Users select
  the metric; normal BLE setup does not require them to calculate encoding factors.
- Failure is separate from the physical value. Negative current/temperature can
  be valid. Timing ratings only apply to actual duration endpoints with configured
  timing-rating boundaries; scans or physical measurements are not rated as latency.

Evidence: [host orchestration](../../../NetworkMonitorService/Services/MonitorService.cs),
[processor](../../../NetworkMonitorProcessorAgent/Services/MonitorPingProcessor.cs),
[Connect metadata](../../../NetworkMonitorLib/Objects/Connection/EndpointMeasurementDefaults.cs),
[scheduling](../../../NetworkMonitorLib/Objects/Connection/FilterStrategy/ConfigurableEndpointFilterStrategy.cs).

## 2. All built-in periodic endpoints

There are **20** built-in endpoint names in EndPointTypeFactory. The factory owns
registration/display names; Connect implementations determine actual behaviour.
Query `get_available_endpoints` for the chosen agent instead of assuming this
whole list is available everywhere.

| Endpoint | Purpose and interpretation | Dependencies / caveats |
| --- | --- | --- |
| `icmp` | Ping reachability and reply RTT | Host/network must permit ICMP |
| `http` | HTTP request completion/reachability and duration | Inspect response status; a completed 4xx/5xx response can still be reachable |
| `https` | Request/certificate-check mode | Trust/expiry policy, including seven-day expiry warning as failure; see routing caveat below |
| `httphtml` | Download website HTML without executing JavaScript | HTTP body/diagnostics; not a rendered-browser test |
| `httpfull` | Load rendered web content including JavaScript | Browser automation; disabled by Android platform policy |
| `sitehash` | Render/hash website content and compare with saved baseline | Browser automation; baseline/reset semantics matter |
| `configintegrity` | Read local Debian configuration-integrity result | Root-published `/run/config-integrity/result.json`; does not itself run the integrity checker |
| `dns` | Resolve hostname and measure lookup duration | Resolver/network-dependent |
| `smtp` | SMTP connection/HELO response | Correct server/port; not end-to-end email delivery testing |
| `quantum` | Test configured post-quantum TLS key exchange | PQ provider/library and algorithm coverage; outcome is distinct from elapsed time |
| `quantumcert` | Inspect certificate for post-quantum signature/key properties | Distinct from PQ handshake and ordinary certificate trust |
| `rawconnect` | TCP socket connection/reachability | Configured port; not application correctness |
| `blebroadcast` | Capture a specified device advertisement; select a numeric metric | Local BLE scanner and protocol/key; selected metric determines unit |
| `blebroadcastlisten` | Discover/capture nearby advertisements during a bounded window | No specific address required; capped diagnostic list, capture duration rather than one device's sensor value |
| `nmap` | Scheduled service/port scan | Nmap on .NET agents; bounded embedded implementation on ESP32 |
| `nmapvuln` | Scheduled Nmap vulnerability-script scan | Nmap/NSE; unsupported on ESP32 |
| `crawlsite` | Crawl internal website links / generate traffic | Browser automation; configured limits |
| `dailycrawl` | Daily lower-frequency crawl | Scheduling plus browser automation |
| `dailyhugkeepalive` | Daily Hugging Face Space activity/keep-alive workflow | Browser automation and upstream page behaviour |
| `hugwake` | Periodic attempt to wake/restart a sleeping Hugging Face Space | Browser automation and upstream page/access behaviour |

Standard durations are displayed in ms. Extended jobs use fixed encoding scales:
Nmap/NmapVuln and BLE discovery use 10 ms per encoded sample; crawl/Space
maintenance use 20 ms. This is internal storage metadata, not a setting users
normally supply. A measurement's duration does not prove its security/content
outcome; read its status.

Known source behaviour to document carefully: the .NET address-normalisation
path and ESP32 URL routing differ for schemeless HTTP/HTTPS targets. The existing
parity audit records this; avoid promising identical certificate checking for
every input until the integrated route is reconciled. Explicit HTTP URLs help
comparison, but do not alone fix the .NET `https` normalisation path.

Evidence: [factory](../../../NetworkMonitorLib/Objects/Factory/EndPointTypeFactory.cs),
[HTTP clients](../../../NetworkMonitorLib/Objects/Connection/ConnectFactory.cs),
[HTTP Connect](../../../NetworkMonitorLib/Objects/Connection/HTTPConnect.cs),
[ESP32 endpoint parity](../../../NetworkMonitorProcessorAgentESP32/docs/endpoint-parity-audit.md).

## 3. BLE and physical measurements

The service uses **passive advertisement decoding**, not BLE pairing/GATT device
control. A device must broadcast the supported protocol and be in radio range.
Address identifies the target, args choose format/metric, and Password supplies
the protocol key when needed. BTHome is a protocol used by multiple manufacturers,
not a manufacturer itself. “Shelly compatible” means a device using the supported
BTHome v2 data, not every Shelly product.

| Protocol | Implemented support | Typical readings / key |
| --- | --- | --- |
| Victron Instant Readout | 13 record layouts selected by advertisement record type | Voltage/current/power/energy, battery state/cells/temperature, device/error fields; 16-byte advertisement AES key |
| Ruuvi RAWv2, format 5 | RuuviTag manufacturer-data layout | Temperature, humidity, pressure, XYZ acceleration, battery voltage, TX power, movement counter, measurement sequence; unencrypted, no key |
| BTHome v2 | Supported object IDs, repeated objects, state/event/counter measurements; encrypted or plain broadcasts | Temperature, humidity, battery, pressure, illuminance, voltage/current/power/energy, motion/opening/etc. and button/dimmer events; 16-byte AES key only for encrypted packets |
| Generic raw/AES-GCM/AES-CTR | Payload selection and optional decryption | Useful for capture/custom protocol diagnostics; automatic numeric metrics are not provided for arbitrary encrypted text |

Victron records: solar charger; battery monitor; inverter; DC/DC converter;
SmartLithium; Inverter RS; AC charger; Smart Battery Protect; Lynx Smart BMS;
Multi RS; VE.Bus; DC energy meter; Orion XS. Support is at the record level, not a promise that
every model/firmware exposes every field. Unsupported records/NA fields must
remain unavailable rather than producing a plausible reading.

Examples for a compatible scanner:

```text
Endpoint: blebroadcast
Address: the device BLE address
Password: its advertisement encryption key (when required)
Args: --format victron --metric battery_voltage
```

For another monitor on the same device use `--metric battery_current`; a plain
BTHome temperature broadcaster uses `--format bthome --metric temperature` and
an empty password. The record header chooses the Victron device decoder; users
do not have to select the solar/inverter class. Examples are configuration
templates, not verified physical captures during this audit.

The published v2 encoding snapshot contains **135 metric definitions**: 52 Victron,
10 Ruuvi and 73 BTHome. The [full metric appendix](ble-metrics.md) lists exact names
and units. Repeated-object selectors inherit catalogue semantics. The available
fields depend on the actual record/object payload; the catalogue count is not a
number of supported device models. Scales may involve quantisation when mapping
large physical ranges into the stored sample range.

Sources/specification links and reproduction procedures are maintained in
[.NET BLE reproduction guide](../../../NetworkMonitorLib/Objects/Connection/Ble/REPRODUCING.md)
and [ESP32 BLE guide](../../../NetworkMonitorProcessorAgentESP32/docs/ble-decoders.md).
These include key handling and tests. Direct specification references:

- [Victron Extra Manufacturer Data specification](https://communityarchive.victronenergy.com/storage/attachments/extra-manufacturer-data-2022-12-14.pdf)
- [Victron Orion XS layout discussion](https://community.victronenergy.com/t/orion-xs-12v-12v-50a-bluetooth-advertising-data/2183)
- [Ruuvi RAWv2 specification](https://docs.ruuvi.com/communication/bluetooth-advertisements/data-format-5-rawv2)
- [BTHome format](https://bthome.io/format/) and [encryption](https://bthome.io/encryption/)

These links are carried forward from the decoder reproduction guide; their
contents were not re-audited for protocol changes in this presentation audit.

## 4. Alerts and anomaly detection

- Availability/check-failure alerts use processor state and configured failure
  thresholds. Timeout is an execution budget, not a voltage/current limit.
- Optional low/high host limits are entered in **actual units**. Unset limits are
  disabled; low must be less than high when both are set. Successful readings
  strictly below/above the configured limits create a MeasurementBreach including
  direction, observed value, limit, unit and timestamp. Equality is not a breach.
- Failed/missing readings do not become physical-limit violations. The breach
  latch is independent of reachability; a host can respond successfully while
  its voltage is out of range.
- Alerts are sent once until reset, using the existing alert state. Dashboard and
  assistant provide reset operations. Config changes/reset handling must follow
  current processor policy; no new automatic-recovery incident lifecycle is implied.
- Email requires the appropriate verification/preferences. Users can toggle
  notifications and reset monitor/predictive alerts separately.
- The frontend also exposes monitor-model configuration controls for confidence,
  pretraining windows and change/spike detector parameters. These need an advanced
  guide separate from ordinary host low/high limits.
- ML anomaly detection is a separate pipeline. NetworkMonitorML supports
  MicrosoftMLTS and TimesFM-related processing, including a hybrid fast screen
  followed by forecast verification. Windows, warm-up, confidence/thresholds and
  dependencies are configured; “AI learns” does not describe all alert paths.
- The current ML pipeline still consumes latency-oriented/encoded readings.
  Physical-metric parity and calibration need a separate audit before advertising
  universal sensor anomaly detection or prediction of future outages.
- No first-class user-configurable alert webhook delivery was identified; custom
  code/API-based integrations are separate from the built-in email flow.

Evidence: [threshold evaluator](../../../NetworkMonitorLib/Objects/MeasurementBreach.cs),
[processor latch](../../../NetworkMonitorProcessorAgent/Services/MonitorPingCollection.cs),
[alert dispatch](../../../NetworkMonitorAlert/Services/AlertProcessor.cs),
[model configuration UI](../../src/components/dashboard/EditMonitorModelConfigDialog.jsx),
[ML pipeline](../../../NetworkMonitorML/README.md),
[ML data retrieval](../../../NetworkMonitorML/Services/MonitorMLDataRepo.cs).

## 5. Dashboard, historical data and reports

- Responsive view/edit tables with search, filtering, sorting, column selection,
  persisted options, long-text hovers and a detailed edit dialog.
- Status, failure/loss counts, measurements with actual units, current limits,
  endpoint/args configuration and monitor location.
- Charts with dataset navigation; last hour, 24 hours, 7 days, 30 days and custom
  ranges. Custom ranges are at most 90 days; timestamps are shown in local time
  and requests use explicit UTC instants.
- Exact range statistics use all available successful readings, even when the
  chart is reduced to representative points. Failures are counted separately.
- Range mode uses 160 buckets, up to six retained samples per bucket: first,
  last, minimum, maximum, first failure and last failure. Maximum 960 plotted
  points; this preserves extrema/failure indications, not every outage or breach.
- Failed observations are red downward arrows below the horizontal axis. Low/high
  violations use coloured/outlined measurement points and reference lines.
  These show violations of **current** configured limits, not recorded historic
  alert-trigger events. Changing limits changes the historical colouring.
- Expandable details above the chart and a full-screen chart dialog; selected
  view is preserved while background updates indicate “New data available”.
- Archived/unavailable range coverage is explicitly noted; summaries exclude
  missing archive samples. Do not claim the range chart restores all archives.
- Scheduled emailed HTML reports contain host summaries and graphs. Optional LLM
  analysis receives actual measurements, units, description/kind/guidance and
  configured limits; timing ratings only where applicable. Reports do not need
  to treat negative values as timeouts or compare amps with milliseconds.
- Profile-generated downloadable archives and host/report JSON paths exist.
  Host/report measurement JSON uses PhysicalMeasurementResponse with actual values,
  units, timestamps/statuses and null failures; it must not be scaled again.
  The full profile archive is different: CreateAndTarPingInfoFilesForUser queries
  EF MonitorPingInfo/PingInfos and serializes them directly, without catalogue
  decoration or physical conversion. Its samples remain encoded and NotMapped
  metadata can retain defaults. Do not promise that archive as actual-unit data;
  resolve this contract before writing an actual-value archive integration guide.
  Legacy/API encoded DTOs also require their metadata.

Evidence: [host table](../../src/components/dashboard/HostList.jsx),
[edit dialog](../../src/components/dashboard/EditHostDialog.jsx),
[chart](../../src/components/dashboard/Chart.jsx),
[time controls](../../src/components/dashboard/ChartTimeRange.jsx),
[range reader](../../../NetworkMonitorData/Data/ChartRangeReader.cs),
[reports](../../../NetworkMonitorData/Services/ReportService.cs),
[archive export](../../../NetworkMonitorData/Services/DataFileService.cs),
[physical DTO](../../../NetworkMonitorLib/Objects/DTOs/PhysicalMeasurementResponse.cs).

## 6. AI assistant and expert catalogue

The assistant can invoke real functions; advice and function results need to be
distinguished. It discovers agents/endpoints, respects account/agent restrictions,
streams replies and delegates to specialised experts. A prompt alone does not
guarantee that an operation was executed; documentation should show tool outcomes.

| Expert / function family | Implemented abilities | Important distinction |
| --- | --- | --- |
| Monitor | Add/edit hosts; list hosts; retrieve host data; discover endpoints; reset alerts | Uses real host IDs, selected agent, args and actual-unit limits |
| Security | Run Nmap and OpenSSL diagnostics; retrieve security knowledge | On-demand diagnostics, separate from periodic endpoints |
| Penetration | Find Metasploit modules; inspect module information; run a module | Requires permitted scope, entitlement and agent dependency |
| Live penetration | Interact with a persistent msfconsole workflow | Stateful console workflow differs from one-shot module execution |
| Quantum | Test PQ handshake/certificate, scan ports, get algorithm information | Key exchange and certificate properties are distinct; algorithm metadata is not runtime support |
| Search | Web search and page crawl; extract information | Browser/network/provider dependencies |
| Command Processor | List/help/source/run/add/update/delete custom processor modules | One-off executable workflow on a capable .NET agent |
| Connect | List/source/add/update/delete custom periodic Connects | Scheduled monitoring, publishes measurement/status metadata; different contract from a command processor |
| AgentFlow | Add/get/list/delete/run named flow definitions | Multi-step backend-orchestrated workflow, runtime inputs, branching/delegation and timeouts; not C# firmware upload |
| Camera | Capture a still from RTSP/ONVIF and send it with an analysis instruction | Snapshot analysis, not a promised continuous video surveillance product |
| Memory | Semantic conversation recall and neighbouring/archive turns | Depends on stored histories/search service and isolation rules |
| Report analysis | Interpret physical host data using catalogue guidance and limits | Optional report-processing configuration |
| User/common tools | Account information, available agents, status/cancel operations and BusyBox commands | Not all tools are entitled on every plan/platform |
| Knowledge retrieval | FAQ, MITRE, security books, quantum books, indexed documents/blogs | Retrieval supports grounded responses; source freshness/coverage matters |

Runners include TurboLLM (OpenAI-compatible route), HugLLM (HF/OpenRouter-compatible
route) and local/TestLLM via llama.cpp/GGUF. Provider/model names are configuration,
not permanent product guarantees. Session history, resume/delete controls, streamed
responses, stopping/cancelling work, token/context limits, voice input/transcription
and optional spoken responses are implemented across the web/Razor clients.

Turbo/Hug histories use Redis; TestLLM local context uses its Space/server storage
and must resume on the same server. Static context caching is separate from saved
conversation context. Agent location is provided to the primary assistant;
delegated experts need the chosen location in their request. This merits a short
“Where will the assistant run this?” explanation.

Tool definitions are the authoritative list, not example chat prose:
[tool builders](../../../NetworkMonitorLLM/Services/ToolsBuilders/Tools),
[builder factory](../../../NetworkMonitorLLM/Services/ToolsBuilders/ToolsBuilderFactory.cs),
[runner/history documentation](../../../NetworkMonitorLLM/README.md),
[AgentFlow graph](../../../NetworkMonitorData/Services/Agents/AgentGraphFactory.cs),
[account permissions](../../../NetworkMonitorLib/Objects/Factory/AccountTypeFactory.cs).

## 7. Agent command processors and extension design

The shared provider registers **19** built-in types:

`Nmap`, `Meta`, `MetaLive`, `Openssl`, `Busybox`, `SearchWeb`, `SearchEngage`,
`CrawlPage`, `CrawlSite`, `HugSpaceWake`, `HugSpaceKeepAlive`, `Ping`,
`QuantumConnect`, `QuantumPortScanner`, `QuantumInfo`, `QuantumCert`,
`BleBroadcast`, `BleBroadcastListen`, `CameraCapture`.

Cmd names/type names and periodic endpoint names are different namespaces; a
manual must use the correct one. Custom command processors and Connects can be
compiled/loaded on .NET agents, inspected and removed through the supported
management paths. Connect metadata declares physical meaning/encoding and fixed
status labels. This provides extensibility beyond the built-ins, not automatic
compatibility with every external tool or arbitrary device.

Evidence: [registered commands](../../../NetworkMonitorLib/Objects/Connection/CommandProcessors/CmdProcessorProvider.cs),
[Connect provider](../../../NetworkMonitorLib/Objects/Connection/Connects/ConnectProvider.cs),
[Connect expert contract](../../../NetworkMonitorLLM/Services/ToolsBuilders/Experts/ConnectExpertToolsBuilder.cs).

## 8. Platforms and agents

| Platform/product | Supported form | Capability boundaries |
| --- | --- | --- |
| Browser frontend | Responsive React dashboard/assistant, light/dark/system appearance | Uses backend services; browser alone is not the local network probe |
| Network Monitor Agent | MAUI Android and Windows app shells, embedded .NET processor, host info and chat | Authorise account, enable agent, assign location/hosts; native tooling varies by platform |
| Quantum Secure | MAUI Android and Windows app shells with single-host checks, local network discovery UI, logs, shared processor/host display/chat | Same shared measurement pipeline; exact app-specific bundled tools need release testing, not inference from the app name |
| Linux .NET agent / Docker | Linux-amd64 and Linux-arm64 project/RID paths; Linux container on supported Docker hosts | Build/release availability must be confirmed for each architecture; native tools/PQ providers required. No implemented live Linux BLE scan |
| Docker Desktop on Windows/macOS | Runs the Linux container | This is not a native macOS MAUI app; container network/device access differs from host access |
| ESP32-S3 | ESP-IDF C firmware; target N16R8 (16 MB flash / 8 MB octal PSRAM), 2.4 GHz Wi-Fi | 11 endpoints and six bounded embedded commands; no dynamic C# Connects/processors, browser automation, Metasploit or camera capture |
| Linux C/MQTT agent | Separate experimental MQTT transport implementation | Treat as experimental/developer-facing until packaged/release/platform evidence is established |
| Blazor/Razor clients | Alternate chat client and reusable components used by app/web projects | Shared streaming/history/audio functions; not proof all React dashboard controls exist in every client |

Android browser-automation endpoint restrictions: `httpfull`, `sitehash`,
`crawlsite`, `dailycrawl`, `dailyhugkeepalive`, `hugwake`; corresponding browser
commands are disabled too. Android battery/background execution and native tool
restrictions need current-device testing. Live BLE implementations exist for
Android/Windows builds, subject to hardware/permissions; ESP32 has its own scanner.

ESP32 supported endpoints: `icmp`, `dns`, `rawconnect`, `http`, `httphtml`,
`https`, `quantum`, `quantumcert`, `nmap`, `blebroadcast`, `blebroadcastlisten`.
Embedded commands: `QuantumCert`, `QuantumConnect`, `QuantumPortScanner`,
`QuantumInfo`, `Openssl`, `Nmap`. They provide typed embedded diagnostics, not
full desktop OpenSSL/Nmap equivalence: bounded port/algorithm sets, no NSE/UDP/OS
fingerprinting, and service-name hints rather than active Nmap version detection.

ESP32 onboarding uses the Live factory firmware, USB Wi-Fi setup and OAuth device
authorization. Enrolled boards update through Profile → Device firmware, with
image selection/status, signed update policy and rollback/recovery handling.
Processor management lists registered processors and supports ownership-checked
deletion. Factory flashing and updating an enrolled board are different procedures.

Evidence: [apps/shared library](../../../NetworkMonitorMaui/README.md),
[processor platforms](../../../NetworkMonitorProcessorAgent/README.md),
[Android policy](../../../NetworkMonitorLib/Objects/Factory/EndPointTypeFactory.cs),
[BLE Linux boundary](../../../NetworkMonitorLib/Objects/Connection/CommandProcessors/BleBroadcastCmdProcessor.cs),
[ESP32 setup](../../../NetworkMonitorProcessorAgentESP32/docs/first-physical-board.md),
[firmware controls](../../../NetworkMonitorService/Controllers/FirmwareController.cs),
[embedded commands](../../../NetworkMonitorProcessorAgentESP32/docs/command-processor-port-notes.md).

## 9. APIs, integrations and accounts

- NetworkMonitorService exposes the authenticated host-management/history/chart,
  diagnostic, agent, account, report and LLM-streaming surfaces used by clients.
  OpenAPI/Swagger and GPT-facing operations support programmatic workflows.
- Its `/mcp` surface discovers GPT API operations, uses an OAuth/scope policy and
  marks operation safety; mutating/external operations require explicit confirmation
  in that MCP contract. Optional v1 exposure is configuration-dependent.
- NetworkMonitorApi is a separate one-off connectivity/diagnostic API: service
  health, Quantum, SMTP, HTTP/HTML/HTTPS/full, SiteHash, DNS, ICMP, Nmap/Vuln,
  RawConnect, CrawlSite/daily crawl and daily Space keep-alive. Its MCP surface
  mirrors these checks and requires the RapidAPI-secret argument. It is not the
  same OAuth host-history/management surface as Service.
- Clients must distinguish encoded API samples plus metadata from actual-value
  DTOs/exports and one-off actual response times. Document null/failure semantics
  and units in examples; never apply scale twice.
- OAuth/device authorization, account/profile settings, email verification and
  notification preferences, passkey registration/list/delete controls, data export,
  plan limits and Stripe-based subscriptions are implemented.
- Current plan catalogue: Free 10 hosts / 250k max tokens / 25k daily; Standard 50 /
  500k / 100k; Professional 300 / 2500k / 500k; Enterprise 500 / 7500k / 1000k.
  Context limits are 24k/32k/48k/64k respectively. These are snapshot figures;
  published docs should use the maintained catalogue/live plan API, not copy them
  into multiple independently maintained pages. Retention/price promises also
  need the actual plan/deployment policy.
- TLS transports, ML-DSA control-message verification, separate backend/LLM HMAC
  trust domains, processor command-signing policy and AuthKey verification are
  implemented. ESP32 also has a bounded signed firmware/command path. These
  mechanisms do not mean every monitored remote server is quantum-safe.

Evidence: [Service controllers](../../../NetworkMonitorService/Controllers),
[Service MCP](../../../NetworkMonitorService/Mcp),
[standalone API](../../../NetworkMonitorApi/Controllers/ChatController.cs),
[standalone MCP](../../../NetworkMonitorApi/Mcp/NetworkMonitorMcpTools.cs),
[plans](../../../NetworkMonitorLib/Objects/PriceObjs.cs),
[signing policy](../../../NetworkMonitorLib/PROCESSOR-COMMAND-SIGNING.md).

## 10. Whole-suite component map

This separates user-facing functions from infrastructure/operator tools. Every
matching root checkout was considered; the ESP32 `-copy` folder is a duplicate,
not another product/platform to advertise.

| Repository | Role / implemented capability | Documentation audience |
| --- | --- | --- |
| FreeNetworkMonitor | Public pages, React dashboard, charts, account/agent controls and assistant | Users |
| FreeNetworkMonitorBlog | Static blog, categories/search, articles, policies/theme integration | Users/editorial |
| NetworkMonitorService | HTTP/streaming orchestration, host/account/agent management, MCP | Users/integrators/operators |
| NetworkMonitorData | EF/MariaDB storage, ingestion/aggregation, measurement catalogue, reports, archives, AgentFlow execution | Integrators/operators |
| NetworkMonitorAlert | Consume processor/ML alert state; notification/reset/email/report delivery | Users/operators |
| NetworkMonitorML | Configured time-series anomaly pipeline and predictive alert state | Users/operators; physical metrics require follow-up |
| NetworkMonitorScheduler | Timed jobs for reports, ML, housekeeping and other service work | Operators |
| NetworkMonitorProcessorAgent | .NET periodic probes and one-off command execution, state/broker integration | Agent users/developers |
| NetworkMonitorLib | Models, Connects, decoders, command processors, factories, metadata and security contracts | Developers |
| NetworkMonitorMaui | Shared native UI, view models, processor hosting and actual-unit display | App developers |
| NetworkMonitorAgent | Network Monitor MAUI application | Users |
| QuantumSecure | Quantum-focused MAUI application using shared runtime/UI | Users |
| NetworkMonitorProcessorAgentESP32 | Embedded monitoring/diagnostics, BLE, enrolment, state/MQTT, OTA | Device users/developers |
| NetworkMonitorProcessorAgentESP32-copy | Duplicate checkout | Exclude from product catalogue |
| NetworkMonitorProcessorAgentMQTT | Experimental Linux C/MQTT transport agent | Developers/operators |
| NetworkMonitorLLM | Expert/tool orchestration, API/local runners, history, retrieval and response streaming | Users/operators/developers |
| NetworkMonitorSearch | Embeddings, vector/hybrid OpenSearch retrieval, document/MITRE/book/blog indexes, conversation-memory retrieval and snapshots | Operators/developers |
| NetworkMonitorDataInjest | PDF/document extraction manifests, semantic splitting/classification/summaries and ingest export pipeline | Operators/developers |
| NetworkMonitorKokoro | Speech synthesis/transcription: Kokoro/Piper-compatible ONNX, CTC/Whisper paths | Users via chat; operators configure models |
| NetworkMonitorCacheHttp | Authenticated static prompt-cache file support | Operators |
| NetworkMonitorApi | Separate one-off check API and secret-authenticated MCP tools | Integrators |
| NetworkMonitorPayment | Stripe endpoints/webhooks and subscription/entitlement updates | Users/operators |
| NetworkMonitorBlazor | Alternate Blazor chat interface | Users/developers |
| NetworkMonitorChatRazorLib | Reusable streaming/history/audio chat components | Developers |
| NetworkMonitorAdmin | Operator CLI/administrative utilities, resets/import/state operations | Operators only |
| NetworkMonitorBackup | Contabo instance/snapshot management CLI | Operators; not a user monitoring-data backup UI |
| NetworkMonitor | Build/deployment compose, provider toolchains, environment/release helpers and evaluation harnesses | Operators/developers |

Operator features worth retaining in developer docs include provider installation,
source-generation serializers, migrations, message protection, broker routes,
state/backlog limits, health/readiness, monitoring retention/purge, release profiles,
firmware artefacts and recovery. They should not dominate user-facing product pages.

# Presentation and accuracy audit

## Overall finding

The public presentation emphasises AI security scanning and quantum readiness.
It underexplains the underlying continuous monitoring product, physical sensor
measurements, alert controls, supported agents and integrations. A new visitor
cannot easily answer: “What can I monitor, where can it run, which agent do I
need, and how do I interpret the result?”

The site has strong starting points: a working interactive landing page, clear
visual styling, responsive pages, FAQ search, installation procedures, visual
guides, plan cards and a substantial blog. The gap is a structured, maintained
reference connecting these pieces to actual capabilities.

## Public page review

| Surface | What works | What needs improvement |
| --- | --- | --- |
| Landing `/` | Security/quantum examples, AI entry points, performance/alert cards, agent selector, custom-code tools, useful articles | No complete feature index or endpoint/platform matrix. Continuous monitoring and physical sensors get little explanation. Generic marketing headings repeat. Clickable explanations launch chat rather than opening stable documentation. Long technical articles and action forms compete with the product overview. |
| FAQ `/faq` | Search, expandable answers, two visual guides, practical account/agent questions | 67 answer entries with two repeated questions; largely one flat list without topics or stable question links. Many assistant transcripts are illustrative rather than operational instructions. Important new features are absent and several older answers conflict with current code. |
| Download `/download` | Android/Windows links, Docker instructions, OAuth setup, ESP32 first-install and OTA distinction | A very long page mixes marketing, platform choice, installation and AI usage. “You've been selected” / exclusive beta wording does not tell ordinary visitors whether they can start. Agent names need comparison. No architecture/capability matrix. ESP32 support description is stale. |
| Subscription `/subscription` | Fetches plans from the backend catalogue; clear side-by-side host/token/retention information | FAQ contains older fallback literals, but its runtime builders replace plan answers with catalogue data. Capability documentation must distinguish plan entitlement from agent support. Marketing labels such as “predictive AI” need a link explaining what is actually detected and prerequisites. |
| Blog `/blog` | 191 posts under `content/posts`, educational and practical examples | Discovery by article/date is unsuitable as the authoritative product manual. No whole-word BLE/Victron/Ruuvi/BTHome, MCP, AgentFlow or passkey matches in the audited post collection. Two camera-related mentions do not form a camera setup reference. |
| Security/legal pages | Dedicated acceptable-use and security pages; visible links | Broad assurances in FAQ exceed what code inspection establishes. Security feature documentation needs to describe mechanisms and boundaries, linking to the policy pages rather than claiming certification. |
| Logged-in dashboard | Source contains extensive table, chart, profile, processor and firmware controls | Public docs do not explain most controls. Needs task guides and annotated examples, not just the existing add-host/chart videos. Live authenticated presentation was outside this audit. |

Sources: [React routes](../../src/app.jsx), [landing](../../src/components/main/ProductDetail.jsx),
[FAQ](../../src/components/main/Faq.jsx), [download](../../src/components/main/Download.jsx),
[pricing](../../src/components/main/PricingContent.jsx), [navigation](../../src/components/dashboard/MainListItems.jsx),
[blog posts](../../../FreeNetworkMonitorBlog/content/posts),
[security page](../../public/security-compliance.html).

## Desktop/mobile observations

- All four audited public routes rendered at both sizes; the captured document
  widths matched the viewport, without overall horizontal overflow.
- Desktop landing cards are readable, but the opening promise is mostly security
  marketing; there is no concise explanation of the broader monitoring workflow.
- On mobile the collapsed navigation hides labels, so visitors have to discover
  the menu before finding installation/help. Add visible “Features” and “Get
  started” links in the main content, not only drawer entries.
- The initial cookie notice occupies a substantial part of the mobile viewport.
  After dismissal, pages are usable, but visitors still face long scrolling before
  detailed installation/reference content. Compact the introduction and add a
  contents navigation with section links.
- FAQ search is useful, but search terms alone cannot teach someone which features
  exist. Add topic groups and prominent links to the manual.
- Installation commands and platform caveats need short platform-specific pages
  with prerequisite checklists, rather than being buried in the single download page.
- In the captured mobile tools state, the floating chat launcher overlays a portion
  of a tool card. Reserve space for it so descriptions/actions remain easy to read.
- The live-tool area should explain its target, required agent and resulting output
  before a user opens chat. It must remain separate from the documentation links.

See [screenshots](screenshots/) and [browser observations](browser-observations.json).

## Accuracy corrections to make before expanding the docs

| Priority | Current statement/location | Finding and proposed correction |
| --- | --- | --- |
| P0 | Download: ESP32 does not support command processors | Current firmware implements QuantumConnect, QuantumCert, QuantumPortScanner, QuantumInfo, Openssl and Nmap. Document the bounded embedded implementations and verify the released image contains them. Its endpoint list also includes httphtml, quantum, quantumcert and nmap. |
| P0 | Landing and HTML fallback: no configuration needed / AI learns normal behaviour to give only relevant alerts | Host setup, agent selection, email verification and optional limits are real configuration. Anomaly detection is a separate configured ML pipeline, not the definition of every alert. Describe conventional failure alerts, optional measurement limits and optional anomaly detection separately. |
| P0 | FAQ: five consecutive failed checks is the alert rule | Alert dispatch uses a configured threshold and processor-supplied state; it also handles latched MeasurementBreach records. Do not hardcode five as a universal rule. Explain low/high limits in actual measurement units and the existing reset behaviour. |
| P0 | FAQ/free-plan token and host figures | Correction after inspecting the FAQ builders: older literals differ from the catalogue, but the live answers are dynamically replaced. Avoid maintaining fallback plan figures; use the catalogue or link to Subscription. This audit did not establish that the old figures were displayed to users. |
| P1 | FAQ Windows Agent link | FAQ uses Microsoft Store ID `9PFJ3203JWDT`, while Download uses `9P58PM1PM9TZ`. Resolve with the owner and use one maintained download-link source; this audit does not establish which listing is current. |
| P1 | FAQ says quantum readiness ensures infrastructure is ready | A successful check demonstrates the tested TLS handshake/certificate property, for that endpoint, agent and algorithm set. It does not certify the whole infrastructure, every port, or all cryptographic dependencies. Distinguish PQ key exchange from PQ certificate signatures. |
| P1 | FAQ synthetic scan examples say “No vulnerabilities were found” | Label examples illustrative and include actual result interpretation. An open-port scan or clean module result does not establish absence of vulnerabilities. Show status, diagnostics and scope. |
| P1 | Download “full functionality ... without platform-specific limitations” | Linux Docker cannot perform live BLE capture in current .NET code: its Linux scan method throws a BlueZ/D-Bus integration exception. Linux supports offline decoder input. Windows needs tools installed/configured, Android has native-execution and browser restrictions, ESP32 has explicit subsets. Replace the general claim with a capability matrix. |
| P1 | FAQ all communication TLS 1.3; credentials never plaintext; no cloning possible | These universal assurances are not established by repository inspection. Describe OAuth/device identity, AuthKey checks, signed control messages, TLS configuration and separate trust domains precisely. Avoid claims that possession of a copied secret can never impersonate a device. |
| P1 | FAQ custom code cannot access other users' data | API ownership checks and agent selection exist, but generated C# code runs on the selected agent. Do not advertise an unverified sandbox guarantee. Explain code review, deployment scope and runtime permissions. |
| P1 | Profile full archive vs host/report JSON download | Host/report JSON converts to physical units. Profile archive directly serializes EF MonitorPingInfo/PingInfos without the catalogue/physical DTO. These are different contracts; NotMapped unit/scale/offset may be defaults in the archive. Document separately and review archive conversion/metadata before promising actual-unit bulk export. |
| P1 | FAQ Enterprise “continuous data export” | Archive/export capability and retention policy are documented in code; an automatic continuous-export product is not established by this audit. Separate downloadable exports from recurring export integrations and verify any plan promise. |
| P1 | FAQ GDPR compliance/anonymized data | Code stores identifiable users, host addresses, chat history and measurements. Blanket anonymisation/certification claims need policy/legal evidence. Link to the actual privacy/security documents and explain logged LLM interactions and provider processing. |
| P1 | FAQ/README generic integrations or webhooks | APIs permit custom integrations; no maintained Grafana/Zapier connector or configurable first-class alert webhook sender was found in the inspected paths. Label these custom integrations, not shipped connectors. A custom processor sending HTTP is a different capability. |
| P2 | FAQ charts/history/datasets | Explain dataset selection versus exact date range, local/UTC conversion, 90-day query maximum, archived data exclusions, up to 960 representative range points and exact available-data summaries. Violations use current limits, not historic alert-event markers. |
| P2 | FAQ agent offline means all missed checks arrive later | A disconnected but running agent can buffer observations; a powered-off agent cannot take checks. Buffers/storage are bounded and ESP32 can pause probes under backlog pressure. Explain this distinction. |

Evidence for these findings:
[ESP32 endpoints](../../../NetworkMonitorProcessorAgentESP32/firmware/main/endpoints.c),
[ESP32 command catalogue](../../../NetworkMonitorProcessorAgentESP32/firmware/main/cmd_processor_catalog.c),
[embedded compatibility](../../../NetworkMonitorProcessorAgentESP32/docs/command-processor-port-notes.md),
[Linux BLE implementation](../../../NetworkMonitorLib/Objects/Connection/CommandProcessors/BleBroadcastCmdProcessor.cs),
[alert dispatch](../../../NetworkMonitorAlert/Services/AlertProcessor.cs),
[limit semantics](../../../NetworkMonitorLib/Objects/MeasurementBreach.cs),
[plan catalogue](../../../NetworkMonitorLib/Objects/PriceObjs.cs),
[chart reader](../../../NetworkMonitorData/Data/ChartRangeReader.cs),
[archive implementation](../../../NetworkMonitorData/Services/DataFileService.cs),
[message protection policy](../../../NetworkMonitorLib/Objects/Repository/README.md).

## Information depth by feature family

“Partial” means a visitor can discover the feature but cannot confidently configure
or interpret it using the public pages alone. This is an editorial assessment,
not a runtime test result.

| Family | Public coverage | Missing reference content |
| --- | --- | --- |
| Basic uptime monitoring | Partial | Endpoint meanings, HTTP reachability vs HTTP status, default ports, timeout/cadence, locations, credentials and args |
| Physical/BLE monitoring | Very little | Supported protocols/devices, keys, radio range, metric selection, automatic units, negative values, multiple monitors per address |
| Alerts | Partial and outdated | Failure vs physical-limit vs anomaly alerts; reset, disabled limits, email verification, chart violation semantics |
| Charts/history/export | Partial | Exact ranges, sampling, full-data summaries, archived coverage, current-data refresh, actual-value export contracts |
| AI assistant | Partial | Expert catalogue, runners, real available-agent discovery, quotas, stop/cancel, history, voice, execution vs advice |
| Quantum diagnostics | Partial | Handshake vs certificate, supported algorithms, statuses, scope and platform-specific limits |
| On-demand security tools | Partial | Nmap/OpenSSL/Metasploit inputs/results, dependencies, platform limits and permission scope |
| Custom extensions/AgentFlows | Cmd processors mentioned; remainder thin/absent | Periodic Connect vs one-off processor vs multi-step AgentFlow; deployment/update/list/source inspection |
| Camera analysis | Little | RTSP/ONVIF, credentials, capture dependencies, image analysis and availability |
| API/MCP | Very little | Two API surfaces, auth methods, schemas, physical vs encoded values, MCP setup and entitlement |
| Agent/device management | Partial | App differences, architecture support, onboarding, location naming, ownership/deletion, ESP32 OTA/recovery |
| Account/platform operations | Partial | Passkeys, notification preferences, retention/exports, billing, operator-only vs user-facing features |

## Recommended first change

Create a public Features/Documentation hub and a complete endpoint/platform
reference. Keep landing-page summaries short, move task detail into linked guides,
and keep FAQ for troubleshooting. This makes the product understandable without
requiring a user to ask the assistant to discover what the assistant can do.

## Developer documentation drift

Repository READMEs are useful evidence, but several still describe .NET 9 while
current projects target .NET 10. NetworkMonitorApi README contains unresolved merge
marker text, and the older ops architecture overview foregrounds Blazor rather than
the current React site. The ESP32 README is also behind its code. Review these
entry points alongside the new manual; do not generate public claims by copying
README prose without checking the implementation.

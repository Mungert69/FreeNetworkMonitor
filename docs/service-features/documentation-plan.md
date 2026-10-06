# Recommended documentation structure

## Navigation and page responsibilities

Add **Features** and **Docs** to the public navigation. The existing landing,
download, FAQ and blog remain useful, with clearer jobs:

- Landing: a short product overview, outcomes and examples; three primary paths
  (“Monitor a service”, “Use the AI assistant”, “Install a local agent”). Live tools
  form a clearly labelled demo section with prerequisites and links to the guides.
- Features: browsable capability groups, endpoint/platform overview and links to
  detail. Include physical sensors/BLE as a first-class capability beside uptime,
  diagnostics, quantum checks, AI automation and historical data.
- Docs: stable task guides and reference material with search, table of contents,
  direct headings/URLs and screenshots. Explain prerequisites before action steps.
- Download: choose an agent/platform and go to its install guide; maintain download
  links centrally. Avoid repeating the entire service's marketing/manual content.
- FAQ: grouped troubleshooting, short answers and links to exact guide sections.
  Deduplicate questions; link quotas/prices to the catalogue-driven plan page.
- Blog: explain background, use cases and releases. Link articles to current product
  references rather than treating dated examples as the contract.

## Proposed public manual

| Section | Pages to create |
| --- | --- |
| Getting started | First public HTTP/ICMP monitor; first local monitor; where checks run; interpreting the first result |
| Monitoring reference | All 20 built-in endpoints; ports/addresses/args; cadence/skip cycles; status vs duration; available-agent endpoint discovery |
| Sensors/BLE | Passive monitoring; supported protocols/device records; keys/encryption; choosing a metric; multiple metrics per device; exact metric reference; unavailable values |
| Alerts | Failure alerts; low/high limits with voltage/current examples; email setup; reset once alerted; predictive alerts, advanced model configuration and scope |
| Data and charts | Tables/edit dialog; location/details; dataset vs time range; summaries/sampling/archives; timeout arrows; current-limit violations; refresh behaviour |
| Reports and exports | Report cadence/preferences; actual-unit graphs/AI analysis; archive downloads; JSON examples and null failures |
| AI assistant | What executes vs advice; all expert families; agent/endpoint discovery; model/runners/quotas; voice; history; stop/cancel; worked prompts with real outcomes |
| Diagnostics | Nmap/OpenSSL; quantum handshake vs certificate; algorithm selection; Metasploit one-shot vs live; results and platform dependencies |
| Extensibility | One-off Cmd Processor vs periodic Connect vs AgentFlow; example creation/update/inspection; metadata/status contract; deployment scope |
| Cameras | RTSP/ONVIF snapshot capture, credentials/dependencies, analysis instructions and troubleshooting |
| Agents/platforms | Comparison matrix; Android, Windows, Docker/Linux install guides; architecture/device access; Network Monitor vs Quantum Secure; local network discovery, single-host checks and logs; ESP32 factory setup, OTA and recovery |
| API/integrations | Service vs standalone check API; OAuth vs API secret; OpenAPI/MCP; actual vs encoded DTO examples; custom integration recipes |
| Account/security | Passkeys; email/preferences; plan/retention links; processor ownership/removal; privacy/AI processing; links to authoritative security policies |

Use a common page template: what it does; who/which platform can use it;
prerequisites; smallest working example; expected output; interpretation;
limitations; troubleshooting; related guides. Example data must be labelled as
illustrative when it was not captured from an actual run.

## Delivery priorities

1. Correct contradictory claims in the audit, particularly ESP32 commands,
   alert rules, plan figures, quantum scope and universal platform promises.
2. Publish the feature hub and endpoint/platform tables. Users need these before
   deciding which agent to install.
3. Write the basic/local/BLE quick starts and alert/chart guides. These cover the
   most recent functionality and daily tasks currently missing from the FAQ.
4. Document the assistant experts, custom Connects/processors/AgentFlows, cameras,
   reports and MCP/API contracts with concise worked examples.
5. Add operator/developer runbooks separately, linking existing repository guides
   rather than duplicating command/security/firmware implementation notes.

## Keeping the documentation accurate

- Source endpoint identity from EndPointTypeFactory plus runtime discovery. Use
  the Connect/decoder catalogue for unit/meaning/metric data; do not invent another
  independently maintained measurement table in the frontend.
- Source prices/limits from PlanCatalog/live API; entitlements from AccountTypeFactory.
  Platform support comes from actual capability registration/disabled lists and
  implemented adapters, with explicit embedded subsets.
- Keep editorial explanations as Markdown or structured documents with stable IDs.
  Use React only for rendering/interactive examples. Avoid another giant JSX string
  containing the entire manual and duplicate FAQ transcripts.
- Public references should be renderable without requiring chat or login and have
  page-specific title, description and canonical URLs. Static/prerendered docs are
  a useful choice because the current non-JavaScript response is the same generic
  landing fallback even on FAQ/download routes. Keep live controls client-rendered.
- Record “reviewed against release/source” and support status, not just a date.
  Review endpoint/decoder, alert, plan, UI, platform and API doc changes with the
  corresponding code changes. Link manufacturer specifications in BLE references.
- Keep the same docs available from host edit/chart help and assistant knowledge
  retrieval. Confirm the Search/FAQ ingest/update path so public docs and AI answers
  do not drift independently.
- Validate links, unique page/anchor IDs and catalogue completeness; then inspect
  desktop/mobile, light/dark, expanded sections and logged-out/error states. Use
  release/device tests for runtime promises; documentation rendering is not enough.

## Definition of done for the first documentation release

A visitor can find every implemented feature family, choose a suitable agent,
add their first monitor, interpret units/status, set/reset an alert, choose a time
range, and understand what the assistant can execute. References show platform
and plan prerequisites, distinguish code capability from live availability, and
link to authoritative endpoint/metric/API definitions. The FAQ no longer carries
contradictory quotas or universal security/platform assurances.

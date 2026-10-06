# Ready for Quantum service documentation audit

Audit date: 6 October 2026.

This audit records the presentation before the customer documentation implementation. The new Features and Guides section addresses the gaps described here. See [maintenance and validation](maintenance.md) for the implemented pages, feature coverage and release checks.

Read these documents in order:

1. [Presentation and accuracy audit](presentation-audit.md): what a visitor can
   discover, where information is missing, and claims that need correction.
2. [Feature inventory](feature-inventory.md): implemented capabilities, all
   built-in endpoints, AI experts, platform differences and suite components.
3. [Documentation plan](documentation-plan.md): proposed pages, priorities and
   maintenance rules.
4. [BLE metric reference](ble-metrics.md): the 135 published v2 metric definitions
   captured from the shared library, grouped by protocol.

[Source snapshot](source-snapshot.json) records repository revisions and whether
their working trees had changes. This is an audit of the current source checkouts
and unauthenticated public presentation, not certification that every implemented
feature is deployed, enabled on every account, or tested on every device.

## Inspection method and limits

- Read the public React routes and content, the blog source, shared factories,
  decoder/catalogue code, tool builders, controllers and relevant service flows.
- Used Chromium to render the live landing, FAQ, download and subscription pages
  at desktop 1440 × 900 and mobile 390 × 900. Also expanded FAQ answers and checked
  pages after dismissing the cookie notice. No scan or other live action was run.
- [Browser observations](browser-observations.json) and selected [screenshots](screenshots/)
  preserve that presentation evidence. Public browsing was logged out; authenticated
  dashboard features were checked in source, not through a live user session.
- Inspected the active ESP32 firmware implementation rather than relying solely on
  its README, because the README/download summaries lag its actual capabilities.
- No Android builds, service builds, migrations, deployments, device operations,
  paid model calls or runtime feature tests were performed for this documentation audit.
- Store links, deployment-specific agent lists, advertised service commitments and
  legal assurances need separate owner verification before publication. Finding code
  for a feature does not establish a commercial commitment or universal availability.

## Repeating the audit

Start with the source files linked in the inventory. Compare the current endpoint
factory, command provider, BLE metric catalogue, platform restriction lists,
AccountTypeFactory and PlanCatalog with the public pages. Render the public pages
at desktop/mobile sizes, inspect both default and expanded states, and record
which environment and login state you used. Recheck source revisions before
publishing; dynamic Connects and available agents cannot be enumerated permanently
from a static document.

The JSON metric snapshot is at
`NetworkMonitorLib/Objects/Connection/Ble/metric-encodings-v2.json`. Regenerate
the metric appendix directly from it, preserving its exact format/metric names.
Do not infer that a device broadcasts every metric listed for its protocol.

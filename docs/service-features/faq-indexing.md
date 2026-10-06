# Expanded FAQ and assistant indexing

The FAQ now contains 174 customer questions (24 original entries plus 150 detailed additions). Both files are combined in `src/components/help/catalog.mjs`; the additions live in `faq-extra.mjs`. Stable IDs keep existing answer links working. Questions cover setup, endpoint semantics, BLE manufacturers/keys/metrics, limits and failures, charts/history, reports/downloads, AI experts/voice/history/cancellation, diagnostics/quantum, custom code/workflows/cameras, each agent platform, billing/privacy and troubleshooting.

The website supports categories, a guide/topic selector and multiword search. Collapsed answers unmount their contents to keep a long FAQ manageable. All answers are still included in the generated HTML and FAQPage structured data.

## One source for website and assistant

`npm run build` writes:

- `dist/faq/index.html`: readable complete FAQ with canonical metadata and structured data.
- `dist/faq.json`: an array of `{ "input": "question", "output": "answer and reference links" }` records, compatible with NetworkMonitorSearch's `DocumentIndexingStrategy`.

The assistant's `execute_query_faq` searches the `documents` index. It does not automatically read changed React source or refresh that index when the frontend image is built. Deploying the website alone therefore does not replace the assistant's existing indexed answers.

## Updating the indexed copy when deploying

1. Build the frontend and run `npm run check:docs`. This validates that every exported record matches its customer answer and includes its stable FAQ link.
2. Replace the FAQ source in the Search deployment's configured data directory with the generated `dist/faq.json`. The current development checkout has a `search_data/faq.json` source; data-directory ingestion uses index subdirectories, so use the actual deployment configuration to determine whether this belongs at the root or under `documents/`. Do not move other knowledge sources.
3. Use the existing authorised Search ingestion workflow to rebuild the `documents` index from its complete current sources, including the replaced FAQ and any other documents. Confirm the source inventory first. Recreating the index with only this one FAQ file would remove other help documents.
4. Check representative `execute_query_faq` results: repeated BTHome temperatures, measurement-limit units, chart sampling and stopping a running diagnostic. Answers should reflect this FAQ and retain useful reference links.

Important implementation detail: `DocumentIndexingStrategy.ComputeId` hashes the output text. Updated answers therefore receive new document IDs. Simply appending or incrementally adding the new FAQ can leave contradictory old answers in the index. A complete rebuild from the maintained sources, or deliberate removal of the previous FAQ records, is needed to retire old entries.

This task generates and checks the replacement input; it does not mutate a running Search index or deploy a service. No Search or LLM code change is required to read this existing input/output format.

## Checks

`npm test -- src/components/help` checks uniqueness, content coverage, multiword search, topic selection and answer navigation. `npm run check:docs` checks built HTML/structured data and the 174-record indexing export. Preview the long FAQ on desktop/mobile in both themes, including search, topic filters and a direct `/faq#bthome-two-temperature` link.

## Validation of this expansion

Ten help tests passed, including FAQ uniqueness, multiword search and topic selection. Production build and all generated-page/export checks passed. Chromium checked the full 174-question page, filtered search and a directly linked expanded answer on desktop/mobile in light/dark modes (12 states), with no document overflow or uncaught JavaScript errors. Representative screenshots and machine observations are saved alongside the earlier documentation validation.

## Headless enrolment clarification

Linux/Docker enrolment is now a numbered log → browser → log confirmation procedure. ESP32 adds the 115200-baud USB serial command, Wi-Fi prompts, exact `nm_enrollment: Sign in at` marker, URL-only copying, code entry, expiry/retry guidance and `ESP32_S3_MQTT_READY` confirmation. Download, platform comparison, getting started and app guides explain the UI/headless distinction. Seven enrolment FAQs were added and the existing Docker answer expanded. Source references: the old Download page in Git HEAD and `NetworkMonitorProcessorAgentESP32/docs/first-physical-board.md`, confirmed against `firmware/main/enrollment_oauth.c` and `processor_mqtt.c`.

Enrolment update validation: all 11 help tests, production build and generated HTML/174-record export checks passed. Ten desktop/light and mobile/dark browser states checked the Download explanation, Linux log procedure, ESP32 serial setup/procedure and linked FAQ answer, with no page overflow. Representative enrolment screenshots and `enrolment-browser.json` retain the checks. No device authorisation was performed.

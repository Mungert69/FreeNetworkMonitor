# Maintaining the customer documentation

Implemented on 6 October 2026 in FreeNetworkMonitor. API and MCP guides are deliberately reserved for a later section.

## Where to edit

- `src/components/help/catalog.mjs`: stable guide URLs, summaries, search tags, categories, FAQ answers and maintained download links.
- `src/components/help/faq-extra.mjs`: the detailed expanded FAQ questions; combined with the core entries in the catalogue. See [assistant FAQ indexing](faq-indexing.md) for refreshing the separately stored help index.
- `src/components/help/content/*.md`: the 19 customer guides. Write from the user's perspective; use `##` for section headings. These become table-of-contents anchors through `headingId`.
- `Features.jsx`: overview and grouped entry points; `Guides.jsx`: searchable guide library; `Guide.jsx` / `GuideMarkdown.jsx`: article layout, navigation and reference tables.
- `PublicLayout.jsx`: public-page navigation, appearance and reading surface.
- `src/components/main/Download.jsx` and `Faq.jsx`: task-oriented download cards and searchable answers. FAQ plan questions link to Subscription; do not duplicate prices or allowances.
- `scripts/prerender-docs.mjs`: builds real page HTML from the same catalogue and Markdown, adds canonical/OG metadata and JSON-LD for public documentation pages.
- `htaccess`: Apache routing for generated HTML with slash-free public URLs. `vite.config.js` mirrors it for production-build preview.

`npm run build` includes HTML generation. Existing build scripts copy `dist`, so the new pages ship with the frontend image. Do not copy only its root `index.html`. The default canonical domain is `https://readyforquantum.com`; set `PUBLIC_SITE_URL` when intentionally building for another canonical domain. Verify backend runtime domain configuration also matches.

React replaces the initial static content through its existing `createRoot` entry point. With JavaScript disabled, the guide remains readable. An unknown guide displays a recovery link when the SPA handles the request; known guide files are built explicitly.

## Feature-to-guide map

| Concern | Guides |
| --- | --- |
| Host add/edit/enable/delete, location, duplicates, scheduling | getting-started, endpoints, charts |
| All 20 periodic endpoint names and platform limitations | endpoints, platforms |
| BLE protocols, keys, selected metrics, automatic units, negative values | sensors, ble-metrics |
| Failure alerts, actual-unit limits, latching/reset, predictive settings | alerts |
| Time ranges, representative sampling, summaries, gaps, markers, refresh | charts |
| Reports, AI measurement guidance, actual-value JSON, separate archive | reports |
| Experts, model routes, streaming, voice, memory/history, cancellation | assistant |
| All 19 commands, dependencies, security/search/crawl/Space tasks | diagnostics |
| Handshake versus certificates, algorithms and bounded embedded checks | quantum |
| Custom Connects, command processors and AgentFlow | automation |
| RTSP/ONVIF stills and interpretation | cameras |
| Install, authorise, monitor and update each platform | linux, windows, android, esp32 |
| Account, verified email, passkeys, plans, processors, appearance/privacy | account |
| Missing values, unavailable tasks, disconnects and stalled work | troubleshooting, faq |

## Authoritative evidence

The audit's `feature-inventory.md` and `source-snapshot.json` identify the inspected repositories and source files. Recheck current code before changing capability claims. Do not treat old README statements as proof of shipped behaviour.

BLE metric tables are a user-facing snapshot of `NetworkMonitorLib/Objects/Connection/Ble/metric-encodings-v2.json` (135 entries when written). They display names and units, not internal scale/offset encodings. When the catalogue changes, update the appropriate manufacturer's table and run the coverage test with the sibling Lib checkout available. Do not claim that every listed field is present on every device.

Vendor links are included in the guides: Victron Instant Readout PDF and Orion XS reference, Ruuvi RAWv2, BTHome format/encryption, and primary tool/platform references. Recheck links and firmware/store destinations periodically. Manufacturer specifications describe the protocol; our decoder/agent implementations determine supported behaviour.

## Checks before release

1. `npm test -- src/components/help src/app.test.jsx` checks published content, internal section links, metric/command/endpoint coverage, search/category filtering, FAQ expansion, article rendering and unknown-guide recovery.
2. `npm run build` must finish HTML generation; then run `npm run check:docs` to validate all shipped pages, structured data, canonical links and sitemap entries. Inspect `dist/docs/sensors/index.html`, JSON-LD, canonical URLs and `dist/sitemap.xml`. Generated article text and vendor links must be present before JavaScript runs.
3. `npm run serve -- --host 127.0.0.1 --port 5189` previews the built routes. Use the printed protocol (this checkout uses HTTPS).
4. Check Features, Guides, Download, FAQ and every guide at desktop/mobile widths in light/dark modes. Check navigation drawer, search, empty results, categories, expanded FAQ, mobile On this page, anchors, long code/table scrolling and footer links.
5. Disable JavaScript and directly load `/docs/sensors`; confirm the article and specification links are still present. Test Apache's slash-free route handling in the frontend image before deployment.
6. Run relevant existing tests. Record unrelated baseline failures separately; do not claim the full suite passed. Android builds are outside this documentation task.

Browser validation used Chromium/CDP at 1440×900 and 390×900, four theme/device combinations for 23 pages. Temporary screenshots and machine observations were captured under `/tmp/nm-docs-screens`; representative retained screenshots accompany the validation notes. An additional 27 interaction states covered filters, empty results, expanded FAQ answers, mobile contents, code blocks, wide tables, drawer navigation and landing-page links.

## Automatic sitemap

Every `npm run build` regenerates `dist/sitemap.xml` from scratch using `scripts/generate-sitemap.mjs`. Existing frontend build scripts therefore include the updated sitemap in the Docker image without a separate manual step. The old hand-maintained `public/sitemap.xml` has been removed.

Public React routes are defined in `src/site-pages.mjs`, shared with the router. Add new public routes there and use their constants in `app.jsx`. Guides are discovered from the guide catalogue automatically. Public HTML files are discovered recursively under `public`; index files and backup files are excluded. Add a robots `noindex` meta tag to exclude an unpublished HTML page. Private dashboard/authentication routes and redirects are not listed.

Run `npm run generate:sitemap` to regenerate the sitemap after an existing build, or `npm test -- scripts/generate-sitemap.test.mjs` to test discovery, exclusions, deletion, URL validation and XML escaping. Run `npm run check:docs` after the full build to verify guide coverage. Inspect `dist/sitemap.xml`; generated output is not committed. `PUBLIC_SITE_URL` sets the canonical origin and the generated robots.txt sitemap link together. Local Docker's existing robots-block override remains in place.

The blog already generates its sitemap using its own plain Node script (`FreeNetworkMonitorBlog/lib/generate-sitemap.js`) during its build. Its pages belong to `blog.readyforquantum.com`, so its sitemap stays separate from the main site's sitemap. Rebuild the corresponding site when its content changes.

Dates are omitted rather than using build timestamps: optional `lastmod` must describe a real page change. See the [sitemap protocol](https://www.sitemaps.org/protocol.html) and [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Landing page and subscription SEO

The HTML generator also writes `dist/index.html` and `dist/subscription/index.html`. Shared titles/descriptions live in `src/public-page-metadata.mjs`. The landing fallback includes feature links and the same `blog.md` article used by React; the plans fallback explains how to view current prices and sign in. Prices and plan allowances remain fetched from the subscription service at runtime and are never frozen into build output. React keeps its existing authentication, tools and checkout flow.

`DeferredArticle.jsx` loads the landing page's Markdown article when it approaches the viewport (600px margin), with an immediate fallback on browsers without IntersectionObserver. The build output includes the article for crawlers and readers without JavaScript. Verify both paths with `npm test -- src/components/main/__tests__/DeferredArticle.test.jsx`, then build and run `npm run check:docs` (25 generated pages). Generated public pages use trailing-slash directory URLs; slash-free requests redirect to them in Apache and Vite preview.

SEO validation: the production build and checks passed for all 25 generated pages and 174 FAQ exports. Chromium checks covered landing/plans at 1440px and 390px with JavaScript enabled and disabled; there was no horizontal overflow. Light/dark plan screenshots and the loaded article were inspected. The local subscription API returned no plans, so live pricing/checkout was not exercised. Deferred article loading was confirmed after scrolling the page's scrollable main container; it was absent from initial landing-page requests. ProductDetail's own chunk changed from approximately 90 KB to 31 KB (uncompressed); this is not a measurement of total page load time.

## Features page emphasis

`src/components/help/feature-highlights.mjs` holds the quantum readiness, security diagnostics and AI monitoring sections shared by the React Features page and its generated HTML. Keep capability claims aligned with the quantum, diagnostics and platform guides. The landing-page feature introduction gives these core capabilities priority; the detailed Bluetooth guides and existing guide groups remain available. Update both the landing React introduction and its build-time counterpart when changing that introduction.

## Consistent header branding

`src/components/main/HeaderBrand.jsx` supplies the shared “Ready for Quantum” label in public, dashboard/landing and subscription headers. It renders a span, leaving heading semantics to page content. Keep header branding changes in this component rather than adding page-specific product names to app bars. The landing hero and subscription content carry their own h1 headings.


## Canonical public URLs (October 2026)

Generated public pages use trailing-slash URLs (`/features/`, `/docs/`, `/docs/quantum/`, `/download/`, `/faq/`, `/subscription/`). `src/site-pages.mjs` shares normalization across build metadata, sitemap and React SEO. Route keys remain slash-free to avoid doubling slashes when composing guide routes. Public links should use the canonical directory URL, including a slash before a query or fragment. Static `.html` files, private SPA routes and external destinations keep their existing URL format.

Apache `htaccess` redirects real generated slash-free pages and explicit public `index.html` aliases permanently, preserving queries. Its internal directory-to-index rewrite must not redirect itself. Keep Apache DirectorySlash enabled. Vite preview mirrors public directory redirects, but testing the actual Apache runtime remains necessary.

Verification: run `npm test -- src/site-pages.test.mjs scripts/generate-sitemap.test.mjs src/components/help/HelpPages.test.jsx src/components/help/catalog.test.mjs`, `npm run build`, and `npm run check:docs`. Against an isolated Apache instance serving the built `dist` including its generated `.htaccess`, run `node scripts/check-public-urls.mjs http://localhost:PORT`. This verifies all sitemap URLs return 200 directly, static canonicals/Open Graph URLs agree, public links use the selected URL format, and slash-free/index aliases redirect with query preservation. Also verify rendered canonical pathnames across all 25 generated pages; React must not change their canonical path after loading.


## Case aliases and missing pages

`npm run build` now runs `scripts/generate-apache-routes.mjs` after generating
the documents and sitemap. It expands `htaccess`'s public-alias marker into
`dist/.htaccess` using the route and guide catalogues. Both Dockerfiles ship this
built file via `COPY ./dist/`; do not overwrite it with the template `htaccess`.
Known mixed-case, slash-free and explicit `index.html` aliases redirect in one
hop to the canonical lowercase directory URL, preserving query parameters.

Only `/dashboard` and `/start-login-proxy` (with optional trailing slash and query
parameters) use the SPA shell. Existing files/directories are served directly;
unknown URLs and missing assets receive HTTP 404 with the themed `404.html`
error page. It contains `noindex, follow`, has no homepage canonical, and stays
out of the sitemap. Client-side unknown routes show a not-found page without
redirecting to the homepage; missing-guide views also declare noindex.

Verify with `npm run check:docs` and
`node scripts/check-public-urls.mjs http://localhost:PORT` against Apache. The
HTTP checks include uppercase aliases for all generated pages, missing page,
guide and asset 404s, and query-bearing dashboard/login routes. They check the
login shell's HTTP availability; they do not perform a real authentication flow.

## Legacy links and static metadata

Main-site blog navigation points directly to `https://blog.readyforquantum.com/`.
The client-side `/blog` route performs an external navigation rather than a
React redirect to the obsolete `/blog/index.html`. Apache permanently redirects
legacy blog entry URLs and known blog content paths to the blog host, preserving
queries. Production `www.readyforquantum.com` requests redirect to the apex host;
other development hosts keep their current behaviour. An external reverse proxy
may apply additional routing before Apache, so live host-to-host hops require
checking that separate configuration after deployment.

`canonicalize-static-pages.mjs` adds one canonical to public static HTML pages
identified by the sitemap discovery code, using `PUBLIC_SITE_URL`. It updates
built output only, leaving policy prose and source HTML unchanged; noindex/error
and backup pages are excluded. The Apache HTTP checker now verifies static-page
canonicals as well as blog/preferred-host redirects. Build scripts and Docker
image versions remain at the separately requested frontend 1.9.2 release.

# Light, dark and system appearance

The navigation appearance menu offers System, Light and Dark. The initial preference is
System. Choices are local to the browser and saved under `networkmonitor-appearance`;
no account, API, measurement or backend changes are involved. Storage changes in another
tab update open views. System mode follows OS colour-scheme changes. Blocked storage
still permits switching for the current page.

## Structure

- `public/appearance.js`: shared preference store, palettes, media/storage listeners,
  document colour variables and browser theme colour. Loaded before the page renders to
  avoid a light flash. React and standalone documents reuse this same store.
- `src/theme/ApplicationTheme.jsx`: subscribes to that store and builds the MUI theme.
  Retains the application's original spacing (four units = 1rem).
- `src/theme/AppearanceMenu.jsx`: reusable navigation control, used on all main pages.
- `public/appearance.css`: initial document colours and standalone document styling.
- `public/appearance-page.js`: native appearance selector for standalone documents.
- `FreeNetworkMonitorBlog/pages/_app.js`: the existing next-themes provider uses the
  same storage key, so its existing light/dark styling follows the website preference
  when hosted on the same origin. Rebuild the blog as well as the React frontend.

For new MUI surfaces use `background.paper`, `background.default`, `text.primary`,
`text.secondary`, `divider` and theme palette colours. Emotion class styles must use
actual `theme.palette` values; `sx` accepts palette tokens. Legacy CSS uses `--nm-*`
variables from the shared store. Do not force white backgrounds or pale grey surfaces.
Fixed colours remain appropriate for media/brand assets and deliberately dark code blocks.
Use the actual application theme for visual previews, not MUI's default theme.

## Verification procedure

1. `npm run build` in FreeNetworkMonitor; `npm run build` and `npm run validate-export`
   in FreeNetworkMonitorBlog. Neither command publishes or rebuilds running Docker images.
2. Run `npx vitest run src/theme/__tests__/appearance.test.jsx` and the chart, host-view,
   chat and navigation tests under `src/components/dashboard/__tests__`.
3. At desktop and mobile widths check `/`, `/dashboard`, `/faq`, `/subscription`,
   `/download`. Check page bottoms/footers, expanded FAQs, drawer and appearance menu.
4. Check populated host view/edit tables; edit details and advanced settings; chart
   details/settings, time-range controls, signed values, timeout arrows, limit violations
   and tooltip; chat/history/code blocks; profile, passkeys, processor and firmware cards;
   subscription cards; host help and model-configuration dialogs.
5. Check every standalone document: cookiepolicy, privacypolicy, termofservice,
   refundpolicy, license, acceptable-use, security-compliance and
   huggingface_gguf_selection_guide. Inspect guide tables and its contents panel too.
6. Check the blog home, post, category, search, about, contact, elements, pagination and 404
   templates in both modes. Generated blog pages share the provider. Pagination wraps on mobile instead of
   overflowing the viewport.
7. Choose Dark, reload and navigate to another page. Verify it persists. Change to Light
   in another tab. Choose System and emulate/change the OS preference in both directions.
   An explicit Light choice must stay light when the OS changes. Expanded chart details
   and form drafts must remain intact when the resolved appearance changes.
8. Rebuild the frontend/blog Docker images with their normal build scripts and use Docker
   Compose `up -d` to recreate containers from new images. A plain container restart does
   not adopt a newly built image. Reload existing browser tabs after deployment.

Implementation checks used desktop 1280px and mobile 390px browser screenshots, actual
application pages, and the real dashboard components with read-only sample API responses
for populated views. The public preview backend returned connection/no-plan errors, so
those states were checked too; populated pricing/account screens used fixtures.

Known pre-existing test failures were confirmed against committed component copies:
HostListEdit's two tests still look for the old `Save host list` button, and three
ProductDetail assistant tests time out with their fake timers. The appearance, chart,
host-view, navigation and chat tests pass. Authentication redirects go to the separate
identity provider; its hosted pages are outside this frontend's styling.

## Responsive page layout

The dashboard tables fill the available width with 8px mobile, 16px tablet and
24px desktop outer gutters. Public pages use the shared `styleObject.container`
with a 1440px maximum width and smaller gutters on narrow screens. Long download
instructions remain limited to 100 characters per line; command blocks scroll
within that column. The HTML entry point has no body margin.

Use current MUI Grid `size={{ xs: 12, md: 6 }}` properties for responsive columns.
Legacy `item`, `xs` and `md` properties on Grid no longer size these sections.
Dashboard status banners belong inside `DashboardMainPanel`, above the table,
so they cannot occupy a second column in the surrounding flex layout.

For layout checks, visit home, dashboard (view and edit), FAQ (collapsed and
expanded), subscription (populated plans and unavailable plans), and download.
Inspect the top and footer in both themes at 390px, 768px, 1280px and 1920px.
Check both document width and the main panel's scrollWidth against clientWidth;
internal overflow can be hidden by the panel's scroll container. Table scrolling
and scrolling within command blocks are expected when their content is wider.

Host-table text cells share `TableTextCell` for ellipsis and full-value hover
tooltips. The view table exposes optional columns through Table options → Columns;
they start hidden and visibility is stored with the other grid preferences per
site. Minimum and maximum columns use the same scale/offset formatting as average;
alert limits already use actual units and must not be scaled again.

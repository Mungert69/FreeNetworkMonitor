// Run against the built Apache container, not the Vite development server:
// node scripts/check-public-urls.mjs http://localhost:8080
import { get as httpGet } from "node:http";
import { get as httpsGet } from "node:https";
import assert from "node:assert/strict";
import { publicPaths, canonicalPublicPath } from "../src/site-pages.mjs";
import { guides } from "../src/components/help/catalog.mjs";

const base = process.argv[2];
assert(base, "Supply the URL of an isolated Apache instance serving the build.");
const generated = new Set([
  ...Object.values(publicPaths),
  ...guides.map(({ slug }) => `/docs/${slug}`),
].map(canonicalPublicPath));
const sitemap = await fetch(new URL("/sitemap.xml", base)).then(r => r.text());
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]));
for (const url of urls) {
  const response = await fetch(new URL(url.pathname, base), { redirect: "manual" });
  assert.equal(response.status, 200, `${url.pathname} must return directly`);
  const html = await response.text();
  assert(html.includes(`<link rel="canonical" href="${url.href}">`), `${url.pathname}: canonical must match sitemap`);
  if (!generated.has(url.pathname)) continue;
  assert(html.includes(`<meta property="og:url" content="${url.href}">`), `${url.pathname}: Open Graph URL must match`);
  for (const [, href] of html.matchAll(/href="(\/[^"\s]*)"/g)) {
    assert.equal(canonicalPublicPath(href), href, `${url.pathname}: noncanonical public link ${href}`);
  }
  if (url.pathname === "/") continue;
  for (const alias of [url.pathname.slice(0, -1), `${url.pathname}index.html`, url.pathname.toUpperCase(), `${url.pathname.slice(0, -1).toUpperCase()}`, `${url.pathname.toUpperCase()}INDEX.HTML`]) {
    const r = await fetch(new URL(`${alias}?source=seo-check`, base), { redirect: "manual" });
    assert.equal(r.status, 301, alias);
    const target = new URL(r.headers.get("location"), base);
    assert.equal(target.pathname, url.pathname, alias);
    assert.equal(target.search, "?source=seo-check", `${alias}: preserve query`);
  }
}
console.log(`Checked ${urls.length} sitemap URLs, ${generated.size} generated pages and their redirect aliases.`);

for (const path of ["/seo-check-not-a-page", "/docs/no-such-guide/", "/docs/quantum/extra", "/assets/seo-check-missing.js", "/missing.png"]) {
  const response = await fetch(new URL(path, base), {redirect: "manual"});
  assert.equal(response.status, 404, path);
  const html = await response.text();
  assert(html.includes('name="robots" content="noindex, follow"'), `${path}: noindex error page`);
  assert(!html.includes('rel="canonical"'), `${path}: must not canonicalize to homepage`);
}
for (const path of ["/dashboard?initViewSub=true", "/start-login-proxy?code=test&state=test"]) {
  const response = await fetch(new URL(path, base), {redirect: "manual"});
  assert.equal(response.status, 200, `${path}: application route remains available`);
}
console.log("Uppercase aliases, unknown page/asset 404s, dashboard and login routes passed.");

for (const path of ["/blog", "/blog/", "/blog/index.html"]) {
  const r = await fetch(new URL(`${path}?source=seo-check`, base), {redirect: "manual"});
  assert.equal(r.status, 301, path);
  assert.equal(r.headers.get("location"), "https://blog.readyforquantum.com/?source=seo-check");
}
// Fetch deliberately controls Host itself; use the HTTP client to test an alias.
const hostUrl = new URL("/?source=seo-check", base);
const preferredHost = await new Promise((resolve, reject) => {
  const get = hostUrl.protocol === "https:" ? httpsGet : httpGet;
  get(hostUrl, {headers: {Host: "www.readyforquantum.com"}}, response => {
    response.resume();
    resolve({status: response.statusCode, location: response.headers.location});
  }).on("error", reject);
});
assert.equal(preferredHost.status, 301);
assert.equal(preferredHost.location, "https://readyforquantum.com/?source=seo-check");
console.log("Static page canonicals, legacy blog redirects and preferred-host redirect passed.");

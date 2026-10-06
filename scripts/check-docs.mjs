// Run after npm run build. Verify the shipped HTML, not just the React catalogue.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { guides, faqItems } from "../src/components/help/catalog.mjs";
const site = (
  process.env.PUBLIC_SITE_URL || "https://readyforquantum.com"
).replace(/\/$/, "");
const sitemap = await readFile("dist/sitemap.xml", "utf8");
for (const path of [
  "/",
  "/subscription",
  "/features",
  "/docs",
  "/download",
  "/faq",
  ...guides.map((g) => `/docs/${g.slug}`),
]) {
  const html = await readFile(path === "/" ? "dist/index.html" : `dist${path}/index.html`, "utf8");
  assert.ok(
    html.includes('<main class="nm-document">'),
    `${path} has readable initial HTML`,
  );
  assert.ok(
    html.includes(`<link rel="canonical" href="${site + path}">`),
    `${path} canonical`,
  );
  assert.equal((html.match(/<meta name="description"/g) || []).length, 1);
  assert.ok(
    sitemap.includes(`<loc>${site + path}</loc>`),
    `${path} in sitemap`,
  );
  const data = JSON.parse(
    html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
  );
  assert.equal(data["@graph"][0].url, site + path);
  if (path.startsWith("/docs/")) {
    assert.equal(data["@graph"][0]["@type"], "TechArticle");
    assert.ok(html.includes("<article>"));
    assert.equal(data["@graph"][1].itemListElement.length, 3);
  }
  if (path === "/faq")
    assert.equal(data["@graph"][0].mainEntity.length, faqItems.length);
}
const homeHtml = await readFile("dist/index.html", "utf8");
assert.ok(homeHtml.includes("Quantum-Safe TLS"), "Home article is readable without JavaScript");
assert.ok(homeHtml.includes('href="/docs/alerts"'), "Home links to feature guides");
const plansHtml = await readFile("dist/subscription/index.html", "utf8");
assert.ok(plansHtml.includes("current plan prices and allowances"), "Plans explain live pricing");
assert.ok(plansHtml.includes('href="/dashboard?initViewSub=true"'), "Plans retain the account entry point");
const sensorHtml = await readFile("dist/docs/sensors/index.html", "utf8");
for (const reference of [
  "communityarchive.victronenergy.com",
  "docs.ruuvi.com",
  "bthome.io",
])
  assert.ok(sensorHtml.includes(reference));
console.log(
  "All 25 generated public pages have readable content, canonical URLs, structured data and sitemap entries.",
);

const faqExport = JSON.parse(await readFile("dist/faq.json", "utf8"));
assert.equal(faqExport.length, faqItems.length);
for (const [i, q] of faqItems.entries()) {
  assert.equal(faqExport[i].input, q.question);
  assert.ok(faqExport[i].output.includes(q.answer));
  assert.ok(faqExport[i].output.includes(`/faq#${q.id}`));
}
console.log(`Validated ${faqExport.length} index-compatible FAQ records.`);

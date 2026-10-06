import { readFile, writeFile } from "node:fs/promises";
import { collectStaticPages } from "./generate-sitemap.mjs";

const site = process.env.PUBLIC_SITE_URL || "https://readyforquantum.com";
const pages = await collectStaticPages("public");
for (const path of pages) {
  const file = `dist${path}`;
  const html = (await readFile(file, "utf8"))
    .replace(/<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/gi, "");
  await writeFile(file, html.replace(/<\/head>/i, `<link rel="canonical" href="${new URL(path, site).href}">\n</head>`));
}
console.log(`Canonicalized ${pages.length} public static HTML pages.`);

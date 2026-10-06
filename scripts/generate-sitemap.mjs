import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { publicPaths } from "../src/site-pages.mjs";
import { guides } from "../src/components/help/catalog.mjs";

const escapeXml = (value) => value.replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
})[c]);

export async function collectStaticPages(directory, prefix = "") {
  const pages = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      pages.push(...await collectStaticPages(path.join(directory, entry.name), relative));
    } else if (entry.name.endsWith(".html") && !/^(?:index(?:-bak)?\.html)$|(?:[-.](?:bak|backup|old|tmp))\.html$/i.test(entry.name)) {
      const html = await readFile(path.join(directory, entry.name), "utf8");
      const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
      if (!metaTags.some((tag) => /\bname\s*=\s*["'](?:robots|googlebot)["']/i.test(tag) && /\bnoindex\b/i.test(tag))) {
        pages.push("/" + relative);
      }
    }
  }
  return pages;
}

export function renderSitemap(paths, site) {
  const base = new URL(site);
  if (!/^https?:$/.test(base.protocol) || base.pathname !== "/" || base.search || base.hash || base.username || base.password) {
    throw new Error("PUBLIC_SITE_URL must be an HTTP(S) origin, without a path, query or credentials.");
  }
  const urls = [...new Set(paths)].sort().map((route) => {
    if (!route.startsWith("/") || route.startsWith("//") || route.includes("?") || route.includes("#")) {
      throw new Error(`Invalid public sitemap path: ${route}`);
    }
    return `  <url><loc>${escapeXml(new URL(route, base).href)}</loc></url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

export async function generateSitemap({ root = process.cwd(), site = process.env.PUBLIC_SITE_URL || "https://readyforquantum.com" } = {}) {
  const staticPages = await collectStaticPages(path.join(root, "public"));
  const paths = [...Object.values(publicPaths), ...guides.map(({ slug }) => `${publicPaths.guides}/${slug}`), ...staticPages];
  const xml = renderSitemap(paths, site);
  await writeFile(path.join(root, "dist/sitemap.xml"), xml);
  const robots = await readFile(path.join(root, "public/robots.txt"), "utf8");
  await writeFile(path.join(root, "dist/robots.txt"), robots.replace(/^Sitemap:.*\r?\n?/gim, "").trimEnd() + `\n\nSitemap: ${new URL("/sitemap.xml", site).href}\n`);
  return new Set(paths).size;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(`Generated sitemap for ${await generateSitemap()} public pages.`);
}

import { test, expect } from "vitest";
import { mkdtemp, mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { collectStaticPages, generateSitemap, renderSitemap } from "./generate-sitemap.mjs";

test("sitemap escapes, deduplicates and validates canonical URLs", () => {
  const xml = renderSitemap(["/a&b.html", "/", "/"], "https://example.com");
  expect(xml.match(/<url>/g)).toHaveLength(2);
  expect(xml).toContain("https://example.com/a&amp;b.html");
  expect(xml).not.toContain("lastmod");
  expect(() => renderSitemap(["//external.example/a"], "https://example.com")).toThrow();
  expect(() => renderSitemap(["/"], "https://example.com/subdir")).toThrow();
});

test("build discovers new pages, removes deleted pages and keeps private routes out", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "nm-sitemap-"));
  try {
    await mkdir(path.join(root, "public"));
    await mkdir(path.join(root, "dist"));
    for (const name of ["new-page.html", "index.html", "index-bak.html", "draft.html"]) {
      await writeFile(path.join(root, "public", name), name === "draft.html" ? '<meta content="noindex, follow" name="robots">' : "<h1>Page</h1>");
    }
    await writeFile(path.join(root, "public/robots.txt"), "User-agent: *\nDisallow:\nSitemap: https://old.example/sitemap.xml\n");
    expect(await collectStaticPages(path.join(root, "public"))).toEqual(["/new-page.html"]);
    await generateSitemap({ root, site: "https://example.com" });
    const xml = await readFile(path.join(root, "dist/sitemap.xml"), "utf8");
    expect(xml).toContain("https://example.com/docs/esp32/");
    expect(xml).toContain("https://example.com/new-page.html");
    for (const excluded of ["/dashboard", "/start-login-proxy", "/blog", "index-bak", "draft.html"]) expect(xml).not.toContain(excluded);
    expect(await readFile(path.join(root, "dist/robots.txt"), "utf8")).toContain("Sitemap: https://example.com/sitemap.xml");
    await rm(path.join(root, "public/new-page.html"));
    await generateSitemap({ root, site: "https://example.com" });
    expect(await readFile(path.join(root, "dist/sitemap.xml"), "utf8")).not.toContain("new-page.html");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

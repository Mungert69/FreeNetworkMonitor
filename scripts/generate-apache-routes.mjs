import { readFile, writeFile } from "node:fs/promises";
import { publicPaths, canonicalPublicPath } from "../src/site-pages.mjs";
import { guides } from "../src/components/help/catalog.mjs";

const paths = [
  ...Object.values(publicPaths).filter(path => path !== "/"),
  ...guides.map(({ slug }) => `/docs/${slug}`),
];
const aliases = paths.map(path => {
  const canonical = canonicalPublicPath(path);
  // The condition is case-sensitive; the alias match is case-insensitive.
  // Canonical requests pass through, while case/index/slash aliases redirect once.
  return `RewriteCond %{REQUEST_URI} !^${canonical}$\nRewriteRule ^${path.slice(1)}(?:/index\\.html|/)?$ ${canonical} [R=301,L,NC]`;
}).join("\n\n");
const template = await readFile("htaccess", "utf8");
if (!template.includes("# GENERATED_PUBLIC_ALIASES")) throw new Error("Missing public route marker");
await writeFile("dist/.htaccess", template.replace("# GENERATED_PUBLIC_ALIASES", aliases));
console.log(`Generated Apache aliases for ${paths.length} public routes.`);

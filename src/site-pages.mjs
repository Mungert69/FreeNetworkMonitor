// Public React routes shared by the router and build-time sitemap generator.
// Keep private routes and redirects in app.jsx, outside this catalogue.
export const publicPaths = Object.freeze({
  home: "/",
  features: "/features",
  guides: "/docs",
  faq: "/faq",
  download: "/download",
  subscription: "/subscription",
});

// Apache serves these generated pages as directories. Use the same trailing-slash
// URL in links, static metadata, runtime metadata and the sitemap.
export function canonicalPublicPath(value) {
  return value.replace(
    /^(\/(?:features|download|faq|subscription|docs(?:\/[a-z0-9-]+)?))\/?(?=[?#]|$)/i,
    (_, path) => `${path.toLowerCase()}/`,
  );
}

export function canonicalPublicUrl(value) {
  const url = new URL(value);
  url.pathname = canonicalPublicPath(url.pathname);
  return url.href;
}

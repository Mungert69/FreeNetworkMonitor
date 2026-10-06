// Build-time HTML for the same public guides React displays. No second copy of prose.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  guides,
  groups,
  faqItems,
  downloads,
  headingId,
} from "../src/components/help/catalog.mjs";
import { homeMetadata, plansMetadata } from "../src/public-page-metadata.mjs";
import { featureIntro, featureHighlights } from "../src/components/help/feature-highlights.mjs";
const h = React.createElement;
const site = (
  process.env.PUBLIC_SITE_URL || "https://readyforquantum.com"
).replace(/\/$/, "");
// Reset previously generated SEO/content so rerunning after a build is safe.
const template = (await readFile("dist/index.html", "utf8"))
  .replace(/<link rel="canonical"[^>]*>/g, "")
  .replace(/<meta property="og:[^>]*>/g, "")
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "")
  .replace(/<style id="nm-document-style">[\s\S]*?<\/style>/g, "")
  .replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const link = (url, title) => `<a href="${esc(url)}">${esc(title)}</a>`;
const cards = (items) =>
  items
    .map(
      (g) =>
        `<section><h2>${link(`/docs/${g.slug}`, g.title)}</h2><p>${esc(g.summary)}</p></section>`,
    )
    .join("");
const nav = `<nav aria-label="Product help">${[
  ["/", "Home"],
  ["/features", "Features"],
  ["/docs", "Guides"],
  ["/download", "Get an agent"],
  ["/faq", "FAQ"],
  ["/subscription", "Plans"],
  ["/dashboard", "Dashboard"],
]
  .map(([u, t]) => link(u, t))
  .join(" · ")}</nav>`;
const pages = [
  {
    path: "/",
    title: homeMetadata.title,
    summary: homeMetadata.summary,
    body: `<h2>Quantum readiness, backed by continuous monitoring</h2><p>Test post-quantum TLS and certificate support, investigate your network with security tools, and ask specialist AI experts to explain the results. Keep watching your services with monitoring, alerts and reports.</p><p>${link("/docs/quantum", "Explore quantum readiness")} · ${link("/features#security-diagnostics", "Security and AI features")}</p><h2>Monitor from the location you choose</h2><p>Use Linux, Windows, Android or ESP32 agents to monitor websites, local services and supported Bluetooth sensors. View measurements, trends and failures on the website.</p>${cards(guides.filter(g => ["endpoints", "platforms", "sensors", "charts", "alerts", "reports", "assistant", "quantum"].includes(g.slug)))}<h2>Get started</h2><p>${link("/download", "Choose and enrol an agent")} · ${link("/docs/getting-started", "Set up your first monitor")} · ${link("/subscription", "Compare plans")}</p><h2>Quantum-Safe TLS: Practical Guide &amp; Playbook</h2>${renderToStaticMarkup(h(ReactMarkdown, { remarkPlugins: [remarkGfm] }, await readFile("src/components/main/blog.md", "utf8")))}`,
  },
  {
    path: "/subscription",
    title: plansMetadata.title,
    summary: plansMetadata.summary,
    body: `<h2>Compare current plans</h2><p>Enable JavaScript to load current plan prices and allowances from the subscription service. Sign in to view your current plan and manage your subscription.</p><p>${link("/dashboard?initViewSub=true", "Sign in and manage your subscription")} · ${link("/faq", "Read plan and billing questions")} · ${link("/docs/account", "Account and subscription guide")}</p><h2>Explore what you can do</h2>${cards(guides.filter(g => ["getting-started", "platforms", "alerts", "reports", "assistant"].includes(g.slug)))}`,
  },
  {
    path: "/docs",
    title: "Guides",
    summary:
      "Practical guides to website monitoring, Bluetooth sensors, alerts, diagnostics and all supported agents.",
    body: cards(guides),
    type: "CollectionPage",
  },
  {
    path: "/features",
    title: featureIntro.title,
    summary: featureIntro.summary,
    body: featureHighlights.map(section => `<section id="${section.id}"><h2>${esc(section.title)}</h2><p>${esc(section.description)}</p>${section.cards.map(card => `<h3>${esc(card.title)}</h3><p>${esc(card.text)}</p><p>${link(card.href, card.link)}</p>`).join("")}</section>`).join("") + groups
      .map(
        (g) =>
          `<h2>${esc(g.title)}</h2><p>${esc(g.description)}</p>${cards(guides.filter((x) => x.group === g.id))}`,
      )
      .join(""),
    type: "CollectionPage",
  },
  {
    path: "/download",
    title: "Download and set up your agent",
    summary:
      "Install Network Monitor or Quantum Secure on Windows and Android, run the Linux Docker agent or set up a compatible ESP32-S3.",
    body: `<h2>How to enrol your agent</h2><p>Windows and Android apps offer setup controls. Linux/Docker and ESP32 have no graphical setup interface: read the agent log, open its printed authorisation URL in a browser, sign in and approve, then return to the log to confirm registration. Use the same account on the dashboard.</p><p>${link("/docs/linux#enrol-the-agent-through-its-logs", "Linux/Docker log instructions")} · ${link("/docs/esp32#enrol-the-board-through-its-serial-log", "ESP32 serial instructions")}</p><h2>Linux / Docker</h2><p>${link("/docs/linux", "Docker installation and authorisation")}</p><h2>Windows</h2><p>${link(downloads.windowsAgent, "Network Monitor in the Microsoft Store")} · ${link(downloads.windowsQuantum, "Quantum Secure in the Microsoft Store")} · ${link("/docs/windows", "Windows setup")}</p><h2>Android</h2><p>${link(downloads.androidAgent, "Network Monitor on Google Play")} · ${link(downloads.androidQuantum, "Quantum Secure on Google Play")} · ${link("/docs/android", "Android setup")}</p><h2>ESP32-S3</h2><p>${link(downloads.firmware, "Live firmware releases")} · ${link("/docs/esp32", "Board setup and updates")}</p><p>${link("/docs/platforms", "Compare platform capabilities")} before choosing an agent.</p>`,
  },
  {
    path: "/faq",
    title: "Frequently asked questions",
    summary:
      "Answers about setup, Bluetooth metrics, alerts, charts, AI diagnostics and Network Monitor agents.",
    body: faqItems
      .map(
        (q) =>
          `<section id="${q.id}"><h2>${esc(q.question)}</h2><p>${esc(q.answer)}</p><p>${link(q.guide ? `/docs/${q.guide}` : q.href, q.linkLabel || "Read the guide")}</p></section>`,
      )
      .join(""),
    type: "FAQPage",
  },
];
for (const guide of guides) {
  const content = await readFile(
    `src/components/help/content/${guide.slug}.md`,
    "utf8",
  );
  const sections = [...content.matchAll(/^## (.+)$/gm)];
  const body = renderToStaticMarkup(
    h(
      ReactMarkdown,
      {
        remarkPlugins: [remarkGfm],
        components: {
          h2: ({ children }) =>
            h("h2", { id: headingId(String(children)) }, children),
        },
      },
      content,
    ),
  );
  pages.push({
    path: `/docs/${guide.slug}`,
    title: guide.title,
    summary: guide.summary,
    body: `<nav aria-label="On this page">${sections.map((m) => link(`#${headingId(m[1])}`, m[1])).join(" · ")}</nav><article>${body}</article><h2>Keep exploring</h2>${cards(guides.filter((x) => x.group === guide.group && x.slug !== guide.slug).slice(0, 3))}`,
    type: "TechArticle",
  });
}
const style = `<style id="nm-document-style">.nm-document h1{text-align:left}.nm-document nav{margin:1.5rem 0;line-height:2}.nm-document section{border-bottom:1px solid var(--nm-border);padding:1rem 0}.nm-document table{border-collapse:collapse;display:block;overflow:auto;max-width:100%}.nm-document th,.nm-document td{padding:.7rem;border:1px solid var(--nm-border);text-align:left}.nm-document pre{padding:1rem;background:var(--nm-paper);overflow:auto}.nm-document code{overflow-wrap:anywhere}.nm-document h2{margin-top:2rem}.nm-document{overflow-wrap:anywhere}</style>`;
for (const page of pages) {
  const title = `${page.title} | Quantum Network Monitor`;
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(
      /<meta name="description"[\s\S]*?>/,
      `<meta name="description" content="${esc(page.summary)}">`,
    )
    .replace(/<meta name="keywords"[\s\S]*?>/, "")
    .replace(/<noscript>[\s\S]*?<\/noscript>/, "");
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": page.type || "WebPage",
        headline: page.title,
        name: page.title,
        description: page.summary,
        url: site + page.path,
        ...(page.type === "FAQPage"
          ? {
              mainEntity: faqItems.map((q) => ({
                "@type": "Question",
                name: q.question,
                acceptedAnswer: { "@type": "Answer", text: q.answer },
              })),
            }
          : {}),
        ...(page.type === "TechArticle"
          ? {
              author: {
                "@type": "Organization",
                name: "Quantum Network Monitor",
                url: site,
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          ...(page.path.startsWith("/docs/")
            ? [
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Guides",
                  item: site + "/docs",
                },
              ]
            : []),
          ...(page.path === "/" ? [] : [{
            "@type": "ListItem",
            position: page.path.startsWith("/docs/") ? 3 : 2,
            name: page.title,
            item: site + page.path,
          }]),
        ],
      },
    ],
  };
  html = html.replace(
    "</head>",
    `<link rel="canonical" href="${esc(site + page.path)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(page.summary)}"><meta property="og:url" content="${esc(site + page.path)}"><meta property="og:type" content="${page.type === "TechArticle" ? "article" : "website"}"><script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>${style}</head>`,
  );
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><main class="nm-document">${nav}<h1>${esc(page.title)}</h1><p>${esc(page.summary)}</p>${page.body}<footer>${nav}<p>${link("/privacypolicy.html", "Privacy")} · ${link("/security-compliance.html", "Security & Compliance")}</p></footer></main></div>`,
  );
  const directory = page.path === "/" ? "dist" : `dist${page.path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html);
}
console.log(`Generated readable HTML, metadata and structured data for ${pages.length} public pages.`);

// Search's DocumentIndexingStrategy consumes input/output pairs, not React markup.
await writeFile(
  "dist/faq.json",
  JSON.stringify(
    faqItems.map((q) => ({
      input: q.question,
      output: `${q.answer}\n\nMore information: ${q.guide ? site + "/docs/" + q.guide : q.href.startsWith("/") ? site + q.href : q.href}\nFAQ: ${site}/faq#${q.id}`,
    })),
    null,
    2,
  ) + "\n",
);
console.log(
  `Exported ${faqItems.length} FAQ answers to faq.json for help indexing.`,
);

import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { guides, faqItems, filterGuides, headingId } from "./catalog.mjs";
const content = (slug) =>
  readFileSync(`src/components/help/content/${slug}.md`, "utf8");
describe("customer documentation coverage", () => {
  it("has complete, linked content for every published guide", () => {
    expect(new Set(guides.map((g) => g.slug)).size).toBe(guides.length);
    for (const guide of guides) {
      const text = content(guide.slug);
      expect(text.length).toBeGreaterThan(800);
      expect(text).toMatch(/^## /m);
      const ids = [...text.matchAll(/^## (.+)$/gm)].map((m) => headingId(m[1]));
      expect(new Set(ids).size).toBe(ids.length);
      for (const [, target, anchor] of text.matchAll(
        /\]\(\/docs\/([a-z0-9-]+)(?:#([a-z0-9-]+))?\)/g,
      )) {
        expect(
          guides.some((g) => g.slug === target),
          `${guide.slug} links to ${target}`,
        ).toBe(true);
        if (anchor)
          expect(
            [...content(target).matchAll(/^## (.+)$/gm)].map((m) =>
              headingId(m[1]),
            ),
          ).toContain(anchor);
      }
    }
    for (const question of faqItems)
      if (question.guide)
        expect(guides.some((g) => g.slug === question.guide)).toBe(true);
  });
  it("keeps the expanded FAQ unique and linked", () => {
    expect(faqItems.length).toBeGreaterThan(150);
    expect(new Set(faqItems.map((q) => q.id)).size).toBe(faqItems.length);
    expect(new Set(faqItems.map((q) => q.question)).size).toBe(faqItems.length);
    for (const q of faqItems) {
      expect(q.answer.length).toBeGreaterThan(100);
      expect(["start", "observe", "assist", "manage"]).toContain(q.group);
    }
  });
  it("explains headless enrolment in pages and FAQ", () => {
    expect(content("linux")).toContain("docker logs -f processor");
    expect(content("linux")).toContain(
      "complete URL printed by your running agent",
    );
    expect(content("esp32")).toContain("115200");
    expect(content("esp32")).toContain("nm_enrollment: Sign in at");
    expect(content("esp32")).toContain("ESP32_S3_MQTT_READY");
    expect(content("esp32")).toContain("not the trailing");
    for (const id of [
      "headless-enrolment",
      "esp32-authorise",
      "enrolment-expired-code",
      "enrolment-browser-confirmation",
    ])
      expect(faqItems.find((q) => q.id === id)?.answer).toContain("log");
  });
  it("documents all built-in endpoint and command names", () => {
    for (const name of [
      "icmp",
      "http",
      "https",
      "httphtml",
      "httpfull",
      "dns",
      "rawconnect",
      "smtp",
      "sitehash",
      "configintegrity",
      "nmap",
      "nmapvuln",
      "quantum",
      "quantumcert",
      "blebroadcast",
      "blebroadcastlisten",
      "crawlsite",
      "dailycrawl",
      "dailyhugkeepalive",
      "hugwake",
    ])
      expect(content("endpoints")).toContain("`" + name + "`");
    for (const name of [
      "Nmap",
      "Meta",
      "MetaLive",
      "Openssl",
      "Busybox",
      "SearchWeb",
      "SearchEngage",
      "CrawlPage",
      "CrawlSite",
      "HugSpaceWake",
      "HugSpaceKeepAlive",
      "Ping",
      "QuantumConnect",
      "QuantumPortScanner",
      "QuantumInfo",
      "QuantumCert",
      "BleBroadcast",
      "BleBroadcastListen",
      "CameraCapture",
    ])
      expect(content("diagnostics")).toContain("`" + name + "`");
  });
  it("covers every shared BLE metric and includes vendor specifications", () => {
    const path =
      "../NetworkMonitorLib/Objects/Connection/Ble/metric-encodings-v2.json";
    // Sibling repo is optional in standalone frontend checkouts.
    if (existsSync(path))
      for (const m of JSON.parse(readFileSync(path, "utf8")))
        expect(content("ble-metrics")).toContain(
          `| \`${m.Metric}\` | ${m.Unit} |`,
        );
    for (const source of [
      "communityarchive.victronenergy.com",
      "docs.ruuvi.com",
      "bthome.io",
    ])
      expect(content("sensors")).toContain(source);
  });
  it("filters by all search words and category", () => {
    expect(filterGuides("  VICTron battery ").map((g) => g.slug)).toContain(
      "ble-metrics",
    );
    expect(filterGuides("", "manage")).toHaveLength(6);
    expect(filterGuides("no-such-feature-zz")).toEqual([]);
    expect(filterGuides("victron", "manage")).toEqual([]);
  });
});

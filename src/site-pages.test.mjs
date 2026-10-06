import { test, expect } from "vitest";
import { canonicalPublicPath, canonicalPublicUrl } from "./site-pages.mjs";

test("generated public pages share directory URLs while preserving fragments and queries", () => {
  expect(canonicalPublicPath("/docs/quantum#checks")).toBe("/docs/quantum/#checks");
  expect(canonicalPublicPath("/download?platform=linux")).toBe("/download/?platform=linux");
  expect(canonicalPublicPath("/Download")).toBe("/download/");
  expect(canonicalPublicPath("/Docs/Quantum#checks")).toBe("/docs/quantum/#checks");
  expect(canonicalPublicPath("/docs/quantum/")).toBe("/docs/quantum/");
  expect(canonicalPublicUrl("https://readyforquantum.com/subscription")).toBe("https://readyforquantum.com/subscription/");
  for (const path of ["/", "/dashboard", "/start-login-proxy", "/privacypolicy.html", "/docs/quantum/file", "/download-agent"]) {
    expect(canonicalPublicPath(path)).toBe(path);
  }
});

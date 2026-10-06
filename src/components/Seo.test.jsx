import React from "react";
import { render } from "@testing-library/react";
import { test, expect } from "vitest";
import Seo from "./Seo";

test("not-found noindex clears when navigating back to an indexable public page", () => {
  const { rerender } = render(<Seo title="Page not found" noIndex openGraph={{ogUrl: "https://readyforquantum.com/missing"}} />);
  expect(document.head.querySelector('meta[name="robots"]')?.content).toBe("noindex, follow");
  expect(document.head.querySelector('link[rel="canonical"]')?.href).toBe("https://readyforquantum.com/missing");
  rerender(<Seo title="Download" openGraph={{ogUrl: "https://readyforquantum.com/Download"}} />);
  expect(document.head.querySelector('meta[name="robots"]')).toBeNull();
  expect(document.head.querySelector('link[rel="canonical"]')?.href).toBe("https://readyforquantum.com/download/");
});

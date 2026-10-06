import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
vi.mock("./PublicLayout", () => ({
  default: ({ children }) => <main>{children}</main>,
}));
import Guides from "./Guides";
import Guide from "./Guide";
import Faq from "../main/Faq";
afterEach(cleanup);
describe("help navigation", () => {
  it("searches guides and can recover from an empty search", () => {
    render(<Guides />);
    fireEvent.change(screen.getByLabelText("Search guides"), {
      target: { value: "zz-no-match" },
    });
    expect(screen.getByText(/No guides match/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("19 guides")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Manage your setup" }));
    expect(screen.getByText("6 guides")).toBeInTheDocument();
  });
  it("expands an answer and links to its full guide", () => {
    render(<Faq />);
    fireEvent.change(screen.getByLabelText("Search questions"), {
      target: { value: "negative" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Is a negative current/ }),
    );
    expect(
      screen.getByText(/A negative physical reading can be valid/),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Read the guide" }),
    ).toHaveAttribute("href", "/docs/sensors/");
  });
  it("matches multiword FAQ searches and filters by topic", () => {
    render(<Faq />);
    fireEvent.change(screen.getByLabelText("Search questions"), {
      target: { value: "negative current" },
    });
    expect(
      screen.getByRole("button", { name: /Is a negative current/ }),
    ).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search questions"), {
      target: { value: "" },
    });
    fireEvent.mouseDown(screen.getByRole("combobox", { name: "Topic" }));
    fireEvent.click(screen.getByRole("option", { name: "Set up an ESP32-S3" }));
    expect(
      screen.getByRole("button", {
        name: /Will the firmware work on any ESP32 board/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /How do I add a website/ }),
    ).not.toBeInTheDocument();
  });
  it("renders a guide with heading anchors and scrollable reference tables", () => {
    render(
      <MemoryRouter initialEntries={["/docs/endpoints"]}>
        <Routes>
          <Route path="/docs/:slug" element={<Guide />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Choose a monitoring check",
    );
    expect(
      screen.getAllByRole("region", { name: "Reference table" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen
        .getAllByRole("heading", { level: 2 })
        .every((e) => !!e.id || e.textContent === "Keep exploring"),
    ).toBe(true);
  });
  it("provides a way back for an unknown guide", () => {
    render(
      <MemoryRouter initialEntries={["/docs/no-such-guide"]}>
        <Routes>
          <Route path="/docs/:slug" element={<Guide />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: "Browse all guides" }),
    ).toHaveAttribute("href", "/docs/");
  });
});

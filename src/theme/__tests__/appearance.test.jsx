import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useTheme } from "@mui/material/styles";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ApplicationTheme, { createApplicationTheme } from "../ApplicationTheme";
import AppearanceMenu from "../AppearanceMenu";

const appearance = window.NetworkMonitorAppearance;
function CurrentMode() {
  return <output aria-label="Current mode">{useTheme().palette.mode}</output>;
}
const mount = () =>
  render(
    <ApplicationTheme>
      <AppearanceMenu />
      <CurrentMode />
    </ApplicationTheme>,
  );
beforeEach(() => {
  localStorage.clear();
  appearance.setPreference("system");
});
describe("appearance", () => {
  it("switches the rendered theme and persists the explicit choice", () => {
    mount();
    fireEvent.click(screen.getByRole("button", { name: "Appearance: system" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Dark" }));
    expect(screen.getByLabelText("Current mode")).toHaveTextContent("dark");
    expect(document.documentElement.dataset.colorMode).toBe("dark");
    expect(localStorage.getItem("networkmonitor-appearance")).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: "Appearance: dark" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Light" }));
    expect(screen.getByLabelText("Current mode")).toHaveTextContent("light");
  });
  it("updates another tab and returns to system when its preference is cleared", () => {
    mount();
    act(() => {
      localStorage.setItem("networkmonitor-appearance", "dark");
      window.dispatchEvent(
        new StorageEvent("storage", { key: "networkmonitor-appearance" }),
      );
    });
    expect(screen.getByLabelText("Current mode")).toHaveTextContent("dark");
    act(() => {
      localStorage.clear();
      window.dispatchEvent(new StorageEvent("storage", { key: null }));
    });
    expect(appearance.getSnapshot().preference).toBe("system");
  });
  it("still switches when persistent storage is unavailable", () => {
    const blocked = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("Storage blocked");
      });
    mount();
    act(() => appearance.setPreference("dark"));
    expect(screen.getByLabelText("Current mode")).toHaveTextContent("dark");
    blocked.mockRestore();
  });
  it("preserves the application spacing in both modes", () => {
    for (const mode of ["light", "dark"])
      expect(createApplicationTheme(mode).spacing(4)).toBe("1rem");
  });
});

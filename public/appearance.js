// Shared by React and standalone documents. Run before rendering to avoid a light flash.
(() => {
  if (window.NetworkMonitorAppearance) return;
  const key = "networkmonitor-appearance";
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const valid = (value) => ["light", "dark", "system"].includes(value);
  const read = () => {
    try {
      const value = localStorage.getItem(key);
      return valid(value) ? value : "system";
    } catch {
      return "system";
    }
  };
  const palettes = {
    light: {
      background: "#f5f7f6",
      paper: "#ffffff",
      text: "#202824",
      muted: "#56615b",
      primary: "#607466",
      secondary: "#6239ab",
      border: "#d8dfdb",
    },
    dark: {
      background: "#121815",
      paper: "#1d2621",
      text: "#eef3ef",
      muted: "#b5c2b9",
      primary: "#a1c3ad",
      secondary: "#c2a4f1",
      border: "#405047",
    },
  };
  const listeners = new Set();
  let snapshot;
  const update = (preference) => {
    const mode =
      preference === "system" ? (media.matches ? "dark" : "light") : preference;
    if (snapshot?.preference === preference && snapshot?.mode === mode) return;
    snapshot = { preference, mode };
    const root = document.documentElement;
    root.dataset.colorMode = mode;
    root.style.colorScheme = mode;
    for (const [name, value] of Object.entries(palettes[mode]))
      root.style.setProperty(`--nm-${name}`, value);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", palettes[mode].background);
    listeners.forEach((listener) => listener());
  };
  window.NetworkMonitorAppearance = {
    palettes,
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setPreference: (preference) => {
      if (!valid(preference)) return;
      try {
        localStorage.setItem(key, preference);
      } catch {
        /* Still works when storage is blocked. */
      }
      update(preference);
    },
  };
  update(read());
  media.addEventListener("change", () => {
    if (snapshot.preference === "system") update("system");
  });
  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) update(read());
  });
})();

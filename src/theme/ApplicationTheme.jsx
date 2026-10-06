import React, { useMemo, useSyncExternalStore } from "react";
import {
  ThemeProvider,
  createTheme,
  lighten,
  darken,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// The shared store is loaded by index.html before React starts.
const appearance = window.NetworkMonitorAppearance;
export function useAppearance() {
  const snapshot = useSyncExternalStore(
    appearance.subscribe,
    appearance.getSnapshot,
  );
  return { ...snapshot, setPreference: appearance.setPreference };
}
export function createApplicationTheme(mode) {
  const colors = appearance.palettes[mode];
  return createTheme({
    spacing: (factor) => `${0.25 * factor}rem`,
    palette: {
      mode,
      background: { default: colors.background, paper: colors.paper },
      text: { primary: colors.text, secondary: colors.muted },
      divider: colors.border,
      primary: {
        main: colors.primary,
        light: lighten(colors.primary, 0.18),
        dark: darken(colors.primary, 0.18),
        contrastText: mode === "dark" ? "#121815" : "#fff",
      },
      secondary: {
        main: colors.secondary,
        light: lighten(colors.secondary, 0.18),
        dark: darken(colors.secondary, 0.18),
        contrastText: mode === "dark" ? "#121815" : "#fff",
      },
      error: { main: mode === "dark" ? "#ff8792" : "#eb5160" },
      warning: { main: mode === "dark" ? "#e8bf55" : "#a87b00" },
    },
    components: {
      MuiGrid: { defaultProps: { disableEqualOverflow: true } },
      MuiAppBar: {
        defaultProps: { enableColorOnDark: true },
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: mode === "dark" ? colors.paper : colors.primary,
            color: mode === "dark" ? colors.text : "#fff",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          a: { color: colors.secondary },
          ".chat-input": { backgroundColor: colors.paper, color: colors.text },
        },
      },
    },
  });
}
export default function ApplicationTheme({ children }) {
  const { mode } = useAppearance();
  const theme = useMemo(() => createApplicationTheme(mode), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}

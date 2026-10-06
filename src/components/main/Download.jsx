import React from "react";
import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PublicLayout from "../help/PublicLayout";
import { downloads } from "../help/catalog.mjs";
const platforms = [
  {
    name: "Linux / Docker",
    tag: "Always-on monitoring",
    text: "A persistent container for local network checks and supported diagnostics. Docker Desktop also runs the Linux image on Windows or macOS.",
    guide: "linux",
    actions: [],
  },
  {
    name: "Windows",
    tag: "Desktop apps",
    text: "Use your PC as a local agent. Network Monitor provides monitoring and chat; Quantum Secure adds dedicated checks, discovery and logs.",
    guide: "windows",
    actions: [
      ["Network Monitor", downloads.windowsAgent],
      ["Quantum Secure", downloads.windowsQuantum],
    ],
  },
  {
    name: "Android",
    tag: "Phone or tablet",
    text: "Monitor local devices and Bluetooth broadcasts with a supported app. Background and battery settings affect continuous operation.",
    guide: "android",
    actions: [
      ["Network Monitor", downloads.androidAgent],
      ["Quantum Secure", downloads.androidQuantum],
    ],
  },
  {
    name: "ESP32-S3",
    tag: "Dedicated hardware",
    text: "A compact Wi-Fi and BLE monitor for compatible N16R8 boards. Install Live firmware, authorise your board and manage updates from your profile.",
    guide: "esp32",
    actions: [["Live firmware releases", downloads.firmware]],
  },
];
export default function Download() {
  return (
    <PublicLayout
      title="Download and set up your agent"
      description="Install Network Monitor or Quantum Secure for Windows and Android, run the Linux Docker agent, or set up a compatible ESP32-S3 board."
    >
      <Typography
        component="h1"
        variant="h3"
        sx={{ fontWeight: 750, fontSize: { xs: "2rem", md: "2.6rem" } }}
      >
        Bring monitoring to your network.
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mt: 4, mb: 7, maxWidth: 800, lineHeight: 1.8 }}
      >
        Choose an agent that can reach your devices. Authorise it with your
        website account, then select its location when adding a host. Public
        targets can also use available service-provided locations.
      </Typography>
      <Box
        sx={{
          mb: 6,
          p: 5,
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Typography component="h2" variant="h5" gutterBottom>
          How to enrol your agent
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
          Windows and Android apps offer setup controls. Linux/Docker and ESP32
          have no graphical setup interface: read the log output, copy the
          printed authorisation URL into a browser, sign in and approve the
          device, then return to the log to confirm registration. Use that same
          account on the dashboard.
        </Typography>
        <Button
          href="/docs/linux#enrol-the-agent-through-its-logs"
          sx={{ mt: 3, mr: 3 }}
        >
          Linux / Docker log instructions
        </Button>
        <Button
          href="/docs/esp32#enrol-the-board-through-its-serial-log"
          sx={{ mt: 3 }}
        >
          ESP32 serial instructions
        </Button>
      </Box>
      <Grid container spacing={5}>
        {platforms.map((p) => (
          <Grid key={p.guide} size={{ xs: 12, md: 6 }}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                p: 6,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Chip
                label={p.tag}
                size="small"
                sx={{ alignSelf: "flex-start", mb: 4 }}
              />
              <Typography component="h2" variant="h5" fontWeight={700}>
                {p.name}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 3, mb: 5, lineHeight: 1.8, flex: 1 }}
              >
                {p.text}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 3 }}>
                {p.actions.map(([label, href]) => (
                  <Button
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                  >
                    {label}
                  </Button>
                ))}
                <Button href={`/docs/${p.guide}`} variant="contained">
                  Setup guide
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 8, p: 5, borderLeft: 3, borderColor: "primary.main" }}>
        <Typography component="h2" variant="h5" gutterBottom>
          Not sure which one to choose?
        </Typography>
        <Typography color="text.secondary">
          Agents have different capabilities. Check the platform comparison for
          Bluetooth, browser checks, native diagnostics and embedded limits.
        </Typography>
        <Button href="/docs/platforms" sx={{ mt: 3 }}>
          Compare agents
        </Button>
        <Button href="/docs/getting-started" sx={{ mt: 3 }}>
          Your first monitor
        </Button>
      </Box>
    </PublicLayout>
  );
}

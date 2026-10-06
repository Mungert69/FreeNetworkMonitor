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
import { alpha } from "@mui/material/styles";
import MonitorHeartOutlined from "@mui/icons-material/MonitorHeartOutlined";
import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import AutoAwesomeOutlined from "@mui/icons-material/AutoAwesomeOutlined";
import DevicesOutlined from "@mui/icons-material/DevicesOutlined";
import SecurityOutlined from "@mui/icons-material/SecurityOutlined";
import { featureIntro, featureHighlights } from "./feature-highlights.mjs";
import PublicLayout from "./PublicLayout";
import GuideCard from "./GuideCard";
import { groups, guides } from "./catalog.mjs";
const icons = [
  MonitorHeartOutlined,
  InsightsOutlined,
  AutoAwesomeOutlined,
  DevicesOutlined,
];
export default function Features() {
  return (
    <PublicLayout
      title={featureIntro.title}
      description={featureIntro.summary}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.3fr 1fr" },
          gap: 8,
          alignItems: "center",
          mb: 10,
        }}
      >
        <Box>
          <Chip
            label="Ready for Quantum · Feature guide"
            variant="outlined"
            sx={{ mb: 4 }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 750,
              fontSize: { xs: "2rem", md: "3rem" },
              letterSpacing: "-.03em",
              maxWidth: 750,
            }}
          >
            Understand your security. Prepare for quantum.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mt: 4, lineHeight: 1.8, maxWidth: 700 }}
          >
            {featureIntro.summary}
          </Typography>
          <Stack direction="row" sx={{ gap: 3, flexWrap: "wrap", mt: 5 }}>
            <Button href="/docs/quantum/" variant="contained">
              Explore quantum readiness
            </Button>
            <Button href="/docs/platforms/" variant="outlined">
              Choose an agent
            </Button>
          </Stack>
        </Box>
        <Card
          variant="outlined"
          sx={{
            p: 6,
            borderRadius: 5,
            background: (t) =>
              `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.12)}, ${t.palette.background.paper})`,
          }}
        >
          <Typography variant="overline" color="text.secondary">
            From readiness to ongoing protection
          </Typography>
          {[
            [
              "01",
              "Choose where to check",
              "Use an agent that can reach your services.",
            ],
            [
              "02",
              "Check security and readiness",
              "Inspect TLS, quantum support and network services.",
            ],
            [
              "03",
              "Understand and act",
              "Explain results, monitor changes and investigate alerts.",
            ],
          ].map(([n, title, text]) => (
            <Stack key={n} direction="row" spacing={4} sx={{ mt: 5 }}>
              <Typography sx={{ color: "primary.main", fontWeight: 800 }}>
                {n}
              </Typography>
              <Box>
                <Typography fontWeight={650}>{title}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {text}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Card>
      </Box>
      <Stack
        component="nav"
        aria-label="Feature sections"
        direction="row"
        sx={{ flexWrap: "wrap", gap: 2, mb: 8 }}
      >
        {[...featureHighlights, ...groups].map((g) => (
          <Button
            href={`#${g.id}`}
            key={g.id}
            variant="outlined"
            sx={{ borderRadius: 8 }}
          >
            {g.title}
          </Button>
        ))}
      </Stack>
      {featureHighlights.map((section) => (
        <Box component="section" id={section.id} key={section.id} sx={{ mb: 10, scrollMarginTop: 90 }}>
          <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 2 }}>
            <SecurityOutlined color="primary" />
            <Typography component="h2" variant="h4" sx={{ fontWeight: 700, fontSize: { xs: "1.5rem", md: "1.9rem" } }}>{section.title}</Typography>
          </Stack>
          <Typography color="text.secondary" sx={{ mb: 5, maxWidth: 900 }}>{section.description}</Typography>
          <Grid container spacing={4}>
            {section.cards.map((card) => (
              <Grid size={{ xs: 12, md: 4 }} key={card.title}>
                <Card variant="outlined" sx={{ p: 5, borderRadius: 4, height: "100%", display: "flex", flexDirection: "column" }}>
                  <Typography component="h3" variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{card.title}</Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.8, mb: 3, flexGrow: 1 }}>{card.text}</Typography>
                  <Button href={card.href} sx={{ alignSelf: "flex-start", textAlign: "left" }}>{card.link}</Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      {groups.map((group, i) => {
        const Icon = icons[i];
        return (
          <Box
            component="section"
            id={group.id}
            key={group.id}
            sx={{ mb: 10, scrollMarginTop: 90 }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={3}
              sx={{ mb: 2 }}
            >
              <Icon color="primary" />
              <Typography
                component="h2"
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", md: "1.9rem" },
                }}
              >
                {group.title}
              </Typography>
            </Stack>
            <Typography color="text.secondary" sx={{ mb: 5 }}>
              {group.description}
            </Typography>
            <Grid container spacing={4}>
              {guides
                .filter((g) => g.group === group.id)
                .map((guide) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={guide.slug}>
                    <GuideCard guide={guide} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        );
      })}
      <Card variant="outlined" sx={{ borderRadius: 4, p: 6 }}>
        <Typography component="h2" variant="h5" gutterBottom>
          Choose the tools that fit your setup
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Your plan, agent and installed tools determine availability. Compare
          capabilities before you install, and use the current plan page for
          allowances and retention.
        </Typography>
        <Stack direction="row" sx={{ gap: 3, flexWrap: "wrap" }}>
          <Button href="/download/" variant="contained">
            Get an agent
          </Button>
          <Button href="/subscription/">Compare plans</Button>
          <Button href="/faq/">Common questions</Button>
        </Stack>
      </Card>
    </PublicLayout>
  );
}

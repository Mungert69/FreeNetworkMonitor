import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import PublicLayout from "./PublicLayout";
import GuideMarkdown from "./GuideMarkdown";
import GuideCard from "./GuideCard";
import { guides, groups, headingId } from "./catalog.mjs";

const contentFiles = import.meta.glob("./content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});
export default function Guide() {
  const { slug: requestedSlug } = useParams();
  const slug = requestedSlug?.toLowerCase();
  const { hash } = useLocation();
  const guide = guides.find((item) => item.slug === slug);
  const content = contentFiles[`./content/${slug}.md`] ?? "";
  useEffect(() => {
    if (!hash) return;
    let id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ block: "start" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [slug, hash]);
  if (!guide || !content)
    return (
      <PublicLayout
        noIndex
        title="Guide not found"
        description="Find help for Network Monitor."
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          We couldn’t find that guide.
        </Typography>
        <Button href="/docs/" variant="contained">
          Browse all guides
        </Button>
      </PublicLayout>
    );
  const sections = [...content.matchAll(/^## (.+)$/gm)].map((match) => ({
    title: match[1],
    id: headingId(match[1]),
  }));
  const related = guides
    .filter((item) => item.group === guide.group && item.slug !== slug)
    .slice(0, 3);
  const group = groups.find((item) => item.id === guide.group);
  return (
    <PublicLayout title={guide.title} description={guide.summary}>
      <Breadcrumbs sx={{ mb: 4 }}>
        <Link href="/docs/" underline="hover">
          Guides
        </Link>
        <Typography color="text.secondary">{group.title}</Typography>
      </Breadcrumbs>
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 3 }}>
        {guide.platforms.map((platform) => (
          <Chip
            key={platform}
            size="small"
            variant="outlined"
            label={platform}
          />
        ))}
      </Stack>
      <Typography
        component="h1"
        variant="h3"
        sx={{ fontWeight: 750, fontSize: { xs: "2rem", md: "2.8rem" }, mb: 3 }}
      >
        {guide.title}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mb: 6, maxWidth: "80ch", lineHeight: 1.8 }}
      >
        {guide.summary}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            lg: "minmax(0, 1fr) 240px",
          },
          gap: { xs: 4, lg: 7 },
          alignItems: "start",
        }}
      >
        <Paper
          component="article"
          variant="outlined"
          sx={{
            minWidth: 0,
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: 4,
            "& > :first-child": { mt: 0 },
          }}
        >
          <GuideMarkdown content={content} />
        </Paper>
        <Box
          component="aside"
          aria-label="On this page"
          sx={{
            gridRow: { xs: 1, lg: "auto" },
            gridColumn: { lg: 2 },
            position: { lg: "sticky" },
            top: 24,
          }}
        >
          <Box sx={{ display: { xs: "block", lg: "none" } }}>
            <Box
              component="details"
              sx={{
                bgcolor: "background.paper",
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                p: 3,
              }}
            >
              <Box
                component="summary"
                sx={{ cursor: "pointer", fontWeight: 600 }}
              >
                On this page
              </Box>
              <Stack sx={{ mt: 3 }} spacing={2}>
                {sections.map((section) => (
                  <Link
                    key={section.id}
                    href={`#${section.id}`}
                    underline="hover"
                  >
                    {section.title}
                  </Link>
                ))}
              </Stack>
            </Box>
          </Box>
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Typography variant="overline" color="text.secondary">
              On this page
            </Typography>
            <Stack spacing={3} sx={{ mt: 3 }}>
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  underline="hover"
                  sx={{ fontSize: ".9rem", lineHeight: 1.5 }}
                >
                  {section.title}
                </Link>
              ))}
            </Stack>
            <Divider sx={{ my: 5 }} />
            <Button href="/docs/" size="small">
              All guides
            </Button>
          </Box>
        </Box>
      </Box>
      <Typography
        component="h2"
        variant="h5"
        sx={{ mt: 8, mb: 4, fontWeight: 700 }}
      >
        Keep exploring
      </Typography>
      <Grid container spacing={4}>
        {related.map((item) => (
          <Grid key={item.slug} size={{ xs: 12, sm: 6, lg: 4 }}>
            <GuideCard guide={item} />
          </Grid>
        ))}
      </Grid>
    </PublicLayout>
  );
}

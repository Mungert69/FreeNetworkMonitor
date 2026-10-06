import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import PublicLayout from "../help/PublicLayout";
import { faqItems, groups, guides } from "../help/catalog.mjs";
export default function Faq() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [group, setGroup] = useState("all");
  const [expanded, setExpanded] = useState(window.location.hash.slice(1));
  useEffect(() => {
    const update = () => {
      const id = window.location.hash.slice(1);
      setExpanded(id);
      setQuery("");
      setGroup("all");
      setTopic("all");
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView(),
      );
    };
    window.addEventListener("hashchange", update);
    if (expanded) update();
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const items = faqItems.filter(
    (q) =>
      (group === "all" || q.group === group) &&
      (topic === "all" || q.guide === topic) &&
      query
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .every((term) =>
          `${q.question} ${q.answer}`.toLowerCase().includes(term),
        ),
  );
  return (
    <PublicLayout
      title="Frequently asked questions"
      description="Answers about setup, Bluetooth metrics, alerts, charts, AI diagnostics, quantum checks and your Network Monitor agents."
    >
      <Typography
        component="h1"
        variant="h3"
        sx={{ fontWeight: 750, fontSize: { xs: "2rem", md: "2.6rem" } }}
      >
        A little help, right when you need it.
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 3, mb: 6 }}>
        Find a quick answer here, or follow a guide for the full walkthrough.
      </Typography>
      <TextField
        label="Search questions"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      <Stack direction="row" sx={{ flexWrap: "wrap", gap: 2, my: 4 }}>
        {[{ id: "all", title: "All questions" }, ...groups].map((g) => (
          <Chip
            key={g.id}
            label={g.title}
            clickable
            onClick={() => setGroup(g.id)}
            color={group === g.id ? "primary" : "default"}
            aria-pressed={group === g.id}
          />
        ))}
      </Stack>
      <Typography
        variant="body2"
        color="text.secondary"
        aria-live="polite"
        sx={{ mb: 4 }}
      >
        {items.length} questions
      </Typography>
      <FormControl fullWidth sx={{ maxWidth: 520, mb: 4 }}>
        <InputLabel id="faq-topic-label">Topic</InputLabel>
        <Select
          labelId="faq-topic-label"
          label="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <MenuItem value="all">All topics</MenuItem>
          {guides
            .filter((g) => faqItems.some((q) => q.guide === g.slug))
            .map((g) => (
              <MenuItem value={g.slug} key={g.slug}>
                {g.title}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <Box sx={{ maxWidth: 1100 }}>
        {items.map((q) => (
          <Accordion
            id={q.id}
            key={q.id}
            expanded={expanded === q.id}
            onChange={(_, open) => setExpanded(open ? q.id : "")}
            slotProps={{ transition: { unmountOnExit: true } }}
            disableGutters
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              mb: 3,
              borderRadius: "12px !important",
              overflow: "hidden",
              "&:before": { display: "none" },
              scrollMarginTop: 90,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${q.id}-answer`}
              id={`${q.id}-question`}
              sx={{ px: 5, py: 2 }}
            >
              <Typography component="h2" variant="subtitle1" fontWeight={650}>
                {q.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails id={`${q.id}-answer`} sx={{ px: 5, pb: 5 }}>
              <Typography
                sx={{ lineHeight: 1.8, mb: 3 }}
                color="text.secondary"
              >
                {q.answer}
              </Typography>
              <Link href={q.guide ? `/docs/${q.guide}/` : q.href}>
                {q.guide ? "Read the guide" : q.linkLabel}
              </Link>
              <Link
                href={`#${q.id}`}
                sx={{ ml: 4 }}
                aria-label={`Link to: ${q.question}`}
              >
                Link to answer
              </Link>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
      {!items.length && (
        <Typography sx={{ my: 5 }}>
          No questions match. Try another word or clear your filters.
        </Typography>
      )}
      <Stack direction="row" sx={{ gap: 3, mt: 6, flexWrap: "wrap" }}>
        <Button href="/docs/" variant="contained">
          Browse all guides
        </Button>
        <Button href="/docs/troubleshooting/" variant="outlined">
          Troubleshooting
        </Button>
        <Button href="/subscription/">Current plans</Button>
      </Stack>
    </PublicLayout>
  );
}

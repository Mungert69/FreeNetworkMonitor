import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PublicLayout from "./PublicLayout";
import GuideCard from "./GuideCard";
import { filterGuides, groups } from "./catalog.mjs";

export default function Guides() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const results = filterGuides(query, category);
  return (
    <PublicLayout
      title="Guides"
      description="Practical guides to monitoring, Bluetooth sensors, alerts, the AI assistant and Network Monitor agents on Linux, Windows and Android."
    >
      <Typography variant="overline" color="secondary">
        Help for your next step
      </Typography>
      <Typography
        component="h1"
        variant="h3"
        sx={{
          fontWeight: 750,
          mt: 1,
          mb: 3,
          fontSize: { xs: "2.15rem", md: "3rem" },
        }}
      >
        Make your monitoring work for you.
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ maxWidth: "72ch", lineHeight: 1.8, mb: 5 }}
      >
        Set up a check, understand a reading or ask the assistant to
        investigate. Choose a guide for the website or the agent you use.
      </Typography>
      <TextField
        fullWidth
        label="Search guides"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Try Bluetooth, alerts, Windows or quantum"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          maxWidth: 760,
          mb: 4,
        }}
      />
      <Stack
        direction="row"
        sx={{ flexWrap: "wrap", gap: 2, mb: 6 }}
        aria-label="Guide categories"
      >
        {[{ id: "all", title: "All guides" }, ...groups].map((group) => (
          <Chip
            key={group.id}
            label={group.title}
            onClick={() => setCategory(group.id)}
            color={category === group.id ? "primary" : "default"}
            variant={category === group.id ? "filled" : "outlined"}
            aria-pressed={category === group.id}
          />
        ))}
      </Stack>
      <Box aria-live="polite">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {results.length} {results.length === 1 ? "guide" : "guides"}
          {query ? ` matching “${query}”` : ""}
        </Typography>
      </Box>
      {results.length === 0 ? (
        <Alert
          severity="info"
          action={
            <Button
              onClick={() => {
                setQuery("");
                setCategory("all");
              }}
            >
              Clear filters
            </Button>
          }
        >
          No guides match your search. Try a device, platform or feature name.
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {results.map((guide) => (
            <Grid key={guide.slug} size={{ xs: 12, sm: 6, lg: 4 }}>
              <GuideCard guide={guide} />
            </Grid>
          ))}
        </Grid>
      )}
    </PublicLayout>
  );
}

import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import PublicLayout from "./PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout title="Page not found" description="Find your way back to Ready for Quantum." noIndex>
      <Typography component="h1" variant="h4" sx={{ mb: 3 }}>We couldn’t find that page.</Typography>
      <Typography sx={{ mb: 4 }}>The link may be out of date. Choose a destination below to continue.</Typography>
      <Stack direction="row" spacing={2}>
        <Button href="/" variant="contained">Home</Button>
        <Button href="/docs/" variant="outlined">Browse guides</Button>
      </Stack>
    </PublicLayout>
  );
}

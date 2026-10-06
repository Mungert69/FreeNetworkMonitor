import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
export default function GuideCard({ guide }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderRadius: 4,
        bgcolor: "background.paper",
        transition: "border-color .15s, transform .15s",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardActionArea
        href={`/docs/${guide.slug}/`}
        sx={{
          height: "100%",
          p: 5,
          display: "flex",
          alignItems: "stretch",
          flexDirection: "column",
          textAlign: "left",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ flexWrap: "wrap", gap: 1, mb: 3 }}
        >
          {guide.platforms.map((platform) => (
            <Chip
              size="small"
              variant="outlined"
              key={platform}
              label={platform}
            />
          ))}
        </Stack>
        <Typography component="h3" variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {guide.title}
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.7, flex: 1 }}>
          {guide.summary}
        </Typography>
        <Box
          sx={{
            mt: 4,
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontWeight: 600,
          }}
        >
          Read guide <ArrowForwardIcon fontSize="small" />
        </Box>
      </CardActionArea>
    </Card>
  );
}

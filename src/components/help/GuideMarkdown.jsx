import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box, Link, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { headingId } from "./catalog.mjs";

const textOf = (value) =>
  Array.isArray(value)
    ? value.map(textOf).join("")
    : typeof value === "string"
      ? value
      : value?.props
        ? textOf(value.props.children)
        : "";
const components = {
  h2: ({ children }) => (
    <Typography
      component="h2"
      id={headingId(textOf(children))}
      variant="h5"
      sx={{ mt: 8, mb: 3, fontWeight: 700, scrollMarginTop: 90 }}
    >
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography
      component="h3"
      variant="h6"
      sx={{ mt: 5, mb: 2, fontWeight: 650 }}
    >
      {children}
    </Typography>
  ),
  p: ({ children }) => (
    <Typography component="p" sx={{ mb: 3, lineHeight: 1.85 }}>
      {children}
    </Typography>
  ),
  a: ({ children, href }) => (
    <Link
      href={href}
      underline="hover"
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  ),
  ul: ({ children }) => (
    <Box
      component="ul"
      sx={{
        pl: 5,
        my: 3,
        "& li": { pl: 1, mb: 2, lineHeight: 1.8 },
        "& li p": { mb: 1 },
      }}
    >
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box
      component="ol"
      sx={{
        pl: 5,
        my: 3,
        "& li": { pl: 1, mb: 2, lineHeight: 1.8 },
        "& li p": { mb: 1 },
      }}
    >
      {children}
    </Box>
  ),
  blockquote: ({ children }) => (
    <Box
      component="blockquote"
      sx={{
        m: 0,
        my: 4,
        px: 4,
        py: 3,
        borderLeft: 3,
        borderColor: "secondary.main",
        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.07),
        borderRadius: "0 12px 12px 0",
        "& p:last-child": { mb: 0 },
      }}
    >
      {children}
    </Box>
  ),
  pre: ({ children }) => (
    <Box
      component="pre"
      sx={{
        m: 0,
        my: 4,
        p: 4,
        maxWidth: "100%",
        overflowX: "auto",
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.07),
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        fontSize: ".86rem",
        lineHeight: 1.8,
      }}
    >
      {children}
    </Box>
  ),
  code: ({ children, className }) => (
    <Box
      component="code"
      className={className}
      sx={{
        fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
        fontSize: ".9em",
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </Box>
  ),
  table: ({ children }) => (
    <>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: { xs: "block", md: "none" }, mt: 3 }}
      >
        Swipe or scroll the table to see all columns.
      </Typography>
      <Box
        role="region"
        aria-label="Reference table"
        tabIndex={0}
        sx={{
          width: "100%",
          overflowX: "auto",
          my: 4,
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Box
          component="table"
          sx={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: 480,
            fontSize: ".9rem",
            "& th, & td": {
              p: 3,
              textAlign: "left",
              verticalAlign: "top",
              borderBottom: 1,
              borderColor: "divider",
              lineHeight: 1.7,
              minWidth: 140,
            },
            "& th": {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.09),
              fontWeight: 700,
            },
            "& tr:last-child td": { borderBottom: 0 },
          }}
        >
          {children}
        </Box>
      </Box>
    </>
  ),
};
export default function GuideMarkdown({ content }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}

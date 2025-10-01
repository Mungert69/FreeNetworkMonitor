// BlogArticle.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Box, Paper, Divider, Typography, Link as MUILink, Container } from '@mui/material';
import blogContent from './blog.md?raw';

const BlogArticle = ({
  title = 'Go Quantum Safe Now! : Easy Guide',
  bodyColor = 'primary.main',
  headingColor = 'primary.dark',
  linkColor = 'primary.dark',
}) => {
  const components = {
    h1: ({node, ...props}) => (
      <Typography color={headingColor} variant="h5" fontWeight={800} gutterBottom sx={{ mt: 4 }} {...props} />
    ),
    h2: ({node, ...props}) => (
      <Typography color={headingColor} variant="h6" fontWeight={700} gutterBottom sx={{ mt: 3 }} {...props} />
    ),
    h3: ({node, ...props}) => (
      <Typography color={headingColor} variant="subtitle1" fontWeight={700} gutterBottom sx={{ mt: 2.5 }} {...props} />
    ),
    h4: ({node, ...props}) => (
      <Typography color={headingColor} variant="subtitle2" fontWeight={700} gutterBottom sx={{ mt: 2 }} {...props} />
    ),
    p: ({node, ...props}) => (
      <Typography
        variant="body1"
        sx={{ mb: 1.25, lineHeight: 1.7, maxWidth: '80ch' }}
        {...props}
      />
    ),
    a: ({node, ...props}) => (
      <MUILink target="_blank" rel="noopener" underline="hover" color={linkColor} {...props} />
    ),
    ul: ({node, ...props}) => (
      <Box component="ul" sx={{ pl: 3, mb: 1.5, maxWidth: '80ch', '& li': { mb: 0.5 } }} {...props} />
    ),
    ol: ({node, ...props}) => (
      <Box component="ol" sx={{ pl: 3, mb: 1.5, maxWidth: '80ch', '& li': { mb: 0.5 } }} {...props} />
    ),
    li: ({node, ...props}) => (
      <Typography component="li" variant="body1" sx={{ lineHeight: 1.7 }} {...props} />
    ),
    blockquote: ({node, ...props}) => (
      <Box
        component="blockquote"
        sx={{
          m: 0,
          my: 1.5,
          pl: 2,
          borderLeft: theme => `4px solid ${theme.palette.primary.dark}`,
          color: 'inherit',
          maxWidth: '80ch',
        }}
        {...props}
      />
    ),
    code: ({inline, className, children, ...props}) => {
      if (inline) {
        return (
          <Box
            component="code"
            sx={{
              px: 0.5, py: 0.1, mx: 0.25,
              borderRadius: 1,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              bgcolor: theme => theme.palette.action.hover,
              fontSize: '0.875rem',
            }}
            {...props}
          >
            {children}
          </Box>
        );
      }
      return (
        <Box component="pre" sx={{ p: 1.5, my: 1.5, overflow: 'auto', borderRadius: 2, bgcolor: t => t.palette.grey[100] }}>
          <Box
            component="code"
            sx={{
              display: 'block',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: '0.9rem',
              lineHeight: 1.6,
            }}
            {...props}
          >
            {children}
          </Box>
        </Box>
      );
    },
    img: ({node, ...props}) => (
      <Box component="img" loading="lazy" alt="" sx={{ maxWidth: '100%', height: 'auto', borderRadius: 2, my: 1.5 }} {...props} />
    ),
    table: ({node, ...props}) => (
      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          my: 2,
          maxWidth: '80ch',
          '& th, & td': { border: theme => `1px solid ${theme.palette.divider}`, p: 1 },
          '& th': { bgcolor: theme => theme.palette.action.hover, textAlign: 'left' },
        }}
        {...props}
      />
    ),
  };

  return (
    <Container maxWidth="md" disableGutters>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, background: 'rgba(255,255,255,0.98)' }}>
        <Typography color={headingColor} variant="h5" fontWeight={800} gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {/* Body text uses primary.main by default; links colored slightly darker */}
        <Box sx={{ color: bodyColor, '& a': { color: linkColor } }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={components}
          >
            {blogContent}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Container>
  );
};

export default BlogArticle;

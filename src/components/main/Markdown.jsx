import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

function MarkdownListItem(props) {
  return <Box component="li" sx={{ mt: 1, typography: 'body1' }} {...props} />;
}

const markdownComponents = {
  h1: ({ node, ...props }) => (
    <Typography gutterBottom variant="h4" component="h1" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <Typography gutterBottom variant="h6" component="h2" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <Typography gutterBottom variant="subtitle1" {...props} />
  ),
  h4: ({ node, ...props }) => (
    <Typography gutterBottom variant="caption" paragraph {...props} />
  ),
  p: ({ node, ...props }) => <Typography paragraph {...props} />,
  a: ({ node, ...props }) => <Link {...props} />,
  li: ({ node, ...props }) => <MarkdownListItem {...props} />,
};

export function Markdown(props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={markdownComponents}
      {...props}
    />
  );
}

export default React.memo(Markdown);

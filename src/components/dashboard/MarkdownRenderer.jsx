import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = React.memo(({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
  style={vscDarkPlus}
  language={match[1]}
  PreTag="div"
  codeTagProps={{
    style: {
      fontFamily: 'monospace',
      fontSize: '0.9rem'
    }
  }}
  {...props}
>
  {String(children).replace(/\n$/, '')}
</SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
      className="markdown-body"
    >
      {content}
    </ReactMarkdown>
  );
});

export default MarkdownRenderer;
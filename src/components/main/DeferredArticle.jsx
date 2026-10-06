import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const BlogArticle = lazy(() => import('./BlogArticle'));
const title = 'Quantum-Safe TLS: Practical Guide & Playbook';

export default function DeferredArticle() {
  const container = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '600px' });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const placeholder = <Typography variant="h5">{title}</Typography>;
  return <Box ref={container} sx={{ minHeight: 160 }}>
    {visible ? <Suspense fallback={placeholder}><BlogArticle title={title} /></Suspense> : placeholder}
  </Box>;
}

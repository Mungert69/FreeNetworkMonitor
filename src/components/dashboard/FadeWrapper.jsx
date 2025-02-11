import React, { useEffect, useState } from 'react';
import { Fade } from '@mui/material';

function FadeWrapper({ children, toggle }) {
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    let timer;
    if (toggle) {
      timer = setInterval(() => {
        setChecked((prev) => !prev);
      }, 1000);
    } else {
      setChecked(true);
    }
    return () => clearInterval(timer);
  }, [toggle]);

  return (
    <Fade in={checked} timeout={1000}>
      {children}
    </Fade>
  );
}

export default FadeWrapper;

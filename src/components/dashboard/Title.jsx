import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

export  function Title(props) {
  return (
    <Typography align="center" component="h2" variant="h6" color="textPrimary" gutterBottom>
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};

export default React.memo(Title);

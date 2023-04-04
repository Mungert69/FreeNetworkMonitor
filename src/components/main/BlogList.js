import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Markdown from './Markdown';
import { Element } from 'react-scroll'

function BlogList({title, posts}) {


if (posts==undefined) {
  return null;
}
else {
  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        '& .markdown': {
          py: 3,
        },
      }}
    >
      <Typography variant="h5" gutterBottom color='secondary'>
        {title}
      </Typography>
      <Divider />
      {  posts.map((post) => (
          <Element id={post.hash} name={post.hash} key={post.hash}>
          <Markdown className="markdown" key={post.hash}>
          {post.markdown}
        </Markdown>
        </Element>      
      ))} 
    </Grid>
  );
      }
}

export default BlogList;

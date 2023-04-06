import React from 'react';
import {Grid,Typography,Divider, CardMedia} from '@mui/material';

import Markdown from './Markdown';
import { Element } from 'react-scroll'

function BlogList({title, posts}) {


if (posts===undefined) {
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
            <React.Fragment key={post.hash}>
          <Markdown className="markdown" key={post.hash}>
          {post.markdown}
        </Markdown>
        {post.isImage && <img src={post.imageUrl} alt={post.imageTitle} />}
        {post.isVideo &&  <CardMedia  component='video'
            title={post.videoTitle}
            image={post.videoUrl}
            controls
            loop/>}
        </React.Fragment>
        </Element>      
      ))} 
    </Grid>
  );
      }
}

export default React.memo(BlogList);

import React from 'react';
import { Grid, Typography, Divider, CardMedia, Link } from '@mui/material';

import Markdown from './Markdown';
import { Element } from 'react-scroll'

function BlogList({ title, posts, classes }) {


  if (posts === undefined) {
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
          <Link display="block" className={classes.link} href={'/blog'}>
            {title}
          </Link>
        </Typography>
        <Divider />
        {posts.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
          .map((post) => (
            <Element id={post.hash} name={post.hash} key={post.hash}>
              <React.Fragment key={post.hash}>
                {post.isImage && <CardMedia component="img"  style={{maxHeight: '10em', width: 'auto',display: 'block'}}
                  image={post.imageUrl}
                  alt={post.imageTitle} />}
                {post.isVideo && <CardMedia component='video'
                  title={post.videoTitle}
                  image={post.videoUrl}
                  controls
                  loop />}
                <Markdown className="markdown" key={post.hash}>
                  {post.header + post.markdown}
                </Markdown>

              </React.Fragment>
            </Element>
          ))}
      </Grid>
    );
  }
}

export default React.memo(BlogList);

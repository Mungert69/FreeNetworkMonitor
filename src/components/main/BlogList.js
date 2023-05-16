import React from 'react';
import { Grid, Typography, Divider, CardMedia, Link,Card } from '@mui/material';

import Markdown from './Markdown';
import { Element } from 'react-scroll'

const styles = {
  card: {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
  imageContainer: {
    maxHeight: '10em',
    width: 'auto',
  },
};

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
                {post.isImage &&  <Card style={styles.card}>
          <CardMedia
            component="img"
            src={post.imageUrl}
            alt={post.imageTitle}
            style={styles.imageContainer}
          />
        </Card>}
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

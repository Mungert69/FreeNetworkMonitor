import React from 'react';
import { Grid, Typography, Divider, CardMedia, CardActions, Box, Link, Card, CardContent, Collapse, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Markdown from './Markdown';
import { Element } from 'react-scroll'

function BlogList({ title, posts, classes }) {
  const theme = useTheme();
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
                {post.isImage && (
                  <Card >
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 } }>
                      
                      <CardContent>
                        <Typography variant="h7" color="text.secondary">
                          <Markdown className="markdown" key={post.hash}>
                            {post.header}
                          </Markdown>
                        </Typography>
                       
                      </CardContent>
                      <CardMedia
                        component="img"
                        src={post.imageUrl}
                        alt={post.title + " image "}
                      />
                    </Box>
                    <CardActions disableSpacing>
                    <CardContent>
                        <Typography variant="h7" color="text.secondary">
                          <Markdown className="markdown" key={post.hash}>
                            {post.markdown.split('\n')[0]}
                          </Markdown>
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          <Link display="block" className={classes.link} href={'/blog/posts/' + post.hash}>
                            Read more...
                          </Link>
                        </Typography>
                      </CardContent>
                   
                    </CardActions>
                  </Card>
                )}
                {post.isVideo && (
                  <Card >
                    
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        <Markdown>{post.header}</Markdown>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <Markdown className="markdown" key={post.hash}>
                          {post.markdown}
                        </Markdown>
                      </Typography>
                    </CardContent>
                    <CardMedia
                      component="video"
                      title={post.videoTitle}
                      image={post.videoUrl}
                      controls
                      loop
                    />
                  </Card>
                )}
              </React.Fragment>
            </Element>
          ))}
      </Grid>
    );
  }
}
export default React.memo(BlogList);

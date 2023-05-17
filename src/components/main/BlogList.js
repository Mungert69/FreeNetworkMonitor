import React from 'react';
import { Grid, Typography, Divider, CardMedia, CardActions, Box, Link, Card, CardContent, Collapse, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
    padding: '0.5em',
  },
};
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));
function BlogList({ title, posts, classes }) {
  const [expanded, setExpanded] = React.useState({});

  const handleExpandClick = (hash) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [hash]: !prevExpanded[hash]
    }));
  };
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
                  <Card sx={styles.card} >
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>

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
                        sx={styles.imageContainer}
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
                          <ExpandMore
                            expand={expanded[post.hash] || false}
                            onClick={() => handleExpandClick(post.hash)}
                            aria-expanded={expanded[post.hash] || false}
                            aria-label="show more"
                          >
                            <ExpandMoreIcon />
                          </ExpandMore>
                        </Typography>
                        <Collapse in={expanded[post.hash] || false} timeout="auto" unmountOnExit>
                          <Typography variant="h7" color="text.secondary">
                            <Markdown className="markdown" key={post.hash}>
                              {post.markdown.split('\n').slice(1).join('\n')}
                            </Markdown>
                          </Typography>
                          <Typography variant="h6" color="text.secondary">
                          <Link display="block" className={classes.link} href={'/blog/posts/' + post.hash}>
                            Read more on blog site...
                          </Link>
                        </Typography>
                        </Collapse>
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

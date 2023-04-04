import * as React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import BlogTitles from './BlogTitles' ;


function Sidebar({classes,sidebar, setArchiveDate, blogTitles}) {
  const { archives, description, social, title } = sidebar;
  // functoin to set archive date from onclick event
  

  return (

    <Grid item xs={12} md={4}>
      <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.200' }}>
        <Typography   variant="h6" gutterBottom >
          {title}
        </Typography>
        <Typography>{description}</Typography>
      </Paper>
      <Typography  variant="h6" gutterBottom sx={{ mt: 3 }} color="text.secondary">
        Archives
      </Typography>
      {archives.map((archive) => (
        <React.Fragment  key={archive.title+'frag'}>
        <Link onClick={() => setArchiveDate(archive.date)} display="block"  className={classes.link} href={'#blog'} key={archive.title+'link'}>
        {archive.title}
         
        </Link>
        {archive.open ? <BlogTitles classes={classes} titles={blogTitles}  key={archive.title+'blogtitle'}/> : null}
        </React.Fragment>
      ))}

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Social
      </Typography>
      {social.map((network) => (
        <Link
          display="block"
          variant="body1"
          href={network.url}
          key={network.name+'link'}
          sx={{ mb: 0.5 }}
          className={classes.link}
           >
          <Stack direction="row" spacing={1} alignItems="center" key={network.name+'stack'}>
            <network.icon />
            <span>{network.name}</span>
          </Stack >
        </Link>
      ))}
    </Grid>
    
  );
}


export default Sidebar;

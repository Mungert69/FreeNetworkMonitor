import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import { NoBackpackRounded } from '@mui/icons-material';
const importAll = (r) => r.keys().map(r);
const markdownFiles = importAll(require.context('./posts', false, /\.md$/))
  .sort();
const nameFile = markdownFiles.map(file => file.split('/')[1].split('.')[0]);
const sections = [
];
const mainFeaturedPost = {
  title: 'Monitor your Website and Services',
  description: 'Website downtime is a serious threat to businesses today. It is detrimental to a company as it leads to customer dissatisfaction, tarnished brand image, poor search engine ranking, and loss of potential business and clients.',
  image: '/img/ping.jpg',
  imageText: 'View of Free Network Monitor',
  linkText: 'Continue reading…',
  href: '#blog-post3',
};
const featuredPosts = [
  {
    title: 'Setup a Free Network Monitor',
    date: 'Jul 02',
    description:
      'How To Setup Your Own Free Network Monitor. This is a guide to setup your own free network monitor.',
    image: '/img/blog-2-network-cables.jpg',
    imageLabel: 'Picture of network cables plugged into a switch',
    href: '#blog-post2',
  },
  {
    title: 'Network monitor charts',
    date: 'Jul 11',
    description:
      'Its simple to get started viewing charts for monitored networks. Here is an example on how to view charts.',
    image: '/img/blog-1-chart.jpg',
    imageLabel: 'Picture of a chart',
    href: '#blog-post1',
  },
];
const sidebar = {
  title: 'About',
  description:
    'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
  archives: [
    { title: 'March 2020', url: '#' },
    { title: 'February 2020', url: '#' },
    { title: 'January 2020', url: '#' },
    { title: 'November 1999', url: '#' },
    { title: 'October 1999', url: '#' },
    { title: 'September 1999', url: '#' },
    { title: 'August 1999', url: '#' },
    { title: 'July 1999', url: '#' },
    { title: 'June 1999', url: '#' },
    { title: 'May 1999', url: '#' },
    { title: 'April 1999', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'Twitter', icon: TwitterIcon },
    { name: 'Facebook', icon: FacebookIcon },
  ],
};
const theme = createTheme();
export default function Blog() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <hr></hr>
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main title="Free Network Monitor Blog" />
          </Grid>
          <Sidebar sidebar={sidebar}/>
        </main>
      </Container>
    </ThemeProvider>
  );
}

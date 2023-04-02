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
import BlogList from './BlogList';
import Sidebar from './Sidebar';
import { fetchBlogs } from '../dashboard/ServiceAPI';
import { Element } from 'react-scroll'
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
// function to create sidebar variable using todays date as seed for archives
const getArchives = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const archives = [];
  const date = new Date();
  const title = 'Latest';
  archives.push({ title, date, open: true });
  for (let i = 0; i < 12; i++) {
    const date = new Date(year, month - i, day);
    const title = date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
    archives.push({ title, date, open: false });
  }
  return archives;
}
const getSidebar = (archives) => {
  return {
    title: 'About',
    description:
      'Welcome to our blog on network monitoring, security, and quantum readiness. Stay up-to-date on the latest trends and best practices in network monitoring, security, and the implications of quantum computing. With expert insights, practical tips, and real-world examples, our blog is your go-to resource for all things related to these important topics.',
    archives,
    social: [
      { name: 'GitHub', icon: GitHubIcon },
      { name: 'Twitter', icon: TwitterIcon },
      { name: 'Facebook', icon: FacebookIcon },
    ]
  };
};
const theme = createTheme();
export default function Blog() {
  const [archiveDate, setArchiveDate] = useState(new Date());
  const [archives, setArchives] = useState(getArchives());
  const [posts, setPosts] = useState();
  const [blogTitles, setBlogTitles] = useState();
  // onClick set archiveDate to date of archive clicked. Also set open to true for that archive and false for all others
  const handleArchiveClick = (date) => {
    setArchiveDate(date);
    const newArchives = archives.map(archive => {
      if (archive.date.getTime() === date.getTime()) {
        archive.open = true;
      } else {
        archive.open = false;
      }
      return archive;
    });
    setArchives(newArchives);

  }
  useEffect(() => {
    fetchBlogs(archiveDate).then((data) => {
      setPosts(data);
      // Create new component from data titles.
      const newSections = data.map((post) => {
        return { title: post.title, url: '#' + post.title };
      });
    }, [archiveDate]);
  });

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
              <Element id={'#blog'} name={'#blog'} />
              <BlogList title="Free Network Monitor Blog" posts={posts} />
              <Sidebar sidebar={getSidebar(archives)} setArchiveDate={handleArchiveClick} blogTitles={blogTitles}/>
            </Grid>
          </main>
        </Container>
      </ThemeProvider>
    );
  }

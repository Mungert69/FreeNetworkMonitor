import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
function BlogTitles({ titles,classes }) {
    if (titles == null || titles.length == 0) {
        return null;
    }
    else {
        return (
            titles.map((item) =>
                <Link  display="block"  className={classes.link} href={item.url} key={item.url}>
                    <Typography sx={{ display: { xs: 'none', sm: 'block' }, paddingLeft: 2 }} color="text.secondary.light" noWrap key={item.url} >
                        {item.title}
                    </Typography>

                </Link>
            )
        );
    }
}
export default React.memo(BlogTitles);

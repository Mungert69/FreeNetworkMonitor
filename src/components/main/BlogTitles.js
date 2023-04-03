import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
function BlogTitles({ titles }) {
    if (titles == null || titles.length == 0) {
        return null;
    }
    else {
        return (
            titles.map((item) =>
                <Link underline='false' display="block" variant="body1" href={item.url} key={item.url}>
                    <Typography sx={{ display: { xs: 'none', sm: 'block' }, paddingLeft: 4 }} color="testPrimary" noWrap >
                        {item.title}
                    </Typography>

                </Link>
            )
        );
    }
}
export default BlogTitles;

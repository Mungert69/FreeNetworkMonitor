import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import React from "react";


const MegaLink = () => {
    return (
        <Grid
            container
            spacing={1}
            direction="column"
            alignItems="center"
           
        >
            <Grid item xs={3}>
            <Link href="https://mega.nz/aff=G-n66OpvAgo">
           
                <Card sx={{ display: 'flex' , backgroundColor: 'transparent', shadowOpacity: 100  }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography variant="body2" color="textSecondary" >
                                {'Storage provided by Mega.nz'}
                            </Typography>
                        </CardContent>
                    </Box>
                    <CardMedia
                        component="img"
                        sx={{ width: 58, height: 58 }}
                        image='/img/mega.png'
                        alt="Mega.nz"
                    />
                </Card>
                </Link>
            </Grid>
        </Grid>

    );
}

export default React.memo(MegaLink);
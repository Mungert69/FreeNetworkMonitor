import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import React from "react";


const LogoLink = () => {
    return (
      <Link href="https://freenetworkmonitor.click">
           
                <Card >
                  
                    <CardMedia
                        component="img"
                        sx={{ width: 48, height: 32 }}
                        image='/img/logo.jpg'
                        alt="Free Network Monitor Logo"
                    />
                </Card>
                </Link>
           

    );
}

export default React.memo(LogoLink);
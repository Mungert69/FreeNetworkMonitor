import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import {  getBaseDomain} from '../dashboard/ServiceAPI';
import React from "react";


const LogoLink = () => {
    return (
        <Link
        href={`https://${getBaseDomain()}`}
        underline="none"
        sx={{ display: 'inline-block' }}
      >
           
                <Card >
                  
                    <CardMedia
                        component="img"
                        sx={{ width: 48, height: 32 }}
                        image='/logo.svg'
                        alt="Quantum Network Monitor Logo"
                    />
                </Card>
                </Link>
           

    );
}

export default React.memo(LogoLink);

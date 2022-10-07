import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import React from "react";
import MegaIcon from '../../img/mega.png';
import BuyMeACoffeeIcon from '../../img/buymeacoffee.png';

const ByMeACoffeeLink = () => {
    return (
        
            <Link href="https://www.buymeacoffee.com/mahadeva">
           
                <Card sx={{  display: 'flex' }}>
                        <CardContent >
                            <Typography variant="body2" color="textPrimary" >
                                {'Please buy me a coffee if you like this site'}
                            </Typography>
                        </CardContent>
                    
                    <CardMedia
                        component="img"
                        sx={{ width: 40, height: 40, padding:1 }}
                        image={BuyMeACoffeeIcon}
                        alt="Buy me a coffee"
                    />
                </Card>
                </Link>
        
    );
}

export default ByMeACoffeeLink;
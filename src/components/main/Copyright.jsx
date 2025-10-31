import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from "react";
import { getBaseDomain } from '../dashboard/ServiceAPI';

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">           
            {'Copyright © '}
            <Link color="inherit" href={`https://${getBaseDomain()}`}>
                Mahadeva Projects
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default React.memo(Copyright);
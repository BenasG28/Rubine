import React from 'react';
import {Typography} from '@mui/material';

const ListHeading = ({children}) => {
    return (
    <Typography
        sx={{
            marginBottom: 3,
            display: 'inline-block',
            fontFamily: 'roboto',
            fontSize: '32px',
            fontWeight: 400,
            height: '40px',
            textTransform: 'none',
            verticalAlign: 'middle',
            WebkitFontSmoothing: 'antialiased', // To apply webkit smoothing
        }}
    >
        {children}
    </Typography>
    );
};
export default ListHeading
import React from 'react';
import {Box} from "@mui/material";

const StartingBox = ({children}) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            minHeight: '100vh',
            padding: 2,
        }}>
            {children}
        </Box>
    )
}
export default StartingBox
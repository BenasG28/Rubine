import React from 'react';
import {Box} from "@mui/material";

const TableBox = ({children}) => {
    return (
        <Box sx={{
            width: '100%',
            overflowX: 'auto', // Allow horizontal scrolling if needed
            display: 'flex',
            justifyContent: 'center', // Center the content horizontally
            paddingX: 4, // Add padding on the left and right
            boxSizing: 'border-box', // Ensure padding is included in the width
        }}>
            {children}
        </Box>
    )
}
export default TableBox
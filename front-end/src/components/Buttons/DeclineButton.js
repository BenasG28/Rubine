import React from 'react';
import {Button} from "@mui/material";

const DeclineButton = ({ onClick, children, sx }) => {
    return (
        <Button
            onClick={onClick}
            sx={{
                fontFamily: 'roboto',
                color: '#DC143C',  // Crimson Red color
            }}
        >
            Atšaukti
        </Button>
    );
};

export default DeclineButton;
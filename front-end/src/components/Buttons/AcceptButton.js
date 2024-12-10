import React from 'react';
import {Button} from "@mui/material";

const AcceptButton = ({ onClick, children, sx }) => {
    return (
        <Button
            onClick={onClick}
            sx={{
                fontFamily: 'roboto',
                color: '#000',}}
        >
            {children}
        </Button>
    );
};

export default AcceptButton;
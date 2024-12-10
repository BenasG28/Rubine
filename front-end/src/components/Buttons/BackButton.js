import React from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ to }) => {
    const navigate = useNavigate();

    return (
        <Button
            variant="text"
            color="black"
            onClick={() => navigate(to)}
            sx={{ marginBottom: 2, alignSelf: 'flex-start' }}
            startIcon={<ArrowBackIcon />}
        >
            Atgal
        </Button>
    );
};

export default BackButton;
import React from 'react';
import { useAuth } from '../context/AuthContext';
import {Navigate} from "react-router-dom";
import {Typography, Box} from '@mui/material';

const MainPage = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Typography variant="h1" align="center">Sveiki atvykę į RUBINE!</Typography>
        </Box>
    );
};

export default MainPage;
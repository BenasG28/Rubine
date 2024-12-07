import React from "react";
import { Link } from "react-router-dom";
import { Typography, Button, Box } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';

const Unauthorized = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                padding: 2,
                gap: 3,
            }}
        >
            <WarningIcon sx={{ fontSize: 50, color: 'black' }} />
            <Typography
                variant="h3"
                gutterBottom
                sx={{ letterSpacing: 1 }}
            >
                Nėra prieigos
            </Typography>
            <Typography
                variant="h6"
                sx={{ letterSpacing: 0.5 }}
            >
                Neturite teisių peržiūrėti šį puslapį.
            </Typography>
            <Button
                component={Link}
                to="/main"
                variant="contained"
                sx={{ backgroundColor: 'black', '&:hover': { backgroundColor: '#333' } }}
            >
                Grįžti į pagrindinį puslapį
            </Button>
        </Box>
    );
};

export default Unauthorized;
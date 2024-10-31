import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import { Box, Snackbar, Alert } from "@mui/material";

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // State for error handling
    const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/login', { email, password });
            const token = response.data.token;
            login(token); // Update the token in context
        } catch (error) {
            console.error('Login error', error);
            setError('Invalid email or password'); // Set error message
            setOpenSnackbar(true); // Open Snackbar
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: 2,
            }}
        >
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>Prisijungti</Button>
            </form>

            {/* Snackbar for error messages */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginPage;
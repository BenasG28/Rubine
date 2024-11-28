import React from 'react';
import { Link } from 'react-router-dom';
import {Toolbar, Button, Typography, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { token, roles, logout } = useAuth();

    return (
            <Box sx={{
                width: '100%',
                maxWidth: '1100px', // Set max width for navbar to make it more compact
                margin: '0 auto', // Center the navbar
            }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>

                    {/* Conditional rendering based on authentication and roles */}
                    {token && (
                        <>
                            <Button color="inherit" component={Link} to="/main">
                            <Typography variant="h6" sx={{  fontSize: '22px' }}>
                                Rubinė
                            </Typography>
                            </Button>

                            {/* Admin Links (only visible for SYS_ADMIN or ADMIN roles) */}
                            {(roles.includes('SYS_ADMIN') || roles.includes('ADMIN')) && (
                                <>
                                    <Button color="inherit" component={Link} to="/users">Vartotojai</Button>
                                    <Button color="inherit" component={Link} to="/products">Prekės</Button>
                                    {/* Uncomment if you want reports */}
                                    {/* <Button color="inherit" component={Link} to="/reports">Ataskaitos</Button> */}
                                </>
                            )}

                            {/* Common Link for Orders */}
                            <Button color="inherit" component={Link} to="/orders">Užsakymai</Button>

                            {/* Logout Button */}
                            <Button color="inherit" onClick={logout} sx={{ marginLeft: '22px' }}>Atsijungti</Button>
                        </>
                    )}
                </Toolbar>
            </Box>
    );
};

export default Navbar;
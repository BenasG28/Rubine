import React from 'react';
import { Link } from 'react-router-dom';
import { Toolbar, Button, Typography, Box, IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const { token, roles, logout } = useAuth();
    const { cart } = useCart();

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '1100px', // Set max width for navbar to make it more compact
            margin: '0 auto', // Center the navbar
        }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* Logo or Home Link */}
                <Button color="inherit" component={Link} to="/main">
                    <Typography variant="h6" sx={{ fontSize: '22px' }}>
                        Rubinė
                    </Typography>
                </Button>

                {/* Links for Authenticated Users */}
                {token && (
                    <>
                        {/* Admin Links */}
                        {(roles.includes('SYS_ADMIN') || roles.includes('ADMIN')) && (
                            <>
                                <Button color="inherit" component={Link} to="/users">Vartotojai</Button>
                                <Button color="inherit" component={Link} to="/products">Prekės</Button>
                                <Button color="inherit" component={Link} to="/reports">Ataskaitos</Button>
                            </>
                        )}

                        {/* Orders Link */}
                        <Button color="inherit" component={Link} to="/orders">Užsakymai</Button>

                        {/* Profile Button */}
                        <Button color="inherit" component={Link} to="/profile">Profilis</Button>

                        {/* Cart Icon */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton color="inherit" component={Link} to="/cart">
                                <Badge badgeContent={cart?.items?.length || 0} color="secondary">
                                    <ShoppingCartIcon />
                                </Badge>
                            </IconButton>
                        </Box>

                        {/* Logout Button */}
                        <Button color="inherit" onClick={logout} sx={{ marginLeft: '22px' }}>Atsijungti</Button>
                    </>
                )}
            </Toolbar>
        </Box>
    );
};

export default Navbar;

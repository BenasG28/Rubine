import React from 'react';
import { Link } from 'react-router-dom';
import { Toolbar, Button, Typography, Box, IconButton, Badge } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import navbarConfig from "../config/navbarConfig";

const Navbar = () => {
    const { token, roles, logout } = useAuth();
    const { cart } = useCart();

    const filteredLinks = navbarConfig.filter(({ roles: allowedRoles }) =>
        !allowedRoles || allowedRoles.some(role => roles.includes(role))
    );

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto',
        }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {token && (
                    <>
                        <Button color="inherit" component={Link} to="/main">
                            <Typography variant="h6" sx={{ fontSize: '22px', fontFamily: 'della respira' }}>
                                Rūbinė
                            </Typography>
                        </Button>

                        {filteredLinks.map(({ path, label }) => (
                            label && (
                                <Button
                                    key={path}
                                    color="inherit"
                                    component={Link}
                                    to={path}
                                    sx={{ fontSize: '13px', fontFamily: 'roboto', fontWeight: '400' }}
                                >
                                    {label}
                                </Button>
                            )
                        ))}
                            {/* Admin Links (only visible for SYS_ADMIN or ADMIN roles) */}
                            {(roles.includes('SYS_ADMIN') || roles.includes('ADMIN')) && (
                                <>
                                    <Button color="inherit" component={Link} to="/users" sx={{  fontSize: '13px', fontFamily: 'roboto', fontWeight: '400' }}>Vartotojai</Button>
                                    <Button color="inherit" component={Link} to="/products" sx={{  fontSize: '13px', fontFamily: 'roboto', fontWeight: '400' }}>Prekės</Button>
                                </>
                            )}

                        <IconButton color="inherit" component={Link} to="/cart">
                            <Badge badgeContent={cart?.items?.length || 0} color="secondary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>

                        <Button
                            color="inherit"
                            onClick={logout}
                            sx={{ fontSize: '13px', fontFamily: 'roboto', fontWeight: '400' }}
                        >
                            Atsijungti
                        </Button>
                    </>
                )}
            </Toolbar>
        </Box>
    );
};

export default Navbar;
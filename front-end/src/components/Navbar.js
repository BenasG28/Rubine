import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { token, roles, logout } = useAuth();

    return (
        <AppBar position="static" sx={{ width: '100%', margin: 0, padding: 0 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>Rubinė</Typography>
                {token && (
                    <>
                        <Button color="inherit" component={Link} to="/main">Pagrindinis</Button>
                        {(roles.includes('SYS_ADMIN') || roles.includes('ADMIN')) && (
                            <>
                                <Button color={"inherit"} component={Link} to={"/users"}>Vartotojai</Button>
                                <Button color={"inherit"} component={Link} to={"/products"}>Prekės</Button>
                                <Button color={"inherit"} component={Link} to={"/reports"}>Ataskaitos</Button>
                            </>
                        )}
                        <Button color={"inherit"} component={Link} to={"/orders"}>Užsakymai</Button>
                        <Button color="inherit" onClick={logout} style={{ marginLeft: '16px' }}>Atsijungti</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
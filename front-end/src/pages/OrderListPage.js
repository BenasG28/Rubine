import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from 'axios';
import {
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';

const OrderListPage = () => {
    const { isAuthenticated, roles, token } = useAuth(); // Use token and roles from AuthContext
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editOrder, setEditOrder] = useState(null);
    const [newOrder, setNewOrder] = useState({
        dateCreated: '',
        purchaseAmount: '',
        status: '',
        user: '', // Assuming each order is associated with a user ID
    });

    useEffect(() => {
        if (isAuthenticated && (roles.includes('ADMIN') || roles.includes('SYS_ADMIN'))) {
            axios.get("/orders/all", {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then(response => setOrders(response.data))
                .catch(error => console.error("Error fetching orders:", error));
        }
    }, [isAuthenticated, roles, token]);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace />;
    }

    if (!roles.includes('ADMIN') && !roles.includes('SYS_ADMIN')) {
        return <Navigate to={"/"} replace />;
    }

    const handleCreateOrder = () => {
        const formattedOrder = {
            ...newOrder,
            user: { id: newOrder.user }, // Wrap user ID in an object with 'id' key
        };

        axios.post('/orders/create', formattedOrder, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => {
                setOrders([...orders, response.data]); // Add new order to the list
                setNewOrder({ dateCreated: '', purchaseAmount: '', status: '', user: '' });
                handleClose();
            })
            .catch(error => console.error("Error creating order:", error));
    };

    const handleEditOrder = () => {
        if (editOrder && editOrder.id) {
            axios.put(`/orders/update/${editOrder.id}`, editOrder, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then(response => {
                    setOrders(orders.map(order =>
                        order.id === editOrder.id ? { ...order, ...response.data } : order
                    ));
                    handleEditClose();
                })
                .catch(error => console.error("Error updating order:", error));
        }
    };

    const handleDeleteOrder = (id) => {
        axios.delete(`/orders/delete/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(() => setOrders(orders.filter(order => order.id !== id)))
            .catch(error => console.error("Error deleting order:", error));
    };

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewOrder({ dateCreated: '', purchaseAmount: '', status: '', user: '' });
    };

    const handleEditOpen = (order) => {
        setEditOrder(order);
        setEditOpen(true);
    };
    const handleEditClose = () => setEditOpen(false);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace />;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                minHeight: '100vh',
                padding: 2,
            }}
        >
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                    variant="h5"
                    sx={{
                        marginBottom: 3,
                        display: 'inline-block',
                        fontFamily: 'Montserrat, Arial, sans-serif',
                        fontSize: '32px',
                        fontWeight: 600,
                        height: '40px',
                        textTransform: 'none',
                        verticalAlign: 'middle',
                        WebkitFontSmoothing: 'antialiased', // To apply webkit smoothing
                    }}
                >
                    Užsakymų sąrašas
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpen}
                    sx={{
                        marginBottom: 3,
                        fontFamily: 'Montserrat, Arial, sans-serif', // Match the font family
                        fontSize: '16px', // Adjust font size for readability
                        fontWeight: 300, // Semi-bold text for a stronger appearance
                        letterSpacing: '0.5px', // Slight spacing for better readability
                        textTransform: 'none', // Remove automatic uppercase
                        padding: '10px 20px', // Adjust padding for a larger, more clickable area
                        borderRadius: '8px', // Rounded corners for a modern look
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
                        transition: 'background-color 0.3s ease, transform 0.3s ease', // Smooth transition for hover effect
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                            transform: 'scale(1.05)',
                        },
                        '&:active': {
                            backgroundColor: 'primary.main',
                            transform: 'scale(1)',
                        },
                        '&:focus': {
                            outline: 'none',
                        },
                    }}
                >
                NAUJAS UŽSAKYMAS
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Kaina</TableCell>
                            <TableCell>Statusas</TableCell>
                            <TableCell>Vartotojo ID</TableCell>
                            <TableCell>Funkcijos</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.dateCreated}</TableCell>
                                    <TableCell>{order.purchaseAmount}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{order.user.id || order.user.name}</TableCell>
                                    <TableCell>
                                        <Button size="small" onClick={() => handleEditOpen(order)}>Atnaujinti</Button>
                                        <Button size="small" color="error" onClick={() => handleDeleteOrder(order.id)}>Ištrinti</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Nėra užsakymų
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for order creation */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Naujas užsakymas</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Data"
                        type="date"
                        fullWidth
                        value={newOrder.dateCreated}
                        slotProps={{inputLabel: {shrink: true} }}
                        onChange={(e) => setNewOrder({ ...newOrder, dateCreated: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Kaina"
                        type="number"
                        fullWidth
                        value={newOrder.purchaseAmount}
                        onChange={(e) => setNewOrder({ ...newOrder, purchaseAmount: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Vartotojo ID"
                        type="text"
                        fullWidth
                        value={newOrder.user}
                        onChange={(e) => setNewOrder({ ...newOrder, user: e.target.value })}
                    />
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Statusas</InputLabel>
                        <Select
                            value={newOrder.status}
                            onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                            label="Statusas" // Make sure the label is linked with the Select component
                        >
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                            <MenuItem value="CANCELLED">Canceled</MenuItem>
                            <MenuItem value="SHIPPED">Shipped</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Atšaukti</Button>
                    <Button onClick={handleCreateOrder} color="primary">Atnaujinti</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for editing an order */}
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Atnaujinti užsakymą</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Data"
                        type="date"
                        fullWidth
                        value={editOrder?.dateCreated || ""}
                        onChange={(e) => setEditOrder({ ...editOrder, dateCreated: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Kaina"
                        type="number"
                        fullWidth
                        value={editOrder?.purchaseAmount || ""}
                        onChange={(e) => setEditOrder({ ...editOrder, purchaseAmount: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Vartotojo ID"
                        type="text"
                        fullWidth
                        value={editOrder?.user || ""}
                        onChange={(e) => setEditOrder({ ...editOrder, user: e.target.value })}
                    />
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Statusas</InputLabel>
                        <Select
                            value={newOrder.status}
                            onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                            label="Statusas" // Make sure the label is linked with the Select component
                        >
                            <MenuItem value="PENDING">Pending</MenuItem>
                            <MenuItem value="COMPLETED">Completed</MenuItem>
                            <MenuItem value="CANCELLED">Canceled</MenuItem>
                            <MenuItem value="SHIPPED">Shipped</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="secondary">Atšaukti</Button>
                    <Button onClick={handleEditOrder} color="primary">Atnaujinti</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderListPage;

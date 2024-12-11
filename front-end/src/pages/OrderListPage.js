import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from 'axios';
import {
    Button, Table, TableBody, TableCell, TableHead,
    TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box, MenuItem, Select, Stack, IconButton
} from '@mui/material';
import AddButton from "../components/Buttons/AddButton";
import ReportDownloadDialog from "../components/ReportDownloadDialog";
import ListHeading from "../components/ListHeading";
import StartingBox from "../components/StartingBox";
import DeclineButton from "../components/Buttons/DeclineButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableBox from "../components/TableBox";
// TODO Make radio buttons for statuses
const OrderListPage = () => {
    const { isAuthenticated, token } = useAuth(); // Use token from AuthContext
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editOrder, setEditOrder] = useState(null);
    // report dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [allData, setAllData] = useState(false);
    const [productType, setProductType] = useState("");
    const [newOrder, setNewOrder] = useState({
        dateCreated: '',
        purchaseAmount: '',
        status: '',
        user: '',
    });

    useEffect(() => {
        axios.get("/orders/all", {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => setOrders(response.data))
            .catch(error => console.error("Error fetching orders:", error));
    }, [token]);

    const handleCreateOrder = () => {
        const formattedOrder = {
            ...newOrder,
            user: { id: newOrder.user },
        };


        axios.post('/orders/create', formattedOrder, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => {
                setOrders([...orders, response.data]);  // Add new order to the list
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

    const handleReportOpenDialog = () => setDialogOpen(true);
    const handleReportCloseDialog = () => setDialogOpen(false);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace />;
    }

    return (
       <StartingBox>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <ListHeading>Užsakymų sąrašas</ListHeading>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <AddButton onClick={handleReportOpenDialog}>ATSISIŲSKIT ATASKAITĄ</AddButton>
                    <AddButton onClick={handleClickOpen}>NAUJAS UŽSAKYMAS</AddButton>
                </Box>
            </Box>

            <TableBox>
                <Table sx={{ minWidth: '1200px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sukūrimo data</TableCell>
                            <TableCell>Suma</TableCell>
                            <TableCell>Statusas</TableCell>
                            <TableCell>Vartotojas</TableCell>
                            <TableCell>Veiksmai</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.dateCreated}</TableCell>
                                    <TableCell>{order.purchaseAmount}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{order.user.id || order.user.name}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" >
                                            <IconButton onClick={() => handleEditOpen(order)} sx={{ color: '#000', fontWeight: '300' }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteOrder(order.id)} sx={{ color: '#DC143C' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No orders available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                </TableBox>
            {/* Dialog for order creation */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Order</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Date Created"
                        type="date"
                        fullWidth
                        value={newOrder.dateCreated}
                        slotProps={{inputLabel: {shrink: true} }}
                        onChange={(e) => setNewOrder({ ...newOrder, dateCreated: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Purchase Amount"
                        type="number"
                        fullWidth
                        value={newOrder.purchaseAmount}
                        onChange={(e) => setNewOrder({ ...newOrder, purchaseAmount: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="User ID"
                        type="text"
                        fullWidth
                        value={newOrder.user}
                        onChange={(e) => setNewOrder({ ...newOrder, user: e.target.value })}
                    />
                    <Select
                        fullWidth
                        value={newOrder.status}
                        onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                        variant="outlined"
                        margin="dense"
                    >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="COMPLETED">Completed</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleCreateOrder} color="primary">Create</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog for report */}
            <ReportDownloadDialog
                open={dialogOpen}
                onClose={handleReportCloseDialog}
                reportType="order"
                startDate={startDate}
                endDate={endDate}
                allData={allData}
                productType={productType}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setProductType={setProductType}
                setAllData={setAllData}
            />
            {/* Dialog for editing an order */}
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Order</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Date Created"
                        type="date"
                        fullWidth
                        value={editOrder?.dateCreated || ""}
                        slotProps={{inputLabel: {shrink: true} }}
                        onChange={(e) => setEditOrder({ ...editOrder, dateCreated: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Purchase Amount"
                        type="number"
                        fullWidth
                        value={editOrder?.purchaseAmount || ""}
                        onChange={(e) => setEditOrder({ ...editOrder, purchaseAmount: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="User ID"
                        type="text"
                        fullWidth
                        value={editOrder?.user.id || ""}
                        onChange={(e) => setEditOrder({ ...editOrder, user: e.target.value })}
                    />
                    <Select
                        fullWidth
                        value={editOrder?.status || ""}
                        onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
                        variant="outlined"
                        margin="dense"
                    >
                        <MenuItem value="PENDING">Ruošiama</MenuItem>
                        <MenuItem value="COMPLETED">Paruoštas</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <DeclineButton onClick={handleEditClose}></DeclineButton>
                    <Button onClick={handleEditOrder} color="primary">Atnaujinti</Button>
                </DialogActions>
            </Dialog>
       </StartingBox>
    );
};

export default OrderListPage;

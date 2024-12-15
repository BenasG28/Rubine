import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from 'axios';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    MenuItem,
    Select,
    Stack,
    IconButton,
    Container, FormControl, InputLabel, Typography, List, ListItem, Divider
} from '@mui/material';
import AddButton from "../components/Buttons/AddButton";
import ReportDownloadDialog from "../components/ReportDownloadDialog";
import ListHeading from "../components/ListHeading";
import DeclineButton from "../components/Buttons/DeclineButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TableBox from "../components/TableBox";
import InfoIcon from "@mui/icons-material/Info";
// TODO Make radio buttons for statuses
const OrderListPage = () => {
    const { isAuthenticated, token, roles, user } = useAuth(); // Use token from AuthContext
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editOrder, setEditOrder] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [allData, setAllData] = useState(false);
    const [productType, setProductType] = useState("");
    const [viewOrder, setViewOrder] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [newOrder, setNewOrder] = useState({
        dateCreated: '',
        purchaseAmount: '',
        status: '',
        user: '',
    });

    useEffect(() => {
        if (isAuthenticated && (roles.includes('ADMIN') || roles.includes('SYS_ADMIN'))) {
            axios.get("/orders/all", {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then(response => setOrders(response.data))
                .catch(error => console.error("Error fetching orders:", error));
        }

        if (isAuthenticated && (roles.includes('USER'))) {
            axios.get(`/orders/user/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
                .then(response => setOrders(response.data))
                .catch(error => console.error("Error fetching orders:", error));
        }

    }, [isAuthenticated, roles, token, user]);

    if (!isAuthenticated) {
        return <Navigate to={"/login"} replace />;
    }

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

    const handleViewOpen = (order) => {
        setViewOrder(order);
        setViewOpen(true);
    };

    const handleViewClose = () => {
        setViewOpen(false);
        setViewOrder(null);
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
        <Container maxWidth="lg" sx={{ mt: 4 }}>
           <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
               <ListHeading>Užsakymų sąrašas</ListHeading>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {roles.includes("ADMIN") || roles.includes("SYS_ADMIN") ? (
                        <AddButton onClick={handleReportOpenDialog}>ATSISIŲSKIT ATASKAITĄ</AddButton>
                    ) : null}
                    <AddButton onClick={handleClickOpen}>NAUJAS UŽSAKYMAS</AddButton>
                </Box>
            </Box>

            <TableBox>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sukūrimo data</TableCell>
                            <TableCell>Suma</TableCell>
                            <TableCell>Statusas</TableCell>
                            {roles.includes("ADMIN") || roles.includes("SYS_ADMIN") ? (
                                <TableCell>Vartotojas</TableCell>
                            ) : null}
                            <TableCell>Veiksmai</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.dateCreated}</TableCell>
                                    <TableCell>{order.purchaseAmount?.toFixed(2)}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    {roles.includes("ADMIN") || roles.includes("SYS_ADMIN") ? (
                                        <TableCell>{order.user.id || order.user.name}</TableCell>
                                    ) : null}
                                    <TableCell>
                                        <Stack direction="row">
                                            <IconButton onClick={() => handleViewOpen(order)} sx={{ color: '#000', fontWeight: '300' }}>
                                                <InfoIcon/>
                                            </IconButton>
                                            {(roles.includes('ADMIN') || roles.includes('SYS_ADMIN')) && (
                                                <>
                                                    <IconButton onClick={() => handleEditOpen(order)} sx={{ color: '#000', fontWeight: '300' }}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDeleteOrder(order.id)} sx={{ color: '#DC143C' }}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </>
                                            )}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Jūs neturite užsakymų
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                </TableBox>
            {/* Dialog for order creation */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Pridėti naują užsakymą</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Sukūrimo data"
                        type="date"
                        fullWidth
                        value={newOrder.dateCreated}
                        slotProps={{inputLabel: {shrink: true} }}
                        onChange={(e) => setNewOrder({ ...newOrder, dateCreated: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Užsakymo suma"
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
                            label="Statusas"
                        >
                            <MenuItem value="PENDING">Laukiama</MenuItem>
                            <MenuItem value="COMPLETED">Užbaigtas</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <DeclineButton onClick={handleClose}></DeclineButton>
                    <Button onClick={handleCreateOrder} color="primary">Sukurti</Button>
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
                <DialogTitle>Redaguoti užsakymą</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Sukūrimo data"
                        type="date"
                        fullWidth
                        value={editOrder?.dateCreated || ""}
                        slotProps={{inputLabel: {shrink:true}}}
                        onChange={(e) => setEditOrder({ ...editOrder, dateCreated: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Užsakymo suma"
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
                        value={editOrder?.user.id || ""}
                        onChange={(e) => setEditOrder({ ...editOrder, user: e.target.value })}
                    />
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>Statusas</InputLabel>
                        <Select
                            value={editOrder?.status || ""}
                            onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value })}
                            label="Statusas" // Make sure the label is linked with the Select component
                        >
                            <MenuItem value="PENDING">Laukiama</MenuItem>
                            <MenuItem value="COMPLETED">Užbaigtas</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <DeclineButton onClick={handleEditClose}>Atšaukti</DeclineButton>
                    <Button onClick={handleEditOrder} color="primary">Atnaujinti</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={viewOpen} onClose={handleViewClose}>
                <DialogTitle>Užsakymo detalės</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Sukūrimo data"
                        type="text"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        value={viewOrder?.dateCreated || ""}
                    />
                    <TextField
                        margin="dense"
                        label="Užsakymo suma (€)"
                        type="text"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        value={viewOrder?.purchaseAmount.toFixed(2) || ""}
                    />
                    <TextField
                        margin="dense"
                        label="Vartotojas"
                        type="text"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        value={`${viewOrder?.user?.name || ""} ${viewOrder?.user?.surname || ""}` || viewOrder.user.id}
                    />
                    <TextField
                        margin="dense"
                        label="Vartotojo el. paštas"
                        type="email"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        value={viewOrder?.user?.email || ""}
                    />
                    <TextField
                        margin="dense"
                        label="Statusas"
                        type="text"
                        fullWidth
                        InputProps={{ readOnly: true }}
                        value={viewOrder?.status === "PENDING" ? "Laukiama" : "Užbaigtas"}
                    />
                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Prekės</Typography>
                    <List>
                        {viewOrder?.lineItems?.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <ListItem sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: '100%' }}>
                                    {roles.includes("ADMIN") || roles.includes("SYS_ADMIN") ? (
                                        <TextField
                                            label="Prekės ID"
                                            value={item.productId}
                                            margin="dense"
                                            fullWidth
                                            InputProps={{ readOnly: true }}
                                        />
                                    ) : null}
                                    <TextField
                                        label="Prekės pavadinimas"
                                        value={item.productName}
                                        margin="dense"
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                    <TextField
                                        label="Kiekis"
                                        value={item.quantity}
                                        margin="dense"
                                        fullWidth
                                        InputProps={{ readOnly: true }}
                                    />
                                </ListItem>
                                {/* Divider between items, not after the last one */}
                                {index < viewOrder?.lineItems?.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleViewClose} color="primary">Uždaryti</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default OrderListPage;
